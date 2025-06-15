import pool from "../db";
import { LoginAuthData } from "../models/login_auth_data.model";
import { RowDataPacket } from "mysql2";
import bcrypt from "bcrypt";

/**
 * Pobiera dane uwierzytelniania użytkownika na podstawie adresu email
 * @param email Adres email użytkownika
 * @returns Dane uwierzytelniania lub null, jeśli nie znaleziono
 */
export const getAuthDataByEmail = async (email: string): Promise<LoginAuthData | null> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query<RowDataPacket[]>("SELECT * FROM login_auth_data WHERE email = ?", [email]);
    return rows.length > 0 ? (rows[0] as LoginAuthData) : null;
  } finally {
    connection.release();
  }
};

/**
 * Pobiera dane uwierzytelniania użytkownika na podstawie identyfikatora logowania
 * @param id_login Identyfikator logowania
 * @returns Dane uwierzytelniania lub null, jeśli nie znaleziono
 */
export const getAuthDataById = async (id_login: string): Promise<LoginAuthData | null> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query<RowDataPacket[]>("SELECT * FROM login_auth_data WHERE id_login = ?", [
      id_login,
    ]);
    return rows.length > 0 ? (rows[0] as LoginAuthData) : null;
  } finally {
    connection.release();
  }
};

/**
 * Aktualizuje datę ostatniego logowania użytkownika
 * @param id_login Identyfikator logowania
 */
export const updateLastLogin = async (id_login: string): Promise<void> => {
  const connection = await pool.getConnection();
  try {
    await connection.execute("UPDATE login_auth_data SET last_login = CURRENT_TIMESTAMP WHERE id_login = ?", [
      id_login,
    ]);
  } finally {
    connection.release();
  }
};

/**
 * Zwiększa licznik nieudanych prób logowania
 * @param id_login Identyfikator logowania
 * @returns Zaktualizowaną liczbę nieudanych prób logowania
 */
export const incrementFailedLoginAttempts = async (id_login: string): Promise<number> => {
  const connection = await pool.getConnection();
  try {
    await connection.execute(
      "UPDATE login_auth_data SET failed_login_attempts = failed_login_attempts + 1 WHERE id_login = ?",
      [id_login]
    );

    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT failed_login_attempts FROM login_auth_data WHERE id_login = ?",
      [id_login]
    );

    return rows.length > 0 ? (rows[0].failed_login_attempts as number) : 0;
  } finally {
    connection.release();
  }
};

/**
 * Resetuje licznik nieudanych prób logowania
 * @param id_login Identyfikator logowania
 */
export const resetFailedLoginAttempts = async (id_login: string): Promise<void> => {
  const connection = await pool.getConnection();
  try {
    await connection.execute(
      "UPDATE login_auth_data SET failed_login_attempts = 0, locked_until = NULL WHERE id_login = ?",
      [id_login]
    );
  } finally {
    connection.release();
  }
};

/**
 * Ustawia blokadę konta do określonego czasu
 * @param id_login Identyfikator logowania
 * @param minutes Liczba minut blokady
 */
export const lockAccount = async (id_login: string, minutes: number): Promise<void> => {
  const connection = await pool.getConnection();
  try {
    await connection.execute(
      "UPDATE login_auth_data SET locked_until = DATE_ADD(CURRENT_TIMESTAMP, INTERVAL ? MINUTE) WHERE id_login = ?",
      [minutes, id_login]
    );
  } finally {
    connection.release();
  }
};

/**
 * Weryfikuje hasło użytkownika
 * @param plainPassword Hasło w postaci jawnej
 * @param hashedPassword Zahaszowane hasło z bazy danych
 * @returns True, jeśli hasło jest poprawne, w przeciwnym razie false
 */
export const verifyPassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
