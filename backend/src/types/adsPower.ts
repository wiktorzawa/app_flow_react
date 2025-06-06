// backend/src/types/adsPower.ts
// Podstawowy interfejs dla odpowiedzi z AdsPower API
export interface AdsPowerResponse<T = unknown> {
  code: number; // 0 zazwyczaj oznacza sukces
  data: T;
  msg: string;
}

// --- INTERFEJCY DLA PROFILI ---
export interface UserProxyConfigInput {
  proxy_type?: "http" | "https" | "socks5";
  proxy_host?: string;
  proxy_port?: string;
  proxy_user?: string;
  proxy_password?: string;
  proxy_soft:
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
  proxy_url?: string;
  global_config?: "0" | "1";
}

export interface FingerprintConfigInput {
  ua?: string;
  automatic_timezone?: "0" | "1";
  timezone?: string;
  language?: string[];
  language_switch?: "0" | "1";
  page_language_switch?: "0" | "1";
  page_language?: string;
  flash?: "allow" | "block" | "ask";
  webrtc?: "forward" | "proxy" | "local" | "disabled";
  location?: "ask" | "allow" | "block";
  location_switch?: "0" | "1";
  longitude?: string;
  latitude?: string;
  accuracy?: string;
  screen_resolution?: string;
  fonts?: string[];
  canvas?: "0" | "1";
  webgl_image?: "0" | "1";
  webgl?: "0" | "1" | "2" | "3";
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

export interface CreateProfilePayload {
  name?: string;
  group_id: string;
  remark?: string;
  domain_name?: string;
  open_urls?: string[];
  username?: string;
  password?: string;
  fakey?: string;
  cookie?: string;
  ignore_cookie_error?: "0" | "1";
  user_proxy_config?: UserProxyConfigInput;
  proxyid?: string;
  fingerprint_config: FingerprintConfigInput;
  ip?: string;
  country?: string;
  region?: string;
  city?: string;
  ipchecker?: "ip2location" | "ipapi";
  sys_app_cate_id?: string;
  repeat_config?: (0 | 2 | 3 | 4)[];
}

export interface CreateProfileResponseData {
  id: string;
}

export interface AdsPowerProfile {
  user_id: string;
  name: string;
  group_id: string;
  group_name?: string;
  remark?: string;
  status?: string;
  last_open_time?: number;
  ip?: string;
  country?: string;
}

export interface AdsPowerProfileListData {
  list: AdsPowerProfile[];
  page?: number;
  page_size?: number;
  total_count?: number;
}

export interface UpdateProfilePayload {
  user_id: string;
  name?: string;
  group_id?: string;
  remark?: string;
  domain_name?: string;
  open_urls?: string[];
  username?: string;
  password?: string;
  fakey?: string;
  cookie?: string;
  ignore_cookie_error?: "0" | "1";
  user_proxy_config?: UserProxyConfigInput;
  proxyid?: string;
  fingerprint_config?: FingerprintConfigInput;
  ip?: string;
  country?: string;
  region?: string;
  city?: string;
  ipchecker?: "ip2location" | "ipapi";
  sys_app_cate_id?: string;
  repeat_config?: (0 | 2 | 3 | 4)[];
}

export interface UpdateProfileResponseData {
  // Zazwyczaj puste
}

export interface DeleteProfilesPayload {
  user_ids: string[];
}

export interface DeleteProfilesResponseData {
  // Zazwyczaj puste
}

export interface RegroupProfilesPayload {
  user_ids: string[];
  group_id: string;
}

export interface RegroupProfilesResponseData {
  // Zazwyczaj puste
}

export interface AdsPowerProfileDetailData extends AdsPowerProfile {
  user_proxy_config?: UserProxyConfigInput;
  fingerprint_config?: FingerprintConfigInput;
  domain_name?: string;
  username?: string;
  serial_number?: string;
  // Dodatkowe szczegółowe pola można dodać tutaj
}

// --- INTERFEJCY DLA OPERACJI NA PRZEGLĄDARCE ---
export interface PuppeteerWebSocketInfo {
  puppeteer: string;
  playwright?: string;
}

export interface StartBrowserData {
  ws: PuppeteerWebSocketInfo;
  debug_port: string;
  webdriver: string;
}

export interface StartBrowserResponseData extends StartBrowserData {}

export interface StopBrowserResponseData {
  // Zazwyczaj puste
}

export interface BrowserStatusData {
  status: "Active" | "Inactive";
}

export interface BrowserStatusResponseData extends BrowserStatusData {}

// --- INTERFEJCY DLA OPERACJI NA GRUPACH ---
export interface CreateGroupPayload {
  group_name: string;
  remark?: string;
}

export interface CreateGroupResponseData {
  group_id: string;
}

export interface AdsPowerGroupFromList {
  group_id: string;
  group_name: string;
  remark: string;
  profile_count: number;
}

export interface AdsPowerGroupListData {
  list: AdsPowerGroupFromList[];
  page?: number;
  page_size?: number;
  total?: number;
}

export interface UpdateGroupPayload {
  group_id: string;
  group_name?: string;
  remark?: string;
}

export interface UpdateGroupResponseData {
  // Zazwyczaj puste
}

export interface DeleteGroupsPayload {
  group_ids: string[];
}

export interface DeleteGroupsResponseData {
  // Zazwyczaj puste
}

// --- INTERFEJCY DLA INNYCH OPERACJI ---
export interface ClearAllProfilesCacheResponseData {
  // Zazwyczaj puste
}
