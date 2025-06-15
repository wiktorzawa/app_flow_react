import axiosInstance from "./axios"; // Zakładając, że masz skonfigurowaną instancję axios
import axios from "axios"; // Poprawiony cudzysłów

// Interfejs dla konfiguracji proxy (zgodnie z user_proxy_config)
export interface AdsPowerProxyConfig {
  proxy_soft?: string; // np. 'brightdata', 'oxylabsauto', 'ssh', 'noproxy'
  proxy_type?: string; // np. 'http', 'https', 'socks5'
  proxy_host?: string;
  proxy_port?: string;
  proxy_user?: string;
  proxy_password?: string;
  proxy_url?: string; // Link do zmiany IP dla mobilnych proxy
  // global_config nie jest tu uwzględniany, bo wydaje się być ustawieniem zarządzania listą proxy
}

// Interfejs dla konfiguracji fingerprint (zgodnie z fingerprint_config)
export interface AdsPowerFingerprintConfig {
  automatic_timezone?: string; // "1" lub "0"
  timezone?: string; // np. "America/Yellowknife"
  webrtc?: string; // "forward", "proxy", "local", "disabled"
  location?: string; // "ask", "allow", "block"
  location_switch?: string; // "1" lub "0"
  longitude?: string;
  latitude?: string;
  accuracy?: string; // np. "1000"
  language_switch?: string; // "1" lub "0"
  language?: string[]; // np. ["en-US", "en"]
  page_language_switch?: string; // "1" lub "0"
  page_language?: string; // np. "en-US", "native"
  ua?: string; // User-agent string
  screen_resolution?: string; // "none", "random", "width_height"
  fonts?: string[]; // ["all"] lub ["Arial", "Calibri"]
  canvas?: string; // "1" (noise), "0" (default)
  webgl_image?: string; // "1" (noise), "0" (default)
  webgl?: string; // "0" (default), "2" (custom), "3" (random) - główny przełącznik WebGL
  webgl_config?: {
    unmasked_vendor?: string;
    unmasked_renderer?: string;
    webgpu?: {
      webgpu_switch?: string; // "1", "2", "0"
    };
  };
  audio?: string; // "1" (noise), "0" (close)
  do_not_track?: string; // "default", "true", "false"
  hardware_concurrency?: string; // np. "4"
  device_memory?: string; // np. "8"
  flash?: string; // "allow", "block"
  scan_port_type?: string; // "1" (enable), "0" (close)
  allow_scan_ports?: string[]; // np. ["4000", "4001"]
  media_devices?: string; // "0", "1", "2"
  media_devices_num?: {
    audioinput_num?: string;
    videoinput_num?: string;
    audiooutput_num?: string;
  };
  client_rects?: string; // "0", "1"
  device_name_switch?: string; // "0", "1", "2"
  device_name?: string;
  speech_switch?: string; // "0", "1"
  mac_address_config?: {
    model?: string; // "0", "1", "2"
    address?: string;
  };
  browser_kernel_config?: {
    version?: string; // "ua_auto", "99", etc.
    type?: string; // "chrome", "firefox"
  };
  gpu?: string; // "0", "1", "2"
  tls_switch?: string; // "'0'", "'1'"
  tls?: string; // np. "'0xC02C,0xC030'"
  // random_ua jest bardziej dla tworzenia, pomijam w definicji profilu
}

// Interfejs dla pojedynczego profilu AdsPower (frontend)
export interface AdsPowerProfile {
  user_id: string;
  name: string;
  group_id: string;
  group_name?: string;
  remark?: string;
  status?: string;
  last_open_time?: number; // Timestamp
  ip?: string;
  ip_country?: string;
  domain_name?: string;
  created_time?: string;
  serial_number?: string;
  user_proxy_config?: AdsPowerProxyConfig; // Zaktualizowane użycie szczegółowego interfejsu
  fingerprint_config?: AdsPowerFingerprintConfig; // Zaktualizowane użycie szczegółowego interfejsu
  // Usunięto user_agent z tego poziomu, jest teraz w fingerprint_config.ua
  // Usunięto proxy_info i częściowe fingerprint_config, zastąpione powyższymi
}

