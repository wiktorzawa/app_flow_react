import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { amazonScraperService } from "../services/amazonScraperService";

export class AmazonScraperController {
  /**
   * @desc    Scrapuje pojedynczy produkt Amazon
   * @route   POST /api/amazon-scraper/scrape
   * @access  Private
   */
  scrapeProduct = asyncHandler(async (req: Request, res: Response) => {
    const { url } = req.body;

    if (!url) {
      res.status(400).json({
        success: false,
        message: "URL produktu jest wymagany",
      });
      return;
    }

    // Walidacja URL Amazon
    const amazonUrlPattern =
      /^https?:\/\/(www\.)?amazon\.(com|co\.uk|de|fr|it|es|pl|ca|com\.mx|com\.br|in|jp|com\.au|nl|se|sg)\/.*$/;
    if (!amazonUrlPattern.test(url)) {
      res.status(400).json({
        success: false,
        message: "Nieprawidłowy URL Amazon",
      });
      return;
    }

    try {
      const product = await amazonScraperService.scrapeAndSaveProduct(url);

      res.status(200).json({
        success: true,
        data: product,
        message: "Produkt został pomyślnie zescrapowany i zapisany",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Błąd podczas scrapowania produktu",
      });
    }
  });

  /**
   * @desc    Scrapuje wiele produktów Amazon
   * @route   POST /api/amazon-scraper/scrape-multiple
   * @access  Private
   */
  scrapeMultipleProducts = asyncHandler(async (req: Request, res: Response) => {
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
      const products = await amazonScraperService.scrapeMultipleProducts(urls);

      res.status(200).json({
        success: true,
        data: products,
        count: products.length,
        message: `Zescrapowano ${products.length} z ${urls.length} produktów`,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Błąd podczas scrapowania produktów",
      });
    }
  });

  /**
   * @desc    Pobiera wszystkie produkty z bazy danych
   * @route   GET /api/amazon-scraper/products
   * @access  Private
   */
  getAllProducts = asyncHandler(async (req: Request, res: Response) => {
    try {
      const AmazonProduct = (await import("../models/AmazonProduct")).default;
      const products = await AmazonProduct.findAll({
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({
        success: true,
        data: products,
        count: products.length,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Błąd podczas pobierania produktów",
      });
    }
  });

  /**
   * @desc    Pobiera produkt po ASIN
   * @route   GET /api/amazon-scraper/products/:asin
   * @access  Private
   */
  getProductByAsin = asyncHandler(async (req: Request, res: Response) => {
    const { asin } = req.params;

    try {
      const AmazonProduct = (await import("../models/AmazonProduct")).default;
      const product = await AmazonProduct.findByAsin(asin);

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
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Błąd podczas pobierania produktu",
      });
    }
  });
}

export const amazonScraperController = new AmazonScraperController();
