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
exports.RequestManager = void 0;
class RequestManager {
  constructor(page) {
    this.page = page;
    this.defaultOptions = {
      timeout: 30000,
      retryDelay: 1000,
      maxRetries: 3,
      randomizeDelay: true,
    };
  }
  delay(ms) {
    return __awaiter(this, void 0, void 0, function* () {
      if (this.defaultOptions.randomizeDelay) {
        // Dodaj losowe opóźnienie ±30%
        const randomFactor = 0.7 + Math.random() * 0.6;
        ms = Math.floor(ms * randomFactor);
      }
      yield new Promise((resolve) => setTimeout(resolve, ms));
    });
  }
  executeWithRetry(action_1) {
    return __awaiter(this, arguments, void 0, function* (action, options = {}) {
      const finalOptions = Object.assign(Object.assign({}, this.defaultOptions), options);
      let lastError = null;
      for (let attempt = 0; attempt < finalOptions.maxRetries; attempt++) {
        try {
          if (attempt > 0) {
            yield this.delay(finalOptions.retryDelay);
          }
          return yield action();
        } catch (error) {
          lastError = error;
          console.error(`Attempt ${attempt + 1} failed:`, error);
          // Sprawdź czy strona nie została zablokowana
          const content = yield this.page.content();
          if (content.includes('captcha') || content.includes('blocked')) {
            throw new Error('Detected blocking/CAPTCHA page');
          }
        }
      }
      throw new Error(
        `Failed after ${finalOptions.maxRetries} attempts. Last error: ${lastError === null || lastError === void 0 ? void 0 : lastError.message}`
      );
    });
  }
  navigateToUrl(url, options) {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.executeWithRetry(
        () =>
          __awaiter(this, void 0, void 0, function* () {
            yield this.page.goto(url, {
              timeout:
                (options === null || options === void 0 ? void 0 : options.timeout) ||
                this.defaultOptions.timeout,
              waitUntil: 'networkidle',
            });
            // Dodatkowe sprawdzenie czy strona załadowała się poprawnie
            const content = yield this.page.content();
            if (content.includes('captcha') || content.includes('blocked')) {
              throw new Error('Detected blocking/CAPTCHA page');
            }
          }),
        options
      );
    });
  }
  extractData(extractionLogic, options) {
    return __awaiter(this, void 0, void 0, function* () {
      return this.executeWithRetry(
        () =>
          __awaiter(this, void 0, void 0, function* () {
            // Dodaj losowe opóźnienia między akcjami
            yield this.delay(Math.random() * 1000 + 500);
            // Zasymuluj ludzkie zachowanie
            yield this.simulateHumanBehavior();
            return yield extractionLogic();
          }),
        options
      );
    });
  }
  simulateHumanBehavior() {
    return __awaiter(this, void 0, void 0, function* () {
      // Losowe scrollowanie
      yield this.page.evaluate(() => {
        window.scrollTo(0, Math.random() * document.body.scrollHeight);
      });
      // Losowe ruchy myszką
      const viewportSize = yield this.page.viewportSize();
      if (viewportSize) {
        yield this.page.mouse.move(
          Math.random() * viewportSize.width,
          Math.random() * viewportSize.height
        );
      }
      // Losowe opóźnienie
      yield this.delay(Math.random() * 500 + 200);
    });
  }
  waitForSelector(selector, options) {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.executeWithRetry(
        () =>
          __awaiter(this, void 0, void 0, function* () {
            yield this.page.waitForSelector(selector, {
              timeout:
                (options === null || options === void 0 ? void 0 : options.timeout) ||
                this.defaultOptions.timeout,
              state: (options === null || options === void 0 ? void 0 : options.visible)
                ? 'visible'
                : 'attached',
            });
          }),
        options
      );
    });
  }
}
exports.RequestManager = RequestManager;
