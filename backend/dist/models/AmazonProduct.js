'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, '__esModule', { value: true });
const sequelize_1 = require('sequelize');
const database_1 = require('../config/database');
class AmazonProduct extends sequelize_1.Model {
  // Metody pomocnicze
  static findByAsin(asin) {
    return __awaiter(this, void 0, void 0, function* () {
      return AmazonProduct.findOne({ where: { asin } });
    });
  }
  static findByUrl(url) {
    return __awaiter(this, void 0, void 0, function* () {
      return AmazonProduct.findOne({ where: { url } });
    });
  }
  static findRecentlyScraped() {
    return __awaiter(this, arguments, void 0, function* (hours = 24) {
      const date = new Date();
      date.setHours(date.getHours() - hours);
      return AmazonProduct.findAll({
        where: {
          lastScraped: {
            [sequelize_1.Op.gte]: date,
          },
        },
      });
    });
  }
  // Sprawdza czy produkt wymaga ponownego scrapowania
  needsRescraping(maxAge = 24) {
    if (!this.lastScraped) return true;
    const hours = (new Date().getTime() - this.lastScraped.getTime()) / (1000 * 60 * 60);
    return hours >= maxAge;
  }
}
AmazonProduct.init(
  {
    id: {
      type: sequelize_1.DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: sequelize_1.DataTypes.STRING(1000),
      allowNull: false,
    },
    seller_name: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    brand: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: sequelize_1.DataTypes.TEXT,
      allowNull: true,
    },
    description_html: {
      type: sequelize_1.DataTypes.TEXT,
      allowNull: true,
    },
    initial_price: {
      type: sequelize_1.DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    final_price: {
      type: sequelize_1.DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    final_price_high: {
      type: sequelize_1.DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    currency: {
      type: sequelize_1.DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
    },
    availability: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    reviews_count: {
      type: sequelize_1.DataTypes.INTEGER,
      allowNull: true,
    },
    categories: {
      type: sequelize_1.DataTypes.JSON,
      allowNull: true,
    },
    categories_with_urls: {
      type: sequelize_1.DataTypes.JSON,
      allowNull: true,
    },
    parent_asin: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    asin: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    buybox_seller: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    number_of_sellers: {
      type: sequelize_1.DataTypes.INTEGER,
      allowNull: true,
    },
    root_bs_rank: {
      type: sequelize_1.DataTypes.INTEGER,
      allowNull: true,
    },
    answered_questions: {
      type: sequelize_1.DataTypes.INTEGER,
      allowNull: true,
    },
    domain: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    images_count: {
      type: sequelize_1.DataTypes.INTEGER,
      allowNull: true,
    },
    url: {
      type: sequelize_1.DataTypes.STRING(1000),
      allowNull: false,
    },
    video_count: {
      type: sequelize_1.DataTypes.INTEGER,
      allowNull: true,
    },
    image_url: {
      type: sequelize_1.DataTypes.STRING(1000),
      allowNull: true,
    },
    item_weight: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    rating: {
      type: sequelize_1.DataTypes.DECIMAL(2, 1),
      allowNull: true,
    },
    product_dimensions: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    seller_id: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    date_first_available: {
      type: sequelize_1.DataTypes.DATE,
      allowNull: true,
    },
    discount: {
      type: sequelize_1.DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    model_number: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    manufacturer: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    department: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    plus_content: {
      type: sequelize_1.DataTypes.BOOLEAN,
      allowNull: true,
    },
    upc: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    video: {
      type: sequelize_1.DataTypes.JSON,
      allowNull: true,
    },
    top_review: {
      type: sequelize_1.DataTypes.JSON,
      allowNull: true,
    },
    variations: {
      type: sequelize_1.DataTypes.JSON,
      allowNull: true,
    },
    delivery: {
      type: sequelize_1.DataTypes.JSON,
      allowNull: true,
    },
    features: {
      type: sequelize_1.DataTypes.JSON,
      allowNull: true,
    },
    format: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    buybox_prices: {
      type: sequelize_1.DataTypes.JSON,
      allowNull: true,
    },
    ingredients: {
      type: sequelize_1.DataTypes.JSON,
      allowNull: true,
    },
    origin_url: {
      type: sequelize_1.DataTypes.STRING(1000),
      allowNull: true,
    },
    bought_past_month: {
      type: sequelize_1.DataTypes.INTEGER,
      allowNull: true,
    },
    is_available: {
      type: sequelize_1.DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    root_bs_category: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    bs_category: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    bs_rank: {
      type: sequelize_1.DataTypes.INTEGER,
      allowNull: true,
    },
    badge: {
      type: sequelize_1.DataTypes.JSON,
      allowNull: true,
    },
    images: {
      type: sequelize_1.DataTypes.JSON,
      allowNull: true,
    },
    country_of_origin: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    product_details: {
      type: sequelize_1.DataTypes.JSON,
      allowNull: true,
    },
    prices_breakdown: {
      type: sequelize_1.DataTypes.JSON,
      allowNull: true,
    },
    unit_price: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    other_sellers_prices: {
      type: sequelize_1.DataTypes.JSON,
      allowNull: true,
    },
    measurement: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    product_rating_object: {
      type: sequelize_1.DataTypes.JSON,
      allowNull: true,
    },
    sustainability_features: {
      type: sequelize_1.DataTypes.JSON,
      allowNull: true,
    },
    climate_pledge_friendly: {
      type: sequelize_1.DataTypes.BOOLEAN,
      allowNull: true,
    },
    coupon: {
      type: sequelize_1.DataTypes.JSON,
      allowNull: true,
    },
    sponsered: {
      type: sequelize_1.DataTypes.BOOLEAN,
      allowNull: true,
    },
    fba_sellers_count: {
      type: sequelize_1.DataTypes.INTEGER,
      allowNull: true,
    },
    fbm_sellers_count: {
      type: sequelize_1.DataTypes.INTEGER,
      allowNull: true,
    },
    is_amazon_seller: {
      type: sequelize_1.DataTypes.BOOLEAN,
      allowNull: true,
    },
    lastScraped: {
      type: sequelize_1.DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize_1.DataTypes.NOW,
    },
  },
  {
    sequelize: database_1.sequelize,
    tableName: 'amazon_products',
    indexes: [
      {
        unique: true,
        fields: ['asin'],
      },
      {
        fields: ['lastScraped'],
      },
      {
        fields: ['brand'],
      },
      {
        fields: ['seller_id'],
      },
      {
        fields: ['root_bs_category'],
      },
    ],
  }
);
