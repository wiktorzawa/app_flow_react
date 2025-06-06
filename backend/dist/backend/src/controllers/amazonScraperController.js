"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.amazonScraperController = exports.AmazonScraperController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const amazonScraperService_1 = require("../services/amazonScraperService");
class AmazonScraperController {
    constructor() {
        /**
         * @desc    Scrapuje pojedynczy produkt Amazon
         * @route   POST /api/amazon-scraper/scrape
         * @access  Private
         */
        this.scrapeProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { url } = req.body;
            if (!url) {
                res.status(400).json({
                    success: false,
                    message: "URL produktu jest wymagany",
                });
                return;
            }
            // Walidacja URL Amazon
            const amazonUrlPattern = /^https?:\/\/(www\.)?amazon\.(com|co\.uk|de|fr|it|es|pl|ca|com\.mx|com\.br|in|jp|com\.au|nl|se|sg)\/.*$/;
            if (!amazonUrlPattern.test(url)) {
                res.status(400).json({
                    success: false,
                    message: "Nieprawidłowy URL Amazon",
                });
                return;
            }
            try {
                const product = yield amazonScraperService_1.amazonScraperService.scrapeAndSaveProduct(url);
                res.status(200).json({
                    success: true,
                    data: product,
                    message: "Produkt został pomyślnie zescrapowany i zapisany",
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message || "Błąd podczas scrapowania produktu",
                });
            }
        }));
        /**
         * @desc    Scrapuje wiele produktów Amazon
         * @route   POST /api/amazon-scraper/scrape-multiple
         * @access  Private
         */
        this.scrapeMultipleProducts = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { urls } = req.body;
            if (!urls || !Array.isArray(urls) || urls.length === 0) {
                res.status(400).json({
                    success: false,
                    message: "Lista URL produktów jest wymagana",
                });
                return;
            }
            // Limit do 10 produktów na raz
            if (urls.length > 10) {
                res.status(400).json({
                    success: false,
                    message: "Maksymalnie 10 produktów na raz",
                });
                return;
            }
            try {
                const products = yield amazonScraperService_1.amazonScraperService.scrapeMultipleProducts(urls);
                res.status(200).json({
                    success: true,
                    data: products,
                    count: products.length,
                    message: `Zescrapowano ${products.length} z ${urls.length} produktów`,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message || "Błąd podczas scrapowania produktów",
                });
            }
        }));
        /**
         * @desc    Pobiera wszystkie produkty z bazy danych
         * @route   GET /api/amazon-scraper/products
         * @access  Private
         */
        this.getAllProducts = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const AmazonProduct = (yield Promise.resolve().then(() => __importStar(require("../models/AmazonProduct")))).default;
                const products = yield AmazonProduct.findAll({
                    order: [["createdAt", "DESC"]],
                });
                res.status(200).json({
                    success: true,
                    data: products,
                    count: products.length,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message || "Błąd podczas pobierania produktów",
                });
            }
        }));
        /**
         * @desc    Pobiera produkt po ASIN
         * @route   GET /api/amazon-scraper/products/:asin
         * @access  Private
         */
        this.getProductByAsin = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { asin } = req.params;
            try {
                const AmazonProduct = (yield Promise.resolve().then(() => __importStar(require("../models/AmazonProduct")))).default;
                const product = yield AmazonProduct.findByAsin(asin);
                if (!product) {
                    res.status(404).json({
                        success: false,
                        message: "Produkt nie został znaleziony",
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    data: product,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message || "Błąd podczas pobierania produktu",
                });
            }
        }));
    }
}
exports.AmazonScraperController = AmazonScraperController;
exports.amazonScraperController = new AmazonScraperController();
