import { Browser } from 'playwright';
import { config } from '../config/config';

export class BrowserApiService {
  private readonly username: string;
  private readonly password: string;
  private readonly host: string = 'brd.superproxy.io';
  private readonly port: number = 22225;

  constructor() {
    this.username = config.brightData.username; // wiktor.zawadzki@gmail.com
    this.password = config.brightData.password; // ibwvrl7p6fjv
  }

  getBrowserWSEndpoint() {
    return `wss://${this.username}:${this.password}@${this.host}:${this.port}`;
  }

  async createBrowserContext() {
    const { chromium } = require('playwright');
    const browser = await chromium.connectOverCDP(this.getBrowserWSEndpoint());
    return browser;
  }

  async createNewPage(browser: Browser) {
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    });
    
    const page = await context.newPage();
    return page;
  }

  async closeBrowser(browser: Browser) {
    await browser.close();
  }
} 