import { config } from "../config/config";

export enum ProxyType {
  RESIDENTIAL = "residential",
  DATACENTER = "datacenter",
  ISP = "isp",
  MOBILE = "mobile"
}

interface ProxyConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  session?: string;
  country?: string;
  city?: string;
  proxyType: ProxyType;
}

export class AdvancedProxyManager {
  private readonly maxRetries = 3;
  private readonly rotationThreshold = 100; // ilość requestów przed rotacją
  private requestCount = new Map<string, number>();
  private bannedIPs = new Set<string>();
  
  constructor(
    private readonly username = config.brightData.username,
    private readonly password = config.brightData.password
  ) {}

  private getProxyUrl(proxyConfig: ProxyConfig): string {
    const { host, port, username, password, session, country, city } = proxyConfig;
    let auth = `${username}:${password}`;
    
    if (session) {
      auth += `-session-${session}`;
    }
    
    if (country) {
      auth += `-country-${country}`;
    }
    
    if (city) {
      auth += `-city-${city}`;
    }
    
    return `http://${auth}@${host}:${port}`;
  }

  private getProxyConfigByType(type: ProxyType): ProxyConfig {
    const baseConfig = {
      username: this.username,
      password: this.password,
      session: Math.random().toString(36).substring(7)
    };

    switch (type) {
      case ProxyType.RESIDENTIAL:
        return {
          ...baseConfig,
          host: "zproxy.lum-superproxy.io",
          port: 22225,
          proxyType: ProxyType.RESIDENTIAL
        };
      
      case ProxyType.DATACENTER:
        return {
          ...baseConfig,
          host: "brd.superproxy.io",
          port: 22225,
          proxyType: ProxyType.DATACENTER
        };
      
      case ProxyType.ISP:
        return {
          ...baseConfig,
          host: "isp.lum-superproxy.io",
          port: 22225,
          proxyType: ProxyType.ISP
        };
      
      case ProxyType.MOBILE:
        return {
          ...baseConfig,
          host: "mobile.lum-superproxy.io",
          port: 22225,
          proxyType: ProxyType.MOBILE
        };
    }
  }

  private shouldRotateProxy(proxyConfig: ProxyConfig): boolean {
    const key = this.getProxyUrl(proxyConfig);
    const count = this.requestCount.get(key) || 0;
    return count >= this.rotationThreshold;
  }

  private rotateProxy(proxyConfig: ProxyConfig): ProxyConfig {
    const newConfig = { ...proxyConfig };
    newConfig.session = Math.random().toString(36).substring(7);
    this.requestCount.set(this.getProxyUrl(newConfig), 0);
    return newConfig;
  }

  private incrementRequestCount(proxyConfig: ProxyConfig): void {
    const key = this.getProxyUrl(proxyConfig);
    const count = this.requestCount.get(key) || 0;
    this.requestCount.set(key, count + 1);
  }

  private handleProxyError(error: any, proxyConfig: ProxyConfig): void {
    if (error.statusCode === 403 || error.statusCode === 429) {
      this.bannedIPs.add(this.getProxyUrl(proxyConfig));
      return this.rotateProxy(proxyConfig);
    }
    return proxyConfig;
  }

  async getWorkingProxy(preferredType: ProxyType = ProxyType.RESIDENTIAL): Promise<ProxyConfig> {
    let proxyConfig = this.getProxyConfigByType(preferredType);
    
    if (this.shouldRotateProxy(proxyConfig)) {
      proxyConfig = this.rotateProxy(proxyConfig);
    }

    // Sprawdź czy proxy nie jest zbanowane
    if (this.bannedIPs.has(this.getProxyUrl(proxyConfig))) {
      proxyConfig = this.rotateProxy(proxyConfig);
    }

    return proxyConfig;
  }

  async executeWithProxy<T>(
    action: (proxyUrl: string) => Promise<T>,
    preferredType: ProxyType = ProxyType.RESIDENTIAL
  ): Promise<T> {
    let retries = 0;
    let lastError: any;

    while (retries < this.maxRetries) {
      const proxyConfig = await this.getWorkingProxy(preferredType);
      const proxyUrl = this.getProxyUrl(proxyConfig);

      try {
        const result = await action(proxyUrl);
        this.incrementRequestCount(proxyConfig);
        return result;
      } catch (error) {
        lastError = error;
        this.handleProxyError(error, proxyConfig);
        retries++;
        
        // Jeśli błąd wskazuje na zablokowane proxy, spróbuj innego typu
        if (error.statusCode === 403 || error.statusCode === 429) {
          const fallbackTypes = [
            ProxyType.ISP,
            ProxyType.DATACENTER,
            ProxyType.MOBILE
          ].filter(type => type !== preferredType);
          
          for (const type of fallbackTypes) {
            try {
              const newProxyConfig = await this.getWorkingProxy(type);
              const result = await action(this.getProxyUrl(newProxyConfig));
              this.incrementRequestCount(newProxyConfig);
              return result;
            } catch (fallbackError) {
              lastError = fallbackError;
            }
          }
        }
      }
    }

    throw new Error(`Failed after ${this.maxRetries} retries. Last error: ${lastError.message}`);
  }
} 