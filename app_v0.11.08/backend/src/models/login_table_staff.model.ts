/**
 * Model danych dla tabeli login_table_staff
 * Tabela zawierająca dane pracowników i administratorów
 */

export type StaffRole = "admin" | "staff";

export interface LoginTableStaff {
  id_staff: string; // Identyfikator pracownika (np. ADM/00001, STF/00001)
  first_name: string; // Imię pracownika
  last_name: string; // Nazwisko pracownika
  role: StaffRole; // Rola pracownika w systemie (admin, staff)
  email: string; // Adres email służbowy
  phone: string | null; // Numer telefonu
  created_at: Date; // Data utworzenia rekordu
  updated_at: Date; // Data aktualizacji rekordu
}
