/**
 * Model danych dla tabeli login_auth_data
 * Tabela zawierająca podstawowe dane do logowania i autoryzacji użytkowników
 */

export type UserRole = "admin" | "staff" | "supplier";

export interface LoginAuthData {
  id_login: string; // Identyfikator logowania (np. ADM/00001/LOG)
  related_id: string; // Powiązany identyfikator użytkownika (ADM/00001, STF/00001, SUP/00001)
  email: string; // Adres email
  password_hash: string; // Zahaszowane hasło
  role: UserRole; // Rola użytkownika (admin, staff, supplier)
  failed_login_attempts: number; // Liczba nieudanych prób logowania
  locked_until: Date | null; // Zablokowane do
  last_login: Date | null; // Ostatnie logowanie
  created_at: Date; // Data utworzenia
  updated_at: Date; // Data aktualizacji
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  userRole?: UserRole;
  userId?: string;
  error?: string;
}
