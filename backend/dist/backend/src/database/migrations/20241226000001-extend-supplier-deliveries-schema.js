'use strict';
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
        // 1. Tabela metadanych plików + przechowywanie oryginalnego pliku
        yield queryInterface.createTable('supplier_deliveries_raw', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            supplier_id: {
                type: Sequelize.STRING(20),
                allowNull: false,
                comment: 'ID dostawcy z login_table_suppliers'
            },
            file_name: {
                type: Sequelize.STRING(255),
                allowNull: false,
                comment: 'Nazwa pliku źródłowego (np. dostawa.xlsx)'
            },
            file_hash: {
                type: Sequelize.STRING(64),
                allowNull: false,
                comment: 'Hash pliku dla wykrywania duplikatów'
            },
            file_content: {
                type: Sequelize.TEXT('long'),
                allowNull: false,
                comment: 'Oryginalny plik w formie CSV (po konwersji z XLSX)'
            },
            upload_timestamp: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
                comment: 'Kiedy plik został wgrany'
            },
            processing_status: {
                type: Sequelize.ENUM('pending', 'processing', 'completed', 'error'),
                defaultValue: 'pending',
                comment: 'Status przetwarzania'
            },
            error_message: {
                type: Sequelize.TEXT,
                allowNull: true,
                comment: 'Komunikat błędu jeśli wystąpił'
            },
            total_rows: {
                type: Sequelize.INTEGER,
                allowNull: true,
                comment: 'Liczba wierszy w pliku'
            },
            processed_rows: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                comment: 'Liczba przetworzonych wierszy'
            },
            aggregated_products: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                comment: 'Liczba produktów po agregacji (w supplier_deliveries)'
            },
            created_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },
            updated_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            }
        });
        // 2. Tabela finansowa dla dostaw
        yield queryInterface.createTable('supplier_delivery_finance', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            delivery_file_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'supplier_deliveries_raw',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },
            supplier_id: {
                type: Sequelize.STRING(20),
                allowNull: false,
                comment: 'ID dostawcy'
            },
            total_items: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: 'Łączna liczba produktów (suma quantity)'
            },
            total_unique_products: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: 'Liczba unikalnych produktów (liczba rekordów)'
            },
            value_netto: {
                type: Sequelize.DECIMAL(15, 2),
                allowNull: false,
                comment: 'Wartość netto (suma quantity * unit_retail)'
            },
            vat_rate: {
                type: Sequelize.DECIMAL(5, 4),
                allowNull: false,
                defaultValue: 0.23,
                comment: 'Stawka VAT (np. 0.23 dla 23%)'
            },
            margin_percentage: {
                type: Sequelize.DECIMAL(5, 4),
                allowNull: false,
                defaultValue: 0.18,
                comment: 'Marża (np. 0.18 dla 18%)'
            },
            value_brutto: {
                type: Sequelize.DECIMAL(15, 2),
                allowNull: false,
                comment: 'Wartość brutto = value_netto * (1 + vat_rate)'
            },
            our_cost_netto: {
                type: Sequelize.DECIMAL(15, 2),
                allowNull: false,
                comment: 'Nasz koszt netto = value_netto * margin_percentage'
            },
            our_cost_brutto: {
                type: Sequelize.DECIMAL(15, 2),
                allowNull: false,
                comment: 'Nasz koszt brutto = our_cost_netto * (1 + vat_rate)'
            },
            currency: {
                type: Sequelize.STRING(3),
                defaultValue: 'EUR',
                comment: 'Waluta'
            },
            exchange_rate: {
                type: Sequelize.DECIMAL(8, 4),
                allowNull: true,
                comment: 'Kurs wymiany jeśli potrzebny'
            },
            payment_terms: {
                type: Sequelize.STRING(255),
                allowNull: true,
                comment: 'Warunki płatności'
            },
            created_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },
            updated_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            }
        });
        // 3. Dodaj kolumnę delivery_file_id do istniejącej tabeli supplier_deliveries
        yield queryInterface.addColumn('supplier_deliveries', 'delivery_file_id', {
            type: Sequelize.INTEGER,
            allowNull: true, // Null dla istniejących rekordów
            references: {
                model: 'supplier_deliveries_raw',
                key: 'id'
            },
            onDelete: 'SET NULL',
            comment: 'Powiązanie z plikiem źródłowym'
        });
        // 4. Dodaj kolumnę validation_status do supplier_deliveries
        yield queryInterface.addColumn('supplier_deliveries', 'validation_status', {
            type: Sequelize.ENUM('pending', 'validated', 'missing_data', 'duplicate'),
            defaultValue: 'pending',
            comment: 'Status walidacji produktu'
        });
        // 5. Dodaj kolumnę missing_fields do supplier_deliveries
        yield queryInterface.addColumn('supplier_deliveries', 'missing_fields', {
            type: Sequelize.STRING(500),
            allowNull: true,
            comment: 'Lista brakujących pól (oddzielone przecinkami)'
        });
        // Dodanie indeksów dla wydajności
        yield queryInterface.addIndex('supplier_deliveries_raw', ['supplier_id']);
        yield queryInterface.addIndex('supplier_deliveries_raw', ['file_hash']);
        yield queryInterface.addIndex('supplier_deliveries_raw', ['processing_status']);
        yield queryInterface.addIndex('supplier_deliveries_raw', ['upload_timestamp']);
        yield queryInterface.addIndex('supplier_delivery_finance', ['delivery_file_id']);
        yield queryInterface.addIndex('supplier_delivery_finance', ['supplier_id']);
        yield queryInterface.addIndex('supplier_deliveries', ['delivery_file_id']);
        yield queryInterface.addIndex('supplier_deliveries', ['validation_status']);
    }),
    down: (queryInterface, Sequelize) => __awaiter(void 0, void 0, void 0, function* () {
        // Usuń dodane kolumny z supplier_deliveries
        yield queryInterface.removeColumn('supplier_deliveries', 'missing_fields');
        yield queryInterface.removeColumn('supplier_deliveries', 'validation_status');
        yield queryInterface.removeColumn('supplier_deliveries', 'delivery_file_id');
        // Usuń tabele
        yield queryInterface.dropTable('supplier_delivery_finance');
        yield queryInterface.dropTable('supplier_deliveries_raw');
    })
};
