import { Request, Response } from "express";
import { BrowserApiService } from "../services/browserApiService";

const browserApiService = new BrowserApiService();

export const browserController = {
  async scrapeWebsite(req: Request, res: Response) {
    try {
      const { url } = req.query;
      
      if (!url || typeof url !== "string") {
        return res.status(400).json({
          success: false,
          error: "URL jest wymagany"
        });
      }

      const browser = await browserApiService.createBrowserContext();
      const page = await browserApiService.createNewPage(browser);
      
      await page.goto(url, { timeout: 60000 });
      
      // Tutaj możesz dodać własną logikę scrapowania
      const title = await page.title();
      const content = await page.content();
      
      await browserApiService.closeBrowser(browser);
      
      res.json({
        success: true,
        data: {
          title,
          content
        }
      });
    } catch (error) {
      console.error("Błąd podczas scrapowania strony:", error);
      res.status(500).json({
        success: false,
        error: "Nie udało się pobrać danych ze strony"
      });
    }
  }
}; 