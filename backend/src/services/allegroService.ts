import axios, { AxiosError } from "axios";
import crypto from "crypto";
import { config } from "../config/config"; // Poprawiona ścieżka na ../config/config

// Interfejsy dla odpowiedzi z tokenem aplikacji (Client Credentials)
interface AllegroAppTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string; // Zakresy przyznane aplikacji
  jti: string;
}

// Interfejs dla danych tokenu użytkownika (Authorization Code + PKCE)
export interface TokenData {
  access_token: string;
  refresh_token: string;
  expires_in: number; // sekundy
  // scope: string; // Zakresy przyznane przez użytkownika, jeśli API je zwraca w tym miejscu
  token_type: string; // Zazwyczaj 'bearer'
  // Można dodać inne pola zwracane przez Allegro
}

// Interfejs dla danych tokenu użytkownika przechowywanych wewnętrznie
export interface UserTokenData extends TokenData {
  obtained_at: number; // Date.now() kiedy token został uzyskany
}

// Interfejs dla oferty (uproszczony, dostosuj w razie potrzeby)
interface AllegroOfferItem {
  id: string;
  name: string;
  price?: { amount?: number; currency?: string };
  category?: { name?: string };
  condition?: string;
}

interface AllegroListingResponse {
  items: {
    promoted: AllegroOfferItem[];
    regular: AllegroOfferItem[];
  };
}

// Interfejsy dla kategorii
interface AllegroCategory {
  id: string;
  name: string;
  leaf: boolean;
}

interface AllegroCategoriesResponse {
  categories: AllegroCategory[];
}

class AllegroService {
  private appAccessToken: string = "";
  private appTokenExpiryTime: number = 0;

  constructor() {
    // Ewentualna inicjalizacja
  }

  // === UTILITIES (WSPÓLNE) ================================================
  private generateCodeVerifier(): string {
    return crypto.randomBytes(64).toString("base64url");
  }

  private generateCodeChallenge(verifier: string): string {
    return crypto.createHash("sha256").update(verifier).digest("base64url");
  }

  private getBasicAuthHeader(): string {
    return Buffer.from(`${config.allegroClientId}:${config.allegroClientSecret}`).toString("base64");
  }

