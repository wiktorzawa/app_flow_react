"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VALIDATION_RULES = exports.FIELD_LABELS = exports.PhotoType = exports.RiskLevel = exports.VerificationStatus = exports.DataSource = exports.IncomeLevel = exports.EducationLevel = exports.Gender = exports.ProfileStatus = void 0;
// === ENUMS & TYPES ===
var ProfileStatus;
(function (ProfileStatus) {
    ProfileStatus["DRAFT"] = "draft";
    ProfileStatus["ACTIVE"] = "active";
    ProfileStatus["SUSPENDED"] = "suspended";
    ProfileStatus["ARCHIVED"] = "archived";
})(ProfileStatus || (exports.ProfileStatus = ProfileStatus = {}));
var Gender;
(function (Gender) {
    Gender["MALE"] = "male";
    Gender["FEMALE"] = "female";
    Gender["OTHER"] = "other";
    Gender["PREFER_NOT_TO_SAY"] = "prefer_not_to_say";
})(Gender || (exports.Gender = Gender = {}));
var EducationLevel;
(function (EducationLevel) {
    EducationLevel["PRIMARY"] = "primary";
    EducationLevel["SECONDARY"] = "secondary";
    EducationLevel["VOCATIONAL"] = "vocational";
    EducationLevel["BACHELOR"] = "bachelor";
    EducationLevel["MASTER"] = "master";
    EducationLevel["DOCTORATE"] = "doctorate";
})(EducationLevel || (exports.EducationLevel = EducationLevel = {}));
var IncomeLevel;
(function (IncomeLevel) {
    IncomeLevel["LOW"] = "low";
    IncomeLevel["MEDIUM_LOW"] = "medium_low";
    IncomeLevel["MEDIUM"] = "medium";
    IncomeLevel["MEDIUM_HIGH"] = "medium_high";
    IncomeLevel["HIGH"] = "high";
})(IncomeLevel || (exports.IncomeLevel = IncomeLevel = {}));
var DataSource;
(function (DataSource) {
    DataSource["GENERATED"] = "generated";
    DataSource["IMPORTED"] = "imported";
    DataSource["MANUAL"] = "manual";
    DataSource["API"] = "api";
})(DataSource || (exports.DataSource = DataSource = {}));
var VerificationStatus;
(function (VerificationStatus) {
    VerificationStatus["UNVERIFIED"] = "unverified";
    VerificationStatus["PARTIAL"] = "partial";
    VerificationStatus["VERIFIED"] = "verified";
    VerificationStatus["FAILED"] = "failed";
})(VerificationStatus || (exports.VerificationStatus = VerificationStatus = {}));
var RiskLevel;
(function (RiskLevel) {
    RiskLevel["LOW"] = "low";
    RiskLevel["MEDIUM"] = "medium";
    RiskLevel["HIGH"] = "high";
    RiskLevel["CRITICAL"] = "critical";
})(RiskLevel || (exports.RiskLevel = RiskLevel = {}));
var PhotoType;
(function (PhotoType) {
    PhotoType["AVATAR"] = "avatar";
    PhotoType["PROFILE"] = "profile";
    PhotoType["BACKGROUND"] = "background";
    PhotoType["DOCUMENT"] = "document";
})(PhotoType || (exports.PhotoType = PhotoType = {}));
// === FRONTEND LABELS (Polish) ===
exports.FIELD_LABELS = {
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
exports.VALIDATION_RULES = {
    first_name: { min: 2, max: 50, pattern: /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-']+$/ },
    last_name: { min: 2, max: 50, pattern: /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-']+$/ },
    primary_email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    phone_number: { pattern: /^\+?[1-9]\d{1,14}$/ },
    postal_code: { pattern: /^\d{2}-\d{3}$/ }, // Polish format
};
