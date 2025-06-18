'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.generatePassword =
  exports.generateSupplierId =
  exports.deleteSupplier =
  exports.updateSupplier =
  exports.createSupplierWithPassword =
  exports.createSupplier =
  exports.getSupplierByNip =
  exports.getSupplierByEmail =
  exports.getSupplierById =
  exports.getAllSuppliers =
    void 0;
const db_1 = __importDefault(require('../db'));
const bcrypt_1 = __importDefault(require('bcrypt'));
/**
 * Pobiera wszystkich dostawców
 * @returns Lista dostawców
 */
const getAllSuppliers = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield db_1.default.getConnection();
    try {
      const [rows] = yield connection.query('SELECT * FROM login_table_suppliers');
      return rows;
    } finally {
      connection.release();
    }
  });
exports.getAllSuppliers = getAllSuppliers;
/**
 * Pobiera dostawcę na podstawie ID
 * @param id_supplier Identyfikator dostawcy
 * @returns Dane dostawcy lub null, jeśli nie znaleziono
 */
const getSupplierById = (id_supplier) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield db_1.default.getConnection();
    try {
      const [rows] = yield connection.query(
        'SELECT * FROM login_table_suppliers WHERE id_supplier = ?',
        [id_supplier]
      );
      return rows.length > 0 ? rows[0] : null;
    } finally {
      connection.release();
    }
  });
exports.getSupplierById = getSupplierById;
/**
 * Pobiera dostawcę na podstawie adresu email
 * @param email Adres email dostawcy
 * @returns Dane dostawcy lub null, jeśli nie znaleziono
 */
const getSupplierByEmail = (email) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield db_1.default.getConnection();
    try {
      const [rows] = yield connection.query('SELECT * FROM login_table_suppliers WHERE email = ?', [
        email,
      ]);
      return rows.length > 0 ? rows[0] : null;
    } finally {
      connection.release();
    }
  });
exports.getSupplierByEmail = getSupplierByEmail;
/**
 * Pobiera dostawcę na podstawie numeru NIP
 * @param nip Numer NIP dostawcy
 * @returns Dane dostawcy lub null, jeśli nie znaleziono
 */
const getSupplierByNip = (nip) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield db_1.default.getConnection();
    try {
      const [rows] = yield connection.query('SELECT * FROM login_table_suppliers WHERE nip = ?', [
        nip,
      ]);
      return rows.length > 0 ? rows[0] : null;
    } finally {
      connection.release();
    }
  });
exports.getSupplierByNip = getSupplierByNip;
/**
 * Tworzy nowego dostawcę
 * @param supplier Dane nowego dostawcy
 * @returns Dane utworzonego dostawcy
 */
const createSupplier = (supplier) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield db_1.default.getConnection();
    try {
      yield connection.execute(
        `INSERT INTO login_table_suppliers (
        id_supplier, company_name, first_name, last_name, nip, email, phone, 
        website, address_street, address_building, address_apartment, 
        address_city, address_postal_code, address_country
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          supplier.id_supplier,
          supplier.company_name,
          supplier.first_name,
          supplier.last_name,
          supplier.nip,
          supplier.email,
          supplier.phone,
          supplier.website,
          supplier.address_street,
          supplier.address_building,
          supplier.address_apartment,
          supplier.address_city,
          supplier.address_postal_code,
          supplier.address_country,
        ]
      );
      return yield (0, exports.getSupplierById)(supplier.id_supplier);
    } finally {
      connection.release();
    }
  });
exports.createSupplier = createSupplier;
/**
 * Tworzy nowego dostawcę wraz z danymi do logowania
 * @param supplier Dane nowego dostawcy (bez ID)
 * @returns Dane utworzonego dostawcy wraz z wygenerowanym hasłem lub null
 */
const createSupplierWithPassword = (supplier) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield db_1.default.getConnection();
    try {
      yield connection.beginTransaction();
      // Generuj ID dostawcy
      const id_supplier = yield (0, exports.generateSupplierId)();
      // Generuj hasło
      const plainPassword = (0, exports.generatePassword)(id_supplier);
      const hashedPassword = yield bcrypt_1.default.hash(plainPassword, 10);
      // Utwórz nowego dostawcę
      yield connection.execute(
        `INSERT INTO login_table_suppliers (
        id_supplier, company_name, first_name, last_name, nip, email, phone, 
        website, address_street, address_building, address_apartment, 
        address_city, address_postal_code, address_country
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id_supplier,
          supplier.company_name,
          supplier.first_name,
          supplier.last_name,
          supplier.nip,
          supplier.email,
          supplier.phone,
          supplier.website,
          supplier.address_street,
          supplier.address_building,
          supplier.address_apartment,
          supplier.address_city,
          supplier.address_postal_code,
          supplier.address_country,
        ]
      );
      // Utwórz dane uwierzytelniające
      const id_login = `${id_supplier}/LOG`;
      yield connection.execute(
        'INSERT INTO login_auth_data (id_login, related_id, email, password_hash, role, failed_login_attempts) VALUES (?, ?, ?, ?, ?, ?)',
        [id_login, id_supplier, supplier.email, hashedPassword, 'supplier', 0]
      );
      yield connection.commit();
      const newSupplier = yield (0, exports.getSupplierById)(id_supplier);
      if (!newSupplier) {
        return null;
      }
      return Object.assign(Object.assign({}, newSupplier), { password: plainPassword });
    } catch (error) {
      yield connection.rollback();
      console.error('Błąd podczas tworzenia dostawcy z hasłem:', error);
      throw error;
    } finally {
      connection.release();
    }
  });
