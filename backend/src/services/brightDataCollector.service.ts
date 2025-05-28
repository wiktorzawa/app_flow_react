import axios, { AxiosError } from "axios";
import { brightDataConfig } from "../config";
// Usunięto nieużywany import ScrapedProductData, ponieważ typy wyników są ogólne (CollectedDataItem)
// import { ScrapedProductData } from "../types"; 

// Interfejs dla danych wejściowych przekazywanych do kolektora
interface CollectorInput {
  url: string;
  asin?: string; // ASIN jest opcjonalny, ale przydatny do śledzenia
}

// Interfejs dla odpowiedzi z API trigger
interface TriggerApiResponse {
  collection_id: string;
  start_eta?: string;
}

// Interfejs dla odpowiedzi "building" z API dataset
interface DatasetBuildingResponse {
  status: "building";
  message: string;
}

// Interfejs dla pojedynczego elementu w gotowym zestawie danych
interface CollectedDataItem extends Record<string, any> {
  input?: CollectorInput; // Zaktualizowany typ dla pola input
}

// Typ dla odpowiedzi z API dataset, gdy dane są gotowe
type DatasetReadyResponse = CollectedDataItem[];

export class BrightDataCollectorService {
  private apiKey: string;
  private amazonCollectorId: string;

  constructor() {
    this.apiKey = brightDataConfig.webScraperIdeApi.apiKey;
    this.amazonCollectorId = brightDataConfig.webScraperIdeApi.collectorId;

    if (!this.amazonCollectorId || this.amazonCollectorId === "YOUR_AMAZON_COLLECTOR_ID") {
      console.warn(
        "BrightDataCollectorService: ID Kolektora dla Amazon (amazonCollectorId) nie jest poprawnie skonfigurowane w brightDataConfig.webScraperIdeApi.collectorId"
      );
    }
    if (!this.apiKey || this.apiKey === "YOUR_WEBSCRAPER_IDE_API_KEY") {
      console.warn(
        "BrightDataCollectorService: Klucz API (apiKey) nie jest poprawnie skonfigurowany w brightDataConfig.webScraperIdeApi.apiKey"
      );
    }
  }

  /**
   * Uruchamia zadanie zbierania danych (batch) w Bright Data Web Scraper IDE na podstawie listy numerów ASIN.
   * @param asinsToScrape Tablica numerów ASIN produktów Amazon.
   * @param batchName Opcjonalna, czytelna dla człowieka nazwa dla tej partii danych.
   * @returns Promise z ID kolekcji (zadania) lub null w przypadku błędu konfiguracji API.
   * @throws Error w przypadku błędu komunikacji z API Bright Data.
   */
  public async triggerScrapingBatch(
    asinsToScrape: string[],
    batchName?: string
  ): Promise<string | null> {
    if (
      !this.amazonCollectorId ||
      this.amazonCollectorId === "YOUR_AMAZON_COLLECTOR_ID" ||
      !this.apiKey ||
      this.apiKey === "YOUR_WEBSCRAPER_IDE_API_KEY"
    ) {
      console.error(
        "BrightDataCollectorService: Nie można uruchomić zadania. ID Kolektora lub Klucz API są niepoprawnie skonfigurowane."
      );
      return null;
    }

    const collectorInputs: CollectorInput[] = asinsToScrape.map((asin) => ({
      url: `https://www.amazon.com/dp/${asin}`,
      asin: asin,
    }));

    let apiUrl = `https://api.brightdata.com/dca/trigger?collector=${this.amazonCollectorId}&queue_next=1`;
    if (batchName) {
      apiUrl += `&name=${encodeURIComponent(batchName)}`;
    }

    const headers = {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
    };

    console.log(
      `BrightDataCollectorService: Uruchamiam batch dla kolektora ${this.amazonCollectorId} z ${collectorInputs.length} ASIN-ami.`
    );

    try {
      const response = await axios.post<TriggerApiResponse>(apiUrl, collectorInputs, { headers });

      if (response.data && response.data.collection_id) {
        console.log(
          `BrightDataCollectorService: Pomyślnie uruchomiono batch. Collection ID: ${response.data.collection_id}, ETA: ${response.data.start_eta || "N/A"}`
        );
        return response.data.collection_id;
      } else {
        console.error(
          "BrightDataCollectorService: Nie otrzymano collection_id w odpowiedzi od Bright Data API.",
          response.data
        );
        return null;
      }
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      if (axiosError.response) {
        console.error(
          `BrightDataCollectorService: Błąd API (${axiosError.response.status}) podczas wywoływania /dca/trigger:`,
          axiosError.response.data
        );
      } else if (axiosError.request) {
        console.error(
          "BrightDataCollectorService: Brak odpowiedzi od serwera Bright Data podczas wywoływania /dca/trigger:",
          axiosError.request
        );
      } else {
        console.error(
          "BrightDataCollectorService: Ogólny błąd podczas przygotowywania żądania do /dca/trigger:",
          axiosError.message
        );
      }
      throw new Error(`Nie udało się uruchomić zadania w Bright Data: ${axiosError.message}`);
    }
  }

