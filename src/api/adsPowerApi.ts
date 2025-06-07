import axiosInstance from "./axios"; // Zakładając, że masz skonfigurowaną instancję axios
import axios from "axios"; // Poprawiony cudzysłów

// SKOPIOWANE DEFINICJE Z backend/src/types/adsPower.ts (lub odpowiednika)

export interface UserProxyConfigInput {
  // Upewnij się, że to jest pełna definicja
  proxy_soft?:
    | "brightdata"
    | "brightauto"
    | "oxylabsauto"
    | "922S5auto"
    | "ipideaauto"
    | "ipfoxyauto"
    | "922S5auth"
    | "kookauto"
    | "ssh"
    | "other"
    | "no_proxy";
  proxy_type?: "http" | "https" | "socks5";
  proxy_host?: string;
  proxy_port?: string;
  proxy_user?: string;
  proxy_password?: string;
  proxy_url?: string;
  global_config?: "0" | "1";
}

// Upewnij się, że ten interfejs FingerprintConfigInput jest tym ROZSZERZONYM,
// zawierającym wszystkie pola z dokumentacji AdsPower, które zdefiniowałeś
// w backend/src/types/adsPower.ts (lub w DetailedFingerprintConfig w serwisie).
// Nazwałem go tutaj MainFingerprintConfigInput dla spójności z Twoim kodem.
export interface MainFingerprintConfigInput {
  automatic_timezone?: "0" | "1";
  timezone?: string;
  webrtc?: "forward" | "proxy" | "local" | "disabled";
  location?: "ask" | "allow" | "block";
  location_switch?: "0" | "1";
  longitude?: string;
  latitude?: string;
  accuracy?: string;
  language_switch?: "0" | "1";
  language?: string[];
  page_language_switch?: "0" | "1";
  page_language?: string;
  ua?: string;
  screen_resolution?: string;
  fonts?: string[];
  canvas?: "0" | "1";
  webgl_image?: "0" | "1";
  webgl?: "0" | "2" | "3";
  webgl_config?: {
    unmasked_vendor?: string;
    unmasked_renderer?: string;
    webgpu?: {
      webgpu_switch?: "0" | "1" | "2";
    };
  };
  audio?: "0" | "1";
  do_not_track?: "default" | "true" | "false";
  hardware_concurrency?: string;
  device_memory?: string;
  flash?: "allow" | "block";
  scan_port_type?: "0" | "1";
  allow_scan_ports?: string[];
  media_devices?: "0" | "1" | "2";
  media_devices_num?: {
    audioinput_num?: string;
    videoinput_num?: string;
    audiooutput_num?: string;
  };
  client_rects?: "0" | "1";
  device_name_switch?: "0" | "1" | "2";
  device_name?: string;
  speech_switch?: "0" | "1";
  mac_address_config?: {
    model?: "0" | "1" | "2";
    address?: string;
  };
  browser_kernel_config?: {
    version?: string;
    type?: "chrome" | "firefox";
  };
  gpu?: "0" | "1" | "2";
  tls_switch?: "'0'" | "'1'";
  tls?: string;
}

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
  user_proxy_config?: UserProxyConfigInput; // Używamy skopiowanego UserProxyConfigInput
  fingerprint_config?: MainFingerprintConfigInput; // Używamy skopiowanego MainFingerprintConfigInput
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

// Interfejs dla danych lokalizacyjnych z L_tabela, które są zagnieżdżone
export interface LTabelaLocationData {
  ID_Profilu_Master: string;
  L_Miasto_Docelowe: string;
  L_KodPocztowy_Docelowy_Przyklad: string;
  L_Region_Docelowy: string;
  L_Kraj_Docelowy: string;
  L_Uwagi_Lokalizacja: string;
}

// Nowy interfejs dla przygotowanego profilu, który będzie wyświetlany w trzeciej tabeli
// Rozszerza standardowy AdsPowerProfile (jeśli niektóre pola są wspólne)
// i dodaje specyficzne pola z procesu przygotowania.
// Upewnij się, że FingerprintConfigInput tutaj odpowiada temu, co generuje backend
// (czyli DetailedFingerprintConfig z profileGenerationService.ts)
export interface PreparedProfileDetails {
  name: string; // Nazwa profilu (np. Profil_Warszawa_PROF_001)
  group_id?: string; // ID grupy
  user_proxy_config?: UserProxyConfigInput; // Zdefiniowany już typ
  fingerprint_config?: MainFingerprintConfigInput; // Użyj globalnego typu, który powinien być rozszerzony
  // lub zdefiniuj tu nowy, bardziej szczegółowy, pasujący do DetailedFingerprintConfig
  remark?: string; // Notatki

  // Dodatkowe dane z L_tabela zagnieżdżone w locationData
  locationData: LTabelaLocationData;

  // Możesz dodać inne pola, jeśli backend je zwraca w combinedProfileData
  // np. status (jeśli go ustawiasz), user_id (jeśli jest generowane na tym etapie)
}

