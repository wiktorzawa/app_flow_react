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
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up(queryInterface, Sequelize) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryInterface.createTable('supplier_deliveries', {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER
                },
                lot_number: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                pallet_id: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                item_description: {
                    type: Sequelize.STRING(1000),
                    allowNull: false
                },
                ean: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                asin: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                quantity: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                unit_retail: {
                    type: Sequelize.DECIMAL(10, 2),
                    allowNull: false,
                    comment: 'Cena rynkowa produktu w walucie zadeklarowanej przez dostawcę'
                },
                currency_value: {
                    type: Sequelize.DECIMAL(10, 4),
                    allowNull: false,
                    comment: 'Kurs waluty (np. EUR/PLN) wprowadzony przez dostawcę'
                },
                value_pln_net: {
                    type: Sequelize.DECIMAL(10, 2),
                    allowNull: false,
                    comment: 'Obliczone: unit_retail * currency_value'
                },
                value_percentage: {
                    type: Sequelize.DECIMAL(5, 4),
                    allowNull: false,
                    comment: 'Procentowa wartość ceny dostawcy dla nas (np. 0.1800 dla 18%)'
                },
                vat_rate: {
                    type: Sequelize.DECIMAL(4, 2),
                    allowNull: false,
                    defaultValue: 0.23
                },
                selling_price_pln_gross: {
                    type: Sequelize.DECIMAL(10, 2),
                    allowNull: false,
                    comment: 'Stores the calculated VAT amount on the net cost price in PLN, based on the formula: (value_pln_net * value_percentage) * vat_rate'
                },
                country_of_origin: {
                    type: Sequelize.STRING(2),
                    allowNull: true
                },
                location: {
                    type: Sequelize.STRING,
                    allowNull: true
                },
                notes: {
                    type: Sequelize.TEXT,
                    allowNull: true
                },
                import_timestamp: {
                    allowNull: false,
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.NOW
                },
                created_at: {
                    allowNull: false,
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.NOW
                },
                updated_at: {
                    allowNull: false,
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.NOW
                }
            });
            yield queryInterface.addIndex('supplier_deliveries', ['lot_number']);
            yield queryInterface.addIndex('supplier_deliveries', ['pallet_id']);
            yield queryInterface.addIndex('supplier_deliveries', ['ean']);
            yield queryInterface.addIndex('supplier_deliveries', ['asin']);
            yield queryInterface.addIndex('supplier_deliveries', ['import_timestamp']);
        });
    },
    down(queryInterface, Sequelize) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryInterface.dropTable('supplier_deliveries');
        });
    }
};
