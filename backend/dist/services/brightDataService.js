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
exports.brightDataService = exports.BrightDataService = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config/config");
// Bright Data REST API
const BRIGHTDATA_API_URL = "https://api.brightdata.com";
class BrightDataService {
  constructor() {
    this.customerID = config_1.config.brightDataCustomerID || "";
    this.apiToken = config_1.config.brightDataApiToken || "";
    if (!this.customerID || !this.apiToken) {
      console.warn("OSTRZEŻENIE: Brak konfiguracji Bright Data (BRIGHT_DATA_CUSTOMER_ID lub BRIGHT_DATA_API_TOKEN)");
    }
  }
  listProxies() {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        if (!this.customerID || !this.apiToken) {
          console.log("Bright Data credentials not configured, returning empty proxy list");
          return [];
        }
        const headers = {
          Authorization: `Bearer ${this.apiToken}`,
          Accept: "application/json",
        };
        console.log("DEBUG - Fetching active Bright Data zones...");
        const activeZonesResponse = yield axios_1.default.get(`${BRIGHTDATA_API_URL}/zone/get_active_zones`, {
          headers,
        });
        if (!activeZonesResponse.data || !Array.isArray(activeZonesResponse.data)) {
          console.log("No active Bright Data zones found or unexpected format.");
          return [];
        }
        console.log(
          `Found ${activeZonesResponse.data.length} active zones:`,
          activeZonesResponse.data.map((z) => z.name)
        );
        const detailedProxies = [];
        for (const activeZone of activeZonesResponse.data) {
          try {
            console.log(`DEBUG - Fetching details for zone: ${activeZone.name}...`);
            const zoneDetailsResp = yield axios_1.default.get(`${BRIGHTDATA_API_URL}/zone?zone=${activeZone.name}`, {
              headers,
            });
            const details = zoneDetailsResp.data;
            // Dodano bardziej szczegółowe logowanie odpowiedzi z detali
            console.log(`DEBUG - Details for ${activeZone.name}:`, JSON.stringify(details, null, 2));
            detailedProxies.push({
              zone: activeZone.name,
              proxy_type: details.plan.product || activeZone.type,
              password: details.password && details.password.length > 0 ? details.password[0] : undefined,
              created_at: details.created,
              ips_config: details.ips,
              plan_details: {
                start_date: details.plan.start,
                type: details.plan.type,
                vips_type: details.plan.vips_type,
                product: details.plan.product,
                smart_resi: details.plan.smart_resi, // Upewnij się, że to pole istnieje w ZoneDetailsResponse
              },
              country: details.plan.country,
              permissions: details.perm,
              customer_id: this.customerID,
              status: "active",
              port: 0,
              whitelist_ips: [],
              // listen_port, test_url, gb_cost, mobile, unblock, preset, city - te pola nie są bezpośrednio mapowane z odpowiedzi API
              // Możesz je dodać, jeśli mają być ustawiane na jakieś wartości domyślne lub pobierane z innego miejsca
            });
          } catch (detailError) {
            console.error(`Error fetching details for zone ${activeZone.name}:`, detailError.message);
            if (axios_1.default.isAxiosError(detailError) && detailError.response) {
              // Dodano bardziej szczegółowe logowanie błędu
              console.error(
                `Bright Data API Error for zone ${activeZone.name} details (status ${detailError.response.status}):`,
                JSON.stringify(detailError.response.data, null, 2)
              );
            }
            detailedProxies.push({
              zone: activeZone.name,
              proxy_type: activeZone.type,
              customer_id: this.customerID,
              status: "active_details_unavailable",
              port: 0,
              whitelist_ips: [],
            });
          }
        }
        console.log("Successfully fetched detailed Bright Data proxies");
        return detailedProxies;
      } catch (error) {
        console.error("Error in listProxies general execution:", error.message);
        if (axios_1.default.isAxiosError(error) && error.response) {
          // Dodano bardziej szczegółowe logowanie błędu
          console.error("Bright Data API Error Response (general):", JSON.stringify(error.response.data, null, 2));
          if (error.response.status === 401) {
            throw new Error(
              "Nieprawidłowe dane dostępowe do Bright Data API. Sprawdź BRIGHT_DATA_CUSTOMER_ID i BRIGHT_DATA_API_TOKEN."
            );
          }
          throw new Error(
            `Failed to fetch Bright Data zones: ${error.response.status} ${error.response.statusText} - ${JSON.stringify(error.response.data)}`
          );
        }
        throw new Error("Failed to fetch Bright Data zones: " + error.message);
      }
    });
  }
}
exports.BrightDataService = BrightDataService;
exports.brightDataService = new BrightDataService();
