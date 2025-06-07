// shared-types/UserProfile.ts
export interface UserProfile {
  // === CORE IDENTITY ===
  id: string; // Unikalny identyfikator profilu
  profile_code: string; // Kod profilu (np. "PROF_001")
  created_at: Date; // Data utworzenia
  updated_at: Date; // Ostatnia aktualizacja
  status: ProfileStatus; // Status profilu

  // === PERSONAL DATA ===
  first_name: string; // Imię
  last_name: string; // Nazwisko
  full_name: string; // Pełne imię i nazwisko (computed)
  gender: Gender; // Płeć
  date_of_birth: Date; // Data urodzenia
  age: number; // Wiek (computed)
  nationality: string; // Narodowość

  // === CONTACT INFO ===
  primary_email: string; // Główny adres email
  primary_email_password: string; // Hasło do głównego emaila
  secondary_email?: string; // Pomocniczy email
  secondary_email_password?: string; // Hasło do pomocniczego emaila
  phone_number: string; // Numer telefonu
  phone_country_code: string; // Kod kraju telefonu

  // === LOCATION DATA ===
  city: string; // Miasto
  postal_code: string; // Kod pocztowy
  region: string; // Województwo/Region
  country: string; // Kraj
  country_code: string; // Kod kraju (ISO)
  address_line_1?: string; // Ulica i numer
  address_line_2?: string; // Mieszkanie/lokal
  coordinates?: {
    // Współrzędne geograficzne
    latitude: number;
    longitude: number;
  };
  location_notes?: string; // Uwagi dotyczące lokalizacji

  // === PERSONAL INTERESTS ===
  interests: string[]; // Zainteresowania/hobby
  education_level: EducationLevel; // Poziom wykształcenia
  job_title?: string; // Stanowisko pracy
  job_industry?: string; // Branża
  job_company?: string; // Nazwa firmy
  income_level?: IncomeLevel; // Poziom dochodów

  // === LANGUAGE & CULTURE ===
  primary_language: string; // Główny język
  secondary_languages: string[]; // Dodatkowe języki
  timezone: string; // Strefa czasowa
  locale: string; // Ustawienia regionalne

  // === DIGITAL IDENTITY ===
  username_preferences: string[]; // Preferowane nazwy użytkownika
  password_pattern?: string; // Wzorzec hasła (zaszyfrowany)
  security_questions?: SecurityQuestion[]; // Pytania bezpieczeństwa

  // === PHOTOS & MEDIA ===
  photos: ProfilePhoto[]; // Zdjęcia profilu
  avatar_url?: string; // Główne zdjęcie profilowe

  // === METADATA ===
  data_source: DataSource; // Źródło danych
  verification_status: VerificationStatus; // Status weryfikacji
  risk_level: RiskLevel; // Poziom ryzyka
  notes?: string; // Dodatkowe notatki
  tags: string[]; // Tagi do kategoryzacji
}

// === ENUMS & TYPES ===
export enum ProfileStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  SUSPENDED = "suspended",
  ARCHIVED = "archived",
}

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
  PREFER_NOT_TO_SAY = "prefer_not_to_say",
}

export enum EducationLevel {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  VOCATIONAL = "vocational",
  BACHELOR = "bachelor",
  MASTER = "master",
  DOCTORATE = "doctorate",
}

export enum IncomeLevel {
  LOW = "low", // < 3000 PLN
  MEDIUM_LOW = "medium_low", // 3000-5000 PLN
  MEDIUM = "medium", // 5000-8000 PLN
  MEDIUM_HIGH = "medium_high", // 8000-12000 PLN
  HIGH = "high", // > 12000 PLN
}

export enum DataSource {
  GENERATED = "generated",
  IMPORTED = "imported",
  MANUAL = "manual",
  API = "api",
}

export enum VerificationStatus {
  UNVERIFIED = "unverified",
  PARTIAL = "partial",
  VERIFIED = "verified",
  FAILED = "failed",
}

export enum RiskLevel {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

// === SUPPORTING INTERFACES ===
export interface SecurityQuestion {
  question: string;
  answer: string;
  encrypted: boolean;
}

export interface ProfilePhoto {
  id: string;
  filename: string;
  url: string;
  type: PhotoType;
  width: number;
  height: number;
  file_size: number;
  created_at: Date;
  is_primary: boolean;
}

export enum PhotoType {
  AVATAR = "avatar",
  PROFILE = "profile",
  BACKGROUND = "background",
  DOCUMENT = "document",
}

// === FRONTEND LABELS (Polish) ===
export const FIELD_LABELS: Record<keyof UserProfile, string> = {
  id: "Identyfikator",
  profile_code: "Kod profilu",
  created_at: "Data utworzenia",
  updated_at: "Ostatnia aktualizacja",
  status: "Status",

  first_name: "Imię",
  last_name: "Nazwisko",
  full_name: "Imię i nazwisko",
  gender: "Płeć",
  date_of_birth: "Data urodzenia",
  age: "Wiek",
  nationality: "Narodowość",

  primary_email: "Główny email",
  primary_email_password: "Hasło głównego emaila",
  secondary_email: "Pomocniczy email",
  secondary_email_password: "Hasło pomocniczego emaila",
  phone_number: "Numer telefonu",
  phone_country_code: "Kod kraju",

  city: "Miasto",
  postal_code: "Kod pocztowy",
  region: "Województwo",
  country: "Kraj",
  country_code: "Kod kraju",
  address_line_1: "Ulica i numer",
  address_line_2: "Mieszkanie/lokal",
  coordinates: "Współrzędne",
  location_notes: "Uwagi lokalizacyjne",

  interests: "Zainteresowania",
  education_level: "Wykształcenie",
  job_title: "Stanowisko",
  job_industry: "Branża",
  job_company: "Firma",
  income_level: "Poziom dochodów",

  primary_language: "Główny język",
  secondary_languages: "Dodatkowe języki",
  timezone: "Strefa czasowa",
  locale: "Ustawienia regionalne",

  username_preferences: "Preferowane nazwy użytkownika",
  password_pattern: "Wzorzec hasła",
  security_questions: "Pytania bezpieczeństwa",

  photos: "Zdjęcia",
  avatar_url: "Zdjęcie profilowe",

  data_source: "Źródło danych",
  verification_status: "Status weryfikacji",
  risk_level: "Poziom ryzyka",
  notes: "Notatki",
  tags: "Tagi",
};

// === VALIDATION SCHEMAS ===
export const VALIDATION_RULES = {
  first_name: { min: 2, max: 50, pattern: /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-']+$/ },
  last_name: { min: 2, max: 50, pattern: /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-']+$/ },
  primary_email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  phone_number: { pattern: /^\+?[1-9]\d{1,14}$/ },
  postal_code: { pattern: /^\d{2}-\d{3}$/ }, // Polish format
} as const;

// Dodaj tu inne typy, których używasz w projekcie
