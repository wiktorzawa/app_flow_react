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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSupplier = exports.updateSupplier = exports.createSupplier = exports.getSupplierByNip = exports.getSupplierByEmail = exports.getSupplierById = exports.getAllSuppliers = void 0;
const db_1 = __importDefault(require("../db"));
/**
 * Pobiera wszystkich dostawców
 * @returns Lista dostawców
 */
const getAllSuppliers = () => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield db_1.default.getConnection();
    try {
        const [rows] = yield connection.query('SELECT * FROM login_table_suppliers');
        return rows;
    }
    finally {
        connection.release();
    }
});
exports.getAllSuppliers = getAllSuppliers;
/**
 * Pobiera dostawcę na podstawie ID
 * @param id_supplier Identyfikator dostawcy
 * @returns Dane dostawcy lub null, jeśli nie znaleziono
 */
const getSupplierById = (id_supplier) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield db_1.default.getConnection();
    try {
        const [rows] = yield connection.query('SELECT * FROM login_table_suppliers WHERE id_supplier = ?', [id_supplier]);
        return rows.length > 0 ? rows[0] : null;
    }
    finally {
        connection.release();
    }
});
exports.getSupplierById = getSupplierById;
/**
 * Pobiera dostawcę na podstawie adresu email
 * @param email Adres email dostawcy
 * @returns Dane dostawcy lub null, jeśli nie znaleziono
 */
const getSupplierByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield db_1.default.getConnection();
    try {
        const [rows] = yield connection.query('SELECT * FROM login_table_suppliers WHERE email = ?', [email]);
        return rows.length > 0 ? rows[0] : null;
    }
    finally {
        connection.release();
    }
});
exports.getSupplierByEmail = getSupplierByEmail;
/**
 * Pobiera dostawcę na podstawie numeru NIP
 * @param nip Numer NIP dostawcy
 * @returns Dane dostawcy lub null, jeśli nie znaleziono
 */
const getSupplierByNip = (nip) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield db_1.default.getConnection();
    try {
        const [rows] = yield connection.query('SELECT * FROM login_table_suppliers WHERE nip = ?', [nip]);
        return rows.length > 0 ? rows[0] : null;
    }
    finally {
        connection.release();
    }
});
exports.getSupplierByNip = getSupplierByNip;
/**
 * Tworzy nowego dostawcę
 * @param supplier Dane nowego dostawcy
 * @returns Dane utworzonego dostawcy
 */
const createSupplier = (supplier) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield db_1.default.getConnection();
    try {
        yield connection.execute(`INSERT INTO login_table_suppliers (
        id_supplier, company_name, first_name, last_name, nip, email, phone, 
        website, address_street, address_building, address_apartment, 
        address_city, address_postal_code, address_country
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            supplier.id_supplier, supplier.company_name, supplier.first_name, supplier.last_name,
            supplier.nip, supplier.email, supplier.phone, supplier.website,
            supplier.address_street, supplier.address_building, supplier.address_apartment,
            supplier.address_city, supplier.address_postal_code, supplier.address_country
        ]);
        return yield (0, exports.getSupplierById)(supplier.id_supplier);
    }
    finally {
        connection.release();
    }
});
exports.createSupplier = createSupplier;
/**
 * Aktualizuje dane dostawcy
 * @param id_supplier Identyfikator dostawcy
 * @param supplier Dane do aktualizacji
 * @returns Zaktualizowane dane dostawcy lub null, jeśli nie znaleziono
 */
const updateSupplier = (id_supplier, supplier) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield db_1.default.getConnection();
    try {
        const updates = [];
        const values = [];
        // Sprawdzamy każde pole i dodajemy je do zapytania aktualizacji, jeśli zostało podane
        for (const [key, value] of Object.entries(supplier)) {
            if (value !== undefined) {
                updates.push(`${key} = ?`);
                values.push(value);
            }
        }
        if (updates.length === 0) {
            return yield (0, exports.getSupplierById)(id_supplier);
        }
        values.push(id_supplier);
        yield connection.execute(`UPDATE login_table_suppliers SET ${updates.join(', ')} WHERE id_supplier = ?`, values);
        return yield (0, exports.getSupplierById)(id_supplier);
    }
    finally {
        connection.release();
    }
});
exports.updateSupplier = updateSupplier;
/**
 * Usuwa dostawcę
 * @param id_supplier Identyfikator dostawcy
 * @returns True, jeśli dostawca został usunięty, false w przeciwnym razie
 */
const deleteSupplier = (id_supplier) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield db_1.default.getConnection();
    try {
        const [result] = yield connection.execute('DELETE FROM login_table_suppliers WHERE id_supplier = ?', [id_supplier]);
        return result.affectedRows > 0;
    }
    finally {
        connection.release();
    }
});
exports.deleteSupplier = deleteSupplier;
