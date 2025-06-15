import axios from "axios";
import { config } from "../config/config";

// Bright Data REST API
const BRIGHTDATA_API_URL = "https://api.brightdata.com";

// Interfejs dla proxy/zone z Bright Data API
export interface BrightDataProxy {
  port: number;
  listen_port?: number;
  test_url?: string;
  password?: string;
  gb_cost?: number;
  whitelist_ips?: string[];
  customer_id?: string;
  zone: string;
  mobile?: boolean;
  unblock?: boolean;
  proxy_type?: string;
  preset?: string;
  country?: string;
  city?: string;
  created_at?: string;
  ips_config?: string[];
  plan_details?: {
    start_date?: string;
    type?: string;
    vips_type?: string;
    product?: string;
    smart_resi?: number;
  };
  permissions?: string;
  status?: string;
}

// Interfejs dla odpowiedzi z /zone/get_active_zones
interface ActiveZoneInfo {
  name: string;
  type: string;
}

// Interfejs dla szczegółowej odpowiedzi z /zone?zone={name}
interface ZoneDetailsResponse {
  created: string;
  password: string[];
  ips: string[];
  plan: {
    start: string;
    type: string;
    vips_type: string;
    country: string;
    smart_resi: number;
    product: string;
  };
  perm: string;
  // Możesz dodać więcej pól, jeśli API je zwraca, np.
  // status?: string; // Jeśli API zwraca status na tym poziomie
  // ... inne specyficzne pola dla danego typu strefy
}

export class BrightDataService {
  private customerID: string;
  private apiToken: string;

  constructor() {
    this.customerID = config.brightDataCustomerID || "";
    this.apiToken = config.brightDataApiToken || "";

    if (!this.customerID || !this.apiToken) {
      console.warn("OSTRZEŻENIE: Brak konfiguracji Bright Data (BRIGHT_DATA_CUSTOMER_ID lub BRIGHT_DATA_API_TOKEN)");
    }
  }

  public async listProxies(): Promise<BrightDataProxy[]> {
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
      const activeZonesResponse = await axios.get<ActiveZoneInfo[]>(
        `${BRIGHTDATA_API_URL}/zone/get_active_zones`,
        { headers }
      );

      if (!activeZonesResponse.data || !Array.isArray(activeZonesResponse.data)) {
        console.log("No active Bright Data zones found or unexpected format.");
        return [];
      }
      console.log(`Found ${activeZonesResponse.data.length} active zones:`, activeZonesResponse.data.map(z => z.name));

      const detailedProxies: BrightDataProxy[] = [];

      for (const activeZone of activeZonesResponse.data) {
        try {
          console.log(`DEBUG - Fetching details for zone: ${activeZone.name}...`);
          const zoneDetailsResp = await axios.get<ZoneDetailsResponse>(
            `${BRIGHTDATA_API_URL}/zone?zone=${activeZone.name}`,
            { headers }
          );
          
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
        } catch (detailError: any) {
          console.error(`Error fetching details for zone ${activeZone.name}:`, detailError.message);
          if (axios.isAxiosError(detailError) && detailError.response) {
            // Dodano bardziej szczegółowe logowanie błędu
            console.error(`Bright Data API Error for zone ${activeZone.name} details (status ${detailError.response.status}):`, JSON.stringify(detailError.response.data, null, 2));
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

    } catch (error: any) {
      console.error("Error in listProxies general execution:", error.message);
      if (axios.isAxiosError(error) && error.response) {
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
  }
}

export const brightDataService = new BrightDataService();
