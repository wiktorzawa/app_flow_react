'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('amazon_products', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      title: {
        type: Sequelize.STRING(1000),
        allowNull: false
      },
      seller_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      brand: {
        type: Sequelize.STRING,
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      description_html: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      initial_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      final_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      final_price_high: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      currency: {
        type: Sequelize.STRING(3),
        defaultValue: "USD"
      },
      availability: {
        type: Sequelize.STRING,
        allowNull: true
      },
      reviews_count: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      categories: {
        type: Sequelize.JSON,
        allowNull: true
      },
      categories_with_urls: {
        type: Sequelize.JSON,
        allowNull: true
      },
      parent_asin: {
        type: Sequelize.STRING,
        allowNull: true
      },
      asin: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      buybox_seller: {
        type: Sequelize.STRING,
        allowNull: true
      },
      number_of_sellers: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      root_bs_rank: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      answered_questions: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      domain: {
        type: Sequelize.STRING,
        allowNull: true
      },
      images_count: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      url: {
        type: Sequelize.STRING(1000),
        allowNull: false
      },
      video_count: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      image_url: {
        type: Sequelize.STRING(1000),
        allowNull: true
      },
      item_weight: {
        type: Sequelize.STRING,
        allowNull: true
      },
      rating: {
        type: Sequelize.DECIMAL(2, 1),
        allowNull: true
      },
      product_dimensions: {
        type: Sequelize.STRING,
        allowNull: true
      },
      seller_id: {
        type: Sequelize.STRING,
        allowNull: true
      },
      date_first_available: {
        type: Sequelize.DATE,
        allowNull: true
      },
      discount: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      model_number: {
        type: Sequelize.STRING,
        allowNull: true
      },
      manufacturer: {
        type: Sequelize.STRING,
        allowNull: true
      },
      department: {
        type: Sequelize.STRING,
        allowNull: true
      },
      plus_content: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      upc: {
        type: Sequelize.STRING,
        allowNull: true
      },
      video: {
        type: Sequelize.JSON,
        allowNull: true
      },
      top_review: {
        type: Sequelize.JSON,
        allowNull: true
      },
      variations: {
        type: Sequelize.JSON,
        allowNull: true
      },
      delivery: {
        type: Sequelize.JSON,
        allowNull: true
      },
      features: {
        type: Sequelize.JSON,
        allowNull: true
      },
      format: {
        type: Sequelize.STRING,
        allowNull: true
      },
      buybox_prices: {
        type: Sequelize.JSON,
        allowNull: true
      },
      ingredients: {
        type: Sequelize.JSON,
        allowNull: true
      },
      origin_url: {
        type: Sequelize.STRING(1000),
        allowNull: true
      },
      bought_past_month: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      is_available: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      root_bs_category: {
        type: Sequelize.STRING,
        allowNull: true
      },
      bs_category: {
        type: Sequelize.STRING,
        allowNull: true
      },
      bs_rank: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      badge: {
        type: Sequelize.JSON,
        allowNull: true
      },
      images: {
        type: Sequelize.JSON,
        allowNull: true
      },
      country_of_origin: {
        type: Sequelize.STRING,
        allowNull: true
      },
      product_details: {
        type: Sequelize.JSON,
        allowNull: true
      },
      prices_breakdown: {
        type: Sequelize.JSON,
        allowNull: true
      },
      unit_price: {
        type: Sequelize.STRING,
        allowNull: true
      },
      other_sellers_prices: {
        type: Sequelize.JSON,
        allowNull: true
      },
      measurement: {
        type: Sequelize.STRING,
        allowNull: true
      },
      product_rating_object: {
        type: Sequelize.JSON,
        allowNull: true
      },
      sustainability_features: {
        type: Sequelize.JSON,
        allowNull: true
      },
      climate_pledge_friendly: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      coupon: {
        type: Sequelize.JSON,
        allowNull: true
      },
      sponsered: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      fba_sellers_count: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      fbm_sellers_count: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      is_amazon_seller: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      lastScraped: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Dodaj indeksy
    await queryInterface.addIndex('amazon_products', ['asin'], { unique: true });
    await queryInterface.addIndex('amazon_products', ['lastScraped']);
    await queryInterface.addIndex('amazon_products', ['brand']);
    await queryInterface.addIndex('amazon_products', ['seller_id']);
    await queryInterface.addIndex('amazon_products', ['root_bs_category']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('amazon_products');
  }
}; 