  /**
   * Pobiera wyniki zadania zbierania danych z Bright Data Web Scraper IDE.
   * @param datasetId ID datasetu (collection_id otrzymane z triggerScrapingBatch).
   * @returns Promise z obiektem statusu (jeśli dane są w budowie) lub tablicą zebranych danych.
   * @throws Error w przypadku błędu komunikacji z API Bright Data.
   */
  public async getScrapingBatchResults(
    datasetId: string
  ): Promise<DatasetReadyResponse | DatasetBuildingResponse | null> {
    if (!this.apiKey || this.apiKey === "YOUR_WEBSCRAPER_IDE_API_KEY") {
      console.error(
        "BrightDataCollectorService: Nie można pobrać wyników. Klucz API jest niepoprawnie skonfigurowany."
      );
      return null;
    }

    const apiUrl = `https://api.brightdata.com/dca/dataset?id=${datasetId}`;
    const headers = {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
    };

    console.log(`BrightDataCollectorService: Pobieram wyniki dla dataset ID: ${datasetId}`);

    try {
      const response = await axios.get<DatasetReadyResponse | DatasetBuildingResponse>(
        apiUrl,
        { headers }
      );

      if (
        response.data &&
        typeof response.data === "object" &&
        "status" in response.data &&
        (response.data as DatasetBuildingResponse).status === "building"
      ) {
        console.log(
          `BrightDataCollectorService: Dataset ${datasetId} jest nadal w budowie. Komunikat: ${(response.data as DatasetBuildingResponse).message}`
        );
        return response.data as DatasetBuildingResponse;
      }

      if (Array.isArray(response.data)) {
        console.log(
          `BrightDataCollectorService: Pomyślnie pobrano ${response.data.length} rekordów dla dataset ID: ${datasetId}.`
        );
        return response.data as DatasetReadyResponse;
      }
      
      console.error(
        `BrightDataCollectorService: Nieoczekiwany format odpowiedzi dla dataset ID: ${datasetId}`,
        response.data
      );
      return null;
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      if (axiosError.response) {
        console.error(
          `BrightDataCollectorService: Błąd API (${axiosError.response.status}) podczas wywoływania /dca/dataset dla ID ${datasetId}:`,
          axiosError.response.data
        );
      } else if (axiosError.request) {
        console.error(
          `BrightDataCollectorService: Brak odpowiedzi od serwera Bright Data podczas wywoływania /dca/dataset dla ID ${datasetId}:`,
          axiosError.request
        );
      } else {
        console.error(
          `BrightDataCollectorService: Ogólny błąd podczas przygotowywania żądania do /dca/dataset dla ID ${datasetId}:`,
          axiosError.message
        );
      }
      throw new Error(`Nie udało się pobrać wyników dla dataset ID ${datasetId}: ${axiosError.message}`);
    }
  }

  // TODO: Zaimplementować metodę do obsługi webhooka (jeśli będzie używany): processWebhookData(data: any)
}

// Opcjonalnie: Eksport pojedynczej instancji serwisu (Singleton pattern)
// export const brightDataCollectorService = new BrightDataCollectorService(); 