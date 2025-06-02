import { Request, Response } from "express";
import { allegroService, UserTokenData as TokenData } from "../services/allegroService"; // TokenData zmienione na UserTokenData dla spójności
import crypto from "crypto";
import asyncHandler from "express-async-handler"; // Zachowujemy, jeśli będzie potrzebne

// Założenie: Express-session jest używane i obiekt sesji jest dostępny w req.session
// Interfejs dla sesji może wyglądać np. tak:
interface AllegroAuthSession {
  allegroAuth?: {
    verifier: string;
    state: string;
  };
  allegroTokens?: TokenData; // Przechowuje UserTokenData
  // inne dane sesji...
}

class AllegroController {
  // Istniejące metody, jeśli mają zostać zachowane (np. dla Client Credentials)
  // public searchOffersByEAN = ...
  // public getCategories = ...
  // Poniżej nowe metody dla PKCE

  /** START logowania – zwraca URL + zapisuje verifier */
  public initLogin(req: Request, res: Response) {
    // Upewnij się, że req.session istnieje i jest poprawnie skonfigurowane
    if (!req.session) {
      return res.status(500).json({ error: "Session not available" });
    }

    const state = crypto.randomUUID();
    const { url, verifier } = allegroService.buildLoginUrl(state);

    // Zapisz oba stringi w sesji
    (req.session as AllegroAuthSession).allegroAuth = { verifier, state };

    // Przekieruj użytkownika lub zwróć URL do przekierowania na frontendzie
    // Dla przykładu, przekierowujemy bezpośrednio:
    console.log(`--- AllegroController: initLogin ---`);
    console.log(`Redirecting to Allegro login URL: ${url}`);
    console.log(`Session allegroAuth set:`, (req.session as AllegroAuthSession).allegroAuth);
    res.redirect(url);
  }

  /** CALLBACK – wymienia code na tokeny */
  public handleCallback = asyncHandler(async (req: Request, res: Response) => {
    if (!req.session) {
      throw new Error("Session not available for callback");
    }

    const { code, state } = req.query;
    const sessionData = req.session as AllegroAuthSession;
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
      const tokenData = await allegroService.exchangeCodeForToken(code, authContext.verifier);
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
      res.status(500).json({ error: "Failed to exchange code for token", details: (error as Error).message });
    }
  });

  // Dodajmy też istniejące metody, jeśli chcesz je zachować
  // (wymagałoby to posiadania instancji AllegroService tak jak poprzednio,
  // lub dostosowania allegroService aby był klasą i tworzenia instancji tutaj)
  // Poniżej zakładam, że allegroService jest już zaimportowaną instancją.

  public searchOffersByEAN = asyncHandler(async (req: Request, res: Response) => {
    const ean = req.query.ean as string;
    if (!ean) {
      res.status(400).json({ error: "Parametr EAN jest wymagany." });
      return; // Zakończ funkcję tutaj
    }
    if (!/^[0-9]{8,14}$/.test(ean)) {
      res.status(400).json({ error: "Nieprawidłowy format numeru EAN." });
      return; // Zakończ funkcję tutaj
    }
    console.log("--- AllegroController: searchOffersByEAN (using App Token) ---");
    const offers = await allegroService.fetchOffers(ean);
    res.json(offers); // Wyślij odpowiedź
    // Nie ma potrzeby return res.json(offers)
  });

  public getCategories = asyncHandler(async (req: Request, res: Response) => {
    console.log("--- AllegroController: getCategories (using App Token) ---");
    const categories = await allegroService.fetchCategories();
    res.json(categories);
  });
}

export const allegroController = new AllegroController();
