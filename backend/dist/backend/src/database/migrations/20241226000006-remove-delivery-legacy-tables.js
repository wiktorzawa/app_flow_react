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
        // Usuń stare tabele dostaw które zostały zastąpione przez nowy system supplier_deliveries_*
        // 1. Usuń delivery_legacy_produkty_hybrid (0 rekordów, zastąpiona przez supplier_deliveries)
        yield queryInterface.dropTable("delivery_legacy_produkty_hybrid");
        // 2. Usuń delivery_legacy_dane_pliku (0 rekordów, zastąpiona przez supplier_deliveries_raw)
        yield queryInterface.dropTable("delivery_legacy_dane_pliku");
        // 3. Usuń delivery_legacy_general (0 rekordów, zastąpiona przez supplier_delivery_finance)
        yield queryInterface.dropTable("delivery_legacy_general");
        console.log("✅ Usunięto stare tabele dostaw: delivery_legacy_produkty_hybrid, delivery_legacy_dane_pliku, delivery_legacy_general");
        console.log("🔄 Nowy system dostaw: supplier_deliveries, supplier_deliveries_raw, supplier_delivery_finance");
    }),
    down: (queryInterface, Sequelize) => __awaiter(void 0, void 0, void 0, function* () {
        // Przywróć tabele legacy (struktura uproszczona - dane zostały utracone)
        // Przywróć delivery_legacy_produkty_hybrid
        yield queryInterface.createTable("delivery_legacy_produkty_hybrid", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            asin: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            item_description: {
                type: Sequelize.STRING(1000),
                allowNull: false,
            },
            quantity: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            unit_retail: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },
            pallet_id: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
            updated_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
        });
        // Przywróć delivery_legacy_dane_pliku
        yield queryInterface.createTable("delivery_legacy_dane_pliku", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            file_name: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            file_path: {
                type: Sequelize.STRING(500),
                allowNull: false,
            },
            upload_date: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            processing_status: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
            updated_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
        });
        // Przywróć delivery_legacy_general
        yield queryInterface.createTable("delivery_legacy_general", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            supplier_id: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            delivery_date: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            total_value: {
                type: Sequelize.DECIMAL(15, 2),
                allowNull: false,
            },
            currency: {
                type: Sequelize.STRING(3),
                defaultValue: "EUR",
            },
            created_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
            updated_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
        });
        console.log("⚠️ Przywrócono tabele legacy delivery (bez danych)");
    }),
};
