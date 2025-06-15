import { DataTypes, Model, Optional, Op } from "sequelize";
import { sequelize } from "../config/database";

interface AmazonProductAttributes {
  id: number;
  title: string;
  seller_name: string | null;
  brand: string | null;
  description: string | null;
  description_html: string | null;
  initial_price: number | null;
  final_price: number | null;
  final_price_high: number | null;
  currency: string;
  availability: string | null;
  reviews_count: number | null;
  categories: string[] | null;
  categories_with_urls: Record<string, string>[] | null;
  parent_asin: string | null;
  asin: string;
  buybox_seller: string | null;
  number_of_sellers: number | null;
  root_bs_rank: number | null;
  answered_questions: number | null;
  domain: string | null;
  images_count: number | null;
  url: string;
  video_count: number | null;
  image_url: string | null;
  item_weight: string | null;
  rating: number | null;
  product_dimensions: string | null;
  seller_id: string | null;
  date_first_available: Date | null;
  discount: number | null;
  model_number: string | null;
  manufacturer: string | null;
  department: string | null;
  plus_content: boolean | null;
  upc: string | null;
  video: string[] | null;
  top_review: Record<string, any> | null;
  variations: Record<string, any>[] | null;
  delivery: Record<string, any> | null;
  features: string[] | null;
  format: string | null;
  buybox_prices: number[] | null;
  ingredients: string[] | null;
  origin_url: string | null;
  bought_past_month: number | null;
  is_available: boolean;
  root_bs_category: string | null;
  bs_category: string | null;
  bs_rank: number | null;
  badge: string[] | null;
  images: string[] | null;
  country_of_origin: string | null;
  product_details: Array<{ title: string; value: string }> | null;
  prices_breakdown: Record<string, any> | null;
  unit_price: string | null;
  other_sellers_prices: number[] | null;
  measurement: string | null;
  product_rating_object: Record<string, number> | null;
  sustainability_features: string[] | null;
  climate_pledge_friendly: boolean | null;
  coupon: Record<string, any> | null;
  sponsered: boolean | null;
  fba_sellers_count: number | null;
  fbm_sellers_count: number | null;
  is_amazon_seller: boolean | null;
  lastScraped: Date;
}

// Atrybuty używane podczas tworzenia nowego produktu
interface AmazonProductCreationAttributes extends Optional<AmazonProductAttributes, "id"> {}

class AmazonProduct
  extends Model<AmazonProductAttributes, AmazonProductCreationAttributes>
  implements AmazonProductAttributes
{
  public id!: number;
  public title!: string;
  public seller_name!: string | null;
  public brand!: string | null;
  public description!: string | null;
  public description_html!: string | null;
  public initial_price!: number | null;
  public final_price!: number | null;
  public final_price_high!: number | null;
  public currency!: string;
  public availability!: string | null;
  public reviews_count!: number | null;
  public categories!: string[] | null;
  public categories_with_urls!: Record<string, string>[] | null;
  public parent_asin!: string | null;
  public asin!: string;
  public buybox_seller!: string | null;
  public number_of_sellers!: number | null;
  public root_bs_rank!: number | null;
  public answered_questions!: number | null;
  public domain!: string | null;
  public images_count!: number | null;
  public url!: string;
  public video_count!: number | null;
  public image_url!: string | null;
  public item_weight!: string | null;
  public rating!: number | null;
  public product_dimensions!: string | null;
  public seller_id!: string | null;
  public date_first_available!: Date | null;
  public discount!: number | null;
  public model_number!: string | null;
  public manufacturer!: string | null;
  public department!: string | null;
  public plus_content!: boolean | null;
  public upc!: string | null;
  public video!: string[] | null;
  public top_review!: Record<string, any> | null;
  public variations!: Record<string, any>[] | null;
  public delivery!: Record<string, any> | null;
  public features!: string[] | null;
  public format!: string | null;
  public buybox_prices!: number[] | null;
  public ingredients!: string[] | null;
  public origin_url!: string | null;
  public bought_past_month!: number | null;
  public is_available!: boolean;
  public root_bs_category!: string | null;
  public bs_category!: string | null;
  public bs_rank!: number | null;
  public badge!: string[] | null;
  public images!: string[] | null;
  public country_of_origin!: string | null;
  public product_details!: Array<{ title: string; value: string }> | null;
  public prices_breakdown!: Record<string, any> | null;
  public unit_price!: string | null;
  public other_sellers_prices!: number[] | null;
  public measurement!: string | null;
  public product_rating_object!: Record<string, number> | null;
  public sustainability_features!: string[] | null;
  public climate_pledge_friendly!: boolean | null;
  public coupon!: Record<string, any> | null;
  public sponsered!: boolean | null;
  public fba_sellers_count!: number | null;
  public fbm_sellers_count!: number | null;
  public is_amazon_seller!: boolean | null;
  public lastScraped!: Date;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Metody pomocnicze
  static async findByAsin(asin: string): Promise<AmazonProduct | null> {
    return AmazonProduct.findOne({ where: { asin } });
  }

  static async findByUrl(url: string): Promise<AmazonProduct | null> {
    return AmazonProduct.findOne({ where: { url } });
  }

  static async findRecentlyScraped(hours: number = 24): Promise<AmazonProduct[]> {
    const date = new Date();
    date.setHours(date.getHours() - hours);

    return AmazonProduct.findAll({
      where: {
        lastScraped: {
          [Op.gte]: date,
        },
      },
    });
  }

  // Sprawdza czy produkt wymaga ponownego scrapowania
  needsRescraping(maxAge: number = 24): boolean {
    if (!this.lastScraped) return true;

    const hours = (new Date().getTime() - this.lastScraped.getTime()) / (1000 * 60 * 60);
    return hours >= maxAge;
  }
}

AmazonProduct.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    seller_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    description_html: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    initial_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    final_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    final_price_high: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: "USD",
    },
    availability: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reviews_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    categories: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    categories_with_urls: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    parent_asin: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    asin: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    buybox_seller: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    number_of_sellers: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    root_bs_rank: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    answered_questions: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    domain: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    images_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    video_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    image_url: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    item_weight: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: true,
    },
    product_dimensions: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    seller_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date_first_available: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    discount: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    model_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    manufacturer: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    plus_content: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    upc: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    video: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    top_review: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    variations: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    delivery: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    features: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    format: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    buybox_prices: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    ingredients: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    origin_url: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    bought_past_month: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    is_available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    root_bs_category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bs_category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bs_rank: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    badge: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    country_of_origin: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    product_details: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    prices_breakdown: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    unit_price: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    other_sellers_prices: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    measurement: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    product_rating_object: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    sustainability_features: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    climate_pledge_friendly: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    coupon: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    sponsered: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    fba_sellers_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fbm_sellers_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    is_amazon_seller: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    lastScraped: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "amazon_products",
    indexes: [
      {
        unique: true,
        fields: ["asin"],
      },
      {
        fields: ["lastScraped"],
      },
      {
        fields: ["brand"],
      },
      {
        fields: ["seller_id"],
      },
      {
        fields: ["root_bs_category"],
      },
    ],
  }
);