// Zaktualizowany interfejs odpowiedzi dla prepareAdsPowerBatch
export interface PrepareAdsPowerBatchResponseData {
  count: number;
  data: PreparedProfileDetails[]; // Używamy nowego, szczegółowego interfejsu
  message: string; // To jest szczegółowy komunikat, np. "Pomyślnie przygotowano..."
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
  params: FetchProfilesParams = {}
): Promise<AdsPowerProfilesResponseData> => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) {
      queryParams.append("page", params.page.toString());
    }
    if (params.pageSize !== undefined) {
      queryParams.append("pageSize", params.pageSize.toString());
    }

    const response = await axiosInstance.get<BackendApiResponse<AdsPowerProfilesResponseData>>(
      `/adspower/profiles?${queryParams.toString()}`
    );

    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    } else {
      const errorMessage =
        response.data?.message || "Failed to fetch AdsPower profiles: Invalid API response from backend.";
      throw new Error(errorMessage);
    }
  } catch (error: unknown) {
    console.error("Error fetching AdsPower profiles:", error);
    let msg = "An unknown error occurred while fetching profiles";

    if (axios.isAxiosError(error)) {
      if (error.response && error.response.data && error.response.data.message) {
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
  payload: CreateAdsPowerProfilePayload
): Promise<CreateAdsPowerProfileResponseData> => {
  try {
    const response = await axiosInstance.post<BackendApiResponse<CreateAdsPowerProfileResponseData>>(
      "/adspower/create-profile",
      payload
    );

    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    } else {
      const errorMessage =
        response.data?.message || "Failed to create AdsPower profile: Invalid API response from backend.";
      throw new Error(errorMessage);
    }
  } catch (error: unknown) {
    console.error("Error creating AdsPower profile:", error);
    let msg = "An unknown error occurred while creating the profile";

    if (axios.isAxiosError(error)) {
      if (error.response && error.response.data && error.response.data.message) {
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
 * Wywołuje endpoint backendu do przygotowania wsadowej listy profili AdsPower.
 * @returns Promise z danymi operacji lub rzuca błąd w przypadku niepowodzenia.
 */
export const prepareAdsPowerBatch = async (): Promise<PrepareAdsPowerBatchResponseData> => {
  try {
    const response = await axiosInstance.post<
      BackendApiResponse<PrepareAdsPowerBatchResponseData> // Odpowiedź backendu ma zagnieżdżone 'data'
    >("/profile-generation/prepare-adspower-batch");

    // Backend zwraca teraz { success: true, message: "Operacja...", data: { count: X, data: [...], message: "Pomyślnie..."}}
    // więc response.data.data to będzie obiekt typu PrepareAdsPowerBatchResponseData
    if (response.data && response.data.success && response.data.data) {
      return response.data.data; // Zwracamy obiekt { count, data, message }
    } else {
      const errorMessage =
        response.data?.message || "Failed to prepare AdsPower profiles batch: Invalid API response from backend.";
      throw new Error(errorMessage);
    }
  } catch (error: unknown) {
    console.error("Error preparing AdsPower profiles batch:", error);
    let msg = "An unknown error occurred while preparing the profiles batch";

    if (axios.isAxiosError(error)) {
      if (error.response && error.response.data && error.response.data.message) {
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
 * Uruchamia przeglądarkę dla określonego profilu AdsPower.
 * @param userId ID profilu AdsPower
 * @param options Opcjonalne parametry uruchomienia
 * @returns Promise z danymi uruchomionej przeglądarki
 */
export const startAdsPowerBrowser = async (
  userId: string,
  options?: {
    ipTab?: boolean;
    openTabs?: boolean;
    clearCacheAfterClosing?: boolean;
    launchArgs?: string[];
  }
): Promise<{ wsEndpoint: string; status: string }> => {
  try {
    const params: Record<string, any> = { user_id: userId };
    if (options) {
      if (options.ipTab !== undefined) params.ip_tab = options.ipTab ? "1" : "0";
      if (options.openTabs !== undefined) params.open_tabs = options.openTabs ? "1" : "0";
      if (options.clearCacheAfterClosing !== undefined)
        params.clear_cache_after_closing = options.clearCacheAfterClosing ? "1" : "0";
      if (options.launchArgs) params.launch_args = JSON.stringify(options.launchArgs);
    }
    const response = await axiosInstance.get(`/adspower/profiles/${userId}/start-browser`, { params });
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data?.message || "Failed to start browser");
    }
  } catch (error) {
    console.error("Error starting AdsPower browser:", error);
    throw error;
  }
};

/**
 * Zatrzymuje przeglądarkę dla określonego profilu AdsPower.
 * @param userId ID profilu AdsPower
 * @returns Promise z wynikiem operacji
 */
export const stopAdsPowerBrowser = async (userId: string): Promise<{ success: boolean }> => {
  try {
    const response = await axiosInstance.get(`/adspower/profiles/${userId}/stop-browser`);
    if (response.data && response.data.success) {
      return { success: true };
    } else {
      throw new Error(response.data?.message || "Failed to stop browser");
    }
  } catch (error) {
    console.error("Error stopping AdsPower browser:", error);
    throw error;
  }
};

/**
 * Sprawdza status przeglądarki dla określonego profilu AdsPower.
 * @param userId ID profilu AdsPower
 * @returns Promise z informacją o statusie przeglądarki
 */
export const checkAdsPowerBrowserStatus = async (userId: string): Promise<{ status: string }> => {
  try {
    const response = await axiosInstance.get(`/adspower/profiles/${userId}/browser-status`, {
      params: { user_id: userId },
    });
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data?.message || "Failed to check browser status");
    }
  } catch (error) {
    console.error("Error checking AdsPower browser status:", error);
    throw error;
  }
};
