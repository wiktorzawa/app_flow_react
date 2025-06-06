import { Router } from "express";
import { amazonScraperController } from "../controllers/amazonScraperController";

const router = Router();

// Scrapowanie pojedynczego produktu
router.post("/scrape", amazonScraperController.scrapeProduct);

// Scrapowanie wielu produktów
router.post("/scrape-multiple", amazonScraperController.scrapeMultipleProducts);

// Pobieranie wszystkich produktów
router.get("/products", amazonScraperController.getAllProducts);

// Pobieranie produktu po ASIN
router.get("/products/:asin", amazonScraperController.getProductByAsin);

export default router;
