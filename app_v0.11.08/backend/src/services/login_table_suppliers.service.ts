import pool from "../db";
import { LoginTableSuppliers } from "../models/login_table_suppliers.model";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import bcrypt from "bcrypt";

/**
 * Pobiera wszystkich dostawców
 * @returns Lista dostawców
 */
export const getAllSuppliers = async (): Promise<LoginTableSuppliers[]> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query<RowDataPacket[]>("SELECT * FROM login_table_suppliers");
    return rows as LoginTableSuppliers[];
  } finally {
    connection.release();
  }
};

/**
 * Pobiera dostawcę na podstawie ID
 * @param id_supplier Identyfikator dostawcy
 * @returns Dane dostawcy lub null, jeśli nie znaleziono
 */
export const getSupplierById = async (id_supplier: string): Promise<LoginTableSuppliers | null> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM login_table_suppliers WHERE id_supplier = ?",
      [id_supplier]
    );
    return rows.length > 0 ? (rows[0] as LoginTableSuppliers) : null;
  } finally {
    connection.release();
  }
};

/**
 * Pobiera dostawcę na podstawie adresu email
 * @param email Adres email dostawcy
 * @returns Dane dostawcy lub null, jeśli nie znaleziono
 */
export const getSupplierByEmail = async (email: string): Promise<LoginTableSuppliers | null> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query<RowDataPacket[]>("SELECT * FROM login_table_suppliers WHERE email = ?", [
      email,
    ]);
    return rows.length > 0 ? (rows[0] as LoginTableSuppliers) : null;
  } finally {
    connection.release();
  }
};

/**
 * Pobiera dostawcę na podstawie numeru NIP
 * @param nip Numer NIP dostawcy
 * @returns Dane dostawcy lub null, jeśli nie znaleziono
 */
export const getSupplierByNip = async (nip: string): Promise<LoginTableSuppliers | null> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query<RowDataPacket[]>("SELECT * FROM login_table_suppliers WHERE nip = ?", [nip]);
    return rows.length > 0 ? (rows[0] as LoginTableSuppliers) : null;
  } finally {
    connection.release();
  }
};

/**
 * Tworzy nowego dostawcę
 * @param supplier Dane nowego dostawcy
 * @returns Dane utworzonego dostawcy
 */
export const createSupplier = async (
  supplier: Omit<LoginTableSuppliers, "created_at" | "updated_at">
): Promise<LoginTableSuppliers | null> => {
  const connection = await pool.getConnection();
  try {
    await connection.execute(
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

    return await getSupplierById(supplier.id_supplier);
  } finally {
    connection.release();
  }
};

/**
 * Tworzy nowego dostawcę wraz z danymi do logowania
 * @param supplier Dane nowego dostawcy (bez ID)
 * @returns Dane utworzonego dostawcy wraz z wygenerowanym hasłem lub null
 */
export const createSupplierWithPassword = async (
  supplier: Omit<LoginTableSuppliers, "id_supplier" | "created_at" | "updated_at">
): Promise<(LoginTableSuppliers & { password: string }) | null> => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Generuj ID dostawcy
    const id_supplier = await generateSupplierId();

    // Generuj hasło
    const plainPassword = generatePassword(id_supplier);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Utwórz nowego dostawcę
    await connection.execute(
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
    await connection.execute(
      "INSERT INTO login_auth_data (id_login, related_id, email, password_hash, role, failed_login_attempts) VALUES (?, ?, ?, ?, ?, ?)",
      [id_login, id_supplier, supplier.email, hashedPassword, "supplier", 0]
    );

    await connection.commit();

    const newSupplier = await getSupplierById(id_supplier);
    if (!newSupplier) {
      return null;
    }

    return {
      ...newSupplier,
      password: plainPassword,
    };
  } catch (error) {
    await connection.rollback();
    console.error("Błąd podczas tworzenia dostawcy z hasłem:", error);
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Aktualizuje dane dostawcy
 * @param id_supplier Identyfikator dostawcy
 * @param supplier Dane do aktualizacji
 * @returns Zaktualizowane dane dostawcy lub null, jeśli nie znaleziono
 */
export const updateSupplier = async (
  id_supplier: string,
  supplier: Partial<Omit<LoginTableSuppliers, "id_supplier" | "created_at" | "updated_at">>
): Promise<LoginTableSuppliers | null> => {
  const connection = await pool.getConnection();
  try {
    const updates: string[] = [];
    const values: any[] = [];

    // Sprawdzamy każde pole i dodajemy je do zapytania aktualizacji, jeśli zostało podane
    for (const [key, value] of Object.entries(supplier)) {
      if (value !== undefined) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (updates.length === 0) {
      return await getSupplierById(id_supplier);
    }

    values.push(id_supplier);

    await connection.execute(`UPDATE login_table_suppliers SET ${updates.join(", ")} WHERE id_supplier = ?`, values);

    return await getSupplierById(id_supplier);
  } finally {
    connection.release();
  }
};

/**
 * Usuwa dostawcę
 * @param id_supplier Identyfikator dostawcy
 * @returns True, jeśli dostawca został usunięty, false w przeciwnym razie
 */
export const deleteSupplier = async (id_supplier: string): Promise<boolean> => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Usuń powiązane dane logowania
    const id_login = `${id_supplier}/LOG`;
    await connection.execute("DELETE FROM login_auth_data WHERE id_login = ? OR related_id = ?", [
      id_login,
      id_supplier,
    ]);

    // Usuń dostawcę
    const [result] = await connection.execute<ResultSetHeader>(
      "DELETE FROM login_table_suppliers WHERE id_supplier = ?",
      [id_supplier]
    );

    await connection.commit();

    return result.affectedRows > 0;
  } catch (error) {
    await connection.rollback();
    console.error(`Błąd podczas usuwania dostawcy o ID ${id_supplier}:`, error);
    return false;
  } finally {
    connection.release();
  }
};

/**
 * Generuje nowe ID dostawcy
 * @returns Wygenerowane ID dostawcy
 */
export const generateSupplierId = async (): Promise<string> => {
  const connection = await pool.getConnection();
  try {
    const prefix = "SUP/";

    // Pobierz wszystkie ID dostawców
    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT id_supplier FROM login_table_suppliers WHERE id_supplier LIKE ?",
      [`${prefix}%`]
    );

    // Znajdź największy numer
    let maxNumber = 0;
    rows.forEach((row) => {
      const idParts = row.id_supplier.split("/");
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

    console.log(`Wygenerowano nowe ID dostawcy: ${newId}`);
    return newId;
  } catch (error) {
    console.error("Błąd podczas generowania ID dostawcy:", error);
    // Wygeneruj domyślne ID w przypadku błędu
    const defaultId = "SUP/00001";
    console.log(`Błąd generowania ID, zwracam domyślne: ${defaultId}`);
    return defaultId;
  } finally {
    connection.release();
  }
};

/**
 * Generuje hasło dla nowego dostawcy na podstawie ID
 * @param id_supplier ID dostawcy
 * @returns Wygenerowane hasło w formie jawnej (przed haszowaniem)
 */
export const generatePassword = (id_supplier: string): string => {
  // Pobierz ostatnią cyfrę z ID
  const lastChar = id_supplier.charAt(id_supplier.length - 1);
  return `dostawca${lastChar}`;
};
