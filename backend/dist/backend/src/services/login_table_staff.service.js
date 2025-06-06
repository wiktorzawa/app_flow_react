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
exports.deleteStaff = exports.updateStaff = exports.createStaff = exports.getStaffByEmail = exports.getStaffById = exports.getAllStaff = exports.createStaffWithPassword = exports.generatePassword = exports.generateStaffId = void 0;
const db_1 = __importDefault(require("../db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
/**
 * Generuje nowe ID pracownika na podstawie roli
 * @param role Rola pracownika ('admin' lub 'staff')
 * @returns Wygenerowane ID pracownika
 */
const generateStaffId = (role) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield db_1.default.getConnection();
    try {
        const prefix = role === "admin" ? "ADM/" : "STF/";
        // Pobierz wszystkie ID pracowników z określonym prefixem
        const [rows] = yield connection.query("SELECT id_staff FROM login_table_staff WHERE id_staff LIKE ?", [`${prefix}%`]);
        // Znajdź największy numer
        let maxNumber = 0;
        rows.forEach((row) => {
            const idParts = row.id_staff.split("/");
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
        const paddedNumber = nextNumber.toString().padStart(5, "0");
        const newId = `${prefix}${paddedNumber}`;
        console.log(`Wygenerowano nowe ID: ${newId} dla roli: ${role}`);
        return newId;
    }
    catch (error) {
        console.error("Błąd podczas generowania ID pracownika:", error);
        // Wygeneruj domyślne ID w przypadku błędu
        const defaultId = role === "admin" ? "ADM/00001" : "STF/00001";
        console.log(`Błąd generowania ID, zwracam domyślne: ${defaultId}`);
        return defaultId;
    }
    finally {
        connection.release();
    }
});
exports.generateStaffId = generateStaffId;
/**
 * Generuje hasło dla nowego pracownika na podstawie ID
 * @param id_staff ID pracownika
 * @returns Wygenerowane hasło w formie jawnej (przed haszowaniem)
 */
const generatePassword = (id_staff) => {
    // Pobierz ostatnią cyfrę z ID
    const lastChar = id_staff.charAt(id_staff.length - 1);
    return `pracownika${lastChar}`;
};
exports.generatePassword = generatePassword;
/**
 * Tworzy nowego pracownika wraz z danymi uwierzytelniającymi
 * @param staff Dane nowego pracownika (bez id_staff, które zostanie wygenerowane)
 * @returns Dane utworzonego pracownika
 */
const createStaffWithPassword = (staff) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield db_1.default.getConnection();
    try {
        yield connection.beginTransaction();
        // Generuj ID pracownika
        const id_staff = yield (0, exports.generateStaffId)(staff.role);
        // Generuj hasło
        const plainPassword = (0, exports.generatePassword)(id_staff);
        const hashedPassword = yield bcrypt_1.default.hash(plainPassword, 10);
        // Utwórz nowego pracownika
        yield connection.execute("INSERT INTO login_table_staff (id_staff, first_name, last_name, role, email, phone) VALUES (?, ?, ?, ?, ?, ?)", [id_staff, staff.first_name, staff.last_name, staff.role, staff.email, staff.phone]);
        // Utwórz dane uwierzytelniające
        const id_login = `${id_staff}/LOG`;
        yield connection.execute("INSERT INTO login_auth_data (id_login, related_id, email, password_hash, role, failed_login_attempts) VALUES (?, ?, ?, ?, ?, ?)", [id_login, id_staff, staff.email, hashedPassword, staff.role, 0]);
        yield connection.commit();
        return yield (0, exports.getStaffById)(id_staff);
    }
    catch (error) {
        yield connection.rollback();
        console.error("Błąd podczas tworzenia pracownika z hasłem:", error);
        throw error;
    }
    finally {
        connection.release();
    }
});
exports.createStaffWithPassword = createStaffWithPassword;
/**
 * Pobiera wszystkich pracowników
 * @returns Lista pracowników
 */