exports.createSupplierWithPassword = createSupplierWithPassword;
/**
 * Aktualizuje dane dostawcy
 * @param id_supplier Identyfikator dostawcy
 * @param supplier Dane do aktualizacji
 * @returns Zaktualizowane dane dostawcy lub null, jeśli nie znaleziono
 */
const updateSupplier = (id_supplier, supplier) =>
  __awaiter(void 0, void 0, void 0, function* () {
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
      yield connection.execute(
        `UPDATE login_table_suppliers SET ${updates.join(', ')} WHERE id_supplier = ?`,
        values
      );
      return yield (0, exports.getSupplierById)(id_supplier);
    } finally {
      connection.release();
    }
  });
exports.updateSupplier = updateSupplier;
/**
 * Usuwa dostawcę
 * @param id_supplier Identyfikator dostawcy
 * @returns True, jeśli dostawca został usunięty, false w przeciwnym razie
 */
const deleteSupplier = (id_supplier) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield db_1.default.getConnection();
    try {
      yield connection.beginTransaction();
      // Usuń powiązane dane logowania
      const id_login = `${id_supplier}/LOG`;
      yield connection.execute('DELETE FROM login_auth_data WHERE id_login = ? OR related_id = ?', [
        id_login,
        id_supplier,
      ]);
      // Usuń dostawcę
      const [result] = yield connection.execute(
        'DELETE FROM login_table_suppliers WHERE id_supplier = ?',
        [id_supplier]
      );
      yield connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      yield connection.rollback();
      console.error(`Błąd podczas usuwania dostawcy o ID ${id_supplier}:`, error);
      return false;
    } finally {
      connection.release();
    }
  });
exports.deleteSupplier = deleteSupplier;
/**
 * Generuje nowe ID dostawcy
 * @returns Wygenerowane ID dostawcy
 */
const generateSupplierId = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield db_1.default.getConnection();
    try {
      const prefix = 'SUP/';
      // Pobierz wszystkie ID dostawców
      const [rows] = yield connection.query(
        'SELECT id_supplier FROM login_table_suppliers WHERE id_supplier LIKE ?',
        [`${prefix}%`]
      );
      // Znajdź największy numer
      let maxNumber = 0;
      rows.forEach((row) => {
        const idParts = row.id_supplier.split('/');
        if (idParts.length === 2) {
          const numStr = idParts[1];
          const num = parseInt(numStr, 10);
          if (!isNaN(num) && num > maxNumber) {
            maxNumber = num;
          }
        }
      });
      // Wygeneruj nowe ID
      const nextNumber = maxNumber + 1;
      const paddedNumber = nextNumber.toString().padStart(5, '0');
      const newId = `${prefix}${paddedNumber}`;
      console.log(`Wygenerowano nowe ID dostawcy: ${newId}`);
      return newId;
    } catch (error) {
      console.error('Błąd podczas generowania ID dostawcy:', error);
      // Wygeneruj domyślne ID w przypadku błędu
      const defaultId = 'SUP/00001';
      console.log(`Błąd generowania ID, zwracam domyślne: ${defaultId}`);
      return defaultId;
    } finally {
      connection.release();
    }
  });
exports.generateSupplierId = generateSupplierId;
/**
 * Generuje hasło dla nowego dostawcy na podstawie ID
 * @param id_supplier ID dostawcy
 * @returns Wygenerowane hasło w formie jawnej (przed haszowaniem)
 */
const generatePassword = (id_supplier) => {
  // Pobierz ostatnią cyfrę z ID
  const lastChar = id_supplier.charAt(id_supplier.length - 1);
  return `dostawca${lastChar}`;
};
exports.generatePassword = generatePassword;
