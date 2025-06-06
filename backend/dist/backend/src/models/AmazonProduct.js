"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
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
}
AmazonProduct.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING(1000),
        allowNull: false,
    },
    asin: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    upc: {
        type: sequelize_1.DataTypes.STRING(255),
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
    currency: {
        type: sequelize_1.DataTypes.STRING(3),
        defaultValue: "EUR",
    },
    brand: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    categories: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true,
    },
    domain: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    url: {
        type: sequelize_1.DataTypes.STRING(1000),
        allowNull: false,
    },
    image_url: {
        type: sequelize_1.DataTypes.STRING(1000),
        allowNull: true,
    },
    model_number: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    from_the_brand: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    features: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true,
    },
    images: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true,
    },
    product_details: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true,
    },
}, {
    sequelize: database_1.sequelize,
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
});
exports.default = AmazonProduct;
