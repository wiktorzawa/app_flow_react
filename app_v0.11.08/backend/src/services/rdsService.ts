// import { rdsConfig } from "../config/aws"; // Usunięto nieużywany import

export interface QueryResult<T = unknown> {
  success: boolean;
  data?: T[];
  error?: string;
}

export class RDSService {
  private static instance: RDSService;
  // private connectionId: string | null = null; // Usunięto stan połączenia

  private constructor() {}

  public static getInstance(): RDSService {
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
  public async executeQuery<T = unknown>(sql: string, params: any[] = []): Promise<T[]> {
    console.log(`Wysyłanie zapytania do /api/query: ${sql}`);
    console.log(`Parametry: ${JSON.stringify(params)}`);

    try {
      const response = await fetch("http://localhost:3001/api/query", {
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
      const data: QueryResult<T> = await response.json(); // Oczekujemy formatu { success, data?, error? }
      console.log(`Dane odpowiedzi (/api/query): ${JSON.stringify(data)}`);

      if (!response.ok) {
        // Błąd HTTP
        const errorMsg = data?.error || `Błąd HTTP ${response.status}: ${response.statusText}`;
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
  }

  // Usunięto metodę disconnect()
  // public async disconnect(): Promise<void> { ... }
}
