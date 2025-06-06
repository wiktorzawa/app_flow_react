"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileGenerationService = void 0;
// @ts-ignore // Ignorujemy błąd TS dla importu JSON, jeśli konfiguracja modułów tego wymaga
const L_tabela_json_1 = __importDefault(require("../../../src/data/L_tabela.json"));
exports.profileGenerationService = {
    prepareProfilesForAdsPower(targetZone) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const preparedProfiles = [];
            const locationDataEntries = L_tabela_json_1.default;
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
                const userProxyConfig = {
                    proxy_soft: "brightdata",
                    proxy_type: ((_a = targetZone.plan_details) === null || _a === void 0 ? void 0 : _a.product) === "res_rotating" ? "http" : "http",
                    proxy_host: "brd.superproxy.io",
                    proxy_port: ((_b = targetZone.port) === null || _b === void 0 ? void 0 : _b.toString()) || "22225",
                    proxy_user: `brd-customer-${targetZone.customer_id}-zone-${targetZone.zone}`,
                    proxy_password: targetZone.password,
                };
                const remarkFromLocation = locationProfile.L_Uwagi_Lokalizacja || `Profil dla ${locationProfile.L_Miasto_Docelowe}`;
                const combinedProfileData = {
                    name: profileName,
                    group_id: "0",
                    user_proxy_config: userProxyConfig,
                    fingerprint_config: fingerprintConfig,
                    remark: remarkFromLocation,
                    locationData: Object.assign({}, locationProfile),
                };
                preparedProfiles.push(combinedProfileData);
            }
            console.log(`Pomyślnie przygotowano konfiguracje dla ${preparedProfiles.length} profili.`);
            return preparedProfiles;
        });
    },
};
// Przykładowe implementacje funkcji pomocniczych (do rozbudowy)
function generateRandomUserAgent() {
    const uas = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    ];
    return uas[Math.floor(Math.random() * uas.length)];
}
function getRandomScreenResolution() {
    const resolutions = ["1920_1080", "1366_768", "1440_900", "1600_900", "2560_1440", "1536_864"];
    return resolutions[Math.floor(Math.random() * resolutions.length)];
}
function getRandomConcurrency() {
    const c = ["2", "4", "8", "12", "16"];
    return c[Math.floor(Math.random() * c.length)];
}
function getRandomDeviceMemory() {
    const m = ["2", "4", "8"];
    return m[Math.floor(Math.random() * m.length)];
}
function generateAdvancedFingerprintConfig(locationProfile) {
    const fingerprint = {
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
    return fingerprint;
}
