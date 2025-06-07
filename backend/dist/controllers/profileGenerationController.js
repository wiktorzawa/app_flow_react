"use strict";
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
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileGenerationController = exports.ProfileGenerationController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const profileGenerationService_1 = require("../services/profileGenerationService");
const brightDataService_1 = require("../services/brightDataService"); // Aby pobrać dane strefy
class ProfileGenerationController {
  constructor() {
    this.prepareBatch = (0, express_async_handler_1.default)((req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        try {
          // 1. Pobierz dane wszystkich stref BrightData, aby znaleźć 'bd_residential_profile_pl'
          // Zakładamy, że `listProxies` zwraca teraz szczegółowe dane, w tym customer_id i password
          const allZones = yield brightDataService_1.brightDataService.listProxies();
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
          const preparedProfiles =
            yield profileGenerationService_1.profileGenerationService.prepareProfilesForAdsPower(targetZone);
          res.status(200).json({
            success: true,
            message: "Operacja przygotowania profili zakończona pomyślnie.",
            data: {
              count: preparedProfiles.length,
              data: preparedProfiles,
              message: "Pomyślnie przygotowano wsadową listę profili AdsPower.",
            },
          });
        } catch (error) {
          console.error("Błąd podczas przygotowywania profili AdsPower:", error);
          res.status(500).json({
            success: false,
            message: error.message || "Wystąpił błąd serwera podczas przygotowywania profili.",
          });
        }
      })
    );
    // Tutaj można dodać metodę do faktycznego tworzenia profili w AdsPower poprzez AdsPowerService
    // np. createAdsPowerBatch = asyncHandler(async (req: Request, res: Response) => { ... });
  }
}
exports.ProfileGenerationController = ProfileGenerationController;
exports.profileGenerationController = new ProfileGenerationController();
