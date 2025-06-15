import pool from "../db";
import { LoginTableStaff } from "../models/login_table_staff.model";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import bcrypt from "bcrypt";

/**
 * Generuje nowe ID pracownika na podstawie roli
 * @param role Rola pracownika ('admin' lub 'staff')
 * @returns Wygenerowane ID pracownika
 */
export const generateStaffId = async (role: "admin" | "staff"): Promise<string> => {
  const connection = await pool.getConnection();
  try {
    const prefix = role === "admin" ? "ADM/" : "STF/";

    // Pobierz wszystkie ID pracowników z określonym prefixem
    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT id_staff FROM login_table_staff WHERE id_staff LIKE ?",
      [`${prefix}%`]
    );

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
  } catch (error) {
    console.error("Błąd podczas generowania ID pracownika:", error);
    // Wygeneruj domyślne ID w przypadku błędu
    const defaultId = role === "admin" ? "ADM/00001" : "STF/00001";
    console.log(`Błąd generowania ID, zwracam domyślne: ${defaultId}`);
    return defaultId;
  } finally {
    connection.release();
  }
};

/**
 * Generuje hasło dla nowego pracownika na podstawie ID
 * @param id_staff ID pracownika
 * @returns Wygenerowane hasło w formie jawnej (przed haszowaniem)
 */
export const generatePassword = (id_staff: string): string => {
  // Pobierz ostatnią cyfrę z ID
  const lastChar = id_staff.charAt(id_staff.length - 1);
  return `pracownika${lastChar}`;
};

/**
 * Tworzy nowego pracownika wraz z danymi uwierzytelniającymi
 * @param staff Dane nowego pracownika (bez id_staff, które zostanie wygenerowane)
 * @returns Dane utworzonego pracownika
 */
export const createStaffWithPassword = async (
  staff: Omit<LoginTableStaff, "id_staff" | "created_at" | "updated_at">
): Promise<LoginTableStaff | null> => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Generuj ID pracownika
    const id_staff = await generateStaffId(staff.role);

    // Generuj hasło
    const plainPassword = generatePassword(id_staff);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Utwórz nowego pracownika
    await connection.execute(
      "INSERT INTO login_table_staff (id_staff, first_name, last_name, role, email, phone) VALUES (?, ?, ?, ?, ?, ?)",
      [id_staff, staff.first_name, staff.last_name, staff.role, staff.email, staff.phone]
    );

    // Utwórz dane uwierzytelniające
    const id_login = `${id_staff}/LOG`;
    await connection.execute(
      "INSERT INTO login_auth_data (id_login, related_id, email, password_hash, role, failed_login_attempts) VALUES (?, ?, ?, ?, ?, ?)",
      [id_login, id_staff, staff.email, hashedPassword, staff.role, 0]
    );

    await connection.commit();

    return await getStaffById(id_staff);
  } catch (error) {
    await connection.rollback();
    console.error("Błąd podczas tworzenia pracownika z hasłem:", error);
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Pobiera wszystkich pracowników
 * @returns Lista pracowników
 */
export const getAllStaff = async (): Promise<LoginTableStaff[]> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query<RowDataPacket[]>("SELECT * FROM login_table_staff");
    return rows as LoginTableStaff[];
  } finally {
    connection.release();
  }
};

/**
 * Pobiera pracownika na podstawie ID
 * @param id_staff Identyfikator pracownika
 * @returns Dane pracownika lub null, jeśli nie znaleziono
 */
export const getStaffById = async (id_staff: string): Promise<LoginTableStaff | null> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query<RowDataPacket[]>("SELECT * FROM login_table_staff WHERE id_staff = ?", [
      id_staff,
    ]);
    return rows.length > 0 ? (rows[0] as LoginTableStaff) : null;
  } finally {
    connection.release();
  }
};

/**
 * Pobiera pracownika na podstawie adresu email
 * @param email Adres email pracownika
 * @returns Dane pracownika lub null, jeśli nie znaleziono
 */
export const getStaffByEmail = async (email: string): Promise<LoginTableStaff | null> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query<RowDataPacket[]>("SELECT * FROM login_table_staff WHERE email = ?", [email]);
    return rows.length > 0 ? (rows[0] as LoginTableStaff) : null;
  } finally {
    connection.release();
  }
};

/**
 * Tworzy nowego pracownika
 * @param staff Dane nowego pracownika
 * @returns Dane utworzonego pracownika
 */
export const createStaff = async (
  staff: Omit<LoginTableStaff, "created_at" | "updated_at">
): Promise<LoginTableStaff | null> => {
  const connection = await pool.getConnection();
  try {
    await connection.execute(
      "INSERT INTO login_table_staff (id_staff, first_name, last_name, role, email, phone) VALUES (?, ?, ?, ?, ?, ?)",
      [staff.id_staff, staff.first_name, staff.last_name, staff.role, staff.email, staff.phone]
    );

    return await getStaffById(staff.id_staff);
  } finally {
    connection.release();
  }
};

/**
 * Aktualizuje dane pracownika
 * @param id_staff Identyfikator pracownika
 * @param staff Dane do aktualizacji
 * @returns Zaktualizowane dane pracownika lub null, jeśli nie znaleziono
 */
export const updateStaff = async (
  id_staff: string,
  staff: Partial<Omit<LoginTableStaff, "id_staff" | "created_at" | "updated_at">>
): Promise<LoginTableStaff | null> => {
  const connection = await pool.getConnection();
  try {
    const updates: string[] = [];
    const values: any[] = [];

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
      return await getStaffById(id_staff);
    }

    values.push(id_staff);

    await connection.execute(`UPDATE login_table_staff SET ${updates.join(", ")} WHERE id_staff = ?`, values);

    return await getStaffById(id_staff);
  } finally {
    connection.release();
  }
};

/**
 * Usuwa pracownika
 * @param id_staff Identyfikator pracownika
 * @returns True, jeśli pracownik został usunięty, false w przeciwnym razie
 */
export const deleteStaff = async (id_staff: string): Promise<boolean> => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Usuń powiązane dane logowania
    const id_login = `${id_staff}/LOG`;
    await connection.execute("DELETE FROM login_auth_data WHERE id_login = ? OR related_id = ?", [id_login, id_staff]);

    // Usuń pracownika
    const [result] = await connection.execute<ResultSetHeader>("DELETE FROM login_table_staff WHERE id_staff = ?", [
      id_staff,
    ]);

    await connection.commit();

    return result.affectedRows > 0;
  } catch (error) {
    await connection.rollback();
    console.error(`Błąd podczas usuwania pracownika o ID ${id_staff}:`, error);
    return false;
  } finally {
    connection.release();
  }
};
