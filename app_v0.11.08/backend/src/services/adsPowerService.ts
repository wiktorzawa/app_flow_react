import axios, { AxiosInstance, AxiosError } from "axios";
import {
  AdsPowerResponse,
  CreateProfilePayload,
  CreateProfileResponseData,
  AdsPowerProfileListData,
  UpdateProfilePayload,
  UpdateProfileResponseData,
  DeleteProfilesPayload,
  DeleteProfilesResponseData,
  RegroupProfilesPayload,
  RegroupProfilesResponseData,
  AdsPowerProfileDetailData,
  StartBrowserResponseData,
  StopBrowserResponseData,
  BrowserStatusResponseData,
  CreateGroupPayload,
  CreateGroupResponseData,
  AdsPowerGroupListData,
  DeleteGroupsPayload,
  DeleteGroupsResponseData,
  ClearAllProfilesCacheResponseData,
  UpdateGroupPayload,
  UpdateGroupResponseData,
} from "../types";

// Domyślny URL dla AdsPower Local API
const ADS_POWER_API_URL = "http://local.adspower.net:50325";

class AdsPowerService {
  private apiClient: AxiosInstance;

  constructor() {
    this.apiClient = axios.create({
      baseURL: ADS_POWER_API_URL,
      timeout: 15000, // Zwiększamy timeout dla potencjalnie dłuższych operacji
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * Sprawdza status API AdsPower poprzez zapytanie o listę grup.
   * @returns Odpowiedź z API AdsPower lub null w przypadku błędu.
   */
  public async checkApiStatus(): Promise<AdsPowerResponse<AdsPowerGroupListData> | null> {
    try {
      console.log(`Attempting to connect to AdsPower API at ${ADS_POWER_API_URL}/api/v1/group/list`);
      const response = await this.apiClient.get<AdsPowerResponse<AdsPowerGroupListData>>("/api/v1/group/list", {
        params: {
          page: 1, // Endpoint /api/v1/group/list może używać 'page' i 'page_size'
          page_size: 1,
        },
      });
      console.log("AdsPower API response data (Query Group):", JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      // Zachowujemy istniejącą, szczegółową obsługę błędów
      if (axios.isAxiosError(error)) {
        console.error("Axios error connecting to AdsPower API (checkApiStatus):", error.message);
        if (error.response) {
          console.error("AdsPower API error response status:", error.response.status);
          console.error("AdsPower API error response headers:", JSON.stringify(error.response.headers, null, 2));
          console.error("AdsPower API error response data:", JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
          console.error("AdsPower API no response received. Request details:", error.request);
        } else {
          console.error("Error setting up AdsPower API request:", error.message);
        }
      } else {
        console.error("An unexpected error occurred while connecting to AdsPower API (checkApiStatus):", error);
      }
      return null;
    }
  }

  /**
   * Tworzy nowy profil przeglądarki w AdsPower.
   * @param payload Dane konfiguracyjne dla nowego profilu.
   * @returns Odpowiedź z API AdsPower zawierająca ID utworzonego profilu lub null w przypadku błędu.
   */
  public async createProfile(
    payload: CreateProfilePayload
  ): Promise<AdsPowerResponse<CreateProfileResponseData> | null> {
    const endpoint = "/api/v1/user/create";
    const fullUrl = `${this.apiClient.defaults.baseURL}${endpoint}`;
    try {
      console.log(`Attempting to create AdsPower profile at URL: ${fullUrl}`);
      console.log("Attempting to create AdsPower profile with payload:", JSON.stringify(payload, null, 2));
      const response = await this.apiClient.post<AdsPowerResponse<CreateProfileResponseData>>(endpoint, payload);
      console.log("AdsPower create profile API response data:", JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError; // Rzutowanie dla lepszego dostępu do pól błędu Axios
      console.error(`Error creating AdsPower profile. Message: ${axiosError.message}`);
      console.error("Request payload for failed profile creation:", JSON.stringify(payload, null, 2));
      if (axiosError.response) {
        console.error("AdsPower API error response status (createProfile):", axiosError.response.status);
        console.error(
          "AdsPower API error response headers (createProfile):",
          JSON.stringify(axiosError.response.headers, null, 2)
        );
        console.error(
          "AdsPower API error response data (createProfile):",
          JSON.stringify(axiosError.response.data, null, 2)
        );
      } else if (axiosError.request) {
        console.error("AdsPower API no response received (createProfile). Request details:", axiosError.request);
      } else {
        console.error("Error setting up AdsPower API request (createProfile):", axiosError.message);
      }
      // Zwróć dane błędu z odpowiedzi AdsPower, jeśli są dostępne, aby kontroler mógł je przetworzyć
      if (axiosError.response && axiosError.response.data) {
        return axiosError.response.data as AdsPowerResponse<CreateProfileResponseData>;
      }
      return null;
    }
  }

  /**
   * Pobiera listę profili przeglądarki z AdsPower.
   * @param page Opcjonalnie numer strony (domyślnie 1).
   * @param pageSize Opcjonalnie rozmiar strony (domyślnie 50, można dostosować).
   * @returns Odpowiedź z API AdsPower zawierająca listę profili lub null w przypadku błędu.
   */
  public async listProfiles(
    page: number = 1,
    pageSize: number = 50 // AdsPower API często ma domyślny limit, np. 50 lub 100
  ): Promise<AdsPowerResponse<AdsPowerProfileListData> | null> {
    const endpoint = "/api/v1/user/list"; // Zakładany endpoint
    const fullUrl = `${this.apiClient.defaults.baseURL}${endpoint}`;
    try {
      console.log(`Attempting to list AdsPower profiles from URL: ${fullUrl}`);
      const response = await this.apiClient.get<AdsPowerResponse<AdsPowerProfileListData>>(endpoint, {
        params: {
          page: page, // Zmieniono z page_no na page
          page_size: pageSize, // Zmieniono z page_size na page_size
        },
      });
      console.log("AdsPower list profiles API response data:", JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`Error listing AdsPower profiles. Message: ${axiosError.message}`);
      if (axiosError.response) {
        console.error("AdsPower API error response status (listProfiles):", axiosError.response.status);
        console.error(
          "AdsPower API error response headers (listProfiles):",
          JSON.stringify(axiosError.response.headers, null, 2)
        );
        console.error(
          "AdsPower API error response data (listProfiles):",
          JSON.stringify(axiosError.response.data, null, 2)
        );
      } else if (axiosError.request) {
        console.error("AdsPower API no response received (listProfiles). Request details:", axiosError.request);
      } else {
        console.error("Error setting up AdsPower API request (listProfiles):", axiosError.message);
      }
      // Zwróć dane błędu z odpowiedzi AdsPower, jeśli są dostępne
      if (axiosError.response && axiosError.response.data) {
        return axiosError.response.data as AdsPowerResponse<AdsPowerProfileListData>;
      }
      return null;
    }
  }

  /**
   * Aktualizuje istniejący profil przeglądarki w AdsPower.
   * @param payload Dane do aktualizacji profilu, w tym user_id.
   * @returns Odpowiedź z API AdsPower lub null w przypadku błędu.
   */
  public async updateProfile(
    payload: UpdateProfilePayload
  ): Promise<AdsPowerResponse<UpdateProfileResponseData> | null> {
    const endpoint = "/api/v1/user/update";
    const fullUrl = `${this.apiClient.defaults.baseURL}${endpoint}`;
    try {
      console.log(`Attempting to update AdsPower profile at URL: ${fullUrl}`);
      console.log("Attempting to update AdsPower profile with payload:", JSON.stringify(payload, null, 2));
      // W AdsPower API, user_id jest częścią payloadu dla aktualizacji
      const response = await this.apiClient.post<AdsPowerResponse<UpdateProfileResponseData>>(endpoint, payload);
      console.log("AdsPower update profile API response data:", JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`Error updating AdsPower profile (user_id: ${payload.user_id}). Message: ${axiosError.message}`);
      console.error("Request payload for failed profile update:", JSON.stringify(payload, null, 2));
      if (axiosError.response) {
        console.error("AdsPower API error response status (updateProfile):", axiosError.response.status);
        console.error(
          "AdsPower API error response headers (updateProfile):",
          JSON.stringify(axiosError.response.headers, null, 2)
        );
        console.error(
          "AdsPower API error response data (updateProfile):",
          JSON.stringify(axiosError.response.data, null, 2)
        );
        // Zwróć dane błędu z odpowiedzi AdsPower, jeśli są dostępne
        return axiosError.response.data as AdsPowerResponse<UpdateProfileResponseData>;
      } else if (axiosError.request) {
        console.error("AdsPower API no response received (updateProfile). Request details:", axiosError.request);
      } else {
        console.error("Error setting up AdsPower API request (updateProfile):", axiosError.message);
      }
      return null; // Zwracamy null tylko jeśli nie ma odpowiedzi od serwera AdsPower z poprawnym formatem błędu
    }
  }

  /**
   * Usuwa wybrane profile przeglądarki w AdsPower.
   * @param payload Obiekt zawierający tablicę user_ids profili do usunięcia.
   * @returns Odpowiedź z API AdsPower lub null w przypadku błędu.
   */
  public async deleteProfiles(
    payload: DeleteProfilesPayload
  ): Promise<AdsPowerResponse<DeleteProfilesResponseData> | null> {
    const endpoint = "/api/v1/user/delete";
    const fullUrl = `${this.apiClient.defaults.baseURL}${endpoint}`;
    try {
      console.log(`Attempting to delete AdsPower profiles from URL: ${fullUrl}`);
      console.log("Attempting to delete AdsPower profiles with payload:", JSON.stringify(payload, null, 2));
      const response = await this.apiClient.post<AdsPowerResponse<DeleteProfilesResponseData>>(endpoint, payload);
      console.log("AdsPower delete profiles API response data:", JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`Error deleting AdsPower profiles. Message: ${axiosError.message}`);
      console.error("Request payload for failed profile deletion:", JSON.stringify(payload, null, 2));
      if (axiosError.response) {
        console.error("AdsPower API error response status (deleteProfiles):", axiosError.response.status);
        console.error(
          "AdsPower API error response headers (deleteProfiles):",
          JSON.stringify(axiosError.response.headers, null, 2)
        );
        console.error(
          "AdsPower API error response data (deleteProfiles):",
          JSON.stringify(axiosError.response.data, null, 2)
        );
        // Zwróć dane błędu z odpowiedzi AdsPower, jeśli są dostępne
        return axiosError.response.data as AdsPowerResponse<DeleteProfilesResponseData>;
      } else if (axiosError.request) {
        console.error("AdsPower API no response received (deleteProfiles). Request details:", axiosError.request);
      } else {
        console.error("Error setting up AdsPower API request (deleteProfiles):", axiosError.message);
      }
      return null;
    }
  }

  /**
   * Przenosi wybrane profile do innej grupy w AdsPower.
   * @param payload Obiekt zawierający tablicę user_ids profili oraz group_id grupy docelowej.
   * @returns Odpowiedź z API AdsPower lub null w przypadku błędu.
   */
  public async regroupProfiles(
    payload: RegroupProfilesPayload
  ): Promise<AdsPowerResponse<RegroupProfilesResponseData> | null> {
    const endpoint = "/api/v1/user/regroup";
    const fullUrl = `${this.apiClient.defaults.baseURL}${endpoint}`;
    try {
      console.log(`Attempting to regroup AdsPower profiles at URL: ${fullUrl}`);
      console.log("Attempting to regroup AdsPower profiles with payload:", JSON.stringify(payload, null, 2));
      const response = await this.apiClient.post<AdsPowerResponse<RegroupProfilesResponseData>>(endpoint, payload);
      console.log("AdsPower regroup profiles API response data:", JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`Error regrouping AdsPower profiles. Message: ${axiosError.message}`);
      console.error("Request payload for failed profile regrouping:", JSON.stringify(payload, null, 2));
      if (axiosError.response) {
        console.error("AdsPower API error response status (regroupProfiles):", axiosError.response.status);
        console.error(
          "AdsPower API error response headers (regroupProfiles):",
          JSON.stringify(axiosError.response.headers, null, 2)
        );
        console.error(
          "AdsPower API error response data (regroupProfiles):",
          JSON.stringify(axiosError.response.data, null, 2)
        );
        return axiosError.response.data as AdsPowerResponse<RegroupProfilesResponseData>;
      } else if (axiosError.request) {
        console.error("AdsPower API no response received (regroupProfiles). Request details:", axiosError.request);
      } else {
        console.error("Error setting up AdsPower API request (regroupProfiles):", axiosError.message);
      }
      return null;
    }
  }

  /**
   * Czyści lokalny cache wygenerowany przez wszystkie otwarte przeglądarki w AdsPower.
   * Jest to operacja globalna.
   * @returns Odpowiedź z API AdsPower lub null w przypadku błędu.
   */
  public async clearAllProfilesCache(): Promise<AdsPowerResponse<ClearAllProfilesCacheResponseData> | null> {
    const endpoint = "/api/v1/user/delete-cache";
    const fullUrl = `${this.apiClient.defaults.baseURL}${endpoint}`;
    try {
      console.log(`Attempting to clear all AdsPower profiles cache at URL: ${fullUrl}`);
      // Ten endpoint nie wymaga payloadu zgodnie z dokumentacją
      const response = await this.apiClient.post<AdsPowerResponse<ClearAllProfilesCacheResponseData>>(endpoint, {});
      console.log("AdsPower clear all profiles cache API response data:", JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`Error clearing all AdsPower profiles cache. Message: ${axiosError.message}`);
      if (axiosError.response) {
        console.error("AdsPower API error response status (clearAllProfilesCache):", axiosError.response.status);
        console.error(
          "AdsPower API error response headers (clearAllProfilesCache):",
          JSON.stringify(axiosError.response.headers, null, 2)
        );
        console.error(
          "AdsPower API error response data (clearAllProfilesCache):",
          JSON.stringify(axiosError.response.data, null, 2)
        );
        return axiosError.response.data as AdsPowerResponse<ClearAllProfilesCacheResponseData>;
      } else if (axiosError.request) {
        console.error(
          "AdsPower API no response received (clearAllProfilesCache). Request details:",
          axiosError.request
        );
      } else {
        console.error("Error setting up AdsPower API request (clearAllProfilesCache):", axiosError.message);
      }
      return null;
    }
  }

  /**
   * Uruchamia przeglądarkę dla określonego profilu AdsPower.
   * @param userId ID profilu użytkownika.
   * @returns Odpowiedź z API AdsPower zawierająca m.in. wsEndpoint dla Puppeteera lub null w przypadku błędu.
   */
  public async startBrowser(
    userId: string,
    launchArgs?: string[], // Dodatkowe argumenty uruchamiania przeglądarki
    ipTab?: "0" | "1", // Czy otwierać stronę sprawdzania IP
    openTabs?: "0" | "1", // Czy otwierać wcześniej skonfigurowane strony
    clearCacheAfterClosing?: "0" | "1"
  ): Promise<AdsPowerResponse<StartBrowserResponseData> | null> {
    const endpoint = "/api/v1/browser/start";
    const params: Record<string, any> = { user_id: userId };

    if (launchArgs && launchArgs.length > 0) {
      params.launch_args = JSON.stringify(launchArgs); // Musi być JSON stringiem
    }
    if (ipTab) {
      params.ip_tab = ipTab;
    }
    if (openTabs) {
      params.open_tabs = openTabs;
    }
    if (clearCacheAfterClosing) {
      params.clear_cache_after_closing = clearCacheAfterClosing;
    }

    const fullUrl = `${this.apiClient.defaults.baseURL}${endpoint}`;
    try {
      console.log(`Attempting to start AdsPower browser for profile ID: ${userId} at URL: ${fullUrl}`);
      console.log("With params:", JSON.stringify(params));
      const response = await this.apiClient.get<AdsPowerResponse<StartBrowserResponseData>>(endpoint, { params });
      console.log("AdsPower start browser API response data:", JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`Error starting AdsPower browser for profile ID: ${userId}. Message: ${axiosError.message}`);
      if (axiosError.response) {
        console.error("AdsPower API error response status (startBrowser):", axiosError.response.status);
        console.error(
          "AdsPower API error response headers (startBrowser):",
          JSON.stringify(axiosError.response.headers, null, 2)
        );
        console.error(
          "AdsPower API error response data (startBrowser):",
          JSON.stringify(axiosError.response.data, null, 2)
        );
        return axiosError.response.data as AdsPowerResponse<StartBrowserResponseData>;
      } else if (axiosError.request) {
        console.error("AdsPower API no response received (startBrowser). Request details:", axiosError.request);
      } else {
        console.error("Error setting up AdsPower API request (startBrowser):", axiosError.message);
      }
      return null;
    }
  }

  /**
   * Zatrzymuje przeglądarkę dla określonego profilu AdsPower.
   * @param userId ID profilu użytkownika.
   * @returns Odpowiedź z API AdsPower lub null w przypadku błędu.
   */
  public async stopBrowser(userId: string): Promise<AdsPowerResponse<StopBrowserResponseData> | null> {
    const endpoint = "/api/v1/browser/stop";
    const params = { user_id: userId };
    const fullUrl = `${this.apiClient.defaults.baseURL}${endpoint}`;
    try {
      console.log(`Attempting to stop AdsPower browser for profile ID: ${userId} at URL: ${fullUrl}`);
      const response = await this.apiClient.get<AdsPowerResponse<StopBrowserResponseData>>(endpoint, { params });
      console.log("AdsPower stop browser API response data:", JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`Error stopping AdsPower browser for profile ID: ${userId}. Message: ${axiosError.message}`);
      if (axiosError.response) {
        console.error("AdsPower API error response status (stopBrowser):", axiosError.response.status);
        console.error(
          "AdsPower API error response headers (stopBrowser):",
          JSON.stringify(axiosError.response.headers, null, 2)
        );
        console.error(
          "AdsPower API error response data (stopBrowser):",
          JSON.stringify(axiosError.response.data, null, 2)
        );
        return axiosError.response.data as AdsPowerResponse<StopBrowserResponseData>;
      } else if (axiosError.request) {
        console.error("AdsPower API no response received (stopBrowser). Request details:", axiosError.request);
      } else {
        console.error("Error setting up AdsPower API request (stopBrowser):", axiosError.message);
      }
      return null;
    }
  }

  /**
   * Sprawdza status (aktywna/nieaktywna) przeglądarki dla określonego profilu AdsPower.
   * @param userId ID profilu użytkownika.
   * @returns Odpowiedź z API AdsPower zawierająca status przeglądarki lub null w przypadku błędu.
   */
  public async checkBrowserStatus(userId: string): Promise<AdsPowerResponse<BrowserStatusResponseData> | null> {
    const endpoint = "/api/v1/browser/active";
    const params = { user_id: userId };
    const fullUrl = `${this.apiClient.defaults.baseURL}${endpoint}`;
    try {
      console.log(`Attempting to check AdsPower browser status for profile ID: ${userId} at URL: ${fullUrl}`);
      const response = await this.apiClient.get<AdsPowerResponse<BrowserStatusResponseData>>(endpoint, { params });
      console.log("AdsPower check browser status API response data:", JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`Error checking AdsPower browser status for profile ID: ${userId}. Message: ${axiosError.message}`);
      if (axiosError.response) {
        console.error("AdsPower API error response status (checkBrowserStatus):", axiosError.response.status);
        console.error(
          "AdsPower API error response headers (checkBrowserStatus):",
          JSON.stringify(axiosError.response.headers, null, 2)
        );
        console.error(
          "AdsPower API error response data (checkBrowserStatus):",
          JSON.stringify(axiosError.response.data, null, 2)
        );
        return axiosError.response.data as AdsPowerResponse<BrowserStatusResponseData>;
      } else if (axiosError.request) {
        console.error("AdsPower API no response received (checkBrowserStatus). Request details:", axiosError.request);
      } else {
        console.error("Error setting up AdsPower API request (checkBrowserStatus):", axiosError.message);
      }
      return null;
    }
  }

  /**
   * Tworzy nową grupę profili w AdsPower.
   * @param payload Obiekt zawierający group_name oraz opcjonalnie remark.
   * @returns Odpowiedź z API AdsPower zawierająca ID utworzonej grupy lub null w przypadku błędu.
   */
  public async createGroup(payload: CreateGroupPayload): Promise<AdsPowerResponse<CreateGroupResponseData> | null> {
    const endpoint = "/api/v1/group/create";
    const fullUrl = `${this.apiClient.defaults.baseURL}${endpoint}`;
    try {
      console.log(`Attempting to create AdsPower group at URL: ${fullUrl}`);
      console.log("Attempting to create AdsPower group with payload:", JSON.stringify(payload, null, 2));
      const response = await this.apiClient.post<AdsPowerResponse<CreateGroupResponseData>>(endpoint, payload);
      console.log("AdsPower create group API response data:", JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`Error creating AdsPower group. Message: ${axiosError.message}`);
      console.error("Request payload for failed group creation:", JSON.stringify(payload, null, 2));
      if (axiosError.response) {
        console.error("AdsPower API error response status (createGroup):", axiosError.response.status);
        console.error(
          "AdsPower API error response headers (createGroup):",
          JSON.stringify(axiosError.response.headers, null, 2)
        );
        console.error(
          "AdsPower API error response data (createGroup):",
          JSON.stringify(axiosError.response.data, null, 2)
        );
        return axiosError.response.data as AdsPowerResponse<CreateGroupResponseData>;
      } else if (axiosError.request) {
        console.error("AdsPower API no response received (createGroup). Request details:", axiosError.request);
      } else {
        console.error("Error setting up AdsPower API request (createGroup):", axiosError.message);
      }
      return null;
    }
  }

  /**
   * Listuje grupy profili w AdsPower, z opcjonalną paginacją (jeśli wspierana przez API).
   * Dokumentacja /api/v1/group/list nie precyzuje parametrów paginacji.
   * @param page Numer strony (opcjonalny).
   * @param pageSize Rozmiar strony (opcjonalny).
   * @returns Odpowiedź z API AdsPower zawierająca listę grup lub null w przypadku błędu.
   */
  public async listGroups(page?: number, pageSize?: number): Promise<AdsPowerResponse<AdsPowerGroupListData> | null> {
    const endpoint = "/api/v1/group/list";
    const params: Record<string, any> = {};
    if (page !== undefined) {
      // Dokumentacja nie precyzuje nazwy, ale typowo jest to 'page'
      params.page = page;
    }
    if (pageSize !== undefined) {
      // Dokumentacja nie precyzuje nazwy, ale typowo jest to 'page_size'
      params.page_size = pageSize;
    }

    const fullUrl = `${this.apiClient.defaults.baseURL}${endpoint}`;
    try {
      console.log(`Attempting to list AdsPower groups at URL: ${fullUrl}`);
      if (Object.keys(params).length > 0) {
        console.log("With params:", JSON.stringify(params));
      }
      const response = await this.apiClient.get<AdsPowerResponse<AdsPowerGroupListData>>(endpoint, { params });
      console.log("AdsPower list groups API response data:", JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`Error listing AdsPower groups. Message: ${axiosError.message}`);
      if (axiosError.response) {
        console.error("AdsPower API error response status (listGroups):", axiosError.response.status);
        console.error(
          "AdsPower API error response headers (listGroups):",
          JSON.stringify(axiosError.response.headers, null, 2)
        );
        console.error(
          "AdsPower API error response data (listGroups):",
          JSON.stringify(axiosError.response.data, null, 2)
        );
        return axiosError.response.data as AdsPowerResponse<AdsPowerGroupListData>;
      } else if (axiosError.request) {
        console.error("AdsPower API no response received (listGroups). Request details:", axiosError.request);
      } else {
        console.error("Error setting up AdsPower API request (listGroups):", axiosError.message);
      }
      return null;
    }
  }

  /**
   * Aktualizuje istniejącą grupę profili w AdsPower.
   * @param payload Obiekt zawierający group_id oraz nowe group_name i/lub remark.
   * @returns Odpowiedź z API AdsPower lub null w przypadku błędu.
   */
  public async updateGroup(payload: UpdateGroupPayload): Promise<AdsPowerResponse<UpdateGroupResponseData> | null> {
    const endpoint = "/api/v1/group/update";
    const fullUrl = `${this.apiClient.defaults.baseURL}${endpoint}`;
    try {
      console.log(`Attempting to update AdsPower group at URL: ${fullUrl}`);
      console.log("Attempting to update AdsPower group with payload:", JSON.stringify(payload, null, 2));
      const response = await this.apiClient.post<AdsPowerResponse<UpdateGroupResponseData>>(endpoint, payload);
      console.log("AdsPower update group API response data:", JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`Error updating AdsPower group (ID: ${payload.group_id}). Message: ${axiosError.message}`);
      console.error("Request payload for failed group update:", JSON.stringify(payload, null, 2));
      if (axiosError.response) {
        console.error("AdsPower API error response status (updateGroup):", axiosError.response.status);
        console.error(
          "AdsPower API error response headers (updateGroup):",
          JSON.stringify(axiosError.response.headers, null, 2)
        );
        console.error(
          "AdsPower API error response data (updateGroup):",
          JSON.stringify(axiosError.response.data, null, 2)
        );
        return axiosError.response.data as AdsPowerResponse<UpdateGroupResponseData>;
      } else if (axiosError.request) {
        console.error("AdsPower API no response received (updateGroup). Request details:", axiosError.request);
      } else {
        console.error("Error setting up AdsPower API request (updateGroup):", axiosError.message);
      }
      return null;
    }
  }

  /**
   * Usuwa wybrane grupy profili w AdsPower.
   * @param payload Obiekt zawierający tablicę group_ids grup do usunięcia.
   * @returns Odpowiedź z API AdsPower lub null w przypadku błędu.
   */
  public async deleteGroups(payload: DeleteGroupsPayload): Promise<AdsPowerResponse<DeleteGroupsResponseData> | null> {
    const endpoint = "/api/v1/group/delete";
    const fullUrl = `${this.apiClient.defaults.baseURL}${endpoint}`;
    try {
      console.log(`Attempting to delete AdsPower groups from URL: ${fullUrl}`);
      console.log("Attempting to delete AdsPower groups with payload:", JSON.stringify(payload, null, 2));
      const response = await this.apiClient.post<AdsPowerResponse<DeleteGroupsResponseData>>(endpoint, payload);
      console.log("AdsPower delete groups API response data:", JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`Error deleting AdsPower groups. Message: ${axiosError.message}`);
      console.error("Request payload for failed group deletion:", JSON.stringify(payload, null, 2));
      if (axiosError.response) {
        console.error("AdsPower API error response status (deleteGroups):", axiosError.response.status);
        console.error(
          "AdsPower API error response headers (deleteGroups):",
          JSON.stringify(axiosError.response.headers, null, 2)
        );
        console.error(
          "AdsPower API error response data (deleteGroups):",
          JSON.stringify(axiosError.response.data, null, 2)
        );
        return axiosError.response.data as AdsPowerResponse<DeleteGroupsResponseData>;
      } else if (axiosError.request) {
        console.error("AdsPower API no response received (deleteGroups). Request details:", axiosError.request);
      } else {
        console.error("Error setting up AdsPower API request (deleteGroups):", axiosError.message);
      }
      return null;
    }
  }

  /**
   * Pobiera szczegółowe informacje o konkretnym profilu przeglądarki z AdsPower.
   * Używa endpointu /api/v1/user/list z filtrowaniem po user_id.
   * @param userId ID profilu do pobrania.
   * @returns Odpowiedź z API AdsPower zawierająca dane profilu lub null w przypadku błędu lub braku profilu.
   */
  public async getProfileDetail(userId: string): Promise<AdsPowerResponse<AdsPowerProfileDetailData> | null> {
    const endpoint = "/api/v1/user/list"; // ZMIENIONO na poprawny endpoint
    const fullUrl = `${this.apiClient.defaults.baseURL}${endpoint}`;
    try {
      console.log(`Attempting to get AdsPower profile detail for ID: ${userId} at URL: ${fullUrl} using ?user_id=${userId}`);
      // ZMIENIONO: Typ odpowiedzi z API to lista, nawet dla pojedynczego user_id
      const response = await this.apiClient.get<AdsPowerResponse<AdsPowerProfileListData>>(endpoint, {
        params: { user_id: userId }, // ZMIENIONO: Przekazanie user_id jako parametr query
      });
      console.log(
        `AdsPower get profile detail (via list) API response data for ID ${userId}:`,
        JSON.stringify(response.data, null, 2)
      );

      // ZMIENIONO: Logika przetwarzania odpowiedzi z /api/v1/user/list
      if (response.data && response.data.code === 0 && response.data.data && response.data.data.list) {
        if (response.data.data.list.length > 0) {
          // Profil znaleziony, zwracamy pierwszy element listy
          // Zakładamy, że struktura elementu listy jest zgodna z AdsPowerProfileDetailData
          return {
            code: response.data.code,
            msg: response.data.msg,
            data: response.data.data.list[0] as AdsPowerProfileDetailData,
          };
        } else {
          // Profil nie znaleziony (lista pusta, ale odpowiedź poprawna)
          console.log(`AdsPower profile with ID '${userId}' not found via /api/v1/user/list (empty list).`);
          return {
            code: 0, // Można tu użyć specyficznego kodu API dla "nie znaleziono", jeśli istnieje
            msg: "Profile not found",
            data: null as any, // Zgodnie z typem Promise
          };
        }
      } else {
        // Odpowiedź z API ma nieoczekiwany format lub kod błędu inny niż 0
        console.error(
          `AdsPower API returned an unexpected response structure or error code for profile detail ID '${userId}':`,
          response.data
        );
        // Zwracamy oryginalną odpowiedź błędu z API, jeśli jest dostępna
        return response.data as AdsPowerResponse<any>; // Rzutowanie na 'any' dla danych błędu
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`Error getting AdsPower profile detail for ID: ${userId}. Message: ${axiosError.message}`);
      if (axiosError.response) {
        console.error("AdsPower API error response status (getProfileDetail):", axiosError.response.status);
        console.error(
          "AdsPower API error response headers (getProfileDetail):",
          JSON.stringify(axiosError.response.headers, null, 2)
        );
        console.error(
          "AdsPower API error response data (getProfileDetail):",
          JSON.stringify(axiosError.response.data, null, 2)
        );
        // Zwróć dane błędu z odpowiedzi AdsPower, jeśli są dostępne
        return axiosError.response.data as AdsPowerResponse<AdsPowerProfileDetailData>;
      } else if (axiosError.request) {
        console.error(
          `AdsPower API no response received (getProfileDetail for ID: ${userId}). Request details:`,
          axiosError.request
        );
      } else {
        console.error(`Error setting up AdsPower API request (getProfileDetail for ID: ${userId}):`, axiosError.message);
      }
      // Zwróć ogólny błąd, jeśli nie ma konkretnej odpowiedzi od API
      return {
        code: -1, // Ogólny kod błędu wewnętrznego
        msg: axiosError.message || "Failed to get profile detail due to an unexpected error.",
        data: null as any, // Zgodnie z typem Promise
      };
    }
  }
}

export default new AdsPowerService();
