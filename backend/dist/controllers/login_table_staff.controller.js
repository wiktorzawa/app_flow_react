"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  (function () {
    var ownKeys = function (o) {
      ownKeys =
        Object.getOwnPropertyNames ||
        function (o) {
          var ar = [];
          for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
          return ar;
        };
      return ownKeys(o);
    };
    return function (mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null)
        for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
      __setModuleDefault(result, mod);
      return result;
    };
  })();
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStaff =
  exports.updateStaff =
  exports.createStaff =
  exports.getStaffById =
  exports.getAllStaff =
  exports.createStaffWithPassword =
  exports.generateStaffId =
    void 0;
const staffService = __importStar(require("../services/login_table_staff.service"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
/**
 * Generuje ID pracownika na podstawie roli
 */
exports.generateStaffId = (0, express_async_handler_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { role } = req.query;
    if (!role || (role !== "admin" && role !== "staff")) {
      res.status(400).json({ error: 'Nieprawidłowa rola. Dozwolone wartości to "admin" lub "staff"' });
      return;
    }
    try {
      console.log(`Generowanie ID dla roli: ${role}`);
      const newId = yield staffService.generateStaffId(role);
      console.log(`Wygenerowane ID: ${newId}`);
      res.json({ id_staff: newId });
    } catch (error) {
      console.error("Błąd podczas generowania ID pracownika:", error);
      res.status(500).json({ error: "Błąd serwera" });
    }
  })
);
/**
 * Tworzy nowego pracownika z automatycznie wygenerowanym ID i hasłem
 */
exports.createStaffWithPassword = (0, express_async_handler_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      // Walidacja danych wejściowych
      const { first_name, last_name, role, email, phone } = req.body;
      if (!first_name || !last_name || !role || !email) {
        res.status(400).json({ error: "Wszystkie wymagane pola muszą być wypełnione" });
        return;
      }
      if (role !== "admin" && role !== "staff") {
        res.status(400).json({ error: 'Nieprawidłowa rola. Dozwolone wartości to "admin" lub "staff"' });
        return;
      }
      // Sprawdź, czy pracownik o tym adresie email już istnieje
      const existingStaffByEmail = yield staffService.getStaffByEmail(email);
      if (existingStaffByEmail) {
        res.status(409).json({ error: "Pracownik o podanym adresie email już istnieje" });
        return;
      }
      // Utwórz nowego pracownika z automatycznie wygenerowanym ID i hasłem
      const newStaff = yield staffService.createStaffWithPassword({
        first_name,
        last_name,
        role,
        email,
        phone,
      });
      res.status(201).json(newStaff);
    } catch (error) {
      console.error("Błąd podczas tworzenia pracownika:", error);
      res.status(500).json({ error: "Błąd serwera" });
    }
  })
);
/**
 * Pobiera listę wszystkich pracowników
 */
exports.getAllStaff = (0, express_async_handler_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const staffList = yield staffService.getAllStaff();
      res.json(staffList);
    } catch (error) {
      console.error("Błąd podczas pobierania pracowników:", error);
      res.status(500).json({ error: "Błąd serwera" });
    }
  })
);
/**
 * Pobiera pracownika na podstawie ID
 */
exports.getStaffById = (0, express_async_handler_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
      const staff = yield staffService.getStaffById(id);
      if (!staff) {
        res.status(404).json({ error: "Pracownik nie został znaleziony" });
        return;
      }
      res.json(staff);
    } catch (error) {
      console.error(`Błąd podczas pobierania pracownika o ID ${id}:`, error);
      res.status(500).json({ error: "Błąd serwera" });
    }
  })
);
/**
 * Tworzy nowego pracownika
 */
exports.createStaff = (0, express_async_handler_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      // Walidacja danych wejściowych
      const { id_staff, first_name, last_name, role, email, phone } = req.body;
      if (!id_staff || !first_name || !last_name || !role || !email) {
        res.status(400).json({ error: "Wszystkie wymagane pola muszą być wypełnione" });
        return;
      }
      // Sprawdź, czy pracownik o tym ID lub adresie email już istnieje
      const existingStaffById = yield staffService.getStaffById(id_staff);
      if (existingStaffById) {
        res.status(409).json({ error: "Pracownik o podanym ID już istnieje" });
        return;
      }
      const existingStaffByEmail = yield staffService.getStaffByEmail(email);
      if (existingStaffByEmail) {
        res.status(409).json({ error: "Pracownik o podanym adresie email już istnieje" });
        return;
      }
      // Utwórz nowego pracownika
      const newStaff = yield staffService.createStaff({
        id_staff,
        first_name,
        last_name,
        role,
        email,
        phone,
      });
      res.status(201).json(newStaff);
    } catch (error) {
      console.error("Błąd podczas tworzenia pracownika:", error);
      res.status(500).json({ error: "Błąd serwera" });
    }
  })
);
/**
 * Aktualizuje dane pracownika
 */
exports.updateStaff = (0, express_async_handler_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
      // Sprawdź, czy pracownik istnieje
      const existingStaff = yield staffService.getStaffById(id);
      if (!existingStaff) {
        res.status(404).json({ error: "Pracownik nie został znaleziony" });
        return;
      }
      // Walidacja danych wejściowych
      const { first_name, last_name, role, email, phone } = req.body;
      // Jeśli zmieniamy email, sprawdź czy nowy email jest już używany
      if (email && email !== existingStaff.email) {
        const existingStaffByEmail = yield staffService.getStaffByEmail(email);
        if (existingStaffByEmail && existingStaffByEmail.id_staff !== id) {
          res.status(409).json({ error: "Pracownik o podanym adresie email już istnieje" });
          return;
        }
      }
      // Aktualizuj dane pracownika
      const updatedStaff = yield staffService.updateStaff(id, {
        first_name,
        last_name,
        role,
        email,
        phone,
      });
      res.json(updatedStaff);
    } catch (error) {
      console.error(`Błąd podczas aktualizacji pracownika o ID ${id}:`, error);
      res.status(500).json({ error: "Błąd serwera" });
    }
  })
);
/**
 * Usuwa pracownika
 */
exports.deleteStaff = (0, express_async_handler_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    // Dekoduj ID z parametru URL, ponieważ może zawierać znaki specjalne (np. /)
    const encodedId = req.params.id;
    const id = decodeURIComponent(encodedId);
    try {
      // Sprawdź, czy pracownik istnieje
      const existingStaff = yield staffService.getStaffById(id);
      if (!existingStaff) {
        res.status(404).json({ error: "Pracownik nie został znaleziony" });
        return;
      }
      // Usuń pracownika
      const deleted = yield staffService.deleteStaff(id);
      if (deleted) {
        res.status(200).json({ message: "Pracownik został usunięty" });
      } else {
        res.status(500).json({ error: "Nie udało się usunąć pracownika" });
      }
    } catch (error) {
      console.error(`Błąd podczas usuwania pracownika o ID ${id}:`, error);
      res.status(500).json({ error: "Błąd serwera" });
    }
  })
);
