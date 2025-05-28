"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrapingService = void 0;
const playwright_1 = require("playwright");
const advancedProxyManager_1 = require("./advancedProxyManager");
const requestManager_1 = require("./requestManager");
class ScrapingService {
    constructor() {
        this.browser = null;
        this.proxyManager = new advancedProxyManager_1.AdvancedProxyManager();
    }
    initBrowser(proxyUrl, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield playwright_1.chromium.launch({
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
        });
    }
    setupPage(browser, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = yield browser.newPage();
            // Ustaw User-Agent
            yield page.setExtraHTTPHeaders(Object.assign({ "User-Agent": (options === null || options === void 0 ? void 0 : options.userAgent) || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" }, options === null || options === void 0 ? void 0 : options.headers));
            // Ustaw cookies jeśli są
            if (options === null || options === void 0 ? void 0 : options.cookies) {
                yield page.context().addCookies(options.cookies);
            }
            // Dodaj losowe opóźnienia do interakcji z przeglądarką
            yield page.setViewportSize({ width: 1920, height: 1080 });
            // Blokuj zbędne zasoby dla przyspieszenia
            yield page.route("**/*.{png,jpg,jpeg,gif,svg,css,font,woff2}", route => route.abort());
            return page;
        });
    }
    scrapeUrl(url, extractionLogic, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.proxyManager.executeWithProxy((proxyUrl) => __awaiter(this, void 0, void 0, function* () {
                this.browser = yield this.initBrowser(proxyUrl, options);
                const page = yield this.setupPage(this.browser, options);
                const requestManager = new requestManager_1.RequestManager(page);
                try {
                    // Nawiguj do strony z wszystkimi zabezpieczeniami
                    yield requestManager.navigateToUrl(url, {
                        timeout: options === null || options === void 0 ? void 0 : options.timeout,
                        maxRetries: options === null || options === void 0 ? void 0 : options.maxRetries
                    });
                    // Wykonaj ekstrakcję danych z zabezpieczeniami
                    const data = yield requestManager.extractData(() => extractionLogic(page), {
                        timeout: options === null || options === void 0 ? void 0 : options.timeout,
                        maxRetries: options === null || options === void 0 ? void 0 : options.maxRetries
                    });
                    return data;
                }
                finally {
                    yield page.close();
                    if (this.browser) {
                        yield this.browser.close();
                        this.browser = null;
                    }
                }
            }), options === null || options === void 0 ? void 0 : options.proxyType);
        });
    }
    scrapeMultipleUrls(urls, extractionLogic, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = [];
            const errors = [];
            for (const url of urls) {
                try {
                    const result = yield this.scrapeUrl(url, extractionLogic, options);
                    results.push(result);
                    // Dodaj losowe opóźnienie między requestami
                    yield new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
                }
                catch (error) {
                    console.error(`Failed to scrape ${url}:`, error);
                    errors.push(error);
                    // Jeśli zbyt dużo błędów, przerwij
                    if (errors.length > urls.length * 0.3) {
                        throw new Error("Too many scraping errors, aborting");
                    }
                }
            }
            return results;
        });
    }
    // Metoda do czyszczenia zasobów
    cleanup() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.browser) {
                yield this.browser.close();
                this.browser = null;
            }
        });
    }
}
exports.ScrapingService = ScrapingService;
