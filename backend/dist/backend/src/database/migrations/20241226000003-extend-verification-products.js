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
        // Dodaj brakujące pola z starej tabeli weryfikacja_produktow
        // 1. Rozmiar produktu
        yield queryInterface.addColumn("verification_products", "product_size", {
            type: Sequelize.ENUM("S", "M", "L", "XL", "LONG", "ONE_SIZE", "VARIOUS"),
            allowNull: true,
            comment: "Rozmiar produktu",
        });
        // 2. Lokalizacja magazynowa
        yield queryInterface.addColumn("verification_products", "location", {
            type: Sequelize.STRING(20),
            allowNull: true,
            comment: "Identyfikator lokalizacji magazynowej (np. R001-P001)",
        });
        // 3. Indywidualny numer LPN (różny od lpn_group)
        yield queryInterface.addColumn("verification_products", "lpn_number", {
            type: Sequelize.STRING(20),
            allowNull: true,
            comment: "Unikalny numer LPN dla tego konkretnego produktu",
        });
        // 4. Zdjęcia produktów w S3
        yield queryInterface.addColumn("verification_products", "images", {
            type: Sequelize.JSON,
            allowNull: true,
            comment: "JSON z referencjami do zdjęć produktu w S3",
        });
        // 5. URL źródłowy
        yield queryInterface.addColumn("verification_products", "source_url", {
            type: Sequelize.STRING(512),
            allowNull: true,
            comment: "URL źródłowy, z którego pobrano dane o produkcie",
        });
        // 6. Cena zweryfikowana (może różnić się od unified_price)
        yield queryInterface.addColumn("verification_products", "price_verified", {
            type: Sequelize.DECIMAL(12, 2),
            allowNull: true,
            comment: "Cena rynkowa produktu po weryfikacji przez pracownika",
        });
        // 7. Oryginalna cena od dostawcy
        yield queryInterface.addColumn("verification_products", "original_price", {
            type: Sequelize.DECIMAL(12, 2),
            allowNull: true,
            comment: "Oryginalna cena produktu podana przez dostawcę",
        });
        // 8. Status weryfikacji dla tego konkretnego produktu
        yield queryInterface.addColumn("verification_products", "verification_status", {
            type: Sequelize.ENUM("pending", "in_progress", "completed", "rejected", "requires_review"),
            defaultValue: "pending",
            comment: "Status weryfikacji tego konkretnego produktu",
        });
        // 9. Data weryfikacji
        yield queryInterface.addColumn("verification_products", "verification_date", {
            type: Sequelize.DATE,
            allowNull: true,
            comment: "Data kiedy produkt został zweryfikowany",
        });
        // 10. Rozszerz enum classification o 'E' (z starej tabeli)
        yield queryInterface.changeColumn("verification_products", "classification", {
            type: Sequelize.ENUM("A", "B", "C", "E", "MISSING", "SURPLUS"),
            allowNull: false,
            comment: "A=nowy, B=używany, C=uszkodzony, E=do sprawdzenia, MISSING=brak, SURPLUS=nadwyżka",
        });
        // 11. Rozszerz enum destination o nowe opcje
        yield queryInterface.changeColumn("verification_products", "destination", {
            type: Sequelize.ENUM("retail", "box_mix", "mystery_box", "damaged", "return_to_supplier", "disposal", "warehouse_keep", "requires_decision"),
            allowNull: false,
            comment: "Przeznaczenie produktu po weryfikacji",
        });
        // 12. Dodaj pole dla wagi produktu
        yield queryInterface.addColumn("verification_products", "product_weight", {
            type: Sequelize.DECIMAL(8, 3),
            allowNull: true,
            comment: "Waga produktu w kg",
        });
        // 13. Dodaj pole dla wymiarów produktu
        yield queryInterface.addColumn("verification_products", "product_dimensions", {
            type: Sequelize.STRING(100),
            allowNull: true,
            comment: "Wymiary produktu (np. 20x15x10 cm)",
        });
        // 14. Dodaj pole dla stanu opakowania
        yield queryInterface.addColumn("verification_products", "packaging_condition", {
            type: Sequelize.ENUM("perfect", "good", "damaged", "missing", "opened"),
            allowNull: true,
            comment: "Stan opakowania produktu",
        });
        // 15. Dodaj pole dla kompletności produktu
        yield queryInterface.addColumn("verification_products", "completeness", {
            type: Sequelize.ENUM("complete", "incomplete", "missing_accessories", "missing_manual", "unknown"),
            allowNull: true,
            comment: "Kompletność produktu (akcesoria, instrukcje, etc.)",
        });
        // Dodanie indeksów dla nowych pól
        yield queryInterface.addIndex("verification_products", ["location"]);
        yield queryInterface.addIndex("verification_products", ["lpn_number"]);
        yield queryInterface.addIndex("verification_products", ["product_size"]);
        yield queryInterface.addIndex("verification_products", ["verification_status"]);
        yield queryInterface.addIndex("verification_products", ["verification_date"]);
        yield queryInterface.addIndex("verification_products", ["packaging_condition"]);
        yield queryInterface.addIndex("verification_products", ["completeness"]);
    }),
    down: (queryInterface, Sequelize) => __awaiter(void 0, void 0, void 0, function* () {
        // Usuń dodane kolumny w odwrotnej kolejności
        yield queryInterface.removeColumn("verification_products", "completeness");
        yield queryInterface.removeColumn("verification_products", "packaging_condition");
        yield queryInterface.removeColumn("verification_products", "product_dimensions");
        yield queryInterface.removeColumn("verification_products", "product_weight");
        yield queryInterface.removeColumn("verification_products", "verification_date");
        yield queryInterface.removeColumn("verification_products", "verification_status");
        yield queryInterface.removeColumn("verification_products", "original_price");
        yield queryInterface.removeColumn("verification_products", "price_verified");
        yield queryInterface.removeColumn("verification_products", "source_url");
        yield queryInterface.removeColumn("verification_products", "images");
        yield queryInterface.removeColumn("verification_products", "lpn_number");
        yield queryInterface.removeColumn("verification_products", "location");
        yield queryInterface.removeColumn("verification_products", "product_size");
        // Przywróć oryginalne enum values
        yield queryInterface.changeColumn("verification_products", "classification", {
            type: Sequelize.ENUM("A", "B", "C", "MISSING", "SURPLUS"),
            allowNull: false,
        });
        yield queryInterface.changeColumn("verification_products", "destination", {
            type: Sequelize.ENUM("retail", "box_mix", "damaged", "return_to_supplier", "disposal"),
            allowNull: false,
        });
    }),
};
