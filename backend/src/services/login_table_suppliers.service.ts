import pool from '../db';
import { LoginTableSuppliers } from '../models/login_table_suppliers.model';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

/**
 * Pobiera wszystkich dostawców
 * @returns Lista dostawców
 */
export const getAllSuppliers = async (): Promise<LoginTableSuppliers[]> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM login_table_suppliers'
    );
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
      'SELECT * FROM login_table_suppliers WHERE id_supplier = ?',
      [id_supplier]
    );
    return rows.length > 0 ? rows[0] as LoginTableSuppliers : null;
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
    const [rows] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM login_table_suppliers WHERE email = ?',
      [email]
    );
    return rows.length > 0 ? rows[0] as LoginTableSuppliers : null;
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
    const [rows] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM login_table_suppliers WHERE nip = ?',
      [nip]
    );
    return rows.length > 0 ? rows[0] as LoginTableSuppliers : null;
  } finally {
    connection.release();
  }
};

/**
 * Tworzy nowego dostawcę
 * @param supplier Dane nowego dostawcy
 * @returns Dane utworzonego dostawcy
 */
export const createSupplier = async (supplier: Omit<LoginTableSuppliers, 'created_at' | 'updated_at'>): Promise<LoginTableSuppliers | null> => {
  const connection = await pool.getConnection();
  try {
    await connection.execute(
      `INSERT INTO login_table_suppliers (
        id_supplier, company_name, first_name, last_name, nip, email, phone, 
        website, address_street, address_building, address_apartment, 
        address_city, address_postal_code, address_country
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        supplier.id_supplier, supplier.company_name, supplier.first_name, supplier.last_name,
        supplier.nip, supplier.email, supplier.phone, supplier.website,
        supplier.address_street, supplier.address_building, supplier.address_apartment,
        supplier.address_city, supplier.address_postal_code, supplier.address_country
      ]
    );
    
    return await getSupplierById(supplier.id_supplier);
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
  supplier: Partial<Omit<LoginTableSuppliers, 'id_supplier' | 'created_at' | 'updated_at'>>
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
    
    await connection.execute(
      `UPDATE login_table_suppliers SET ${updates.join(', ')} WHERE id_supplier = ?`,
      values
    );
    
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
    const [result] = await connection.execute<ResultSetHeader>(
      'DELETE FROM login_table_suppliers WHERE id_supplier = ?',
      [id_supplier]
    );
    
    return result.affectedRows > 0;
  } finally {
    connection.release();
  }
}; 