import {
  UserProfile,
  Gender,
  EducationLevel,
  IncomeLevel,
  DataSource,
  ProfileStatus,
  VerificationStatus,
  RiskLevel,
} from "@shared-types/UserProfile";
import { faker } from "@faker-js/faker/locale/pl";
import crypto from "crypto";

interface LocationData {
  city: string;
  region: string;
  postal_code: string;
  coordinates: { latitude: number; longitude: number };
  typical_demographics: {
    avg_age_range: [number, number];
    income_distribution: Record<IncomeLevel, number>;
    education_distribution: Record<EducationLevel, number>;
  };
}

export class ProfileDataGenerator {
  private polishCities: LocationData[] = [
    {
      city: "Warszawa",
      region: "Mazowieckie",
      postal_code: "02-777",
      coordinates: { latitude: 52.2297, longitude: 21.0122 },
      typical_demographics: {
        avg_age_range: [25, 45],
        income_distribution: {
          [IncomeLevel.LOW]: 0.15,
          [IncomeLevel.MEDIUM_LOW]: 0.25,
          [IncomeLevel.MEDIUM]: 0.3,
          [IncomeLevel.MEDIUM_HIGH]: 0.2,
          [IncomeLevel.HIGH]: 0.1,
        },
        education_distribution: {
          [EducationLevel.PRIMARY]: 0.05,
          [EducationLevel.SECONDARY]: 0.25,
          [EducationLevel.VOCATIONAL]: 0.2,
          [EducationLevel.BACHELOR]: 0.3,
          [EducationLevel.MASTER]: 0.15,
          [EducationLevel.DOCTORATE]: 0.05,
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
          [IncomeLevel.LOW]: 0.2,
          [IncomeLevel.MEDIUM_LOW]: 0.3,
          [IncomeLevel.MEDIUM]: 0.25,
          [IncomeLevel.MEDIUM_HIGH]: 0.15,
          [IncomeLevel.HIGH]: 0.1,
        },
        education_distribution: {
          [EducationLevel.PRIMARY]: 0.08,
          [EducationLevel.SECONDARY]: 0.3,
          [EducationLevel.VOCATIONAL]: 0.22,
          [EducationLevel.BACHELOR]: 0.25,
          [EducationLevel.MASTER]: 0.12,
          [EducationLevel.DOCTORATE]: 0.03,
        },
      },
    },
  ];

