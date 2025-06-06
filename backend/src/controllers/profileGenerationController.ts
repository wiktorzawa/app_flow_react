import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { profileGenerationService } from "../services/profileGenerationService";
import { brightDataService } from "../services/brightDataService"; // Aby pobrać dane strefy

export class ProfileGenerationController {
  prepareBatch = asyncHandler(async (_req: Request, res: Response) => {
    try {
      // 1. Pobierz dane wszystkich stref BrightData, aby znaleźć 'bd_residential_profile_pl'
      // Zakładamy, że `listProxies` zwraca teraz szczegółowe dane, w tym customer_id i password
      const allZones = await brightDataService.listProxies();
      const targetZone = allZones.find((z) => z.zone === "bd_residential_profile_pl");

      if (!targetZone) {
        res.status(404).json({
          success: false,
          message: "Nie znaleziono docelowej strefy Bright Data 'bd_residential_profile_pl'.",
        });
        return;
      }
      // Sprawdzenie, czy kluczowe pola w targetZone istnieją, zanim zostaną użyte
      if (!targetZone.customer_id || !targetZone.password || !targetZone.zone) {
        console.error("Brakujące dane w znalezionej strefie Bright Data:", targetZone);
        res.status(500).json({
          success: false,
          message: "Niekompletne dane konfiguracyjne dla strefy Bright Data 'bd_residential_profile_pl'.",
        });
        return;
      }

      // 2. Wygeneruj profile
      const preparedProfiles = await profileGenerationService.prepareProfilesForAdsPower(targetZone);

      res.status(200).json({
        success: true,
        message: "Operacja przygotowania profili zakończona pomyślnie.",
        data: {
          count: preparedProfiles.length,
          data: preparedProfiles,
          message: "Pomyślnie przygotowano wsadową listę profili AdsPower.",
        },
      });
    } catch (error: any) {
      console.error("Błąd podczas przygotowywania profili AdsPower:", error);
      res
        .status(500)
        .json({ success: false, message: error.message || "Wystąpił błąd serwera podczas przygotowywania profili." });
    }
  });

  // Tutaj można dodać metodę do faktycznego tworzenia profili w AdsPower poprzez AdsPowerService
  // np. createAdsPowerBatch = asyncHandler(async (req: Request, res: Response) => { ... });
}

export const profileGenerationController = new ProfileGenerationController();