// Interfejs dla danych w odpowiedzi z API (lista profili + paginacja)
export interface AdsPowerProfilesResponseData {
  list: AdsPowerProfile[];
  page?: number;
  page_size?: number;
  total_count?: number; // Jeśli backend to zwraca, przyda się do paginacji
}

// Interfejs dla pełnej odpowiedzi API backendu
export interface BackendApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  errors?: unknown; // Opcjonalne pole na błędy walidacji itp.
}

// Interfejs dla danych wejściowych do tworzenia profilu (frontend)
// Powinien być zgodny z tym, czego oczekuje backendowy endpoint /api/adspower/create-profile
export interface CreateAdsPowerProfilePayload {
  group_id?: string; // Opcjonalne, domyślnie może być "0" dla braku grupy
  name?: string; // Opcjonalne, AdsPower może nadać domyślną nazwę
  user_proxy_config?: AdsPowerProxyConfig;
  fingerprint_config?: AdsPowerFingerprintConfig;
  // Można dodać inne opcjonalne pola z CreateProfilePayload, jeśli frontend ma je konfigurować
}

// Interfejs dla danych w odpowiedzi przy tworzeniu profilu (oczekiwane z backendu)
export interface CreateAdsPowerProfileResponseData {
  id: string; // ID nowo utworzonego profilu
  // Można dodać inne pola, jeśli backend je zwraca, np. name, group_id itp.
}

interface FetchProfilesParams {
  page?: number;
  pageSize?: number;
}

/**
 * Pobiera listę profili AdsPower z backendu.
 * @param params Parametry paginacji (page, pageSize)
 * @returns Promise z danymi profili lub rzuca błąd w przypadku niepowodzenia.
 */
export const fetchAdsPowerProfiles = async (
  params: FetchProfilesParams = {},
): Promise<AdsPowerProfilesResponseData> => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) {
      queryParams.append("page", params.page.toString());
    }
    if (params.pageSize !== undefined) {
      queryParams.append("pageSize", params.pageSize.toString());
    }

    const response = await axiosInstance.get<
      BackendApiResponse<AdsPowerProfilesResponseData>
    >(`/adspower/profiles?${queryParams.toString()}`);

    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    } else {
      const errorMessage =
        response.data?.message ||
        "Failed to fetch AdsPower profiles: Invalid API response from backend.";
      throw new Error(errorMessage);
    }
  } catch (error: unknown) {
    console.error("Error fetching AdsPower profiles:", error);
    let msg = "An unknown error occurred while fetching profiles";

    if (axios.isAxiosError(error)) {
      if (error.response?.data?.message) {
        msg = error.response.data.message;
      } else if (error.message) {
        msg = error.message;
      }
    } else if (error instanceof Error) {
      msg = error.message;
    }
    throw new Error(msg);
  }
};

/**
 * Tworzy nowy profil AdsPower poprzez backend.
 * @param payload Dane konfiguracyjne dla nowego profilu.
 * @returns Promise z danymi utworzonego profilu lub rzuca błąd w przypadku niepowodzenia.
 */
export const createAdsPowerProfile = async (
  payload: CreateAdsPowerProfilePayload,
): Promise<CreateAdsPowerProfileResponseData> => {
  try {
    const response = await axiosInstance.post<
      BackendApiResponse<CreateAdsPowerProfileResponseData>
    >("/adspower/create-profile", payload);

    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    } else {
      const errorMessage =
        response.data?.message ||
        "Failed to create AdsPower profile: Invalid API response from backend.";
      throw new Error(errorMessage);
    }
  } catch (error: unknown) {
    console.error("Error creating AdsPower profile:", error);
    let msg = "An unknown error occurred while creating the profile";

    if (axios.isAxiosError(error)) {
      if (error.response?.data?.message) {
        msg = error.response.data.message;
      } else if (error.message) {
        msg = error.message;
      }
    } else if (error instanceof Error) {
      msg = error.message;
    }
    throw new Error(msg);
  }
};

// Możemy tu później dodać funkcję do tworzenia profili, np. createAdsPowerProfile
// export const createAdsPowerProfile = async (payload: CreateProfilePayloadFrontend) => { ... };