const getAllStaff = () => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield db_1.default.getConnection();
    try {
        const [rows] = yield connection.query("SELECT * FROM login_table_staff");
        return rows;
    }
    finally {
        connection.release();
    }
});
exports.getAllStaff = getAllStaff;
/**
 * Pobiera pracownika na podstawie ID
 * @param id_staff Identyfikator pracownika
 * @returns Dane pracownika lub null, jeśli nie znaleziono
 */
const getStaffById = (id_staff) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield db_1.default.getConnection();
    try {
        const [rows] = yield connection.query("SELECT * FROM login_table_staff WHERE id_staff = ?", [
            id_staff,
        ]);
        return rows.length > 0 ? rows[0] : null;
    }
    finally {
        connection.release();
    }
});
exports.getStaffById = getStaffById;
/**
 * Pobiera pracownika na podstawie adresu email
 * @param email Adres email pracownika
 * @returns Dane pracownika lub null, jeśli nie znaleziono
 */
const getStaffByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield db_1.default.getConnection();
    try {
        const [rows] = yield connection.query("SELECT * FROM login_table_staff WHERE email = ?", [email]);
        return rows.length > 0 ? rows[0] : null;
    }
    finally {
        connection.release();
    }
});
exports.getStaffByEmail = getStaffByEmail;
/**
 * Tworzy nowego pracownika
 * @param staff Dane nowego pracownika
 * @returns Dane utworzonego pracownika
 */
const createStaff = (staff) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield db_1.default.getConnection();
    try {
        yield connection.execute("INSERT INTO login_table_staff (id_staff, first_name, last_name, role, email, phone) VALUES (?, ?, ?, ?, ?, ?)", [staff.id_staff, staff.first_name, staff.last_name, staff.role, staff.email, staff.phone]);
        return yield (0, exports.getStaffById)(staff.id_staff);
    }
    finally {
        connection.release();
    }
});
exports.createStaff = createStaff;
/**
 * Aktualizuje dane pracownika
 * @param id_staff Identyfikator pracownika
 * @param staff Dane do aktualizacji
 * @returns Zaktualizowane dane pracownika lub null, jeśli nie znaleziono
 */
const updateStaff = (id_staff, staff) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield db_1.default.getConnection();
    try {
        const updates = [];
        const values = [];
        if (staff.first_name !== undefined) {
            updates.push("first_name = ?");
            values.push(staff.first_name);
        }
        if (staff.last_name !== undefined) {
            updates.push("last_name = ?");
            values.push(staff.last_name);
        }
        if (staff.role !== undefined) {
            updates.push("role = ?");
            values.push(staff.role);
        }
        if (staff.email !== undefined) {
            updates.push("email = ?");
            values.push(staff.email);
        }
        if (staff.phone !== undefined) {
            updates.push("phone = ?");
            values.push(staff.phone);
        }
        if (updates.length === 0) {
            return yield (0, exports.getStaffById)(id_staff);
        }
        values.push(id_staff);
        yield connection.execute(`UPDATE login_table_staff SET ${updates.join(", ")} WHERE id_staff = ?`, values);
        return yield (0, exports.getStaffById)(id_staff);
    }
    finally {
        connection.release();
    }
});
exports.updateStaff = updateStaff;
/**
 * Usuwa pracownika
 * @param id_staff Identyfikator pracownika
 * @returns True, jeśli pracownik został usunięty, false w przeciwnym razie
 */
const deleteStaff = (id_staff) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield db_1.default.getConnection();
    try {
        yield connection.beginTransaction();
        // Usuń powiązane dane logowania
        const id_login = `${id_staff}/LOG`;
        yield connection.execute("DELETE FROM login_auth_data WHERE id_login = ? OR related_id = ?", [id_login, id_staff]);
        // Usuń pracownika
        const [result] = yield connection.execute("DELETE FROM login_table_staff WHERE id_staff = ?", [
            id_staff,
        ]);
        yield connection.commit();
        return result.affectedRows > 0;
    }
    catch (error) {
        yield connection.rollback();
        console.error(`Błąd podczas usuwania pracownika o ID ${id_staff}:`, error);
        return false;
    }
    finally {
        connection.release();
    }
});
exports.deleteStaff = deleteStaff;
