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
exports.verifyPassword = exports.lockAccount = exports.resetFailedLoginAttempts = exports.incrementFailedLoginAttempts = exports.updateLastLogin = exports.getAuthDataById = exports.getAuthDataByEmail = void 0;
const db_1 = __importDefault(require("../db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
/**
 * Pobiera dane uwierzytelniania użytkownika na podstawie adresu email
 * @param email Adres email użytkownika
 * @returns Dane uwierzytelniania lub null, jeśli nie znaleziono
 */
const getAuthDataByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield db_1.default.getConnection();
    try {
        const [rows] = yield connection.query('SELECT * FROM login_auth_data WHERE email = ?', [email]);
        return rows.length > 0 ? rows[0] : null;
    }
    finally {
        connection.release();
    }
});
exports.getAuthDataByEmail = getAuthDataByEmail;
/**
 * Pobiera dane uwierzytelniania użytkownika na podstawie identyfikatora logowania
 * @param id_login Identyfikator logowania
 * @returns Dane uwierzytelniania lub null, jeśli nie znaleziono
 */
const getAuthDataById = (id_login) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield db_1.default.getConnection();
    try {
        const [rows] = yield connection.query('SELECT * FROM login_auth_data WHERE id_login = ?', [id_login]);
        return rows.length > 0 ? rows[0] : null;
    }
    finally {
        connection.release();
    }
});
exports.getAuthDataById = getAuthDataById;
/**
 * Aktualizuje datę ostatniego logowania użytkownika
 * @param id_login Identyfikator logowania
 */
const updateLastLogin = (id_login) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield db_1.default.getConnection();
    try {
        yield connection.execute('UPDATE login_auth_data SET last_login = CURRENT_TIMESTAMP WHERE id_login = ?', [id_login]);
    }
    finally {
        connection.release();
    }
});
exports.updateLastLogin = updateLastLogin;
/**
 * Zwiększa licznik nieudanych prób logowania
 * @param id_login Identyfikator logowania
 * @returns Zaktualizowaną liczbę nieudanych prób logowania
 */
const incrementFailedLoginAttempts = (id_login) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield db_1.default.getConnection();
    try {
        yield connection.execute('UPDATE login_auth_data SET failed_login_attempts = failed_login_attempts + 1 WHERE id_login = ?', [id_login]);
        const [rows] = yield connection.query('SELECT failed_login_attempts FROM login_auth_data WHERE id_login = ?', [id_login]);
        return rows.length > 0 ? rows[0].failed_login_attempts : 0;
    }
    finally {
        connection.release();
    }
});
exports.incrementFailedLoginAttempts = incrementFailedLoginAttempts;
/**
 * Resetuje licznik nieudanych prób logowania
 * @param id_login Identyfikator logowania
 */
const resetFailedLoginAttempts = (id_login) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield db_1.default.getConnection();
    try {
        yield connection.execute('UPDATE login_auth_data SET failed_login_attempts = 0, locked_until = NULL WHERE id_login = ?', [id_login]);
    }
    finally {
        connection.release();
    }
});
exports.resetFailedLoginAttempts = resetFailedLoginAttempts;
/**
 * Ustawia blokadę konta do określonego czasu
 * @param id_login Identyfikator logowania
 * @param minutes Liczba minut blokady
 */
const lockAccount = (id_login, minutes) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield db_1.default.getConnection();
    try {
        yield connection.execute('UPDATE login_auth_data SET locked_until = DATE_ADD(CURRENT_TIMESTAMP, INTERVAL ? MINUTE) WHERE id_login = ?', [minutes, id_login]);
    }
    finally {
        connection.release();
    }
});
exports.lockAccount = lockAccount;
/**
 * Weryfikuje hasło użytkownika
 * @param plainPassword Hasło w postaci jawnej
 * @param hashedPassword Zahaszowane hasło z bazy danych
 * @returns True, jeśli hasło jest poprawne, w przeciwnym razie false
 */
const verifyPassword = (plainPassword, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.compare(plainPassword, hashedPassword);
});
exports.verifyPassword = verifyPassword;
