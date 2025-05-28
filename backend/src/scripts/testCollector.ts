import axios from "axios";
import { BrightDataCollectorService } from "../services/brightDataCollector.service";
import { brightDataConfig } from "../config"; // Potrzebne do sprawdzenia konfiguracji

// Przykładowe numery ASIN do testów - możesz je zmienić
const exampleAsins = [
  "B08N5WRWNW", // Przykład 1 (Kindle Paperwhite)
  "B07YNLBS7R", // Przykład 2 (Echo Dot)
  // Dodaj więcej ASIN-ów, jeśli potrzebujesz
];

const testBrightDataCollector = async () => {
  console.log("--- Rozpoczynam test BrightDataCollectorService ---");

  // Sprawdzenie, czy konfiguracja jest choć częściowo wypełniona
  if (
    !brightDataConfig.webScraperIdeApi.apiKey ||
    brightDataConfig.webScraperIdeApi.apiKey === "YOUR_WEBSCRAPER_IDE_API_KEY" ||
    !brightDataConfig.webScraperIdeApi.collectorId ||
    brightDataConfig.webScraperIdeApi.collectorId === "YOUR_AMAZON_COLLECTOR_ID"
  ) {
    console.error("!!! KONFIGURACJA BRIGHT DATA NIEOKREŚLONA !!!");
    console.error("Proszę uzupełnić dane API_KEY oraz COLLECTOR_ID w pliku backend/src/config/brightdata.ts");
    console.log("-------------------------------------------------");
    return;
  }

  const collectorService = new BrightDataCollectorService();

  try {
    console.log(`\n[1] Uruchamianie zadania scrapowania dla ${exampleAsins.length} ASIN-ów...`);
    const collectionId = await collectorService.triggerScrapingBatch(exampleAsins, "TestBatch_ASINs");

    if (!collectionId) {
      console.error("Nie udało się uruchomić zadania scrapowania. Zakończono test.");
      console.log("-------------------------------------------------");
      return;
    }

    console.log(`Otrzymano Collection ID: ${collectionId}`);
    console.log("Poczekaj chwilę na przetworzenie danych przez Bright Data...");
    console.log(
      "(Może to potrwać od kilkudziesięciu sekund do kilku minut w zależności od liczby URLi i obciążenia systemu)"
    );

    // Odczekaj chwilę przed próbą pobrania wyników
    // W rzeczywistej aplikacji lepiej implementować logikę odpytywania (polling) lub webhooki
    await new Promise((resolve) => setTimeout(resolve, 60000)); // Czekaj 60 sekund

    console.log(`\n[2] Pobieranie wyników dla Collection ID: ${collectionId}...`);
    let results = await collectorService.getScrapingBatchResults(collectionId);

    let attempts = 0;
    const maxAttempts = 5; // Maksymalna liczba prób odpytywania
    const pollInterval = 30000; // Odstęp między próbami w ms (30 sekund)

    // Pętla odpytująca, jeśli dane wciąż są w budowie
    while (
      results &&
      typeof results === "object" &&
      "status" in results &&
      results.status === "building" &&
      attempts < maxAttempts
    ) {
      attempts++;
      console.log(`Wyniki są nadal w budowie (próba ${attempts}/${maxAttempts}). Komunikat: ${results.message}`);
      console.log(`Kolejna próba za ${pollInterval / 1000} sekund...`);
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
      results = await collectorService.getScrapingBatchResults(collectionId);
    }

    if (results && typeof results === "object" && "status" in results && results.status === "building") {
      console.error(`Po ${maxAttempts} próbach wyniki dla Collection ID: ${collectionId} są nadal w budowie.`);
      console.log("Spróbuj pobrać wyniki ręcznie później lub sprawdź panel Bright Data.");
    } else if (results && Array.isArray(results)) {
      console.log(`\n--- OTRZYMANE WYNIKI (${results.length} rekordów) ---`);
      results.forEach((item, index) => {
        console.log(`\nRekord ${index + 1}:`);
        // Logujemy tylko kilka pierwszych kluczy dla zwięzłości
        // Możesz zalogować cały obiekt, jeśli chcesz: console.log(JSON.stringify(item, null, 2));
        const keysToLog = Object.keys(item).slice(0, 5);
        keysToLog.forEach((key) => console.log(`  ${key}: ${JSON.stringify(item[key])}`));
        if (Object.keys(item).length > 5) {
          console.log("  ... (więcej pól dostępnych)");
        }
      });
    } else {
      console.error("Nie udało się pobrać wyników lub otrzymano nieoczekiwany format.");
      console.log("Otrzymano:", results);
    }
  } catch (error) {
    console.error("\n!!! Wystąpił błąd podczas testowania BrightDataCollectorService !!!");
    if (error instanceof Error) {
      console.error("Błąd:", error.message);
      // Sprawdzanie, czy to AxiosError, zanim odwołamy się do error.response
      if (axios.isAxiosError(error) && error.response) {
        console.error("Dane odpowiedzi błędu Axios:", error.response.data);
      }
    } else {
      console.error("Nieznany błąd:", error);
    }
  }

  console.log("\n--- Zakończono test BrightDataCollectorService ---");
};

// Uruchomienie testu
testBrightDataCollector().catch((err) => {
  console.error("Krytyczny błąd podczas uruchamiania skryptu testowego:", err);
}); 