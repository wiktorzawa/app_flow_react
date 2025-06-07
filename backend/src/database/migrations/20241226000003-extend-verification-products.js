"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Dodaj brakujące pola z starej tabeli weryfikacja_produktow

    // 1. Rozmiar produktu
    await queryInterface.addColumn("verification_products", "product_size", {
      type: Sequelize.ENUM("S", "M", "L", "XL", "LONG", "ONE_SIZE", "VARIOUS"),
      allowNull: true,
      comment: "Rozmiar produktu",
    });

    // 2. Lokalizacja magazynowa
    await queryInterface.addColumn("verification_products", "location", {
      type: Sequelize.STRING(20),
      allowNull: true,
      comment: "Identyfikator lokalizacji magazynowej (np. R001-P001)",
    });

    // 3. Indywidualny numer LPN (różny od lpn_group)
    await queryInterface.addColumn("verification_products", "lpn_number", {
      type: Sequelize.STRING(20),
      allowNull: true,
      comment: "Unikalny numer LPN dla tego konkretnego produktu",
    });

    // 4. Zdjęcia produktów w S3
    await queryInterface.addColumn("verification_products", "images", {
      type: Sequelize.JSON,
      allowNull: true,
      comment: "JSON z referencjami do zdjęć produktu w S3",
    });

    // 5. URL źródłowy
    await queryInterface.addColumn("verification_products", "source_url", {
      type: Sequelize.STRING(512),
      allowNull: true,
      comment: "URL źródłowy, z którego pobrano dane o produkcie",
    });

    // 6. Cena zweryfikowana (może różnić się od unified_price)
    await queryInterface.addColumn("verification_products", "price_verified", {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true,
      comment: "Cena rynkowa produktu po weryfikacji przez pracownika",
    });

    // 7. Oryginalna cena od dostawcy
    await queryInterface.addColumn("verification_products", "original_price", {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true,
      comment: "Oryginalna cena produktu podana przez dostawcę",
    });

    // 8. Status weryfikacji dla tego konkretnego produktu
    await queryInterface.addColumn("verification_products", "verification_status", {
      type: Sequelize.ENUM("pending", "in_progress", "completed", "rejected", "requires_review"),
      defaultValue: "pending",
      comment: "Status weryfikacji tego konkretnego produktu",
    });

    // 9. Data weryfikacji
    await queryInterface.addColumn("verification_products", "verification_date", {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "Data kiedy produkt został zweryfikowany",
    });

    // 10. Rozszerz enum classification o 'E' (z starej tabeli)
    await queryInterface.changeColumn("verification_products", "classification", {
      type: Sequelize.ENUM("A", "B", "C", "E", "MISSING", "SURPLUS"),
      allowNull: false,
      comment: "A=nowy, B=używany, C=uszkodzony, E=do sprawdzenia, MISSING=brak, SURPLUS=nadwyżka",
    });

    // 11. Rozszerz enum destination o nowe opcje
    await queryInterface.changeColumn("verification_products", "destination", {
      type: Sequelize.ENUM(
        "retail",
        "box_mix",
        "mystery_box",
        "damaged",
        "return_to_supplier",
        "disposal",
        "warehouse_keep",
        "requires_decision"
      ),
      allowNull: false,
      comment: "Przeznaczenie produktu po weryfikacji",
    });

    // 12. Dodaj pole dla wagi produktu
    await queryInterface.addColumn("verification_products", "product_weight", {
      type: Sequelize.DECIMAL(8, 3),
      allowNull: true,
      comment: "Waga produktu w kg",
    });

    // 13. Dodaj pole dla wymiarów produktu
    await queryInterface.addColumn("verification_products", "product_dimensions", {
      type: Sequelize.STRING(100),
      allowNull: true,
      comment: "Wymiary produktu (np. 20x15x10 cm)",
    });

    // 14. Dodaj pole dla stanu opakowania
    await queryInterface.addColumn("verification_products", "packaging_condition", {
      type: Sequelize.ENUM("perfect", "good", "damaged", "missing", "opened"),
      allowNull: true,
      comment: "Stan opakowania produktu",
    });

    // 15. Dodaj pole dla kompletności produktu
    await queryInterface.addColumn("verification_products", "completeness", {
      type: Sequelize.ENUM("complete", "incomplete", "missing_accessories", "missing_manual", "unknown"),
      allowNull: true,
      comment: "Kompletność produktu (akcesoria, instrukcje, etc.)",
    });

    // Dodanie indeksów dla nowych pól
    await queryInterface.addIndex("verification_products", ["location"]);
    await queryInterface.addIndex("verification_products", ["lpn_number"]);
    await queryInterface.addIndex("verification_products", ["product_size"]);
    await queryInterface.addIndex("verification_products", ["verification_status"]);
    await queryInterface.addIndex("verification_products", ["verification_date"]);
    await queryInterface.addIndex("verification_products", ["packaging_condition"]);
    await queryInterface.addIndex("verification_products", ["completeness"]);
  },

  down: async (queryInterface, Sequelize) => {
    // Usuń dodane kolumny w odwrotnej kolejności
    await queryInterface.removeColumn("verification_products", "completeness");
    await queryInterface.removeColumn("verification_products", "packaging_condition");
    await queryInterface.removeColumn("verification_products", "product_dimensions");
    await queryInterface.removeColumn("verification_products", "product_weight");
    await queryInterface.removeColumn("verification_products", "verification_date");
    await queryInterface.removeColumn("verification_products", "verification_status");
    await queryInterface.removeColumn("verification_products", "original_price");
    await queryInterface.removeColumn("verification_products", "price_verified");
    await queryInterface.removeColumn("verification_products", "source_url");
    await queryInterface.removeColumn("verification_products", "images");
    await queryInterface.removeColumn("verification_products", "lpn_number");
    await queryInterface.removeColumn("verification_products", "location");
    await queryInterface.removeColumn("verification_products", "product_size");

    // Przywróć oryginalne enum values
    await queryInterface.changeColumn("verification_products", "classification", {
      type: Sequelize.ENUM("A", "B", "C", "MISSING", "SURPLUS"),
      allowNull: false,
    });

    await queryInterface.changeColumn("verification_products", "destination", {
      type: Sequelize.ENUM("retail", "box_mix", "damaged", "return_to_supplier", "disposal"),
      allowNull: false,
    });
  },
};
