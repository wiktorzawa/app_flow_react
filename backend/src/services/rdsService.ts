// import { rdsConfig } from "../config/aws"; // Usunięto nieużywany import

export type SQLParam = string | number | boolean | Date | null;

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
  public async executeQuery<T = unknown>(sql: string, params: SQLParam[] = []): Promise<T[]> {
    console.log(`Wysyłanie zapytania do /api/query: ${sql}`);
    console.log(`Parametry: ${JSON.stringify(params)}`);

    try {
      const response = await fetch('http://localhost:3001/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sql,
          params,
        }),
      });

      console.log(`Odpowiedź serwera (/api/query): ${response.status}`);
      const data: QueryResult<T> = await response.json();
      console.log(`Dane odpowiedzi (/api/query): ${JSON.stringify(data)}`);

      if (!response.ok) {
        const errorMsg = data?.error || `Błąd HTTP ${response.status}: ${response.statusText}`;
        console.error(`Błąd HTTP w executeQuery: ${errorMsg}`);
        throw new Error(errorMsg);
      }

      if (!data.success) {
        const errorMsg = data.error || 'Nieznany błąd wykonania zapytania na serwerze.';
        console.error(`Błąd API w executeQuery: ${errorMsg}`);
        throw new Error(errorMsg);
      }

      return data.data || [];
    } catch (error) {
      console.error('Błąd sieci lub inny błąd w executeQuery:', error);
      throw error;
    }
  }
}
