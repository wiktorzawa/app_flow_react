import { Router, Request, Response, NextFunction } from "express";
import { allegroController } from "../controllers/allegroController";

export const allegroRouter = Router();

// Definicja trasy dla wyszukiwania ofert Allegro po EAN
// Dostępna pod ścieżką /api/allegro/search (po zmontowaniu w routes/index.ts i server.ts)
allegroRouter.get("/search", allegroController.searchOffersByEAN);

// Trasa do pobierania kategorii
allegroRouter.get("/categories", allegroController.getCategories);

// --- Nowe trasy dla Authorization Code + PKCE ---

// 1 · LOGIN - Inicjuje proces logowania przez Allegro
allegroRouter.get("/login", (req: Request, res: Response, next: NextFunction) => {
  try {
    // initLogin nie jest asyncHandler, więc obsługujemy błędy bezpośrednio lub przekazujemy
    allegroController.initLogin(req, res);
  } catch (error) {
    next(error); // Przekaż błąd do globalnego error handlera Express
  }
});

// 2 · CALLBACK - Obsługuje przekierowanie powrotne z Allegro po zalogowaniu
// Metoda handleCallback w kontrolerze jest już opakowana w asyncHandler
allegroRouter.get("/oauth/callback", allegroController.handleCallback);

// Możesz dodać tutaj inne trasy, np. do odświeżania tokenu użytkownika, wylogowania itp.
// np. allegroRouter.post("/refresh-token", ...)

export default allegroRouter;
