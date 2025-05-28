import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import { brightDataConfig } from "../config";

export class ProxyService {
  private agent: HttpsProxyAgent | undefined;
  private serviceEnabled: boolean;

  constructor() {
    const { localProxyManager } = brightDataConfig;
    this.serviceEnabled = localProxyManager.enabled;

    if (this.serviceEnabled) {
      if (!localProxyManager.host || !localProxyManager.port) {
        console.warn(
          "ProxyService: Host lub port dla localProxyManager nie są zdefiniowane w konfiguracji. Serwis proxy nie zostanie w pełni aktywowany."
        );
        this.serviceEnabled = false;
        return;
      }

      if (localProxyManager.username && localProxyManager.password) {
        const proxyUrl = `http://${localProxyManager.username}:${localProxyManager.password}@${localProxyManager.host}:${localProxyManager.port}`;
        this.agent = new HttpsProxyAgent(proxyUrl) as any;
        console.log(
          `ProxyService: Uruchomiono z uwierzytelnianiem dla ${localProxyManager.host}:${localProxyManager.port}`
        );
      } else {
        const proxyUrl = `http://${localProxyManager.host}:${localProxyManager.port}`;
        this.agent = new HttpsProxyAgent(proxyUrl) as any;
        console.log(
          `ProxyService: Uruchomiono bez uwierzytelniania dla ${localProxyManager.host}:${localProxyManager.port}`
        );
      }
    } else {
      console.log(
        "ProxyService: Usługa proxy jest wyłączona w konfiguracji (localProxyManager.enabled = false)."
      );
    }
  }

  public async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    if (!this.serviceEnabled || !this.agent) {
      console.warn(
        "ProxyService: Wykonuję bezpośrednie żądanie GET, ponieważ usługa proxy jest wyłączona lub agent nie jest skonfigurowany."
      );
      return axios.get<T>(url, config);
    }

    const requestConfig: AxiosRequestConfig = {
      ...config,
      httpsAgent: this.agent,
      proxy: false,
    };

    try {
      const response = await axios.get<T>(url, requestConfig);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(
          `ProxyService: Błąd żądania GET przez proxy dla ${url}: Status ${error.response.status}`,
          error.response.data
        );
      } else if (axios.isAxiosError(error) && error.request) {
        console.error(
          `ProxyService: Błąd żądania GET przez proxy dla ${url}: Nie otrzymano odpowiedzi`,
          error.request
        );
      } else {
        const axiosError = error as any;
        console.error(
          `ProxyService: Ogólny błąd żądania GET przez proxy dla ${url}:`,
          axiosError.message
        );
      }
      throw error;
    }
  }

  // Można dodać inne metody HTTP (post, put, delete) w podobny sposób, jeśli będą potrzebne
  // np. public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> { ... }
}

// Eksport pojedynczej instancji serwisu (Singleton pattern)
export const proxyService = new ProxyService(); 