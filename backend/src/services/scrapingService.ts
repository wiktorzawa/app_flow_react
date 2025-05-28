import { chromium, Browser, Page } from "playwright";
import { AdvancedProxyManager, ProxyType } from "./advancedProxyManager";
import { RequestManager } from "./requestManager";

interface ScrapingOptions {
  proxyType?: ProxyType;
  timeout?: number;
  maxRetries?: number;
  userAgent?: string;
  cookies?: any[];
  headers?: Record<string, string>;
}

export class ScrapingService {
  private browser: Browser | null = null;
  private readonly proxyManager: AdvancedProxyManager;
  
  constructor() {
    this.proxyManager = new AdvancedProxyManager();
  }

  private async initBrowser(proxyUrl: string, options?: ScrapingOptions): Promise<Browser> {
    return await chromium.launch({
      proxy: {
        server: proxyUrl,
        username: process.env.BRIGHT_DATA_USERNAME,
        password: process.env.BRIGHT_DATA_PASSWORD
      },
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
        "--window-size=1920x1080"
      ]
    });
  }

  private async setupPage(browser: Browser, options?: ScrapingOptions): Promise<Page> {
    const page = await browser.newPage();
    
    // Ustaw User-Agent
    await page.setExtraHTTPHeaders({
      "User-Agent": options?.userAgent || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      ...options?.headers
    });

    // Ustaw cookies jeśli są
    if (options?.cookies) {
      await page.context().addCookies(options.cookies);
    }

    // Dodaj losowe opóźnienia do interakcji z przeglądarką
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Blokuj zbędne zasoby dla przyspieszenia
    await page.route("**/*.{png,jpg,jpeg,gif,svg,css,font,woff2}", route => route.abort());
    
    return page;
  }

  async scrapeUrl<T>(
    url: string,
    extractionLogic: (page: Page) => Promise<T>,
    options?: ScrapingOptions
  ): Promise<T> {
    return this.proxyManager.executeWithProxy(async (proxyUrl) => {
      this.browser = await this.initBrowser(proxyUrl, options);
      const page = await this.setupPage(this.browser, options);
      const requestManager = new RequestManager(page);

      try {
        // Nawiguj do strony z wszystkimi zabezpieczeniami
        await requestManager.navigateToUrl(url, {
          timeout: options?.timeout,
          maxRetries: options?.maxRetries
        });

        // Wykonaj ekstrakcję danych z zabezpieczeniami
        const data = await requestManager.extractData(() => extractionLogic(page), {
          timeout: options?.timeout,
          maxRetries: options?.maxRetries
        });

        return data;
      } finally {
        await page.close();
        if (this.browser) {
          await this.browser.close();
          this.browser = null;
        }
      }
    }, options?.proxyType);
  }

  async scrapeMultipleUrls<T>(
    urls: string[],
    extractionLogic: (page: Page) => Promise<T>,
    options?: ScrapingOptions
  ): Promise<T[]> {
    const results: T[] = [];
    const errors: Error[] = [];

    for (const url of urls) {
      try {
        const result = await this.scrapeUrl(url, extractionLogic, options);
        results.push(result);
        
        // Dodaj losowe opóźnienie między requestami
        await new Promise(resolve => 
          setTimeout(resolve, Math.random() * 2000 + 1000)
        );
      } catch (error) {
        console.error(`Failed to scrape ${url}:`, error);
        errors.push(error as Error);
        
        // Jeśli zbyt dużo błędów, przerwij
        if (errors.length > urls.length * 0.3) {
          throw new Error("Too many scraping errors, aborting");
        }
      }
    }

    return results;
  }

  // Metoda do czyszczenia zasobów
  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
} 