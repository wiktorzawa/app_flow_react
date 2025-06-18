'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.allegroRouter = void 0;
const express_1 = require('express');
const allegroController_1 = require('../controllers/allegroController');
exports.allegroRouter = (0, express_1.Router)();
// Definicja trasy dla wyszukiwania ofert Allegro po EAN
// Dostępna pod ścieżką /api/allegro/search (po zmontowaniu w routes/index.ts i server.ts)
exports.allegroRouter.get('/search', allegroController_1.allegroController.searchOffersByEAN);
// Trasa do pobierania kategorii
exports.allegroRouter.get('/categories', allegroController_1.allegroController.getCategories);
// --- Nowe trasy dla Authorization Code + PKCE ---
// 1 · LOGIN - Inicjuje proces logowania przez Allegro
exports.allegroRouter.get('/login', (req, res, next) => {
  try {
    // initLogin nie jest asyncHandler, więc obsługujemy błędy bezpośrednio lub przekazujemy
    allegroController_1.allegroController.initLogin(req, res);
  } catch (error) {
    next(error); // Przekaż błąd do globalnego error handlera Express
  }
});
// 2 · CALLBACK - Obsługuje przekierowanie powrotne z Allegro po zalogowaniu
// Metoda handleCallback w kontrolerze jest już opakowana w asyncHandler
exports.allegroRouter.get('/oauth/callback', allegroController_1.allegroController.handleCallback);
// Możesz dodać tutaj inne trasy, np. do odświeżania tokenu użytkownika, wylogowania itp.
// np. allegroRouter.post("/refresh-token", ...)
exports.default = exports.allegroRouter;
