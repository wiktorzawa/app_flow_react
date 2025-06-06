"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const amazonScraperController_1 = require("../controllers/amazonScraperController");
const router = (0, express_1.Router)();
// Scrapowanie pojedynczego produktu
router.post("/scrape", amazonScraperController_1.amazonScraperController.scrapeProduct);
// Scrapowanie wielu produktów
router.post("/scrape-multiple", amazonScraperController_1.amazonScraperController.scrapeMultipleProducts);
// Pobieranie wszystkich produktów
router.get("/products", amazonScraperController_1.amazonScraperController.getAllProducts);
// Pobieranie produktu po ASIN
router.get("/products/:asin", amazonScraperController_1.amazonScraperController.getProductByAsin);
exports.default = router;
