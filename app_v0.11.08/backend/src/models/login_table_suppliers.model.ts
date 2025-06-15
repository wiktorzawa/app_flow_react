/**
 * Model danych dla tabeli login_table_suppliers
 * Tabela zawierająca dane dostawców
 */

export interface LoginTableSuppliers {
  id_supplier: string; // Identyfikator dostawcy (np. SUP/00001)
  company_name: string; // Nazwa firmy
  first_name: string; // Imię osoby kontaktowej
  last_name: string; // Nazwisko osoby kontaktowej
  nip: string; // Numer NIP
  email: string; // Adres email
  phone: string; // Numer telefonu
  website: string | null; // Strona internetowa
  address_street: string; // Ulica
  address_building: string; // Numer budynku
  address_apartment: string | null; // Numer lokalu
  address_city: string; // Miejscowość
  address_postal_code: string; // Kod pocztowy
  address_country: string; // Kraj
  created_at: Date; // Data utworzenia rekordu
  updated_at: Date; // Data aktualizacji rekordu
}
