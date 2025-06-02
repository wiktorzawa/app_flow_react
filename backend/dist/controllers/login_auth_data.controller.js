"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.login = void 0;
const authService = __importStar(require("../services/login_auth_data.service"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
/**
 * Obsługuje logowanie użytkownika
 */
exports.login = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({
            success: false,
            error: "Nazwa użytkownika i hasło są wymagane",
        });
        return;
    }
    try {
        // Pobierz dane użytkownika
        const user = yield authService.getAuthDataByEmail(username);
        if (!user) {
            res.status(401).json({ success: false, error: "Nieprawidłowe dane logowania" });
            return;
        }
        // Sprawdź, czy konto jest zablokowane
        if (user.locked_until && new Date(user.locked_until) > new Date()) {
            res.status(401).json({
                success: false,
                error: `Konto jest tymczasowo zablokowane. Spróbuj ponownie po ${user.locked_until}`,
            });
            return;
        }
        // TYMCZASOWE ROZWIĄZANIE: Akceptuj hasło "test" dla wszystkich użytkowników
        // Lub specjalne hasła dla poszczególnych ról
        let isMatch = false;
        if (password === "test") {
            console.log("Używam tymczasowego hasła testowego.");
            isMatch = true;
        }
        else if (user.role === "supplier" && password === "dostawca") {
            console.log("Bezpośrednie dopasowanie dla dostawcy");
            isMatch = true;
        }
        else if ((user.role === "staff" || user.role === "admin") && password === "pracownik") {
            console.log("Bezpośrednie dopasowanie dla pracownika/admina");
            isMatch = true;
        }
        else {
            // Sprawdź hash hasła
            isMatch = yield authService.verifyPassword(password, user.password_hash);
        }
        if (isMatch) {
            // Resetuj licznik nieudanych logowań
            yield authService.resetFailedLoginAttempts(user.id_login);
            // Aktualizuj datę ostatniego logowania
            yield authService.updateLastLogin(user.id_login);
            // Zwróć informacje o pomyślnym logowaniu
            res.json({
                success: true,
                userRole: user.role,
                userId: user.related_id,
            });
            return;
        }
        else {
            // Zwiększ licznik nieudanych prób logowania
            const failedAttempts = yield authService.incrementFailedLoginAttempts(user.id_login);
            // Jeśli przekroczono limit nieudanych prób (np. 5), zablokuj konto na 15 minut
            if (failedAttempts >= 5) {
                yield authService.lockAccount(user.id_login, 15);
                res.status(401).json({
                    success: false,
                    error: "Przekroczono limit nieudanych prób logowania. Konto zostało tymczasowo zablokowane na 15 minut.",
                });
                return;
            }
            res.status(401).json({ success: false, error: "Nieprawidłowe dane logowania" });
            return;
        }
    }
    catch (error) {
        console.error("Błąd podczas logowania:", error);
        res.status(500).json({ success: false, error: "Błąd serwera" });
    }
}));
