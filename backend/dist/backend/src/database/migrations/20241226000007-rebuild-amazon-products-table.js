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
module.exports = {
    up: (queryInterface, Sequelize) => __awaiter(void 0, void 0, void 0, function* () {
        // Najpierw usuń starą tabelę jeśli istnieje
        yield queryInterface.dropTable("katalog_produktow_amazon_products", { cascade: true });
        // Utwórz nową tabelę z zaktualizowaną strukturą
        yield queryInterface.createTable("katalog_produktow_amazon_products", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            title: {
                type: Sequelize.STRING(1000),
                allowNull: false,
                collate: "utf8mb4_unicode_ci",
            },
            asin: {
                type: Sequelize.STRING(255),
                allowNull: false,
                collate: "utf8mb4_unicode_ci",
            },
            upc: {
                type: Sequelize.STRING(255),
                allowNull: true,
                collate: "utf8mb4_unicode_ci",
            },
            initial_price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true,
            },
            final_price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true,
            },
            currency: {
                type: Sequelize.STRING(3),
                defaultValue: "EUR",
                collate: "utf8mb4_unicode_ci",
            },
            brand: {
                type: Sequelize.STRING(255),
                allowNull: true,
                collate: "utf8mb4_unicode_ci",
            },
            categories: {
                type: Sequelize.JSON,
                allowNull: true,
            },
            domain: {
                type: Sequelize.STRING(255),
                allowNull: true,
                collate: "utf8mb4_unicode_ci",
            },
            url: {
                type: Sequelize.STRING(1000),
                allowNull: false,
                collate: "utf8mb4_unicode_ci",
            },
            image_url: {
                type: Sequelize.STRING(1000),
                allowNull: true,
                collate: "utf8mb4_unicode_ci",
            },
            model_number: {
                type: Sequelize.STRING(255),
                allowNull: true,
                collate: "utf8mb4_unicode_ci",
            },
            from_the_brand: {
                type: Sequelize.TEXT,
                allowNull: true,
                collate: "utf8mb4_unicode_ci",
            },
            features: {
                type: Sequelize.JSON,
                allowNull: true,
            },
            images: {
                type: Sequelize.JSON,
                allowNull: true,
            },
            product_details: {
                type: Sequelize.JSON,
                allowNull: true,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
            },
        }, {
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci",
            engine: "InnoDB",
        });
        // Dodaj indeksy dla lepszej wydajności
        yield queryInterface.addIndex("katalog_produktow_amazon_products", ["asin"], {
            name: "idx_asin",
            unique: false,
        });
        yield queryInterface.addIndex("katalog_produktow_amazon_products", ["brand"], {
            name: "idx_brand",
            unique: false,
        });
        yield queryInterface.addIndex("katalog_produktow_amazon_products", ["domain"], {
            name: "idx_domain",
            unique: false,
        });
    }),
    down: (queryInterface, Sequelize) => __awaiter(void 0, void 0, void 0, function* () {
        yield queryInterface.dropTable("katalog_produktow_amazon_products");
    }),
};
