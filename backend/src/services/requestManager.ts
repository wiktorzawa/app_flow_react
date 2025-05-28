import { Page } from "playwright";

interface RequestOptions {
  timeout?: number;
  retryDelay?: number;
  maxRetries?: number;
  randomizeDelay?: boolean;
}

export class RequestManager {
  private readonly defaultOptions: RequestOptions = {
    timeout: 30000,
    retryDelay: 1000,
    maxRetries: 3,
    randomizeDelay: true
  };

  constructor(private readonly page: Page) {}

  private async delay(ms: number): Promise<void> {
    if (this.defaultOptions.randomizeDelay) {
      // Dodaj losowe opóźnienie ±30%
      const randomFactor = 0.7 + Math.random() * 0.6;
      ms = Math.floor(ms * randomFactor);
    }
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  private async executeWithRetry<T>(
    action: () => Promise<T>,
    options: RequestOptions = {}
  ): Promise<T> {
    const finalOptions = { ...this.defaultOptions, ...options };
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < finalOptions.maxRetries!; attempt++) {
      try {
        if (attempt > 0) {
          await this.delay(finalOptions.retryDelay!);
        }
        return await action();
      } catch (error) {
        lastError = error as Error;
        console.error(`Attempt ${attempt + 1} failed:`, error);
        
        // Sprawdź czy strona nie została zablokowana
        const content = await this.page.content();
        if (content.includes("captcha") || content.includes("blocked")) {
          throw new Error("Detected blocking/CAPTCHA page");
        }
      }
    }

    throw new Error(`Failed after ${finalOptions.maxRetries} attempts. Last error: ${lastError?.message}`);
  }

  async navigateToUrl(url: string, options?: RequestOptions): Promise<void> {
    await this.executeWithRetry(async () => {
      await this.page.goto(url, { 
        timeout: options?.timeout || this.defaultOptions.timeout,
        waitUntil: "networkidle"
      });
      
      // Dodatkowe sprawdzenie czy strona załadowała się poprawnie
      const content = await this.page.content();
      if (content.includes("captcha") || content.includes("blocked")) {
        throw new Error("Detected blocking/CAPTCHA page");
      }
    }, options);
  }

  async extractData<T>(
    extractionLogic: () => Promise<T>,
    options?: RequestOptions
  ): Promise<T> {
    return this.executeWithRetry(async () => {
      // Dodaj losowe opóźnienia między akcjami
      await this.delay(Math.random() * 1000 + 500);
      
      // Zasymuluj ludzkie zachowanie
      await this.simulateHumanBehavior();
      
      return await extractionLogic();
    }, options);
  }

  private async simulateHumanBehavior(): Promise<void> {
    // Losowe scrollowanie
    await this.page.evaluate(() => {
      window.scrollTo(0, Math.random() * document.body.scrollHeight);
    });
    
    // Losowe ruchy myszką
    const viewportSize = await this.page.viewportSize();
    if (viewportSize) {
      await this.page.mouse.move(
        Math.random() * viewportSize.width,
        Math.random() * viewportSize.height
      );
    }
    
    // Losowe opóźnienie
    await this.delay(Math.random() * 500 + 200);
  }

  async waitForSelector(
    selector: string,
    options?: RequestOptions & { visible?: boolean }
  ): Promise<void> {
    await this.executeWithRetry(async () => {
      await this.page.waitForSelector(selector, {
        timeout: options?.timeout || this.defaultOptions.timeout,
        state: options?.visible ? "visible" : "attached"
      });
    }, options);
  }
} 