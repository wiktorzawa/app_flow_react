import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface AmazonProductAttributes {
  id: number;
  title: string;
  asin: string;
  upc?: string | null;
  initial_price?: number | null;
  final_price?: number | null;
  currency?: string;
  brand?: string | null;
  categories?: any | null;
  domain?: string | null;
  url: string;
  image_url?: string | null;
  model_number?: string | null;
  from_the_brand?: string | null;
  features?: any | null;
  images?: any | null;
  product_details?: any | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AmazonProductCreationAttributes
  extends Optional<
    AmazonProductAttributes,
    | "id"
    | "upc"
    | "initial_price"
    | "final_price"
    | "currency"
    | "brand"
    | "categories"
    | "domain"
    | "image_url"
    | "model_number"
    | "from_the_brand"
    | "features"
    | "images"
    | "product_details"
    | "createdAt"
    | "updatedAt"
  > {}

class AmazonProduct
  extends Model<AmazonProductAttributes, AmazonProductCreationAttributes>
  implements AmazonProductAttributes
{
  public id!: number;
  public title!: string;
  public asin!: string;
  public upc?: string | null;
  public initial_price?: number | null;
  public final_price?: number | null;
  public currency?: string;
  public brand?: string | null;
  public categories?: any | null;
  public domain?: string | null;
  public url!: string;
  public image_url?: string | null;
  public model_number?: string | null;
  public from_the_brand?: string | null;
  public features?: any | null;
  public images?: any | null;
  public product_details?: any | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Metody pomocnicze
  static async findByAsin(asin: string): Promise<AmazonProduct | null> {
    return AmazonProduct.findOne({ where: { asin } });
  }

  static async findByUrl(url: string): Promise<AmazonProduct | null> {
    return AmazonProduct.findOne({ where: { url } });
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
    asin: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    upc: {
      type: DataTypes.STRING(255),
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
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: "EUR",
    },
    brand: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    categories: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    domain: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    model_number: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    from_the_brand: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    features: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    product_details: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "katalog_produktow_amazon_products",
    timestamps: true,
    indexes: [
      {
        name: "idx_asin",
        fields: ["asin"],
      },
      {
        name: "idx_brand",
        fields: ["brand"],
      },
      {
        name: "idx_domain",
        fields: ["domain"],
      },
    ],
  }
);

export default AmazonProduct;
