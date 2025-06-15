export const scraperConfig = {
  // Domyślne ustawienia dla scrapera Amazon
  amazon: {
    defaultMarketplace: "US", // Przykładowo, można zmienić na "DE", "PL" itd.
    defaultLanguage: "en-US", // Przykładowy język
  },
  // Możesz tu dodać inne konfiguracje specyficzne dla scrapera
};

export type ScraperConfig = typeof scraperConfig;
// Dodano pustą linię na końcu pliku dla lintera
