-- backend/database/migrations/001_create_user_profiles.sql
-- Migration: Create unified user profiles table (UP + L combined)

CREATE TABLE user_profiles (
  -- === CORE IDENTITY ===
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  profile_code VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  status ENUM('draft', 'active', 'suspended', 'archived') DEFAULT 'active',
  
  -- === PERSONAL DATA ===
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  full_name VARCHAR(200) GENERATED ALWAYS AS (CONCAT(first_name, ' ', last_name)) STORED,
  gender ENUM('male', 'female', 'other', 'prefer_not_to_say') NOT NULL,
  date_of_birth DATE NOT NULL,
  age INT GENERATED ALWAYS AS (FLOOR(DATEDIFF(CURDATE(), date_of_birth) / 365.25)) STORED,
  nationality VARCHAR(100) DEFAULT 'Polska',
  
  -- === CONTACT INFO ===
  primary_email VARCHAR(255) UNIQUE NOT NULL,
  primary_email_password VARCHAR(255) NOT NULL, -- Encrypted
  secondary_email VARCHAR(255) NULL,
  secondary_email_password VARCHAR(255) NULL, -- Encrypted
  phone_number VARCHAR(20) NOT NULL,
  phone_country_code VARCHAR(5) DEFAULT '+48',
  
  -- === LOCATION DATA ===
  city VARCHAR(100) NOT NULL,
  postal_code VARCHAR(10) NOT NULL,
  region VARCHAR(100) NOT NULL,
  country VARCHAR(100) DEFAULT 'Polska',
  country_code VARCHAR(2) DEFAULT 'PL',
  address_line_1 VARCHAR(255) NULL,
  address_line_2 VARCHAR(255) NULL,
  latitude DECIMAL(10, 8) NULL,
  longitude DECIMAL(11, 8) NULL,
  location_notes TEXT NULL,
  
  -- === PERSONAL INTERESTS ===
  interests JSON NULL, -- Array of interests
  education_level ENUM('primary', 'secondary', 'vocational', 'bachelor', 'master', 'doctorate') NOT NULL,
  job_title VARCHAR(200) NULL,
  job_industry VARCHAR(100) NULL,
  job_company VARCHAR(200) NULL,
  income_level ENUM('low', 'medium_low', 'medium', 'medium_high', 'high') NULL,
  
  -- === LANGUAGE & CULTURE ===
  primary_language VARCHAR(5) DEFAULT 'pl',
  secondary_languages JSON NULL, -- Array of language codes
  timezone VARCHAR(50) DEFAULT 'Europe/Warsaw',
  locale VARCHAR(10) DEFAULT 'pl_PL',
  
  -- === DIGITAL IDENTITY ===
  username_preferences JSON NULL, -- Array of preferred usernames
  password_pattern TEXT NULL, -- Encrypted pattern
  security_questions JSON NULL, -- Array of {question, answer, encrypted}
  
  -- === PHOTOS & MEDIA ===
  avatar_url VARCHAR(500) NULL,
  photos_count INT DEFAULT 0,
  
  -- === METADATA ===
  data_source ENUM('generated', 'imported', 'manual', 'api') DEFAULT 'generated',
  verification_status ENUM('unverified', 'partial', 'verified', 'failed') DEFAULT 'unverified',
  risk_level ENUM('low', 'medium', 'high', 'critical') DEFAULT 'low',
  notes TEXT NULL,
  tags JSON NULL, -- Array of tags
  
  -- === INDEXES ===
  INDEX idx_profile_code (profile_code),
  INDEX idx_email (primary_email),
  INDEX idx_phone (phone_number),
  INDEX idx_location (city, region, country_code),
  INDEX idx_status_risk (status, risk_level),
  INDEX idx_created_at (created_at),
  INDEX idx_demographics (gender, age, education_level),
  
  -- === CONSTRAINTS ===
  CONSTRAINT chk_age CHECK (age >= 18 AND age <= 100),
  CONSTRAINT chk_coordinates CHECK (
    (latitude IS NULL AND longitude IS NULL) OR 
    (latitude BETWEEN -90 AND 90 AND longitude BETWEEN -180 AND 180)
  )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Separate table for profile photos
CREATE TABLE profile_photos (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  profile_id VARCHAR(36) NOT NULL,
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL,
  type ENUM('avatar', 'profile', 'background', 'document') DEFAULT 'profile',
  width INT NULL,
  height INT NULL,
  file_size INT NULL, -- in bytes
  mime_type VARCHAR(100) NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (profile_id) REFERENCES user_profiles(id) ON DELETE CASCADE,
  INDEX idx_profile_photos (profile_id),
  INDEX idx_primary_photo (profile_id, is_primary),
  
  -- Ensure only one primary photo per profile
  UNIQUE KEY unique_primary_per_profile (profile_id, is_primary, type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table for field labels (internationalization)
CREATE TABLE field_labels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  field_name VARCHAR(100) NOT NULL,
  language_code VARCHAR(5) NOT NULL,
  label VARCHAR(255) NOT NULL,
  description TEXT NULL,
  
  UNIQUE KEY unique_field_lang (field_name, language_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Polish labels
INSERT INTO field_labels (field_name, language_code, label, description) VALUES
-- Core Identity
('id', 'pl', 'Identyfikator', 'Unikalny identyfikator profilu'),
('profile_code', 'pl', 'Kod profilu', 'Kod identyfikacyjny profilu'),
('status', 'pl', 'Status', 'Status profilu w systemie'),

-- Personal Data  
('first_name', 'pl', 'Imię', 'Imię użytkownika'),
('last_name', 'pl', 'Nazwisko', 'Nazwisko użytkownika'),
('full_name', 'pl', 'Imię i nazwisko', 'Pełne imię i nazwisko'),
('gender', 'pl', 'Płeć', 'Płeć użytkownika'),
('date_of_birth', 'pl', 'Data urodzenia', 'Data urodzenia użytkownika'),
('age', 'pl', 'Wiek', 'Wiek w latach'),
('nationality', 'pl', 'Narodowość', 'Narodowość użytkownika'),

-- Contact Info
('primary_email', 'pl', 'Główny email', 'Główny adres email'),
('secondary_email', 'pl', 'Pomocniczy email', 'Dodatkowy adres email'),
('phone_number', 'pl', 'Numer telefonu', 'Numer telefonu kontaktowego'),

-- Location  
('city', 'pl', 'Miasto', 'Miasto zamieszkania'),
('postal_code', 'pl', 'Kod pocztowy', 'Kod pocztowy'),
('region', 'pl', 'Województwo', 'Województwo/region'),
('country', 'pl', 'Kraj', 'Kraj zamieszkania'),

-- Professional
('education_level', 'pl', 'Wykształcenie', 'Poziom wykształcenia'),
('job_title', 'pl', 'Stanowisko', 'Stanowisko pracy'),
('job_industry', 'pl', 'Branża', 'Branża zawodowa'),
('job_company', 'pl', 'Firma', 'Nazwa firmy'),
('income_level', 'pl', 'Poziom dochodów', 'Poziom miesięcznych dochodów'),

-- Digital Identity
('username_preferences', 'pl', 'Preferowane nazwy użytkownika', 'Lista preferowanych nazw użytkownika'),
('security_questions', 'pl', 'Pytania bezpieczeństwa', 'Pytania zabezpieczające'),

-- Photos & Media
('avatar_url', 'pl', 'Zdjęcie profilowe', 'URL zdjęcia profilowego'),
('photos_count', 'pl', 'Liczba zdjęć', 'Liczba przesłanych zdjęć'),

-- Metadata
('data_source', 'pl', 'Źródło danych', 'Źródło pochodzenia danych'),
('verification_status', 'pl', 'Status weryfikacji', 'Status weryfikacji danych'),
('risk_level', 'pl', 'Poziom ryzyka', 'Ocena poziomu ryzyka profilu'),
('notes', 'pl', 'Notatki', 'Dodatkowe notatki'),
('tags', 'pl', 'Tagi', 'Tagi kategoryzacyjne');

-- Create view for easier frontend queries
CREATE VIEW user_profiles_view AS
SELECT 
  up.*,
  GROUP_CONCAT(pp.url ORDER BY pp.is_primary DESC, pp.created_at ASC) as photo_urls,
  COUNT(pp.id) as total_photos
FROM user_profiles up
LEFT JOIN profile_photos pp ON up.id = pp.profile_id
GROUP BY up.id; 