import axiosInstance from "./axios";

// Interfejs dla modelu danych dostawcy bazujący na login_table_suppliers
export interface Dostawca {
  id_supplier: string;
  company_name: string;
  first_name: string;
  last_name: string;
  nip: string;
  email: string;
  phone: string;
  website: string | null;
  address_street: string;
  address_building: string;
  address_apartment: string | null;
  address_city: string;
  address_postal_code: string;
  address_country: string;
  created_at: string;
  updated_at: string;
}

// Typ dla nowego dostawcy (bez dat)
export type NowyDostawca = Omit<Dostawca, "created_at" | "updated_at">;

// Typ dla aktualizacji dostawcy (częściowe dane, bez ID i dat)
export type AktualizacjaDostawcy = Partial<Omit<Dostawca, "id_supplier" | "created_at" | "updated_at">>;

// Typ dla nowego dostawcy bez ID (generowane automatycznie)
export type NowyDostawcaBezId = Omit<NowyDostawca, "id_supplier">;

/**
 * Generuje ID dostawcy
 * @returns Wygenerowane ID lub pusty string w przypadku błędu
 */
export const generujIdDostawcy = async (): Promise<string> => {
  try {
    const response = await axiosInstance.get(`/suppliers/generate-id`);
    return response.data.id_supplier;
  } catch (error) {
    console.error("Błąd podczas generowania ID dostawcy:", error);
    return "";
  }
};

/**
 * Pobiera wszystkich dostawców
 * @returns Lista dostawców
 */
export const pobierzDostawcow = async (): Promise<Dostawca[]> => {
  try {
    const response = await axiosInstance.get("/suppliers");
    return response.data;
  } catch (error) {
    console.error("Błąd podczas pobierania dostawców:", error);
    return [];
  }
};

/**
 * Pobiera dostawcę po ID
 * @param id Identyfikator dostawcy
 * @returns Dane dostawcy lub null w przypadku błędu
 */
export const pobierzDostawce = async (id: string): Promise<Dostawca | null> => {
  try {
    const response = await axiosInstance.get(`/suppliers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Błąd podczas pobierania dostawcy o ID ${id}:`, error);
    return null;
  }
};

/**
 * Dodaje nowego dostawcę
 * @param dostawca Dane nowego dostawcy
 * @returns Dane utworzonego dostawcy lub null w przypadku błędu
 */
export const dodajDostawce = async (dostawca: NowyDostawca): Promise<Dostawca | null> => {
  try {
    const response = await axiosInstance.post("/suppliers", dostawca);
    return response.data;
  } catch (error) {
    console.error("Błąd podczas dodawania dostawcy:", error);
    return null;
  }
};

/**
 * Aktualizuje dane dostawcy
 * @param id Identyfikator dostawcy
 * @param dane Dane do aktualizacji
 * @returns Zaktualizowane dane dostawcy lub null w przypadku błędu
 */
export const aktualizujDostawce = async (id: string, dane: AktualizacjaDostawcy): Promise<Dostawca | null> => {
  try {
    const response = await axiosInstance.put(`/suppliers/${id}`, dane);
    return response.data;
  } catch (error) {
    console.error(`Błąd podczas aktualizacji dostawcy o ID ${id}:`, error);
    return null;
  }
};

/**
 * Usuwa dostawcę
 * @param id Identyfikator dostawcy
 * @returns True jeśli usunięto, false w przypadku błędu
 */
export const usunDostawce = async (id: string): Promise<boolean> => {
  try {
    const encodedId = encodeURIComponent(id);
    await axiosInstance.delete(`/suppliers/${encodedId}`);
    return true;
  } catch (error) {
    console.error(`Błąd podczas usuwania dostawcy o ID ${id}:`, error);
    return false;
  }
};

/**
 * Dodaje nowego dostawcę z automatycznie wygenerowanym hasłem
 * @param dostawca Dane nowego dostawcy (bez ID)
 * @returns Dane utworzonego dostawcy wraz z wygenerowanym hasłem lub null w przypadku błędu
 */
export const dodajDostawceZHaslem = async (
  dostawca: NowyDostawcaBezId
): Promise<(Dostawca & { password: string }) | null> => {
  try {
    const response = await axiosInstance.post("/suppliers/with-password", dostawca);
    return response.data;
  } catch (error) {
    console.error("Błąd podczas dodawania dostawcy z hasłem:", error);
    return null;
  }
};
