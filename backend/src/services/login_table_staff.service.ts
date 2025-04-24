import pool from '../db';
import { LoginTableStaff } from '../models/login_table_staff.model';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

/**
 * Pobiera wszystkich pracowników
 * @returns Lista pracowników
 */
export const getAllStaff = async (): Promise<LoginTableStaff[]> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM login_table_staff'
    );
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
    const [rows] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM login_table_staff WHERE id_staff = ?',
      [id_staff]
    );
    return rows.length > 0 ? rows[0] as LoginTableStaff : null;
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
    const [rows] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM login_table_staff WHERE email = ?',
      [email]
    );
    return rows.length > 0 ? rows[0] as LoginTableStaff : null;
  } finally {
    connection.release();
  }
};

/**
 * Tworzy nowego pracownika
 * @param staff Dane nowego pracownika
 * @returns Dane utworzonego pracownika
 */
export const createStaff = async (staff: Omit<LoginTableStaff, 'created_at' | 'updated_at'>): Promise<LoginTableStaff | null> => {
  const connection = await pool.getConnection();
  try {
    await connection.execute(
      'INSERT INTO login_table_staff (id_staff, first_name, last_name, role, email, phone) VALUES (?, ?, ?, ?, ?, ?)',
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
  staff: Partial<Omit<LoginTableStaff, 'id_staff' | 'created_at' | 'updated_at'>>
): Promise<LoginTableStaff | null> => {
  const connection = await pool.getConnection();
  try {
    const updates: string[] = [];
    const values: any[] = [];
    
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
      return await getStaffById(id_staff);
    }
    
    values.push(id_staff);
    
    await connection.execute(
      `UPDATE login_table_staff SET ${updates.join(', ')} WHERE id_staff = ?`,
      values
    );
    
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
    const [result] = await connection.execute<ResultSetHeader>(
      'DELETE FROM login_table_staff WHERE id_staff = ?',
      [id_staff]
    );
    
    return result.affectedRows > 0;
  } finally {
    connection.release();
  }
}; 