  // === CLIENT CREDENTIALS (dla operacji aplikacji, np. publiczne kategorie) =====
  private async refreshAppAccessToken(): Promise<void> {
    if (!config.allegroClientId || !config.allegroClientSecret) {
      console.error(
        "Klucze API Allegro (allegroClientId lub allegroClientSecret) nie są skonfigurowane dla Client Credentials."
      );
      throw new Error("Brak konfiguracji kluczy API Allegro dla Client Credentials.");
    }
    console.log("--- AllegroService: refreshAppAccessToken (Client Credentials) ---");
    const tokenUrl = config.allegroAuthTokenUrl;
    console.log("App Token URL:", tokenUrl);

    const requestBody = new URLSearchParams({ grant_type: "client_credentials" }).toString();
    console.log("App Token Request body:", requestBody);

    try {
      const response = await axios.post<AllegroAppTokenResponse>(tokenUrl, requestBody, {
        headers: {
          Authorization: `Basic ${this.getBasicAuthHeader()}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      this.appAccessToken = response.data.access_token;
      this.appTokenExpiryTime = Date.now() + (response.data.expires_in - 60) * 1000;
      console.log("Token dostępu aplikacji (Client Credentials) został odświeżony.");
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(
        "Błąd podczas odświeżania tokenu aplikacji (Client Credentials):",
        `URL: ${tokenUrl}`,
        axiosError.response?.status,
        axiosError.response?.data || axiosError.message
      );
      throw new Error("Nie udało się odświeżyć tokenu dostępu aplikacji.");
    }
  }

  private async getValidAppAccessToken(): Promise<string> {
    if (!this.appAccessToken || Date.now() >= this.appTokenExpiryTime) {
      console.log("Token aplikacji (Client Credentials) wygasł lub nie istnieje, odświeżanie...");
      await this.refreshAppAccessToken();
    }
    return this.appAccessToken;
  }

  // Metody publiczne używające tokenu aplikacji (Client Credentials)
  public async fetchOffers(phrase: string): Promise<AllegroOfferItem[]> {
    const token = await this.getValidAppAccessToken();
    const offersUrl = `${config.allegroApiUrl}/offers/listing`;
    console.log(`--- AllegroService: fetchOffers (using App Token) ---`);
    try {
      const response = await axios.get<AllegroListingResponse>(offersUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.allegro.public.v1+json",
        },
        params: { phrase: phrase },
      });
      return [...(response.data.items.promoted || []), ...(response.data.items.regular || [])];
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        console.warn("Otrzymano błąd 401 (App Token) przy fetchOffers. Token mógł wygasnąć.");
      }
      console.error(
        "Błąd podczas pobierania ofert z Allegro (App Token):",
        `URL: ${offersUrl}?phrase=${phrase}`,
        axiosError.response?.status,
        axiosError.response?.data || axiosError.message
      );
      throw new Error(`Nie udało się pobrać ofert z Allegro (App Token): ${axiosError.message}`);
    }
  }

  public async fetchCategories(): Promise<AllegroCategory[]> {
    const token = await this.getValidAppAccessToken();
    const categoriesUrl = `${config.allegroApiUrl}/sale/categories`;
    console.log(`--- AllegroService: fetchCategories (using App Token) ---`);
    try {
      const response = await axios.get<AllegroCategoriesResponse>(categoriesUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.allegro.public.v1+json",
        },
      });
      return response.data.categories || [];
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        console.warn("Otrzymano błąd 401 (App Token) przy fetchCategories. Token mógł wygasnąć.");
      }
      console.error(
        "Błąd podczas pobierania kategorii z Allegro (App Token):",
        `URL: ${categoriesUrl}`,
        axiosError.response?.status,
        axiosError.response?.data || axiosError.message
      );
      throw new Error(`Nie udało się pobrać kategorii z Allegro (App Token): ${axiosError.message}`);
    }
  }

  // === AUTHORIZATION CODE + PKCE (dla operacji w imieniu użytkownika) =====
  public buildLoginUrl(state: string) {
    const verifier = this.generateCodeVerifier();
    const challenge = this.generateCodeChallenge(verifier);
    const loginUrl = new URL(`${config.allegroAuthTokenUrl.replace("/token", "")}/authorize`); // Dostosowanie URL do autoryzacji

    loginUrl.searchParams.set("response_type", "code");
    loginUrl.searchParams.set("client_id", config.allegroClientId);
    loginUrl.searchParams.set("redirect_uri", config.allegroRedirectUri);
    if (config.allegroScope) {
      // Dodajemy scope tylko jeśli jest zdefiniowany
      loginUrl.searchParams.set("scope", config.allegroScope);
    }
    loginUrl.searchParams.set("state", state);
    loginUrl.searchParams.set("code_challenge", challenge);
    loginUrl.searchParams.set("code_challenge_method", "S256");

    console.log(`--- AllegroService: buildLoginUrl ---`);
    console.log(`Generated verifier (to be stored in session): ${verifier}`);
    console.log(`Login URL: ${loginUrl.toString()}`);
    return { url: loginUrl.toString(), verifier };
  }

  public async exchangeCodeForToken(code: string, verifier: string): Promise<UserTokenData> {
    console.log(`--- AllegroService: exchangeCodeForToken ---`);
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: config.allegroRedirectUri,
      code_verifier: verifier,
    }).toString();

    try {
      const { data } = await axios.post<TokenData>(config.allegroAuthTokenUrl, body, {
        headers: {
          Authorization: `Basic ${this.getBasicAuthHeader()}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      console.log("Successfully exchanged code for user token.");
      return { ...data, obtained_at: Date.now() };
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(
        "Błąd podczas wymiany kodu na token użytkownika (PKCE):",
        `URL: ${config.allegroAuthTokenUrl}`,
        axiosError.response?.status,
        axiosError.response?.data || axiosError.message,
        `Request body: ${body}`
      );
      throw new Error(`Nie udało się wymienić kodu na token użytkownika: ${axiosError.message}`);
    }
  }

  public async refreshUserToken(refreshToken: string): Promise<UserTokenData> {
    console.log(`--- AllegroService: refreshUserToken ---`);
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      redirect_uri: config.allegroRedirectUri, // redirect_uri jest często wymagany także przy odświeżaniu
    }).toString();

    try {
      const { data } = await axios.post<TokenData>(config.allegroAuthTokenUrl, body, {
        headers: {
          Authorization: `Basic ${this.getBasicAuthHeader()}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      console.log("Successfully refreshed user token.");
      return { ...data, obtained_at: Date.now() };
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(
        "Błąd podczas odświeżania tokenu użytkownika:",
        `URL: ${config.allegroAuthTokenUrl}`,
        axiosError.response?.status,
        axiosError.response?.data || axiosError.message,
        `Request body: ${body}`
      );
      throw new Error(`Nie udało się odświeżyć tokenu użytkownika: ${axiosError.message}`);
    }
  }
}

export const allegroService = new AllegroService();
