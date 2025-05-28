import axios from "axios";
import httpsProxyAgent from "https-proxy-agent";
import { brightDataConfig, scraperConfig } from "../config";
import { ScrapedProductData } from "../types/katalog_produktow_amz";
import { logger } from "../utils/logger";

// Typ dla odpowiedzi z Web Scraper IDE (należy dostosować do rzeczywistej struktury)
interface BrightDataScraperResponse {
  product_title?: string;
  price?: number;
  product_description?: string;
  images?: string[];
  asin?: string;
  [key: string]: any;
}

export class ScraperService {
  private axiosInstance;

  constructor() {
    const proxyConfig = brightDataConfig.localProxyManager;
    let agent;
    if (proxyConfig.enabled && proxyConfig.host && proxyConfig.port) {
      let authPart = '';
      if (proxyConfig.username && proxyConfig.password) {
        authPart = `${proxyConfig.username}:${proxyConfig.password}@`;
      }
      const proxyUrl = `http://${authPart}${proxyConfig.host}:${proxyConfig.port}`;
      agent = new httpsProxyAgent.HttpsProxyAgent(proxyUrl);
      logger.info('ScraperService: Using local proxy manager: ' + proxyConfig.host + ':' + proxyConfig.port);
    } else {
      logger.info("ScraperService: Not using local proxy manager.");
    }
    this.axiosInstance = axios.create({
      httpsAgent: agent,
    });
  }

  /**
   * Pobiera dane produktu z Amazon używając Web Scraper IDE od Bright Data.
   * @param asin - ASIN produktu do zescrapowania.
   * @param marketplace - Opcjonalnie: rynek Amazon (np. "US", "DE").
   * @returns Zmapowane dane produktu lub null w przypadku błędu.
   */
  public async scrapeAmazonProductByAsin(
    asin: string,
    marketplace?: string
  ): Promise<ScrapedProductData | null> {
    const { apiKey, collectorId } = brightDataConfig.webScraperIdeApi;
    const targetMarketplace = marketplace || scraperConfig.amazon.defaultMarketplace;

    if (!apiKey || !collectorId) {
      logger.error(
        "ScraperService: API key or Collector ID for Bright Data Web Scraper IDE is not configured."
      );
      throw new Error(
        "Bright Data Web Scraper IDE API key or Collector ID not configured."
      );
    }

    const apiUrl = `https://api.brightdata.com/dca/trigger_and_deliver/${collectorId}`;
    const headers = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    };
    const body = {
      product_asin: asin,
      marketplace_id: targetMarketplace,
    };

    logger.info(
      `ScraperService: Triggering Bright Data collector '${collectorId}' for ASIN '${asin}' on marketplace '${targetMarketplace}'.`
    );

    try {
      const response = await this.axiosInstance.post<BrightDataScraperResponse[] | BrightDataScraperResponse>(
        apiUrl,
        body,
        { headers }
      );
      
      logger.info(`ScraperService: Received response from Bright Data for ASIN '${asin}'. Status: ${response.status}`);

      let rawProductData: BrightDataScraperResponse | undefined;
      if (Array.isArray(response.data) && response.data.length > 0) {
        rawProductData = response.data[0];
      } else if (!Array.isArray(response.data) && typeof response.data === 'object' && response.data !== null) {
        rawProductData = response.data as BrightDataScraperResponse;
      }

      if (!rawProductData) {
        logger.warn(`ScraperService: No product data found in Bright Data response for ASIN '${asin}'. Response data: ${JSON.stringify(response.data)}`);
        return null;
      }

      const mappedProduct = this.mapBrightDataResponseToKatalog(
        rawProductData,
        asin,
        targetMarketplace
      );
      return mappedProduct;

    } catch (error: any) {
      logger.error(
        `ScraperService: Error scraping Amazon product ASIN '${asin}':`,
        error.response?.data || error.message
      );
      if (axios.isAxiosError(error) && error.response) {
        logger.error('BrightData API Error Details:', {
          status: error.response.status,
          headers: error.response.headers,
          data: error.response.data,
        });
      }
      return null;
    }
  }

  /**
   * Mapuje surową odpowiedź z Bright Data na nasz wewnętrzny typ KatalogProduktowAmz.
   * To jest kluczowe miejsce, gdzie musisz dopasować pola z JSONa od Bright Data
   * do pól w twoim modelu.
   */
  private mapBrightDataResponseToKatalog(
    data: BrightDataScraperResponse,
    originalAsin: string,
    marketplace: string
  ): ScrapedProductData {
    
    const product: ScrapedProductData = {
      asin: data.asin || originalAsin,
      title: data.product_title || "N/A",
      description: data.product_description,
      final_price: data.price,
      currency: data.currency_symbol || "USD",
      images: data.images,
      url: data.product_url || `https://www.amazon.${marketplace}/dp/${data.asin || originalAsin}`,
      upc: data.upc || null,
      brand: data.brand_name || null,
      last_scraped_at: new Date(),
      id: undefined,
      description_html: null,
      features: null,
      model_number: null,
      department: null,
      product_details: null,
      ingredients: null,
      product_dimensions: null,
      initial_price: null,
      final_price_high: null,
      discount: null,
      buybox_prices: null,
      prices_breakdown: null,
      unit_price: null,
      other_sellers_prices: null,
      categories: null,
      categories_with_urls: null,
      root_bs_category: null,
      bs_category: null,
      bs_rank: null,
      image_url: (data.images && data.images.length > 0) ? data.images[0] : null,
      images_count: data.images ? data.images.length : 0,
      bought_past_month: null,
      origin_url: null,
      domain: `amazon.${marketplace}`,
      parent_asin: null,
      variations: null,
      product_rating_object: null,
      supplier_data: null,
      best_sellers_rank: null,
      is_prime: null,
      raw_html: null,
    };

    logger.info(`ScraperService: Successfully mapped data for ASIN '${product.asin}'. Title: ${product.title}`);
    return product;
  }
}

export const scraperService = new ScraperService(); 