  private polishFirstNames: Record<Gender, string[]> = {
    [Gender.MALE]: [
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
    [Gender.FEMALE]: [
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
    [Gender.OTHER]: ["Alex", "Jordan", "Casey", "Riley"],
    [Gender.PREFER_NOT_TO_SAY]: ["Pat", "Sam", "Taylor"],
  };

  private polishLastNames = [
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

  private jobTitlesByIndustry = {
    IT: ["Programista", "Analityk", "DevOps Engineer", "Product Manager", "UX Designer"],
    Finansje: ["Księgowy", "Analityk finansowy", "Doradca finansowy", "Controller"],
    Marketing: ["Specjalista ds. marketingu", "Content Creator", "Performance Marketer"],
    Edukacja: ["Nauczyciel", "Wykładowca", "Trener", "Mentor"],
    Zdrowie: ["Lekarz", "Pielęgniarka", "Fizjoterapeuta", "Farmaceuta"],
    Handel: ["Sprzedawca", "Kierownik sklepu", "Przedstawiciel handlowy"],
    Produkcja: ["Operator maszyn", "Technolog", "Kierownik produkcji"],
  };

  private interests = [
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

  /**
   * Generates a complete realistic user profile
   */
  public async generateUserProfile(overrides: Partial<UserProfile> = {}): Promise<UserProfile> {
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

    const profile: UserProfile = {
      id: crypto.randomUUID(),
      profile_code: this.generateProfileCode(),
      created_at: new Date(),
      updated_at: new Date(),
      status: ProfileStatus.ACTIVE,

      // Personal data
      ...personalData,

      // Contact info
      ...contactInfo,

      // Location
      city: location.city,
      postal_code: this.generatePostalCode(location.postal_code),
      region: location.region,
      country: "Polska",
      country_code: "PL",
      coordinates: {
        latitude: location.coordinates.latitude + (Math.random() - 0.5) * 0.01,
        longitude: location.coordinates.longitude + (Math.random() - 0.5) * 0.01,
      },
      location_notes: `${location.city}, ${location.region}`,

      // Professional & interests
      ...professionalInfo,
      interests: this.generateInterests(),

      // Language & culture
      primary_language: "pl",
      secondary_languages: this.generateSecondaryLanguages(),
      timezone: "Europe/Warsaw",
      locale: "pl_PL",

      // Digital identity
      ...digitalIdentity,

      // Photos (will be generated separately)
      photos: [],
      avatar_url: await this.generateAvatarUrl(personalData.gender, personalData.age),

      // Metadata
      data_source: DataSource.GENERATED,
      verification_status: VerificationStatus.UNVERIFIED,
      risk_level: RiskLevel.LOW,
      notes: `Auto-generated profile for ${personalData.first_name} ${personalData.last_name}`,
      tags: ["generated", "synthetic", location.city.toLowerCase()],

      // Apply any overrides
      ...overrides,
    };

    return profile;
  }

  private getRandomLocation(): LocationData {
    return this.polishCities[Math.floor(Math.random() * this.polishCities.length)];
  }

  private generateDemographics(location: LocationData) {
    const [minAge, maxAge] = location.typical_demographics.avg_age_range;
    const age = faker.number.int({ min: minAge, max: maxAge });

    const gender = Math.random() > 0.5 ? Gender.MALE : Gender.FEMALE;

    // Education level based on age and location demographics
    const education = this.weightedRandom<EducationLevel>(location.typical_demographics.education_distribution);

    // Income level correlated with education and age
    const income = this.generateIncomeLevel(education, age);

    return { age, gender, education, income };
  }

  private generatePersonalData(demographics: { age: number; gender: Gender; education: EducationLevel }) {
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

  private generateContactInfo(personalData: { first_name: string; last_name: string }) {
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

    const secondaryEmail =
      Math.random() > 0.6
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

  private generateProfessionalInfo(demographics: { education: EducationLevel; income: IncomeLevel }) {
    const industries = Object.keys(this.jobTitlesByIndustry) as Array<keyof typeof this.jobTitlesByIndustry>;
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

  private generateDigitalIdentity(personalData: { first_name: string; last_name: string }) {
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
          answer: this.encryptString(faker.animal.dog()),
          encrypted: true,
        },
        {
          question: "W jakim mieście się urodziłeś?",
          answer: this.encryptString(faker.location.city()),
          encrypted: true,
        },
      ],
    };
  }

  private generateInterests(): string[] {
    const numInterests = faker.number.int({ min: 3, max: 8 });
    const shuffled = [...this.interests].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numInterests);
  }

  private generateSecondaryLanguages(): string[] {
    const languages = ["en", "de", "fr", "es", "it"];
    const numLangs = Math.random() > 0.7 ? faker.number.int({ min: 1, max: 3 }) : 0;
    return languages.slice(0, numLangs);
  }

  private async generateAvatarUrl(gender: Gender, age: number): Promise<string> {
    // Integration with AI avatar service or stock photos
    const genderParam = gender === Gender.MALE ? "men" : "women";
    const ageCategory = age < 30 ? "young" : age < 50 ? "middle" : "senior";

    // Using This Person Does Not Exist API or similar
    return `https://api.generated-photos.com/api/v1/photos?age=${ageCategory}&gender=${genderParam}&ethnicity=white`;
  }

  // === HELPER METHODS ===

  private getRandomFirstName(gender: Gender): string {
    const names = this.polishFirstNames[gender] || this.polishFirstNames[Gender.MALE];
    return names[Math.floor(Math.random() * names.length)];
  }

  private getRandomLastName(): string {
    return this.polishLastNames[Math.floor(Math.random() * this.polishLastNames.length)];
  }

  private generateProfileCode(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 5);
    return `PROF_${timestamp}_${random}`.toUpperCase();
  }

  private generatePostalCode(baseCode: string): string {
    // Generate similar postal code with small variation
    const [prefix, suffix] = baseCode.split("-");
    const newSuffix = (parseInt(suffix) + Math.floor(Math.random() * 50)).toString().padStart(3, "0");
    return `${prefix}-${newSuffix}`;
  }

  private generatePolishPhoneNumber(): string {
    const prefixes = ["50", "51", "53", "57", "60", "66", "69", "72", "73", "78", "79", "88"];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const number = Math.floor(Math.random() * 10000000)
      .toString()
      .padStart(7, "0");
    return `+48${prefix}${number}`;
  }

  private generateSecurePassword(): string {
    return faker.internet.password({ length: 12 });
  }

  private normalizePolishName(name: string): string {
    const map: Record<string, string> = {
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

  private weightedRandom<T>(weights: Record<string, number>): T {
    const entries = Object.entries(weights);
    const random = Math.random();
    let cumulative = 0;

    for (const [key, weight] of entries) {
      cumulative += weight;
      if (random <= cumulative) {
        return key as T;
      }
    }

    return entries[0][0] as T;
  }

  private generateIncomeLevel(education: EducationLevel, age: number): IncomeLevel {
    let baseLevel = IncomeLevel.MEDIUM_LOW;

    // Education factor
    if (education === EducationLevel.MASTER || education === EducationLevel.DOCTORATE) {
      baseLevel = IncomeLevel.MEDIUM_HIGH;
    } else if (education === EducationLevel.BACHELOR) {
      baseLevel = IncomeLevel.MEDIUM;
    }

    // Age factor (experience)
    if (age > 35) {
      const levels = Object.values(IncomeLevel);
      const currentIndex = levels.indexOf(baseLevel);
      const newIndex = Math.min(currentIndex + 1, levels.length - 1);
      baseLevel = levels[newIndex];
    }

    // Random variation
    const random = Math.random();
    if (random < 0.1) {
      const levels = Object.values(IncomeLevel);
      const currentIndex = levels.indexOf(baseLevel);
      const newIndex = Math.max(0, currentIndex - 1);
      baseLevel = levels[newIndex];
    } else if (random > 0.9) {
      const levels = Object.values(IncomeLevel);
      const currentIndex = levels.indexOf(baseLevel);
      const newIndex = Math.min(currentIndex + 1, levels.length - 1);
      baseLevel = levels[newIndex];
    }

    return baseLevel;
  }

  private encryptString(text: string): string {
    // Simple encryption for demo - in production use proper encryption
    return Buffer.from(text).toString("base64");
  }

  /**
   * Generate multiple profiles at once
   */
  public async generateBatchProfiles(count: number): Promise<UserProfile[]> {
    const profiles: UserProfile[] = [];

    for (let i = 0; i < count; i++) {
      const profile = await this.generateUserProfile();
      profiles.push(profile);

      // Small delay to ensure unique timestamps
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    return profiles;
  }
}
