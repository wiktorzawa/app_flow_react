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
        // Sprawdź które tabele istnieją i przemianuj tylko te, które jeszcze nie zostały przemianowane
        const tableExists = (tableName) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield queryInterface.describeTable(tableName);
                return true;
            }
            catch (error) {
                return false;
            }
        });
        // 1. ZMIEŃ NAZWY TABEL NA PREFIKSY FOLDERÓW (tylko jeśli tabele jeszcze nie zostały przemianowane)
        // Folder: supplier_deliveries
        // (supplier_deliveries już ma dobry prefiks)
        // (supplier_deliveries_raw już ma dobry prefiks)
        // (supplier_delivery_finance już ma dobry prefiks)
        // Folder: verification
        // (verification_* już mają dobre prefiksy)
        // Folder: login (sprawdź czy trzeba zmienić nazwy)
        // Te tabele już mają dobre nazwy, więc nie robimy nic
        // Folder: katalog_produktow (sprawdź czy trzeba zmienić nazwy)
        if (yield tableExists("amazon_products")) {
            yield queryInterface.renameTable("amazon_products", "katalog_produktow_amazon_products");
        }
        if (yield tableExists("katalog_produktow")) {
            yield queryInterface.renameTable("katalog_produktow", "katalog_produktow_master");
        }
        if (yield tableExists("products")) {
            yield queryInterface.renameTable("products", "katalog_produktow_products");
        }
        if (yield tableExists("product_images")) {
            yield queryInterface.renameTable("product_images", "katalog_produktow_product_images");
        }
        if (yield tableExists("product_templates")) {
            yield queryInterface.renameTable("product_templates", "katalog_produktow_product_templates");
        }
        if (yield tableExists("product_description_analysis")) {
            yield queryInterface.renameTable("product_description_analysis", "katalog_produktow_description_analysis");
        }
        // Folder: offer_analysis (sprawdź czy trzeba zmienić nazwy)
        if (yield tableExists("offer_analysis")) {
            yield queryInterface.renameTable("offer_analysis", "offer_analysis_main");
        }
        // (offer_analysis_categories już ma dobry prefiks)
        // (offer_analysis_keywords już ma dobry prefiks)
        // (offer_analysis_parameters już ma dobry prefiks)
        // Folder: delivery_legacy (sprawdź czy trzeba zmienić nazwy)
        if (yield tableExists("delivery_produkty_hybrid")) {
            yield queryInterface.renameTable("delivery_produkty_hybrid", "delivery_legacy_produkty_hybrid");
        }
        if (yield tableExists("dostawy_dane_pliku")) {
            yield queryInterface.renameTable("dostawy_dane_pliku", "delivery_legacy_dane_pliku");
        }
        if (yield tableExists("dostawy_general")) {
            yield queryInterface.renameTable("dostawy_general", "delivery_legacy_general");
        }
        // 2. USUŃ STARE TABELE KTÓRE SĄ ZASTĄPIONE PRZEZ NOWE
        // Usuń starą tabelę weryfikacji (zastąpiona przez verification_*)
        if (yield tableExists("weryfikacja_produktow")) {
            yield queryInterface.dropTable("weryfikacja_produktow");
        }
        // 3. Tabele zostały zorganizowane w logiczne foldery przez prefiksy nazw
        // Foldery: supplier_deliveries/, verification/, login/, katalog_produktow/, offer_analysis/, delivery_legacy/
        console.log("✅ Reorganizacja tabel zakończona");
    }),
    down: (queryInterface, Sequelize) => __awaiter(void 0, void 0, void 0, function* () {
        // Przywróć oryginalne nazwy tabel
        const tableExists = (tableName) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield queryInterface.describeTable(tableName);
                return true;
            }
            catch (error) {
                return false;
            }
        });
        // Katalog produktow
        if (yield tableExists("katalog_produktow_amazon_products")) {
            yield queryInterface.renameTable("katalog_produktow_amazon_products", "amazon_products");
        }
        if (yield tableExists("katalog_produktow_master")) {
            yield queryInterface.renameTable("katalog_produktow_master", "katalog_produktow");
        }
        if (yield tableExists("katalog_produktow_products")) {
            yield queryInterface.renameTable("katalog_produktow_products", "products");
        }
        if (yield tableExists("katalog_produktow_product_images")) {
            yield queryInterface.renameTable("katalog_produktow_product_images", "product_images");
        }
        if (yield tableExists("katalog_produktow_product_templates")) {
            yield queryInterface.renameTable("katalog_produktow_product_templates", "product_templates");
        }
        if (yield tableExists("katalog_produktow_description_analysis")) {
            yield queryInterface.renameTable("katalog_produktow_description_analysis", "product_description_analysis");
        }
        // Offer analysis
        if (yield tableExists("offer_analysis_main")) {
            yield queryInterface.renameTable("offer_analysis_main", "offer_analysis");
        }
        // Delivery legacy
        if (yield tableExists("delivery_legacy_produkty_hybrid")) {
            yield queryInterface.renameTable("delivery_legacy_produkty_hybrid", "delivery_produkty_hybrid");
        }
        if (yield tableExists("delivery_legacy_dane_pliku")) {
            yield queryInterface.renameTable("delivery_legacy_dane_pliku", "dostawy_dane_pliku");
        }
        if (yield tableExists("delivery_legacy_general")) {
            yield queryInterface.renameTable("delivery_legacy_general", "dostawy_general");
        }
        // Przywróć tabelę weryfikacji (jeśli to możliwe)
        // Uwaga: dane zostaną utracone
        yield queryInterface.createTable("weryfikacja_produktow", {
            id_weryfikacja: {
                type: Sequelize.STRING(36),
                primaryKey: true,
            },
            // ... inne pola (uproszczona struktura)
            created_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
        });
    }),
};
