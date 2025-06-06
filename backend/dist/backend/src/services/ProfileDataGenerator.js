"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileDataGenerator = void 0;
const UserProfile_1 = require("@shared-types/UserProfile");
const pl_1 = require("@faker-js/faker/locale/pl");
const crypto_1 = __importDefault(require("crypto"));
class ProfileDataGenerator {
    constructor() {
        this.polishCities = [
            {
                city: "Warszawa",
                region: "Mazowieckie",
                postal_code: "02-777",
                coordinates: { latitude: 52.2297, longitude: 21.0122 },
                typical_demographics: {
                    avg_age_range: [25, 45],
                    income_distribution: {
                        [UserProfile_1.IncomeLevel.LOW]: 0.15,
                        [UserProfile_1.IncomeLevel.MEDIUM_LOW]: 0.25,
                        [UserProfile_1.IncomeLevel.MEDIUM]: 0.3,
                        [UserProfile_1.IncomeLevel.MEDIUM_HIGH]: 0.2,
                        [UserProfile_1.IncomeLevel.HIGH]: 0.1,
                    },
                    education_distribution: {
                        [UserProfile_1.EducationLevel.PRIMARY]: 0.05,
                        [UserProfile_1.EducationLevel.SECONDARY]: 0.25,
                        [UserProfile_1.EducationLevel.VOCATIONAL]: 0.2,
                        [UserProfile_1.EducationLevel.BACHELOR]: 0.3,
                        [UserProfile_1.EducationLevel.MASTER]: 0.15,
                        [UserProfile_1.EducationLevel.DOCTORATE]: 0.05,
                    },
                },
            },
            {
                city: "Kraków",
                region: "Małopolskie",
                postal_code: "31-909",
                coordinates: { latitude: 50.0647, longitude: 19.945 },
                typical_demographics: {
                    avg_age_range: [22, 40],
                    income_distribution: {
                        [UserProfile_1.IncomeLevel.LOW]: 0.2,
                        [UserProfile_1.IncomeLevel.MEDIUM_LOW]: 0.3,
                        [UserProfile_1.IncomeLevel.MEDIUM]: 0.25,
                        [UserProfile_1.IncomeLevel.MEDIUM_HIGH]: 0.15,
                        [UserProfile_1.IncomeLevel.HIGH]: 0.1,
                    },
                    education_distribution: {
                        [UserProfile_1.EducationLevel.PRIMARY]: 0.08,
                        [UserProfile_1.EducationLevel.SECONDARY]: 0.3,
                        [UserProfile_1.EducationLevel.VOCATIONAL]: 0.22,
                        [UserProfile_1.EducationLevel.BACHELOR]: 0.25,
                        [UserProfile_1.EducationLevel.MASTER]: 0.12,
                        [UserProfile_1.EducationLevel.DOCTORATE]: 0.03,
                    },
                },
            },
        ];
        this.polishFirstNames = {
            [UserProfile_1.Gender.MALE]: [
                "Aleksander",
                "Antoni",
                "Bartosz",
                "Damian",
                "Filip",
                "Jakub",
                "Jan",
                "Kacper",
                "Kamil",
                "Krzysztof",
                "Łukasz",
                "Maciej",
                "Marcin",
                "Mateusz",
                "Michał",
                "Paweł",
                "Piotr",
                "Przemysław",
                "Radosław",
                "Robert",
                "Sebastian",
                "Szymon",
                "Tomasz",
                "Wojciech",
            ],
            [UserProfile_1.Gender.FEMALE]: [
                "Agnieszka",
                "Anna",
                "Aleksandra",
                "Barbara",
                "Ewa",
                "Joanna",
                "Justyna",
                "Karina",
                "Katarzyna",
                "Magdalena",
                "Małgorzata",
                "Maria",
                "Martyna",
                "Monika",
                "Natalia",
                "Patrycja",
                "Paulina",
                "Sandra",
                "Sylwia",
                "Weronika",
                "Zuzanna",
                "Żaneta",
            ],
            [UserProfile_1.Gender.OTHER]: ["Alex", "Jordan", "Casey", "Riley"],
            [UserProfile_1.Gender.PREFER_NOT_TO_SAY]: ["Pat", "Sam", "Taylor"],
        };
        this.polishLastNames = [
            "Nowak",
            "Kowalski",
            "Wiśniewski",
            "Dąbrowski",
            "Lewandowski",
            "Wójcik",
            "Kamiński",
            "Kowalczyk",
            "Zieliński",
            "Szymański",
            "Woźniak",
            "Kozłowski",
            "Jankowski",
            "Mazur",
            "Krawczyk",
            "Kaczmarek",
            "Piotrowski",
            "Grabowski",
            "Nowakowski",
            "Pawłowski",
            "Michalski",
            "Adamczyk",
            "Dudek",
            "Zając",
            "Wieczorek",
            "Jabłoński",
            "Król",
            "Majewski",
            "Olszewski",
        ];
        this.jobTitlesByIndustry = {
            IT: ["Programista", "Analityk", "DevOps Engineer", "Product Manager", "UX Designer"],
            Finansje: ["Księgowy", "Analityk finansowy", "Doradca finansowy", "Controller"],
            Marketing: ["Specjalista ds. marketingu", "Content Creator", "Performance Marketer"],
            Edukacja: ["Nauczyciel", "Wykładowca", "Trener", "Mentor"],
            Zdrowie: ["Lekarz", "Pielęgniarka", "Fizjoterapeuta", "Farmaceuta"],
            Handel: ["Sprzedawca", "Kierownik sklepu", "Przedstawiciel handlowy"],
            Produkcja: ["Operator maszyn", "Technolog", "Kierownik produkcji"],
        };
        this.interests = [
            "Podróże",
            "Fotografia",
            "Gotowanie",
            "Sport",
            "Muzyka",
            "Filmy",
            "Książki",
            "Gaming",
            "Technologia",
            "Moda",
            "Sztuka",
            "Historia",
            "Nauka języków",
            "Fitness",
            "Joga",
            "Piłka nożna",
            "Koszykówka",
            "Tenis",
            "Narty",
            "Kolarstwo",
            "Bieganie",
            "Pływanie",
        ];
    }
    /**
     * Generates a complete realistic user profile
     */
    generateUserProfile() {
        return __awaiter(this, arguments, void 0, function* (overrides = {}) {
            // Select random location
            const location = this.getRandomLocation();
            // Generate correlated demographics
            const demographics = this.generateDemographics(location);
            // Generate personal data
            const personalData = this.generatePersonalData(demographics);
            // Generate contact info
            const contactInfo = this.generateContactInfo(personalData);
            // Generate professional info
            const professionalInfo = this.generateProfessionalInfo(demographics);
            // Generate digital identity
            const digitalIdentity = this.generateDigitalIdentity(personalData);
            const profile = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ id: crypto_1.default.randomUUID(), profile_code: this.generateProfileCode(), created_at: new Date(), updated_at: new Date(), status: UserProfile_1.ProfileStatus.ACTIVE }, personalData), contactInfo), { 
                // Location
                city: location.city, postal_code: this.generatePostalCode(location.postal_code), region: location.region, country: "Polska", country_code: "PL", coordinates: {
                    latitude: location.coordinates.latitude + (Math.random() - 0.5) * 0.01,
                    longitude: location.coordinates.longitude + (Math.random() - 0.5) * 0.01,
                }, location_notes: `${location.city}, ${location.region}` }), professionalInfo), { interests: this.generateInterests(), 
                // Language & culture
                primary_language: "pl", secondary_languages: this.generateSecondaryLanguages(), timezone: "Europe/Warsaw", locale: "pl_PL" }), digitalIdentity), { 
                // Photos (will be generated separately)
                photos: [], avatar_url: yield this.generateAvatarUrl(personalData.gender, personalData.age), 
                // Metadata
                data_source: UserProfile_1.DataSource.GENERATED, verification_status: UserProfile_1.VerificationStatus.UNVERIFIED, risk_level: UserProfile_1.RiskLevel.LOW, notes: `Auto-generated profile for ${personalData.first_name} ${personalData.last_name}`, tags: ["generated", "synthetic", location.city.toLowerCase()] }), overrides);
            return profile;
        });
    }
    getRandomLocation() {
        return this.polishCities[Math.floor(Math.random() * this.polishCities.length)];
    }
    generateDemographics(location) {
        const [minAge, maxAge] = location.typical_demographics.avg_age_range;
        const age = pl_1.faker.number.int({ min: minAge, max: maxAge });
        const gender = Math.random() > 0.5 ? UserProfile_1.Gender.MALE : UserProfile_1.Gender.FEMALE;
        // Education level based on age and location demographics
        const education = this.weightedRandom(location.typical_demographics.education_distribution);
        // Income level correlated with education and age
        const income = this.generateIncomeLevel(education, age);
        return { age, gender, education, income };
    }
    generatePersonalData(demographics) {
        const firstName = this.getRandomFirstName(demographics.gender);
        const lastName = this.getRandomLastName();
        const dateOfBirth = new Date();
        dateOfBirth.setFullYear(dateOfBirth.getFullYear() - demographics.age);
        dateOfBirth.setMonth(Math.floor(Math.random() * 12));
        dateOfBirth.setDate(Math.floor(Math.random() * 28) + 1);
        return {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`,
            gender: demographics.gender,
            date_of_birth: dateOfBirth,
            age: demographics.age,
            nationality: "Polska",
            education_level: demographics.education,
        };
    }
    generateContactInfo(personalData) {
        const emailDomains = ["gmail.com", "wp.pl", "o2.pl", "onet.pl", "interia.pl"];
        const domain = emailDomains[Math.floor(Math.random() * emailDomains.length)];
        const normalizedFirstName = this.normalizePolishName(personalData.first_name);
        const normalizedLastName = this.normalizePolishName(personalData.last_name);
        const emailVariations = [
            `${normalizedFirstName}.${normalizedLastName}`,
            `${normalizedFirstName}${normalizedLastName}`,
            `${normalizedFirstName}_${normalizedLastName}`,
            `${normalizedFirstName}${Math.floor(Math.random() * 99)}`,
        ];
        const primaryEmail = `${emailVariations[0]}@${domain}`;
        const primaryPassword = this.generateSecurePassword();
        const secondaryEmail = Math.random() > 0.6
            ? `${emailVariations[1]}@${emailDomains[Math.floor(Math.random() * emailDomains.length)]}`
            : undefined;
        return {
            primary_email: primaryEmail,
            primary_email_password: primaryPassword,
            secondary_email: secondaryEmail,
            secondary_email_password: secondaryEmail ? this.generateSecurePassword() : undefined,
            phone_number: this.generatePolishPhoneNumber(),
            phone_country_code: "+48",
        };
    }
    generateProfessionalInfo(demographics) {
        const industries = Object.keys(this.jobTitlesByIndustry);
        const industry = industries[Math.floor(Math.random() * industries.length)];
        const jobTitles = this.jobTitlesByIndustry[industry];
        const jobTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)];
        const companies = [
            "Allegro",
            "CD Projekt",
            "PKO Bank Polski",
            "Orange Polska",
            "PZU",
            "Asseco",
            "LiveChat",
            "Techland",
            "Grupa Żywiec",
            "KGHM",
            "Orlen",
            "Polsat",
        ];
        return {
            job_title: jobTitle,
            job_industry: industry,
            job_company: companies[Math.floor(Math.random() * companies.length)],
            income_level: demographics.income,
        };
    }
    generateDigitalIdentity(personalData) {
        const normalizedFirstName = this.normalizePolishName(personalData.first_name);
        const normalizedLastName = this.normalizePolishName(personalData.last_name);
        const usernamePreferences = [
            normalizedFirstName + normalizedLastName,
            normalizedFirstName + "_" + normalizedLastName,
            normalizedFirstName + Math.floor(Math.random() * 999),
            normalizedLastName + normalizedFirstName,
            normalizedFirstName.substring(0, 3) + normalizedLastName,
        ];
        return {
            username_preferences: usernamePreferences,
            password_pattern: this.encryptString("Strong123!@#"),
            security_questions: [
                {
                    question: "Jak nazywa się twoje pierwsze zwierzę?",
                    answer: this.encryptString(pl_1.faker.animal.dog()),
                    encrypted: true,
                },
                {
                    question: "W jakim mieście się urodziłeś?",
                    answer: this.encryptString(pl_1.faker.location.city()),
                    encrypted: true,
                },
            ],
        };
    }
    generateInterests() {
        const numInterests = pl_1.faker.number.int({ min: 3, max: 8 });
        const shuffled = [...this.interests].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, numInterests);
    }
    generateSecondaryLanguages() {
        const languages = ["en", "de", "fr", "es", "it"];
        const numLangs = Math.random() > 0.7 ? pl_1.faker.number.int({ min: 1, max: 3 }) : 0;
        return languages.slice(0, numLangs);
    }
    generateAvatarUrl(gender, age) {
        return __awaiter(this, void 0, void 0, function* () {
            // Integration with AI avatar service or stock photos
            const genderParam = gender === UserProfile_1.Gender.MALE ? "men" : "women";
            const ageCategory = age < 30 ? "young" : age < 50 ? "middle" : "senior";
            // Using This Person Does Not Exist API or similar
            return `https://api.generated-photos.com/api/v1/photos?age=${ageCategory}&gender=${genderParam}&ethnicity=white`;
        });
    }
    // === HELPER METHODS ===
    getRandomFirstName(gender) {
        const names = this.polishFirstNames[gender] || this.polishFirstNames[UserProfile_1.Gender.MALE];
        return names[Math.floor(Math.random() * names.length)];
    }
    getRandomLastName() {
        return this.polishLastNames[Math.floor(Math.random() * this.polishLastNames.length)];
    }
    generateProfileCode() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 5);
        return `PROF_${timestamp}_${random}`.toUpperCase();
    }
    generatePostalCode(baseCode) {
        // Generate similar postal code with small variation
        const [prefix, suffix] = baseCode.split("-");
        const newSuffix = (parseInt(suffix) + Math.floor(Math.random() * 50)).toString().padStart(3, "0");
        return `${prefix}-${newSuffix}`;
    }
    generatePolishPhoneNumber() {
        const prefixes = ["50", "51", "53", "57", "60", "66", "69", "72", "73", "78", "79", "88"];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const number = Math.floor(Math.random() * 10000000)
            .toString()
            .padStart(7, "0");
        return `+48${prefix}${number}`;
    }
    generateSecurePassword() {
        return pl_1.faker.internet.password({ length: 12 });
    }
    normalizePolishName(name) {
        const map = {
            ą: "a",
            ć: "c",
            ę: "e",
            ł: "l",
            ń: "n",
            ó: "o",
            ś: "s",
            ź: "z",
            ż: "z",
            Ą: "a",
            Ć: "c",
            Ę: "e",
            Ł: "l",
            Ń: "n",
            Ó: "o",
            Ś: "s",
            Ź: "z",
            Ż: "z",
        };
        return name.toLowerCase().replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, (char) => map[char] || char);
    }
    weightedRandom(weights) {
        const entries = Object.entries(weights);
        const random = Math.random();
        let cumulative = 0;
        for (const [key, weight] of entries) {
            cumulative += weight;
            if (random <= cumulative) {
                return key;
            }
        }
        return entries[0][0];
    }
    generateIncomeLevel(education, age) {
        let baseLevel = UserProfile_1.IncomeLevel.MEDIUM_LOW;
        // Education factor
        if (education === UserProfile_1.EducationLevel.MASTER || education === UserProfile_1.EducationLevel.DOCTORATE) {
            baseLevel = UserProfile_1.IncomeLevel.MEDIUM_HIGH;
        }
        else if (education === UserProfile_1.EducationLevel.BACHELOR) {
            baseLevel = UserProfile_1.IncomeLevel.MEDIUM;
        }
        // Age factor (experience)
        if (age > 35) {
            const levels = Object.values(UserProfile_1.IncomeLevel);
            const currentIndex = levels.indexOf(baseLevel);
            const newIndex = Math.min(currentIndex + 1, levels.length - 1);
            baseLevel = levels[newIndex];
        }
        // Random variation
        const random = Math.random();
        if (random < 0.1) {
            const levels = Object.values(UserProfile_1.IncomeLevel);
            const currentIndex = levels.indexOf(baseLevel);
            const newIndex = Math.max(0, currentIndex - 1);
            baseLevel = levels[newIndex];
        }
        else if (random > 0.9) {
            const levels = Object.values(UserProfile_1.IncomeLevel);
            const currentIndex = levels.indexOf(baseLevel);
            const newIndex = Math.min(currentIndex + 1, levels.length - 1);
            baseLevel = levels[newIndex];
        }
        return baseLevel;
    }
    encryptString(text) {
        // Simple encryption for demo - in production use proper encryption
        return Buffer.from(text).toString("base64");
    }
    /**
     * Generate multiple profiles at once
     */
    generateBatchProfiles(count) {
        return __awaiter(this, void 0, void 0, function* () {
            const profiles = [];
            for (let i = 0; i < count; i++) {
                const profile = yield this.generateUserProfile();
                profiles.push(profile);
                // Small delay to ensure unique timestamps
                yield new Promise((resolve) => setTimeout(resolve, 10));
            }
            return profiles;
        });
    }
}
exports.ProfileDataGenerator = ProfileDataGenerator;
