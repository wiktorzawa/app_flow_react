'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    // Sprawdź które tabele istnieją i przemianuj tylko te, które jeszcze nie zostały przemianowane
    
    const tableExists = async (tableName) => {
      try {
        await queryInterface.describeTable(tableName);
        return true;
      } catch (error) {
        return false;
      }
    };
    
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
    if (await tableExists('amazon_products')) {
      await queryInterface.renameTable('amazon_products', 'katalog_produktow_amazon_products');
    }
    if (await tableExists('katalog_produktow')) {
      await queryInterface.renameTable('katalog_produktow', 'katalog_produktow_master');
    }
    if (await tableExists('products')) {
      await queryInterface.renameTable('products', 'katalog_produktow_products');
    }
    if (await tableExists('product_images')) {
      await queryInterface.renameTable('product_images', 'katalog_produktow_product_images');
    }
    if (await tableExists('product_templates')) {
      await queryInterface.renameTable('product_templates', 'katalog_produktow_product_templates');
    }
    if (await tableExists('product_description_analysis')) {
      await queryInterface.renameTable('product_description_analysis', 'katalog_produktow_description_analysis');
    }
    
    // Folder: offer_analysis (sprawdź czy trzeba zmienić nazwy)
    if (await tableExists('offer_analysis')) {
      await queryInterface.renameTable('offer_analysis', 'offer_analysis_main');
    }
    // (offer_analysis_categories już ma dobry prefiks)
    // (offer_analysis_keywords już ma dobry prefiks)
    // (offer_analysis_parameters już ma dobry prefiks)
    
    // Folder: delivery_legacy (sprawdź czy trzeba zmienić nazwy)
    if (await tableExists('delivery_produkty_hybrid')) {
      await queryInterface.renameTable('delivery_produkty_hybrid', 'delivery_legacy_produkty_hybrid');
    }
    if (await tableExists('dostawy_dane_pliku')) {
      await queryInterface.renameTable('dostawy_dane_pliku', 'delivery_legacy_dane_pliku');
    }
    if (await tableExists('dostawy_general')) {
      await queryInterface.renameTable('dostawy_general', 'delivery_legacy_general');
    }
    
    // 2. USUŃ STARE TABELE KTÓRE SĄ ZASTĄPIONE PRZEZ NOWE
    
    // Usuń starą tabelę weryfikacji (zastąpiona przez verification_*)
    if (await tableExists('weryfikacja_produktow')) {
      await queryInterface.dropTable('weryfikacja_produktow');
    }
    
    // 3. Tabele zostały zorganizowane w logiczne foldery przez prefiksy nazw
    // Foldery: supplier_deliveries/, verification/, login/, katalog_produktow/, offer_analysis/, delivery_legacy/
    
    console.log('✅ Reorganizacja tabel zakończona');
  },

  down: async (queryInterface, Sequelize) => {
    
    // Przywróć oryginalne nazwy tabel
    
    const tableExists = async (tableName) => {
      try {
        await queryInterface.describeTable(tableName);
        return true;
      } catch (error) {
        return false;
      }
    };
    
    // Katalog produktow
    if (await tableExists('katalog_produktow_amazon_products')) {
      await queryInterface.renameTable('katalog_produktow_amazon_products', 'amazon_products');
    }
    if (await tableExists('katalog_produktow_master')) {
      await queryInterface.renameTable('katalog_produktow_master', 'katalog_produktow');
    }
    if (await tableExists('katalog_produktow_products')) {
      await queryInterface.renameTable('katalog_produktow_products', 'products');
    }
    if (await tableExists('katalog_produktow_product_images')) {
      await queryInterface.renameTable('katalog_produktow_product_images', 'product_images');
    }
    if (await tableExists('katalog_produktow_product_templates')) {
      await queryInterface.renameTable('katalog_produktow_product_templates', 'product_templates');
    }
    if (await tableExists('katalog_produktow_description_analysis')) {
      await queryInterface.renameTable('katalog_produktow_description_analysis', 'product_description_analysis');
    }
    
    // Offer analysis
    if (await tableExists('offer_analysis_main')) {
      await queryInterface.renameTable('offer_analysis_main', 'offer_analysis');
    }
    
    // Delivery legacy
    if (await tableExists('delivery_legacy_produkty_hybrid')) {
      await queryInterface.renameTable('delivery_legacy_produkty_hybrid', 'delivery_produkty_hybrid');
    }
    if (await tableExists('delivery_legacy_dane_pliku')) {
      await queryInterface.renameTable('delivery_legacy_dane_pliku', 'dostawy_dane_pliku');
    }
    if (await tableExists('delivery_legacy_general')) {
      await queryInterface.renameTable('delivery_legacy_general', 'dostawy_general');
    }
    
    // Przywróć tabelę weryfikacji (jeśli to możliwe)
    // Uwaga: dane zostaną utracone
    await queryInterface.createTable('weryfikacja_produktow', {
      id_weryfikacja: {
        type: Sequelize.STRING(36),
        primaryKey: true
      },
      // ... inne pola (uproszczona struktura)
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  }
}; 