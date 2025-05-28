import express from "express";
import { browserController } from "../controllers/browserController";

const router = express.Router();

// Endpoint do scrapowania dowolnej strony
router.get("/scrape", browserController.scrapeWebsite);

export default router; 