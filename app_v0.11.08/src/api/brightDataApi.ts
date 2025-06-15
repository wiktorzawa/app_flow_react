import axiosInstance from "./axios"; // Zakładając, że masz skonfigurowaną instancję axios
import { AxiosError } from "axios";

// Interfejs dla pojedynczego proxy z Bright Data (frontend)
// Powinien odpowiadać strukturze BrightDataProxy z backendu
export interface BrightDataProxy {
  port: number; // Pozostaje, jeśli frontend tego oczekuje, mimo że nie ma w API detali strefy
  listen_port?: number;
  test_url?: string;
  password?: string; 
  gb_cost?: number;
  whitelist_ips?: string[];
  // account_id?: string;
  // customer?: string;
  customer_id?: string;
  zone: string; 
  mobile?: boolean;
  unblock?: boolean;
  proxy_type?: string; 
  preset?: string;
  country?: string; 
  city?: string;
  
  // Nowe/zaktualizowane pola na podstawie odpowiedzi API
  created_at?: string; 
  ips_config?: string[]; 
  plan_details?: { 
    start_date?: string; 
    type?: string; // np. "resident"
    vips_type?: string; // np. "shared"
    product?: string; // np. "res_rotating"
    smart_resi?: number; // Dodaj, jeśli potrzebujesz
  };
  permissions?: string; // np. "country"
  
  status?: string; // np. "active" lub "active_details_unavailable"
}

// Interfejs dla odpowiedzi API backendu zawierającej listę proxy Bright Data
export interface BrightDataProxiesResponse {
  success: boolean;
  count: number;
  data: BrightDataProxy[];
  message?: string;
}

// Funkcja do pobierania listy proxy Bright Data z backendu
export const fetchBrightDataProxies = async (): Promise<BrightDataProxiesResponse> => {
  try {
    const response = await axiosInstance.get<BrightDataProxiesResponse>(
      "/brightdata/proxies" // Endpoint na Twoim backendzie
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching Bright Data proxies from backend:", error);
    // Rzucanie błędu dalej, aby komponent mógł go obsłużyć
    // Możesz chcieć bardziej szczegółowo obsłużyć różne typy błędów
    let errorMessage = "An unknown error occurred while fetching Bright Data proxies.";
    if (error instanceof AxiosError && error.response) {
      errorMessage = error.response.data?.message || error.message || errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
}; 