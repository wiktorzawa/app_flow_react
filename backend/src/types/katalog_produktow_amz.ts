import { SupplierProductInput } from './dostawca_spec_originalny';

interface ProductDetail {
  name: string;
  value: string | number | boolean | null;
}

interface PriceBreakdown {
  original?: number;
  current?: number;
  discount?: number;
  savings?: number;
  currency?: string;
}

interface Variation {
  asin?: string;
  title?: string;
  price?: number;
  image?: string;
  selected?: boolean;
  attributes?: Record<string, string>;
}

interface BestSellerRank {
  category: string;
  rank: number;
  url?: string;
}

export interface ScrapedProductData {
  id?: number | string;
  asin?: string | null;
  upc?: string | null;
  title: string;
  brand?: string | null;
  description?: string | null;
  description_html?: string | null;
  features?: string[] | null;
  model_number?: string | null;
  department?: string | null;
  product_details?: ProductDetail[] | null;
  ingredients?: string[] | null;
  product_dimensions?: string | null;
  initial_price?: number | null;
  final_price?: number | null;
  final_price_high?: number | null;
  currency: string;
  discount?: number | null;
  buybox_prices?: number[] | null;
  prices_breakdown?: PriceBreakdown | null;
  unit_price?: string | null;
  other_sellers_prices?: number[] | null;
  categories?: string[] | null;
  categories_with_urls?: Record<string, string>[] | null;
  root_bs_category?: string | null;
  bs_category?: string | null;
  bs_rank?: number | null;
  image_url?: string | null;
  images?: string[] | null;
  images_count?: number | null;
  bought_past_month?: number | null;
  url: string;
  origin_url?: string | null;
  domain?: string | null;
  parent_asin?: string | null;
  variations?: Variation[] | null;
  product_rating_object?: Record<string, number> | null;
  supplier_data?: SupplierProductInput | null;
  last_scraped_at?: Date;
  best_sellers_rank?: BestSellerRank[] | null;
  is_prime?: boolean | null;
  raw_html?: string | null;
}

export interface ProductImage {
  url: string;
  scraped_product_id: number | string;
  is_main_image?: boolean;
  s3_key?: string;
  alt_text?: string | null;
}
