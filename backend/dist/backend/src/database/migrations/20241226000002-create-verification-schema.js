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
        // 1. Sesje weryfikacji - główna tabela koordynująca proces
        yield queryInterface.createTable('verification_sessions', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            session_code: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true,
                comment: 'Kod sesji weryfikacji np. VER_2024_001'
            },
            delivery_file_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'supplier_deliveries_raw',
                    key: 'id'
                },
                onDelete: 'CASCADE',
                comment: 'Powiązanie z dostawą'
            },
            supplier_id: {
                type: Sequelize.STRING(20),
                allowNull: false,
                comment: 'ID dostawcy'
            },
            verification_status: {
                type: Sequelize.ENUM('pending', 'in_progress', 'completed', 'reported_to_supplier'),
                defaultValue: 'pending',
                comment: 'Status procesu weryfikacji'
            },
            started_by: {
                type: Sequelize.STRING(20),
                allowNull: false,
                comment: 'ID pracownika rozpoczynającego weryfikację'
            },
            started_at: {
                type: Sequelize.DATE,
                allowNull: false,
                comment: 'Kiedy rozpoczęto weryfikację'
            },
            completed_at: {
                type: Sequelize.DATE,
                allowNull: true,
                comment: 'Kiedy zakończono weryfikację'
            },
            total_products_declared: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: 'Łączna ilość produktów zadeklarowana przez dostawcę'
            },
            total_products_verified: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                comment: 'Łączna ilość produktów zweryfikowana'
            },
            notes: {
                type: Sequelize.TEXT,
                allowNull: true,
                comment: 'Notatki z weryfikacji'
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
        // 2. Produkty w weryfikacji - rozdzielenie zagregowanych produktów
        yield queryInterface.createTable('verification_products', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            session_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'verification_sessions',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },
            source_product_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'supplier_deliveries',
                    key: 'id'
                },
                comment: 'Produkt źródłowy z dostawy (zagregowany)'
            },
            asin: {
                type: Sequelize.STRING(255),
                allowNull: false,
                comment: 'ASIN produktu'
            },
            ean: {
                type: Sequelize.STRING(255),
                allowNull: true,
                comment: 'EAN produktu'
            },
            item_description: {
                type: Sequelize.STRING(1000),
                allowNull: false,
                comment: 'Opis produktu'
            },
            quantity_declared: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: 'Ilość zadeklarowana przez dostawcę (z agregacji)'
            },
            quantity_verified: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: 'Ilość rzeczywiście zweryfikowana w tej partii'
            },
            classification: {
                type: Sequelize.ENUM('A', 'B', 'C', 'MISSING', 'SURPLUS'),
                allowNull: false,
                comment: 'A=nowy, B=używany, C=uszkodzony, MISSING=brak, SURPLUS=nadwyżka'
            },
            destination: {
                type: Sequelize.ENUM('retail', 'box_mix', 'damaged', 'return_to_supplier', 'disposal'),
                allowNull: false,
                comment: 'Przeznaczenie produktu po weryfikacji'
            },
            condition_notes: {
                type: Sequelize.TEXT,
                allowNull: true,
                comment: 'Szczegółowe notatki o stanie produktu'
            },
            verified_by: {
                type: Sequelize.STRING(20),
                allowNull: false,
                comment: 'ID pracownika weryfikującego'
            },
            verified_at: {
                type: Sequelize.DATE,
                allowNull: false,
                comment: 'Kiedy zweryfikowano'
            },
            unified_price: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: true,
                comment: 'Ujednolicona cena po decyzji pracownika (może różnić się od oryginalnej)'
            },
            lpn_group: {
                type: Sequelize.STRING(50),
                allowNull: true,
                comment: 'Grupa LPN dla produktów o tej samej cenie i przeznaczeniu'
            },
            price_adjustment_reason: {
                type: Sequelize.TEXT,
                allowNull: true,
                comment: 'Powód korekty ceny przez pracownika'
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
        // 3. Rozbieżności cenowe i finansowe
        yield queryInterface.createTable('verification_financial_discrepancies', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            session_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'verification_sessions',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },
            verification_product_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'verification_products',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },
            asin: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            declared_market_value: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: false,
                comment: 'Wartość rynkowa zadeklarowana przez dostawcę'
            },
            actual_market_value: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: false,
                comment: 'Rzeczywista wartość rynkowa (po weryfikacji)'
            },
            purchase_cost_gross: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: false,
                comment: 'Koszt zakupu brutto = declared_value * 1.23 * 0.18'
            },
            expected_revenue_retail: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: true,
                comment: 'Oczekiwany przychód ze sprzedaży detalicznej'
            },
            expected_revenue_box_mix: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: true,
                comment: 'Oczekiwany przychód z box mix = actual_value * 0.5 * 0.81'
            },
            financial_impact: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: false,
                comment: 'Wpływ finansowy (dodatni=zysk, ujemny=strata)'
            },
            impact_type: {
                type: Sequelize.ENUM('profit', 'loss', 'neutral'),
                allowNull: false,
                comment: 'Typ wpływu finansowego'
            },
            currency: {
                type: Sequelize.STRING(3),
                defaultValue: 'PLN',
                comment: 'Waluta obliczeń'
            },
            notes: {
                type: Sequelize.TEXT,
                allowNull: true,
                comment: 'Dodatkowe notatki o rozbieżności'
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
        // 4. Raporty dla dostawców
        yield queryInterface.createTable('verification_supplier_reports', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            session_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'verification_sessions',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },
            supplier_id: {
                type: Sequelize.STRING(20),
                allowNull: false,
                comment: 'ID dostawcy'
            },
            report_type: {
                type: Sequelize.ENUM('discrepancies', 'damages', 'financial_summary', 'full_report'),
                allowNull: false,
                comment: 'Typ raportu'
            },
            report_data: {
                type: Sequelize.JSON,
                allowNull: false,
                comment: 'Dane raportu w formacie JSON'
            },
            sent_to_supplier: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                comment: 'Czy raport został wysłany do dostawcy'
            },
            sent_at: {
                type: Sequelize.DATE,
                allowNull: true,
                comment: 'Kiedy wysłano raport'
            },
            supplier_response: {
                type: Sequelize.TEXT,
                allowNull: true,
                comment: 'Odpowiedź dostawcy na raport'
            },
            response_received_at: {
                type: Sequelize.DATE,
                allowNull: true,
                comment: 'Kiedy otrzymano odpowiedź'
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
        // 5. Podsumowania sesji weryfikacji
        yield queryInterface.createTable('verification_session_summary', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            session_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'verification_sessions',
                    key: 'id'
                },
                onDelete: 'CASCADE',
                unique: true
            },
            total_products_class_a: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                comment: 'Produkty klasy A (nowe)'
            },
            total_products_class_b: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                comment: 'Produkty klasy B (używane)'
            },
            total_products_class_c: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                comment: 'Produkty klasy C (uszkodzone)'
            },
            total_missing: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                comment: 'Produkty brakujące'
            },
            total_surplus: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                comment: 'Produkty nadwyżkowe'
            },
            total_financial_impact: {
                type: Sequelize.DECIMAL(15, 2),
                defaultValue: 0,
                comment: 'Łączny wpływ finansowy sesji'
            },
            total_losses: {
                type: Sequelize.DECIMAL(15, 2),
                defaultValue: 0,
                comment: 'Łączne straty'
            },
            total_gains: {
                type: Sequelize.DECIMAL(15, 2),
                defaultValue: 0,
                comment: 'Łączne zyski'
            },
            verification_accuracy: {
                type: Sequelize.DECIMAL(5, 2),
                allowNull: true,
                comment: 'Dokładność dostawy w % (produkty zgodne/wszystkie)'
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
        // Dodanie indeksów dla wydajności
        yield queryInterface.addIndex('verification_sessions', ['delivery_file_id']);
        yield queryInterface.addIndex('verification_sessions', ['supplier_id']);
        yield queryInterface.addIndex('verification_sessions', ['verification_status']);
        yield queryInterface.addIndex('verification_sessions', ['started_at']);
        yield queryInterface.addIndex('verification_products', ['session_id']);
        yield queryInterface.addIndex('verification_products', ['source_product_id']);
        yield queryInterface.addIndex('verification_products', ['asin']);
        yield queryInterface.addIndex('verification_products', ['classification']);
        yield queryInterface.addIndex('verification_products', ['destination']);
        yield queryInterface.addIndex('verification_products', ['lpn_group']);
        yield queryInterface.addIndex('verification_financial_discrepancies', ['session_id']);
        yield queryInterface.addIndex('verification_financial_discrepancies', ['verification_product_id']);
        yield queryInterface.addIndex('verification_financial_discrepancies', ['impact_type']);
        yield queryInterface.addIndex('verification_supplier_reports', ['session_id']);
        yield queryInterface.addIndex('verification_supplier_reports', ['supplier_id']);
        yield queryInterface.addIndex('verification_supplier_reports', ['report_type']);
        yield queryInterface.addIndex('verification_session_summary', ['session_id']);
    }),
    down: (queryInterface, Sequelize) => __awaiter(void 0, void 0, void 0, function* () {
        // Usuń tabele w odwrotnej kolejności (ze względu na klucze obce)
        yield queryInterface.dropTable('verification_session_summary');
        yield queryInterface.dropTable('verification_supplier_reports');
        yield queryInterface.dropTable('verification_financial_discrepancies');
        yield queryInterface.dropTable('verification_products');
        yield queryInterface.dropTable('verification_sessions');
    })
};
