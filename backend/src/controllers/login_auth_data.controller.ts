import { Request, Response } from "express";
import * as authService from "../services/login_auth_data.service";
import asyncHandler from "express-async-handler";
import { LoginCredentials } from "../models/login_auth_data.model";

/**
 * Obsługuje logowanie użytkownika
 */
export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body as LoginCredentials;

  if (!username || !password) {
    res.status(400).json({
      success: false,
      error: "Nazwa użytkownika i hasło są wymagane",
    });
    return;
  }

  try {
    // Pobierz dane użytkownika
    const user = await authService.getAuthDataByEmail(username);

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
    } else if (user.role === "supplier" && password === "dostawca") {
      console.log("Bezpośrednie dopasowanie dla dostawcy");
      isMatch = true;
    } else if ((user.role === "staff" || user.role === "admin") && password === "pracownik") {
      console.log("Bezpośrednie dopasowanie dla pracownika/admina");
      isMatch = true;
    } else {
      // Sprawdź hash hasła
      isMatch = await authService.verifyPassword(password, user.password_hash);
    }

    if (isMatch) {
      // Resetuj licznik nieudanych logowań
      await authService.resetFailedLoginAttempts(user.id_login);

      // Aktualizuj datę ostatniego logowania
      await authService.updateLastLogin(user.id_login);

      // Zwróć informacje o pomyślnym logowaniu
      res.json({
        success: true,
        userRole: user.role,
        userId: user.related_id,
      });
      return;
    } else {
      // Zwiększ licznik nieudanych prób logowania
      const failedAttempts = await authService.incrementFailedLoginAttempts(user.id_login);

      // Jeśli przekroczono limit nieudanych prób (np. 5), zablokuj konto na 15 minut
      if (failedAttempts >= 5) {
        await authService.lockAccount(user.id_login, 15);
        res.status(401).json({
          success: false,
          error: "Przekroczono limit nieudanych prób logowania. Konto zostało tymczasowo zablokowane na 15 minut.",
        });
        return;
      }

      res.status(401).json({ success: false, error: "Nieprawidłowe dane logowania" });
      return;
    }
  } catch (error) {
    console.error("Błąd podczas logowania:", error);
    res.status(500).json({ success: false, error: "Błąd serwera" });
  }
});
