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
exports.browserController = void 0;
const browserApiService_1 = require("../services/browserApiService");
const browserApiService = new browserApiService_1.BrowserApiService();
exports.browserController = {
    scrapeWebsite(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { url } = req.query;
                if (!url || typeof url !== "string") {
                    return res.status(400).json({
                        success: false,
                        error: "URL jest wymagany"
                    });
                }
                const browser = yield browserApiService.createBrowserContext();
                const page = yield browserApiService.createNewPage(browser);
                yield page.goto(url, { timeout: 60000 });
                // Tutaj możesz dodać własną logikę scrapowania
                const title = yield page.title();
                const content = yield page.content();
                yield browserApiService.closeBrowser(browser);
                res.json({
                    success: true,
                    data: {
                        title,
                        content
                    }
                });
            }
            catch (error) {
                console.error("Błąd podczas scrapowania strony:", error);
                res.status(500).json({
                    success: false,
                    error: "Nie udało się pobrać danych ze strony"
                });
            }
        });
    }
};
