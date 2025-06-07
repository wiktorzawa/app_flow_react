# 🚀 Profile Generator API - Przykłady użycia

## 📝 Generowanie Profili

### 1. Wygeneruj pojedynczy profil

```bash
curl -X POST http://localhost:3001/api/profiles/generate \
  -H "Content-Type: application/json" \
  -d '{
    "city": "Kraków",
    "status": "active"
  }'
```

**Odpowiedź:**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "profile_code": "PROF_L8Q2X3_A7B",
    "first_name": "Anna",
    "last_name": "Kowalska",
    "full_name": "Anna Kowalska",
    "age": 28,
    "gender": "female",
    "city": "Kraków",
    "primary_email": "anna.kowalska@gmail.com",
    "phone_number": "+48601234567",
    "interests": ["Podróże", "Fotografia", "Sport"],
    "job_title": "Programista",
    "status": "active"
  }
}
```

### 2. Wygeneruj wiele profili naraz

```bash
curl -X POST http://localhost:3001/api/profiles/generate/batch \
  -H "Content-Type: application/json" \
  -d '{"count": 50}'
```

## 📷 Zarządzanie Zdjęciami

### 3. Upload zdjęcia profilowego

```bash
curl -X POST http://localhost:3001/api/profiles/550e8400-e29b-41d4-a716-446655440000/photos \
  -F "photo=@/path/to/photo.jpg"
```

### 4. Wygeneruj AI avatar

```bash
curl -X POST http://localhost:3001/api/profiles/550e8400-e29b-41d4-a716-446655440000/avatar/generate \
  -H "Content-Type: application/json" \
  -d '{
    "gender": "female",
    "age": 28,
    "ethnicity": "white"
  }'
```

## 🔍 Zapytania o Profile

### 5. Pobierz profile z filtrami

```bash
curl -X GET "http://localhost:3001/api/profiles?city=Warszawa&age_min=25&age_max=35&status=active&page=1&limit=10"
```

## 💾 Baza Danych - Przykłady SQL

### 6. Stwórz tabele (SQL)

```sql
-- Uruchom migrację
SOURCE backend/database/migrations/001_create_user_profiles.sql;
```

### 7. Zapytania SQL

```sql
-- Wszystkie profile z Warszawy
SELECT * FROM user_profiles WHERE city = 'Warszawa';

-- Profile z AI-generated avatarami
SELECT up.*, pp.url as avatar_url
FROM user_profiles up
LEFT JOIN profile_photos pp ON up.id = pp.profile_id
WHERE pp.type = 'avatar';

-- Statystyki demograficzne
SELECT
  city,
  gender,
  COUNT(*) as count,
  AVG(age) as avg_age
FROM user_profiles
GROUP BY city, gender;
```

## 🎯 Frontend - Przykłady TypeScript

### 8. Używanie typów w React

```typescript
import { UserProfile, ProfileStatus } from '@shared-types/UserProfile';

const MyComponent: FC = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);

  const generateProfile = async () => {
    const response = await fetch('/api/profiles/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        city: 'Gdańsk',
        status: ProfileStatus.ACTIVE
      })
    });

    const result = await response.json();
    if (result.success) {
      setProfiles(prev => [...prev, result.data]);
    }
  };

  return (
    <div>
      {profiles.map(profile => (
        <div key={profile.id}>
          <h3>{profile.full_name}</h3>
          <p>{profile.city}, wiek: {profile.age}</p>
          <p>Email: {profile.primary_email}</p>
        </div>
      ))}
    </div>
  );
};
```

## 🔧 Konfiguracja Środowiska

### 9. Zmienne środowiskowe (.env)

```bash
# Backend
DATABASE_URL=mysql://user:password@localhost:3306/profiles_db
UPLOAD_DIR=./uploads/profiles
JWT_SECRET=your-secret-key

# Photo APIs
UNSPLASH_API_KEY=your-unsplash-key
GENERATED_PHOTOS_API_KEY=your-api-key
```

### 10. Uruchomienie systemu

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd ..
npm install
npm run dev
```

## 📊 Przykładowe dane wygenerowane

### Profile demographics dla Warszawy:

- **Średni wiek**: 32 lata
- **Podział płci**: 52% kobiety, 48% mężczyźni
- **Wykształcenie**: 45% wyższe, 35% średnie, 20% zawodowe
- **Główne branże**: IT (25%), Finanse (20%), Marketing (15%)

