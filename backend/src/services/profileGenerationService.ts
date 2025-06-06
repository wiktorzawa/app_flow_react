import { BrightDataProxy } from "./brightDataService"; // Upewnij się, że ścieżka jest poprawna i interfejs jest eksportowany
import { AdsPowerProfile, UserProxyConfigInput } from "../types/adsPower";
// @ts-ignore // Ignorujemy błąd TS dla importu JSON, jeśli konfiguracja modułów tego wymaga
import L_tabelaData from "../../../src/data/L_tabela.json";

// Definicje interfejsów LTabelaEntry i KompletnyProfilAdsPower (jak zdefiniowano w poprzednim kroku)

// Interfejs dla wpisu z L_tabela.json
export interface LTabelaEntry {
  ID_Profilu_Master: string;
  L_Miasto_Docelowe: string;
  L_KodPocztowy_Docelowy_Przyklad: string;
  L_Region_Docelowy: string;
  L_Kraj_Docelowy: string;
  L_Uwagi_Lokalizacja: string;
}

// Interfejs dla konfiguracji fingerprintu AdsPower (zgodnie z dokumentacją)
// Ten interfejs jest bardziej szczegółowy i używany lokalnie w tym serwisie.
// Nazwa została zmieniona, aby uniknąć konfliktu z importowanym FingerprintConfigInput,
// jeśli ten importowany jest inny. Jeśli są takie same, można używać jednego.
interface DetailedFingerprintConfig {
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
  webgl?: "0" | "2" | "3"; // Poprawiono "1" na "2" lub "3" zgodnie z dokumentacją i poprzednimi ustaleniami
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

// Interfejs dla "Kompletnego Profilu" przygotowanego do wysłania do AdsPower
export interface KompletnyProfilAdsPower {
  idProfiluMaster: string;
  miastoDocelowe: string;
  kodPocztowyDocelowy: string;
  regionDocelowy: string;
  krajDocelowy: string;
  uwagiLokalizacja: string;
  adsPowerProfileName: string;
  adsPowerGroupName: string;
  adsPower_country?: string;
  adsPower_group_id?: string; // Możesz chcieć to mapować na konkretne ID grupy AdsPower
  user_proxy_config: {
    proxy_soft: "brightdata" | string;
    proxy_type: "http" | "https" | "socks5";
    proxy_host: string;
    proxy_port: string;
    proxy_user?: string;
    proxy_password?: string;
  };
  fingerprint_config: DetailedFingerprintConfig;
}

export const profileGenerationService = {
  async prepareProfilesForAdsPower(targetZone: BrightDataProxy): Promise<Partial<AdsPowerProfile>[]> {
    const preparedProfiles: Partial<AdsPowerProfile>[] = [];
    const locationDataEntries: LTabelaEntry[] = L_tabelaData as LTabelaEntry[];

    const numberOfProfilesToGenerate = Math.min(20, locationDataEntries.length);

    if (locationDataEntries.length === 0) {
      console.warn("Brak danych w L_tabela.json. Nie można wygenerować profili.");
      return [];
    }

    console.log(`Przygotowywanie ${numberOfProfilesToGenerate} profili na podstawie L_tabela.json`);

    for (let i = 0; i < numberOfProfilesToGenerate; i++) {
      const locationProfile = locationDataEntries[i];

      if (!locationProfile || !locationProfile.L_Miasto_Docelowe || !locationProfile.ID_Profilu_Master) {
        console.warn(`Pominięto wpis ${i} z L_tabela z powodu braku kluczowych danych.`);
        continue;
      }

      const profileName = `Profil_${locationProfile.L_Miasto_Docelowe.replace(/\s+/g, "_")}_${locationProfile.ID_Profilu_Master}`;

      const fingerprintConfig = generateAdvancedFingerprintConfig(locationProfile);

      const userProxyConfig: UserProxyConfigInput = {
        proxy_soft: "brightdata",
        proxy_type: targetZone.plan_details?.product === "res_rotating" ? "http" : "http",
        proxy_host: "brd.superproxy.io",
        proxy_port: targetZone.port?.toString() || "22225",
        proxy_user: `brd-customer-${targetZone.customer_id}-zone-${targetZone.zone}`,
        proxy_password: targetZone.password,
      };

      const remarkFromLocation =
        locationProfile.L_Uwagi_Lokalizacja || `Profil dla ${locationProfile.L_Miasto_Docelowe}`;

      const combinedProfileData: any = {
        name: profileName,
        group_id: "0",
        user_proxy_config: userProxyConfig,
        fingerprint_config: fingerprintConfig,
        remark: remarkFromLocation,
        locationData: { ...locationProfile },
      };

      preparedProfiles.push(combinedProfileData);
    }

    console.log(`Pomyślnie przygotowano konfiguracje dla ${preparedProfiles.length} profili.`);
    return preparedProfiles;
  },
};

// Przykładowe implementacje funkcji pomocniczych (do rozbudowy)
function generateRandomUserAgent(): string {
  const uas = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
  ];
  return uas[Math.floor(Math.random() * uas.length)];
}

function getRandomScreenResolution(): string {
  const resolutions = ["1920_1080", "1366_768", "1440_900", "1600_900", "2560_1440", "1536_864"];
  return resolutions[Math.floor(Math.random() * resolutions.length)];
}

function getRandomConcurrency(): string {
  const c = ["2", "4", "8", "12", "16"];
  return c[Math.floor(Math.random() * c.length)];
}

function getRandomDeviceMemory(): string {
  const m = ["2", "4", "8"];
  return m[Math.floor(Math.random() * m.length)];
}

function generateAdvancedFingerprintConfig(locationProfile: LTabelaEntry): DetailedFingerprintConfig {
  const fingerprint: Partial<DetailedFingerprintConfig> = {
    automatic_timezone: "1",
    location_switch: "1",
    location: "allow",
    language_switch: "1",
    page_language_switch: "1",
    ua: generateRandomUserAgent(),
    screen_resolution: getRandomScreenResolution(),
    webgl: "3",
    webgl_image: "1",
    canvas: "1",
    audio: "1",
    hardware_concurrency: getRandomConcurrency(),
    device_memory: getRandomDeviceMemory(),
    webrtc: "forward",
    flash: "block",
    scan_port_type: "1",
    media_devices: "1",
    client_rects: "1",
    device_name_switch: "1",
    speech_switch: "1",
    mac_address_config: { model: "1", address: "" },
    browser_kernel_config: { type: "chrome", version: "ua_auto" },
    gpu: "0",
    tls_switch: "'0'",
  };

  if (locationProfile.L_Kraj_Docelowy === "PL") {
    fingerprint.language = ["pl-PL", "pl"];
  }

  return fingerprint as DetailedFingerprintConfig;
}
