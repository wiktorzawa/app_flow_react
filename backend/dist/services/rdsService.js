"use strict";
// import { rdsConfig } from "../config/aws"; // Usunięto nieużywany import
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RDSService = void 0;
class RDSService {
  // private connectionId: string | null = null; // Usunięto stan połączenia
  constructor() {}
  static getInstance() {
    if (!RDSService.instance) {
      RDSService.instance = new RDSService();
    }
    return RDSService.instance;
  }
  // Usunięto metodę connect()
  // public async connect(): Promise<string> { ... }
  /**
   * Wykonuje zapytanie SQL poprzez wysłanie go do endpointu /api/query backendu.
   * @param sql Zapytanie SQL do wykonania.
   * @param params Tablica parametrów do zapytania (dla zapytań parametryzowanych).
   * @returns Obietnica (Promise) zwracająca tablicę wyników typu T.
   * @throws Rzuca błąd, jeśli zapytanie się nie powiedzie lub wystąpi błąd sieci.
   */
  executeQuery(sql_1) {
    return __awaiter(this, arguments, void 0, function* (sql, params = []) {
      console.log(`Wysyłanie zapytania do /api/query: ${sql}`);
      console.log(`Parametry: ${JSON.stringify(params)}`);
      try {
        const response = yield fetch("http://localhost:3001/api/query", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sql,
            params, // Przekazujemy parametry jako tablicę
          }),
        });
        console.log(`Odpowiedź serwera (/api/query): ${response.status}`);
        const data = yield response.json(); // Oczekujemy formatu { success, data?, error? }
        console.log(`Dane odpowiedzi (/api/query): ${JSON.stringify(data)}`);
        if (!response.ok) {
          // Błąd HTTP
          const errorMsg =
            (data === null || data === void 0 ? void 0 : data.error) ||
            `Błąd HTTP ${response.status}: ${response.statusText}`;
          console.error(`Błąd HTTP w executeQuery: ${errorMsg}`);
          throw new Error(errorMsg);
        }
        if (!data.success) {
          // Błąd zwrócony przez API w polu 'error'
          const errorMsg = data.error || "Nieznany błąd wykonania zapytania na serwerze.";
          console.error(`Błąd API w executeQuery: ${errorMsg}`);
          throw new Error(errorMsg);
        }
        // Sukces - zwracamy dane (lub pustą tablicę, jeśli data nie istnieje)
        return data.data || [];
      } catch (error) {
        // Błąd sieciowy lub błąd parsowania JSON
        console.error("Błąd sieci lub inny błąd w executeQuery:", error);
        // Przekaż błąd dalej, aby komponent mógł go obsłużyć
        throw error;
      }
    });
  }
}
exports.RDSService = RDSService;
