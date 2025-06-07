"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Usuń nieużywane tabele które nie mają żadnych danych ani referencji w kodzie

    // 1. Usuń tabelę category_parameters (0 rekordów, brak referencji w kodzie)
    await queryInterface.dropTable("category_parameters");

    // 2. Usuń tabelę parameter_recommendations (0 rekordów, brak referencji w kodzie)
    await queryInterface.dropTable("parameter_recommendations");

    console.log("✅ Usunięto nieużywane tabele: category_parameters, parameter_recommendations");
  },

  down: async (queryInterface, Sequelize) => {
    // Przywróć tabele (struktura uproszczona - dane zostały utracone)

    // Przywróć category_parameters
    await queryInterface.createTable("category_parameters", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      category_id: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      parameter_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      parameter_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      is_required: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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

    // Przywróć parameter_recommendations
    await queryInterface.createTable("parameter_recommendations", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      category_id: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      parameter_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      recommendation_text: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      priority: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
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

    console.log("⚠️ Przywrócono tabele category_parameters i parameter_recommendations (bez danych)");
  },
};
