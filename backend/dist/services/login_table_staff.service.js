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
exports.deleteStaff = exports.updateStaff = exports.createStaff = exports.getStaffByEmail = exports.getStaffById = exports.getAllStaff = void 0;
const db_1 = __importDefault(require("../db"));
/**
 * Pobiera wszystkich pracowników
 * @returns Lista pracowników
 */
const getAllStaff = () => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield db_1.default.getConnection();
    try {
        const [rows] = yield connection.query('SELECT * FROM login_table_staff');
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
        const [rows] = yield connection.query('SELECT * FROM login_table_staff WHERE id_staff = ?', [id_staff]);
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
        const [rows] = yield connection.query('SELECT * FROM login_table_staff WHERE email = ?', [email]);
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
        yield connection.execute('INSERT INTO login_table_staff (id_staff, first_name, last_name, role, email, phone) VALUES (?, ?, ?, ?, ?, ?)', [staff.id_staff, staff.first_name, staff.last_name, staff.role, staff.email, staff.phone]);
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
            updates.push('first_name = ?');
            values.push(staff.first_name);
        }
        if (staff.last_name !== undefined) {
            updates.push('last_name = ?');
            values.push(staff.last_name);
        }
        if (staff.role !== undefined) {
            updates.push('role = ?');
            values.push(staff.role);
        }
        if (staff.email !== undefined) {
            updates.push('email = ?');
            values.push(staff.email);
        }
        if (staff.phone !== undefined) {
            updates.push('phone = ?');
            values.push(staff.phone);
        }
        if (updates.length === 0) {
            return yield (0, exports.getStaffById)(id_staff);
        }
        values.push(id_staff);
        yield connection.execute(`UPDATE login_table_staff SET ${updates.join(', ')} WHERE id_staff = ?`, values);
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
        const [result] = yield connection.execute('DELETE FROM login_table_staff WHERE id_staff = ?', [id_staff]);
        return result.affectedRows > 0;
    }
    finally {
        connection.release();
    }
});
exports.deleteStaff = deleteStaff;
