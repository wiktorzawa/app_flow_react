import axiosInstance from "./axios";

// Interfejs dla modelu danych pracownika bazujący na login_table_staff
export interface Pracownik {
  id_staff: string;
  first_name: string;
  last_name: string;
  role: "admin" | "staff";
  email: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

// Typ dla nowego pracownika (bez dat)
export type NowyPracownik = Omit<Pracownik, "created_at" | "updated_at">;

// Typ dla aktualizacji pracownika (częściowe dane, bez ID i dat)
export type AktualizacjaPracownika = Partial<Omit<Pracownik, "id_staff" | "created_at" | "updated_at">>;

// Typ dla nowego pracownika bez ID (generowane automatycznie)
export type NowyPracownikBezId = Omit<NowyPracownik, "id_staff">;

/**
 * Generuje ID pracownika na podstawie roli
 * @param role Rola pracownika ('admin' lub 'staff')
 * @returns Wygenerowane ID lub pusty string w przypadku błędu
 */
export const generujIdPracownika = async (role: "admin" | "staff"): Promise<string> => {
  try {
    const response = await axiosInstance.get(`/staff/generate-id?role=${role}`);
    return response.data.id_staff;
  } catch (error) {
    console.error("Błąd podczas generowania ID pracownika:", error);
    return "";
  }
};

/**
 * Dodaje nowego pracownika z automatycznie wygenerowanym ID i hasłem
 * @param pracownik Dane nowego pracownika (bez ID)
 * @returns Dane utworzonego pracownika lub null w przypadku błędu
 */
export const dodajPracownikaZHaslem = async (pracownik: NowyPracownikBezId): Promise<Pracownik | null> => {
  try {
    const response = await axiosInstance.post("/staff/with-password", pracownik);
    return response.data;
  } catch (error) {
    console.error("Błąd podczas dodawania pracownika z hasłem:", error);
    return null;
  }
};

/**
 * Pobiera wszystkich pracowników
 * @returns Lista pracowników
 */
export const pobierzPracownikow = async (): Promise<Pracownik[]> => {
  try {
    const response = await axiosInstance.get("/staff");
    return response.data;
  } catch (error) {
    console.error("Błąd podczas pobierania pracowników:", error);
    return [];
  }
};

/**
 * Pobiera pracownika po ID
 * @param id Identyfikator pracownika
 * @returns Dane pracownika lub null w przypadku błędu
 */
export const pobierzPracownika = async (id: string): Promise<Pracownik | null> => {
  try {
    const response = await axiosInstance.get(`/staff/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Błąd podczas pobierania pracownika o ID ${id}:`, error);
    return null;
  }
};

/**
 * Dodaje nowego pracownika
 * @param pracownik Dane nowego pracownika
 * @returns Dane utworzonego pracownika lub null w przypadku błędu
 */
export const dodajPracownika = async (pracownik: NowyPracownik): Promise<Pracownik | null> => {
  try {
    const response = await axiosInstance.post("/staff", pracownik);
    return response.data;
  } catch (error) {
    console.error("Błąd podczas dodawania pracownika:", error);
    return null;
  }
};

/**
 * Aktualizuje dane pracownika
 * @param id Identyfikator pracownika
 * @param dane Dane do aktualizacji
 * @returns Zaktualizowane dane pracownika lub null w przypadku błędu
 */
export const aktualizujPracownika = async (id: string, dane: AktualizacjaPracownika): Promise<Pracownik | null> => {
  try {
    const response = await axiosInstance.put(`/staff/${id}`, dane);
    return response.data;
  } catch (error) {
    console.error(`Błąd podczas aktualizacji pracownika o ID ${id}:`, error);
    return null;
  }
};

/**
 * Usuwa pracownika
 * @param id Identyfikator pracownika
 * @returns True jeśli usunięto, false w przypadku błędu
 */
export const usunPracownika = async (id: string): Promise<boolean> => {
  try {
    // Enkoduj ID w URL, aby uniknąć problemów z "/" w identyfikatorze
    const encodedId = encodeURIComponent(id);
    await axiosInstance.delete(`/staff/${encodedId}`);
    return true;
  } catch (error) {
    console.error(`Błąd podczas usuwania pracownika o ID ${id}:`, error);
    return false;
  }
};
