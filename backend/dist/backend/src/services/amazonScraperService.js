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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.amazonScraperService = exports.AmazonScraperService = void 0;
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const config_1 = require("../config/config");
const AmazonProduct_1 = __importDefault(require("../models/AmazonProduct"));
class AmazonScraperService {
    constructor() {
        // Konfiguracja z pliku config
        this.scraperConfig = {
            username: config_1.config.brightDataScraperUsername,
            password: config_1.config.brightDataScraperPassword,
            zone: config_1.config.brightDataScraperZone,
        };
        if (!this.scraperConfig.username || !this.scraperConfig.password) {
            console.warn("OSTRZEŻENIE: Brak konfiguracji Bright Data Browser API");
        }
        // Konstruowanie WebSocket endpoint
        const auth = `${this.scraperConfig.username}:${this.scraperConfig.password}`;
        this.wsEndpoint = `wss://${auth}@brd.superproxy.io:9222`;
    }
    /**
     * Scrapuje dane produktu Amazon
     * @param productUrl - URL produktu Amazon
     * @returns Dane produktu
     */
    scrapeProduct(productUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.scraperConfig.username || !this.scraperConfig.password) {
                throw new Error("Bright Data Browser API credentials not configured");
            }
            console.log(`Rozpoczynam scrapowanie produktu: ${productUrl}`);
            let browser;
            try {
                // Połączenie z Bright Data Browser API
                console.log("Łączenie z Bright Data Browser API...");
                browser = yield puppeteer_core_1.default.connect({
                    browserWSEndpoint: this.wsEndpoint,
                });
                const page = yield browser.newPage();
                // Ustawienie User-Agent i viewport
                yield page.setViewport({ width: 1920, height: 1080 });
                // Nawigacja do strony produktu
                console.log("Nawigacja do strony produktu...");
                yield page.goto(productUrl, {
                    waitUntil: "networkidle2",
                    timeout: 60000,
                });
                // Czekanie na załadowanie głównych elementów
                yield page.waitForSelector("#productTitle", { timeout: 30000 }).catch(() => {
                    console.log("Nie znaleziono tytułu produktu, próbuję alternatywne selektory...");
                });
                // Rozwiązywanie CAPTCHA jeśli występuje
                const client = yield page.target().createCDPSession();
                console.log("Sprawdzanie CAPTCHA...");
                try {
                    const captchaResult = (yield client.send("Captcha.solve", {
                        detectTimeout: 30000,
                    }));
                    console.log(`Status CAPTCHA: ${captchaResult.status || "not_detected"}`);
                }
                catch (error) {
                    console.log("CAPTCHA nie wykryta lub już rozwiązana");
                }
                // Ekstrakcja danych produktu
                const productData = yield page.evaluate(() => {
                    var _a, _b, _c;
                    const getTextContent = (selector) => {
                        var _a;
                        const element = document.querySelector(selector);
                        return (_a = element === null || element === void 0 ? void 0 : element.textContent) === null || _a === void 0 ? void 0 : _a.trim();
                    };
                    const getPrice = (selector) => {
                        var _a;
                        const priceText = getTextContent(selector);
                        if (!priceText)
                            return undefined;
                        const price = (_a = priceText.match(/[\d,]+\.?\d*/)) === null || _a === void 0 ? void 0 : _a[0];
                        return price ? parseFloat(price.replace(",", "")) : undefined;
                    };
                    // Pobieranie ASIN z URL lub meta tagów
                    const getAsin = () => {
                        var _a, _b;
                        // Próba 1: Z URL
                        const urlMatch = window.location.pathname.match(/\/dp\/([A-Z0-9]{10})/);
                        if (urlMatch)
                            return urlMatch[1];
                        // Próba 2: Z meta tagów
                        const metaAsin = (_a = document.querySelector('meta[name="keywords"]')) === null || _a === void 0 ? void 0 : _a.getAttribute("content");
                        const asinMatch = metaAsin === null || metaAsin === void 0 ? void 0 : metaAsin.match(/([A-Z0-9]{10})/);
                        if (asinMatch)
                            return asinMatch[1];
                        // Próba 3: Z danych produktu
                        const asinElement = Array.from(document.querySelectorAll("span")).find((el) => { var _a; return (_a = el.textContent) === null || _a === void 0 ? void 0 : _a.includes("ASIN"); });
                        const asinText = (_b = asinElement === null || asinElement === void 0 ? void 0 : asinElement.nextElementSibling) === null || _b === void 0 ? void 0 : _b.textContent;
                        return asinText || "";
                    };
                    // Pobieranie kategorii
                    const getCategories = () => {
                        const categories = [];
                        const breadcrumbs = document.querySelectorAll("#wayfinding-breadcrumbs_feature_div a");
                        breadcrumbs.forEach((link) => {
                            var _a;
                            const text = (_a = link.textContent) === null || _a === void 0 ? void 0 : _a.trim();
                            if (text && text !== "‹")
                                categories.push(text);
                        });
                        return categories;
                    };
                    // Pobieranie cech produktu
                    const getFeatures = () => {
                        const features = [];
                        const featureElements = document.querySelectorAll("#feature-bullets li span");
                        featureElements.forEach((el) => {
                            var _a;
                            const text = (_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim();
                            if (text)
                                features.push(text);
                        });
                        return features;
                    };
                    // Pobieranie obrazów
                    const getImages = () => {
                        const images = [];
                        const imageElements = document.querySelectorAll("#altImages img");
                        imageElements.forEach((img) => {
                            const src = img.getAttribute("src");
                            if (src && !src.includes("blank.gif")) {
                                // Konwersja na pełny rozmiar
                                const fullSizeSrc = src.replace(/\._.*_\./, ".");
                                images.push(fullSizeSrc);
                            }
                        });
                        return images;
                    };
                    // Pobieranie szczegółów produktu
                    const getProductDetails = () => {
                        const details = {};
                        const detailRows = document.querySelectorAll("#productDetails_techSpec_section_1 tr, #productDetails_detailBullets_sections1 tr");
                        detailRows.forEach((row) => {
                            var _a, _b, _c, _d;
                            const label = (_b = (_a = row.querySelector("th, td:first-child")) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim();
                            const value = (_d = (_c = row.querySelector("td:last-child")) === null || _c === void 0 ? void 0 : _c.textContent) === null || _d === void 0 ? void 0 : _d.trim();
                            if (label && value) {
                                details[label.replace(":", "")] = value;
                            }
                        });
                        return details;
                    };
                    return {
                        title: getTextContent("#productTitle") || "",
                        asin: getAsin(),
                        initial_price: getPrice(".a-price-range .a-price-range-top .a-price.a-text-price") ||
                            getPrice(".a-price.a-text-price.a-size-medium.apexPriceToPay"),
                        final_price: getPrice(".a-price-whole") || getPrice(".a-price.a-text-price.a-size-medium.apexPriceToPay"),
                        currency: ((_a = document.querySelector(".a-price-symbol")) === null || _a === void 0 ? void 0 : _a.textContent) || "EUR",
                        brand: getTextContent("#bylineInfo") || getTextContent(".po-brand .po-break-word"),
                        categories: getCategories(),
                        image_url: ((_b = document.querySelector("#landingImage")) === null || _b === void 0 ? void 0 : _b.getAttribute("src")) ||
                            ((_c = document.querySelector("#imgBlkFront")) === null || _c === void 0 ? void 0 : _c.getAttribute("src")) ||
                            undefined,
                        model_number: getTextContent(".po-model_name .po-break-word"),
                        features: getFeatures(),
                        images: getImages(),
                        product_details: getProductDetails(),
                        url: window.location.href,
                        domain: window.location.hostname,
                    };
                });
                // Pobieranie dodatkowych informacji "From the brand"
                const fromTheBrand = yield page.evaluate(() => {
                    var _a;
                    const brandSection = document.querySelector("#aplus_feature_div");
                    return (_a = brandSection === null || brandSection === void 0 ? void 0 : brandSection.textContent) === null || _a === void 0 ? void 0 : _a.trim().substring(0, 1000); // Ograniczenie do 1000 znaków
                });
                // Pobieranie UPC jeśli dostępne
                const upc = yield page.evaluate(() => {
                    var _a, _b;
                    const upcElement = Array.from(document.querySelectorAll("span")).find((el) => { var _a; return (_a = el.textContent) === null || _a === void 0 ? void 0 : _a.includes("UPC"); });
                    return (_b = (_a = upcElement === null || upcElement === void 0 ? void 0 : upcElement.nextElementSibling) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim();
                });
                console.log("Scrapowanie zakończone pomyślnie");
                return Object.assign(Object.assign({}, productData), { from_the_brand: fromTheBrand, upc: upc });
            }
            catch (error) {
                console.error("Błąd podczas scrapowania:", error);
                throw error;
            }
            finally {
                if (browser) {
                    yield browser.close();
                }
            }
        });
    }
    /**
     * Scrapuje i zapisuje produkt do bazy danych
     * @param productUrl - URL produktu Amazon
     * @returns Zapisany produkt
     */
    scrapeAndSaveProduct(productUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Sprawdzenie czy produkt już istnieje
                const existingProduct = yield AmazonProduct_1.default.findByUrl(productUrl);
                if (existingProduct) {
                    console.log(`Produkt już istnieje w bazie: ${existingProduct.asin}`);
                    return existingProduct;
                }
                // Scrapowanie danych
                const productData = yield this.scrapeProduct(productUrl);
                if (!productData) {
                    throw new Error("Nie udało się pobrać danych produktu");
                }
                // Sprawdzenie czy produkt z tym ASIN już istnieje
                const existingByAsin = yield AmazonProduct_1.default.findByAsin(productData.asin);
                if (existingByAsin) {
                    console.log(`Produkt z ASIN ${productData.asin} już istnieje`);
                    return existingByAsin;
                }
                // Zapisanie do bazy danych
                const newProduct = yield AmazonProduct_1.default.create(productData);
                console.log(`Produkt zapisany: ${newProduct.asin}`);
                return newProduct;
            }
            catch (error) {
                console.error("Błąd podczas zapisywania produktu:", error);
                throw error;
            }
        });
    }
    /**
     * Scrapuje wiele produktów
     * @param productUrls - Lista URL produktów
     * @returns Lista zapisanych produktów
     */
    scrapeMultipleProducts(productUrls) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = [];
            for (const url of productUrls) {
                try {
                    const product = yield this.scrapeAndSaveProduct(url);
                    if (product) {
                        results.push(product);
                    }
                    // Opóźnienie między requestami (2-5 sekund)
                    const delay = Math.random() * 3000 + 2000;
                    yield new Promise((resolve) => setTimeout(resolve, delay));
                }
                catch (error) {
                    console.error(`Błąd dla URL ${url}:`, error);
                }
            }
            return results;
        });
    }
}
exports.AmazonScraperService = AmazonScraperService;
// Eksport instancji serwisu
exports.amazonScraperService = new AmazonScraperService();
