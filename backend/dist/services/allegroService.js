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
exports.allegroService = void 0;
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
const config_1 = require("../config/config"); // Poprawiona ścieżka na ../config/config
class AllegroService {
    constructor() {
        this.appAccessToken = "";
        this.appTokenExpiryTime = 0;
        // Ewentualna inicjalizacja
    }
    // === UTILITIES (WSPÓLNE) ================================================
    generateCodeVerifier() {
        return crypto_1.default.randomBytes(64).toString("base64url");
    }
    generateCodeChallenge(verifier) {
        return crypto_1.default
            .createHash("sha256")
            .update(verifier)
            .digest("base64url");
    }
    getBasicAuthHeader() {
        return Buffer.from(`${config_1.config.allegroClientId}:${config_1.config.allegroClientSecret}`).toString("base64");
    }
    // === CLIENT CREDENTIALS (dla operacji aplikacji, np. publiczne kategorie) =====
    refreshAppAccessToken() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (!config_1.config.allegroClientId || !config_1.config.allegroClientSecret) {
                console.error("Klucze API Allegro (allegroClientId lub allegroClientSecret) nie są skonfigurowane dla Client Credentials.");
                throw new Error("Brak konfiguracji kluczy API Allegro dla Client Credentials.");
            }
            console.log("--- AllegroService: refreshAppAccessToken (Client Credentials) ---");
            const tokenUrl = config_1.config.allegroAuthTokenUrl;
            console.log("App Token URL:", tokenUrl);
            const requestBody = new URLSearchParams({ grant_type: "client_credentials" }).toString();
            console.log("App Token Request body:", requestBody);
            try {
                const response = yield axios_1.default.post(tokenUrl, requestBody, {
                    headers: {
                        Authorization: `Basic ${this.getBasicAuthHeader()}`,
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                });
                this.appAccessToken = response.data.access_token;
                this.appTokenExpiryTime = Date.now() + (response.data.expires_in - 60) * 1000;
                console.log("Token dostępu aplikacji (Client Credentials) został odświeżony.");
            }
            catch (error) {
                const axiosError = error;
                console.error("Błąd podczas odświeżania tokenu aplikacji (Client Credentials):", `URL: ${tokenUrl}`, (_a = axiosError.response) === null || _a === void 0 ? void 0 : _a.status, ((_b = axiosError.response) === null || _b === void 0 ? void 0 : _b.data) || axiosError.message);
                throw new Error("Nie udało się odświeżyć tokenu dostępu aplikacji.");
            }
        });
    }
    getValidAppAccessToken() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.appAccessToken || Date.now() >= this.appTokenExpiryTime) {
                console.log("Token aplikacji (Client Credentials) wygasł lub nie istnieje, odświeżanie...");
                yield this.refreshAppAccessToken();
            }
            return this.appAccessToken;
        });
    }
    // Metody publiczne używające tokenu aplikacji (Client Credentials)
    fetchOffers(phrase) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const token = yield this.getValidAppAccessToken();
            const offersUrl = `${config_1.config.allegroApiUrl}/offers/listing`;
            console.log(`--- AllegroService: fetchOffers (using App Token) ---`);
            try {
                const response = yield axios_1.default.get(offersUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/vnd.allegro.public.v1+json",
                    },
                    params: { phrase: phrase },
                });
                return [...(response.data.items.promoted || []), ...(response.data.items.regular || [])];
            }
            catch (error) {
                const axiosError = error;
                if (((_a = axiosError.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
                    console.warn("Otrzymano błąd 401 (App Token) przy fetchOffers. Token mógł wygasnąć.");
                }
                console.error("Błąd podczas pobierania ofert z Allegro (App Token):", `URL: ${offersUrl}?phrase=${phrase}`, (_b = axiosError.response) === null || _b === void 0 ? void 0 : _b.status, ((_c = axiosError.response) === null || _c === void 0 ? void 0 : _c.data) || axiosError.message);
                throw new Error(`Nie udało się pobrać ofert z Allegro (App Token): ${axiosError.message}`);
            }
        });
    }
    fetchCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const token = yield this.getValidAppAccessToken();
            const categoriesUrl = `${config_1.config.allegroApiUrl}/sale/categories`;
            console.log(`--- AllegroService: fetchCategories (using App Token) ---`);
            try {
                const response = yield axios_1.default.get(categoriesUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/vnd.allegro.public.v1+json",
                    },
                });
                return response.data.categories || [];
            }
            catch (error) {
                const axiosError = error;
                if (((_a = axiosError.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
                    console.warn("Otrzymano błąd 401 (App Token) przy fetchCategories. Token mógł wygasnąć.");
                }
                console.error("Błąd podczas pobierania kategorii z Allegro (App Token):", `URL: ${categoriesUrl}`, (_b = axiosError.response) === null || _b === void 0 ? void 0 : _b.status, ((_c = axiosError.response) === null || _c === void 0 ? void 0 : _c.data) || axiosError.message);
                throw new Error(`Nie udało się pobrać kategorii z Allegro (App Token): ${axiosError.message}`);
            }
        });
    }
    // === AUTHORIZATION CODE + PKCE (dla operacji w imieniu użytkownika) =====
    buildLoginUrl(state) {
        const verifier = this.generateCodeVerifier();
        const challenge = this.generateCodeChallenge(verifier);
        const loginUrl = new URL(`${config_1.config.allegroAuthTokenUrl.replace("/token", "")}/authorize`); // Dostosowanie URL do autoryzacji
        loginUrl.searchParams.set("response_type", "code");
        loginUrl.searchParams.set("client_id", config_1.config.allegroClientId);
        loginUrl.searchParams.set("redirect_uri", config_1.config.allegroRedirectUri);
        if (config_1.config.allegroScope) { // Dodajemy scope tylko jeśli jest zdefiniowany
            loginUrl.searchParams.set("scope", config_1.config.allegroScope);
        }
        loginUrl.searchParams.set("state", state);
        loginUrl.searchParams.set("code_challenge", challenge);
        loginUrl.searchParams.set("code_challenge_method", "S256");
        console.log(`--- AllegroService: buildLoginUrl ---`);
        console.log(`Generated verifier (to be stored in session): ${verifier}`);
        console.log(`Login URL: ${loginUrl.toString()}`);
        return { url: loginUrl.toString(), verifier };
    }
    exchangeCodeForToken(code, verifier) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            console.log(`--- AllegroService: exchangeCodeForToken ---`);
            const body = new URLSearchParams({
                grant_type: "authorization_code",
                code,
                redirect_uri: config_1.config.allegroRedirectUri,
                code_verifier: verifier,
            }).toString();
            try {
                const { data } = yield axios_1.default.post(config_1.config.allegroAuthTokenUrl, body, {
                    headers: {
                        Authorization: `Basic ${this.getBasicAuthHeader()}`,
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                });
                console.log("Successfully exchanged code for user token.");
                return Object.assign(Object.assign({}, data), { obtained_at: Date.now() });
            }
            catch (error) {
                const axiosError = error;
                console.error("Błąd podczas wymiany kodu na token użytkownika (PKCE):", `URL: ${config_1.config.allegroAuthTokenUrl}`, (_a = axiosError.response) === null || _a === void 0 ? void 0 : _a.status, ((_b = axiosError.response) === null || _b === void 0 ? void 0 : _b.data) || axiosError.message, `Request body: ${body}`);
                throw new Error(`Nie udało się wymienić kodu na token użytkownika: ${axiosError.message}`);
            }
        });
    }
    refreshUserToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            console.log(`--- AllegroService: refreshUserToken ---`);
            const body = new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: refreshToken,
                redirect_uri: config_1.config.allegroRedirectUri, // redirect_uri jest często wymagany także przy odświeżaniu
            }).toString();
            try {
                const { data } = yield axios_1.default.post(config_1.config.allegroAuthTokenUrl, body, {
                    headers: {
                        Authorization: `Basic ${this.getBasicAuthHeader()}`,
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                });
                console.log("Successfully refreshed user token.");
                return Object.assign(Object.assign({}, data), { obtained_at: Date.now() });
            }
            catch (error) {
                const axiosError = error;
                console.error("Błąd podczas odświeżania tokenu użytkownika:", `URL: ${config_1.config.allegroAuthTokenUrl}`, (_a = axiosError.response) === null || _a === void 0 ? void 0 : _a.status, ((_b = axiosError.response) === null || _b === void 0 ? void 0 : _b.data) || axiosError.message, `Request body: ${body}`);
                throw new Error(`Nie udało się odświeżyć tokenu użytkownika: ${axiosError.message}`);
            }
        });
    }
}
exports.allegroService = new AllegroService();
