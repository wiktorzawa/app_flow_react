'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.BrowserApiService = void 0;
const config_1 = require('../config/config');
class BrowserApiService {
  constructor() {
    this.host = 'brd.superproxy.io';
    this.port = 22225;
    this.username = config_1.config.brightData.username; // wiktor.zawadzki@gmail.com
    this.password = config_1.config.brightData.password; // ibwvrl7p6fjv
  }
  getBrowserWSEndpoint() {
    return `wss://${this.username}:${this.password}@${this.host}:${this.port}`;
  }
  createBrowserContext() {
    return __awaiter(this, void 0, void 0, function* () {
      const { chromium } = require('playwright');
      const browser = yield chromium.connectOverCDP(this.getBrowserWSEndpoint());
      return browser;
    });
  }
  createNewPage(browser) {
    return __awaiter(this, void 0, void 0, function* () {
      const context = yield browser.newContext({
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      });
      const page = yield context.newPage();
      return page;
    });
  }
  closeBrowser(browser) {
    return __awaiter(this, void 0, void 0, function* () {
      yield browser.close();
    });
  }
}
exports.BrowserApiService = BrowserApiService;