### Realistic email patterns:

- `imie.nazwisko@domena.pl`
- `imienazwisko@domena.pl`
- `imie_nazwisko@domena.pl`
- `imie123@domena.pl`

### Telefony polskie:

- Format: `+48XXXXXXXXX`
- Prefiksy: 50, 51, 53, 57, 60, 66, 69, 72, 73, 78, 79, 88

## 🎉 **GOTOWY SYSTEM - JAK TO DZIAŁA W PRAKTYCE**

### **🚀 WORKFLOW UŻYTKOWNIKA:**

#### **1. Backend Developer:**

```typescript
// Importuje typy z shared-types
import { UserProfile, ProfileStatus } from "@shared-types/UserProfile";

// Tworzy kontroler
const generator = new ProfileDataGenerator();
const profile = await generator.generateUserProfile({
  city: "Warszawa",
  status: ProfileStatus.ACTIVE,
});
```

#### **2. Frontend Developer:**

```typescript
// Te same typy!
import { UserProfile, ProfileStatus } from "@shared-types/UserProfile";

// TypeScript wie dokładnie czego oczekiwać
const [profiles, setProfiles] = useState<UserProfile[]>([]);
```

#### **3. API Endpoints:**

```bash
# Wygeneruj profil
POST /api/profiles/generate

# Upload zdjęcia
POST /api/profiles/:id/photos

# AI avatar
POST /api/profiles/:id/avatar/generate

# Pobierz z filtrami
GET /api/profiles?city=Warszawa&age_min=25
```

### **💾 DATABASE SCHEMA:**

```sql
-- Jedna unifikowana tabela zamiast kilku
user_profiles:
├── Dane osobowe (first_name, last_name, age...)
├── Lokalizacja (city, region, coordinates...)
├── Kontakt (primary_email, phone_number...)
├── Zawód (job_title, job_industry, income_level...)
├── Cyfrowa tożsamość (username_preferences...)
└── Zdjęcia (avatar_url, photos_count...)
```

### **🎯 REALISTYCZNE DANE:**

- **Polskie imiona i nazwiska**
- **Prawdziwe kody pocztowe**
- **Spójne profile demograficzne**
- **Realistyczne emaile** (anna.kowalski@wp.pl)
- **Prawdziwe numery tel.** (+48601234567)
- **AI-generated avatary**

### **📱 FRONTEND UI (Flowbite):**

- **Tabela profili** z filtrami
- **Upload zdjęć** (drag & drop)
- **Generowanie AI avatarów** (1 klik)
- **Batch generation** (10, 50, 100 profili)
- **Dark mode** support

### **🔧 DEVELOPMENT WORKFLOW:**

```bash
# 1. Backend development
cd backend
npm run dev  # TypeScript + hot reload

# 2. Frontend development
npm run dev  # Vite + React + Flowbite

# 3. Test API
curl -X POST localhost:3001/api/profiles/generate

# 4. Database migration
mysql < backend/database/migrations/001_create_user_profiles.sql
```

### **✅ CO ZYSKUJESZ:**

1. **🎯 Type Safety** - Te same typy w całej aplikacji
2. **🚀 Realistic Data** - Spójne dane polskie z faker.js
3. **📷 Photo Management** - Upload + AI avatary + processing
4. **💾 Unified Schema** - Jedna tabela zamiast kilku
5. **🌍 Internationalization** - Polski frontend + English database
6. **⚡ Performance** - Batch generation + optymalizacja zdjęć
7. **🛡️ Validation** - Zod schemas + TypeScript strict mode

### **📊 PRZYKŁADOWY REZULTAT:**

```json
{
  "id": "uuid-here",
  "profile_code": "PROF_L8Q2X3_A7B",
  "first_name": "Anna",
  "last_name": "Kowalska",
  "age": 28,
  "city": "Kraków",
  "primary_email": "anna.kowalska@gmail.com",
  "phone_number": "+48601234567",
  "job_title": "Programista",
  "interests": ["Podróże", "Fotografia", "Sport"],
  "avatar_url": "https://generated-avatar.url",
  "status": "active"
}
```

**Teraz masz kompletny, działający system do generowania realistycznych profili użytkowników z polskimi danymi, zarządzaniem zdjęć i unifikowaną strukturą bazy danych!** 🎉
