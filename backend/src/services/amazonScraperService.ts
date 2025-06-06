import puppeteer from "puppeteer-core";
import { config } from "../config/config";
import AmazonProduct from "../models/AmazonProduct";

interface ScraperConfig {
  username: string;
  password: string;
  zone?: string;
}

interface AmazonProductData {
  title: string;
  asin: string;
  upc?: string;
  initial_price?: number;
  final_price?: number;
  currency?: string;
  brand?: string;
  categories?: string[];
  domain?: string;
  url: string;
  image_url?: string;
  model_number?: string;
  from_the_brand?: string;
  features?: string[];
  images?: string[];
  product_details?: any;
}

export class AmazonScraperService {
  private scraperConfig: ScraperConfig;
  private wsEndpoint: string;

  constructor() {
    // Konfiguracja z pliku config
    this.scraperConfig = {
      username: config.brightDataScraperUsername,
      password: config.brightDataScraperPassword,
      zone: config.brightDataScraperZone,
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
  async scrapeProduct(productUrl: string): Promise<AmazonProductData | null> {
    if (!this.scraperConfig.username || !this.scraperConfig.password) {
      throw new Error("Bright Data Browser API credentials not configured");
    }

    console.log(`Rozpoczynam scrapowanie produktu: ${productUrl}`);

    let browser;
    try {
      // Połączenie z Bright Data Browser API
      console.log("Łączenie z Bright Data Browser API...");
      browser = await puppeteer.connect({
        browserWSEndpoint: this.wsEndpoint,
      });

      const page = await browser.newPage();

      // Ustawienie User-Agent i viewport
      await page.setViewport({ width: 1920, height: 1080 });

      // Nawigacja do strony produktu
      console.log("Nawigacja do strony produktu...");
      await page.goto(productUrl, {
        waitUntil: "networkidle2",
        timeout: 60000,
      });

      // Czekanie na załadowanie głównych elementów
      await page.waitForSelector("#productTitle", { timeout: 30000 }).catch(() => {
        console.log("Nie znaleziono tytułu produktu, próbuję alternatywne selektory...");
      });

      // Rozwiązywanie CAPTCHA jeśli występuje
      const client = await page.target().createCDPSession();
      console.log("Sprawdzanie CAPTCHA...");
      try {
        const captchaResult = (await client.send("Captcha.solve" as any, {
          detectTimeout: 30000,
        })) as any;
        console.log(`Status CAPTCHA: ${captchaResult.status || "not_detected"}`);
      } catch (error) {
        console.log("CAPTCHA nie wykryta lub już rozwiązana");
      }

      // Ekstrakcja danych produktu
      const productData = await page.evaluate(() => {
        const getTextContent = (selector: string): string | undefined => {
          const element = document.querySelector(selector);
          return element?.textContent?.trim();
        };

        const getPrice = (selector: string): number | undefined => {
          const priceText = getTextContent(selector);
          if (!priceText) return undefined;
          const price = priceText.match(/[\d,]+\.?\d*/)?.[0];
          return price ? parseFloat(price.replace(",", "")) : undefined;
        };

        // Pobieranie ASIN z URL lub meta tagów
        const getAsin = (): string => {
          // Próba 1: Z URL
          const urlMatch = window.location.pathname.match(/\/dp\/([A-Z0-9]{10})/);
          if (urlMatch) return urlMatch[1];

          // Próba 2: Z meta tagów
          const metaAsin = document.querySelector('meta[name="keywords"]')?.getAttribute("content");
          const asinMatch = metaAsin?.match(/([A-Z0-9]{10})/);
          if (asinMatch) return asinMatch[1];

          // Próba 3: Z danych produktu
          const asinElement = Array.from(document.querySelectorAll("span")).find((el) =>
            el.textContent?.includes("ASIN")
          );
          const asinText = asinElement?.nextElementSibling?.textContent;
          return asinText || "";
        };

        // Pobieranie kategorii
        const getCategories = (): string[] => {
          const categories: string[] = [];
          const breadcrumbs = document.querySelectorAll("#wayfinding-breadcrumbs_feature_div a");
          breadcrumbs.forEach((link) => {
            const text = link.textContent?.trim();
            if (text && text !== "‹") categories.push(text);
          });
          return categories;
        };

        // Pobieranie cech produktu
        const getFeatures = (): string[] => {
          const features: string[] = [];
          const featureElements = document.querySelectorAll("#feature-bullets li span");
          featureElements.forEach((el) => {
            const text = el.textContent?.trim();
            if (text) features.push(text);
          });
          return features;
        };

        // Pobieranie obrazów
        const getImages = (): string[] => {
          const images: string[] = [];
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
        const getProductDetails = (): any => {
          const details: any = {};
          const detailRows = document.querySelectorAll(
            "#productDetails_techSpec_section_1 tr, #productDetails_detailBullets_sections1 tr"
          );

          detailRows.forEach((row) => {
            const label = row.querySelector("th, td:first-child")?.textContent?.trim();
            const value = row.querySelector("td:last-child")?.textContent?.trim();
            if (label && value) {
              details[label.replace(":", "")] = value;
            }
          });

          return details;
        };

        return {
          title: getTextContent("#productTitle") || "",
          asin: getAsin(),
          initial_price:
            getPrice(".a-price-range .a-price-range-top .a-price.a-text-price") ||
            getPrice(".a-price.a-text-price.a-size-medium.apexPriceToPay"),
          final_price: getPrice(".a-price-whole") || getPrice(".a-price.a-text-price.a-size-medium.apexPriceToPay"),
          currency: document.querySelector(".a-price-symbol")?.textContent || "EUR",
          brand: getTextContent("#bylineInfo") || getTextContent(".po-brand .po-break-word"),
          categories: getCategories(),
          image_url:
            document.querySelector("#landingImage")?.getAttribute("src") ||
            document.querySelector("#imgBlkFront")?.getAttribute("src") ||
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
      const fromTheBrand = await page.evaluate(() => {
        const brandSection = document.querySelector("#aplus_feature_div");
        return brandSection?.textContent?.trim().substring(0, 1000); // Ograniczenie do 1000 znaków
      });

      // Pobieranie UPC jeśli dostępne
      const upc = await page.evaluate(() => {
        const upcElement = Array.from(document.querySelectorAll("span")).find((el) => el.textContent?.includes("UPC"));
        return upcElement?.nextElementSibling?.textContent?.trim();
      });

      console.log("Scrapowanie zakończone pomyślnie");

      return {
        ...productData,
        from_the_brand: fromTheBrand,
        upc: upc,
      };
    } catch (error) {
      console.error("Błąd podczas scrapowania:", error);
      throw error;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  /**
   * Scrapuje i zapisuje produkt do bazy danych
   * @param productUrl - URL produktu Amazon
   * @returns Zapisany produkt
   */
  async scrapeAndSaveProduct(productUrl: string): Promise<AmazonProduct | null> {
    try {
      // Sprawdzenie czy produkt już istnieje
      const existingProduct = await AmazonProduct.findByUrl(productUrl);
      if (existingProduct) {
        console.log(`Produkt już istnieje w bazie: ${existingProduct.asin}`);
        return existingProduct;
      }

      // Scrapowanie danych
      const productData = await this.scrapeProduct(productUrl);
      if (!productData) {
        throw new Error("Nie udało się pobrać danych produktu");
      }

      // Sprawdzenie czy produkt z tym ASIN już istnieje
      const existingByAsin = await AmazonProduct.findByAsin(productData.asin);
      if (existingByAsin) {
        console.log(`Produkt z ASIN ${productData.asin} już istnieje`);
        return existingByAsin;
      }

      // Zapisanie do bazy danych
      const newProduct = await AmazonProduct.create(productData);
      console.log(`Produkt zapisany: ${newProduct.asin}`);

      return newProduct;
    } catch (error) {
      console.error("Błąd podczas zapisywania produktu:", error);
      throw error;
    }
  }

  /**
   * Scrapuje wiele produktów
   * @param productUrls - Lista URL produktów
   * @returns Lista zapisanych produktów
   */
  async scrapeMultipleProducts(productUrls: string[]): Promise<AmazonProduct[]> {
    const results: AmazonProduct[] = [];

    for (const url of productUrls) {
      try {
        const product = await this.scrapeAndSaveProduct(url);
        if (product) {
          results.push(product);
        }

        // Opóźnienie między requestami (2-5 sekund)
        const delay = Math.random() * 3000 + 2000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      } catch (error) {
        console.error(`Błąd dla URL ${url}:`, error);
      }
    }

    return results;
  }
}

// Eksport instancji serwisu
export const amazonScraperService = new AmazonScraperService();
