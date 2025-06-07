"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.allegroController = void 0;
const allegroService_1 = require("../services/allegroService"); // TokenData zmienione na UserTokenData dla spójności
const crypto_1 = __importDefault(require("crypto"));
const express_async_handler_1 = __importDefault(require("express-async-handler")); // Zachowujemy, jeśli będzie potrzebne
class AllegroController {
  constructor() {
    // Istniejące metody, jeśli mają zostać zachowane (np. dla Client Credentials)
    // public searchOffersByEAN = ...
    // public getCategories = ...
    // Poniżej nowe metody dla PKCE
    /** CALLBACK – wymienia code na tokeny */
    this.handleCallback = (0, express_async_handler_1.default)((req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        if (!req.session) {
          throw new Error("Session not available for callback");
        }
        const { code, state } = req.query;
        const sessionData = req.session;
        const authContext = sessionData.allegroAuth;
        console.log(`--- AllegroController: handleCallback ---`);
        console.log(`Received code: ${code}, state: ${state}`);
        console.log(`Session allegroAuth:`, authContext);
        if (!authContext || typeof state !== "string" || state !== authContext.state) {
          console.error("CSRF state mismatch or auth context missing.");
          throw new Error("CSRF state mismatch or session error.");
        }
        if (typeof code !== "string") {
          console.error("Authorization code missing or invalid.");
          throw new Error("Authorization code missing or invalid.");
        }
        try {
          const tokenData = yield allegroService_1.allegroService.exchangeCodeForToken(code, authContext.verifier);
          sessionData.allegroTokens = tokenData; // Zapisz tokeny użytkownika w sesji
          delete sessionData.allegroAuth; // Usuń tymczasowe dane autoryzacji
          console.log("Successfully obtained user tokens. Stored in session:", sessionData.allegroTokens);
          // Przekieruj użytkownika do miejsca docelowego w aplikacji, np. profilu
          // Tutaj dla przykładu wysyłamy tokeny jako JSON (NIEZALECANE W PRODUKCJI DLA TOKENÓW)
          // Lepiej przekierować i odczytać z sesji na kolejnej stronie
          res.json({ message: "Login successful. Tokens obtained.", tokens: tokenData });
        } catch (error) {
          console.error("Error in handleCallback while exchanging code for token:", error);
          // Możesz chcieć przekierować do strony błędu
          res.status(500).json({ error: "Failed to exchange code for token", details: error.message });
        }
      })
    );
    // Dodajmy też istniejące metody, jeśli chcesz je zachować
    // (wymagałoby to posiadania instancji AllegroService tak jak poprzednio,
    // lub dostosowania allegroService aby był klasą i tworzenia instancji tutaj)
    // Poniżej zakładam, że allegroService jest już zaimportowaną instancją.
    this.searchOffersByEAN = (0, express_async_handler_1.default)((req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        const ean = req.query.ean;
        if (!ean) {
          res.status(400).json({ error: "Parametr EAN jest wymagany." });
          return; // Zakończ funkcję tutaj
        }
        if (!/^[0-9]{8,14}$/.test(ean)) {
          res.status(400).json({ error: "Nieprawidłowy format numeru EAN." });
          return; // Zakończ funkcję tutaj
        }
        console.log("--- AllegroController: searchOffersByEAN (using App Token) ---");
        const offers = yield allegroService_1.allegroService.fetchOffers(ean);
        res.json(offers); // Wyślij odpowiedź
        // Nie ma potrzeby return res.json(offers)
      })
    );
    this.getCategories = (0, express_async_handler_1.default)((req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        console.log("--- AllegroController: getCategories (using App Token) ---");
        const categories = yield allegroService_1.allegroService.fetchCategories();
        res.json(categories);
      })
    );
  }
  /** START logowania – zwraca URL + zapisuje verifier */
  initLogin(req, res) {
    // Upewnij się, że req.session istnieje i jest poprawnie skonfigurowane
    if (!req.session) {
      return res.status(500).json({ error: "Session not available" });
    }
    const state = crypto_1.default.randomUUID();
    const { url, verifier } = allegroService_1.allegroService.buildLoginUrl(state);
    // Zapisz oba stringi w sesji
    req.session.allegroAuth = { verifier, state };
    // Przekieruj użytkownika lub zwróć URL do przekierowania na frontendzie
    // Dla przykładu, przekierowujemy bezpośrednio:
    console.log(`--- AllegroController: initLogin ---`);
    console.log(`Redirecting to Allegro login URL: ${url}`);
    console.log(`Session allegroAuth set:`, req.session.allegroAuth);
    res.redirect(url);
  }
}
exports.allegroController = new AllegroController();
