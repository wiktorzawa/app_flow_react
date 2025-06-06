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
exports.createSupplierWithPassword = exports.generateSupplierId = exports.deleteSupplier = exports.updateSupplier = exports.createSupplier = exports.getSupplierById = exports.getAllSuppliers = void 0;
const supplierService = __importStar(require("../services/login_table_suppliers.service"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
/**
 * Pobiera listę wszystkich dostawców
 */
exports.getAllSuppliers = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const suppliersList = yield supplierService.getAllSuppliers();
        res.json(suppliersList);
    }
    catch (error) {
        console.error("Błąd podczas pobierania dostawców:", error);
        res.status(500).json({ error: "Błąd serwera" });
    }
}));
/**
 * Pobiera dostawcę na podstawie ID
 */
exports.getSupplierById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const supplier = yield supplierService.getSupplierById(id);
        if (!supplier) {
            res.status(404).json({ error: "Dostawca nie został znaleziony" });
            return;
        }
        res.json(supplier);
    }
    catch (error) {
        console.error(`Błąd podczas pobierania dostawcy o ID ${id}:`, error);
        res.status(500).json({ error: "Błąd serwera" });
    }
}));
/**
 * Tworzy nowego dostawcę
 */
exports.createSupplier = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Walidacja danych wejściowych
        const { id_supplier, company_name, first_name, last_name, nip, email, phone, website, address_street, address_building, address_apartment, address_city, address_postal_code, address_country, } = req.body;
        if (!id_supplier ||
            !company_name ||
            !first_name ||
            !last_name ||
            !nip ||
            !email ||
            !phone ||
            !address_street ||
            !address_building ||
            !address_city ||
            !address_postal_code ||
            !address_country) {
            res.status(400).json({ error: "Wszystkie wymagane pola muszą być wypełnione" });
            return;
        }
        // Sprawdź, czy dostawca o tym ID, NIP lub adresie email już istnieje
        const existingSupplierById = yield supplierService.getSupplierById(id_supplier);
        if (existingSupplierById) {
            res.status(409).json({ error: "Dostawca o podanym ID już istnieje" });
            return;
        }
        const existingSupplierByEmail = yield supplierService.getSupplierByEmail(email);
        if (existingSupplierByEmail) {
            res.status(409).json({ error: "Dostawca o podanym adresie email już istnieje" });
            return;
        }
        const existingSupplierByNip = yield supplierService.getSupplierByNip(nip);
        if (existingSupplierByNip) {
            res.status(409).json({ error: "Dostawca o podanym numerze NIP już istnieje" });
            return;
        }
        // Utwórz nowego dostawcę
        const newSupplier = yield supplierService.createSupplier({
            id_supplier,
            company_name,
            first_name,
            last_name,
            nip,
            email,
            phone,
            website,
            address_street,
            address_building,
            address_apartment,
            address_city,
            address_postal_code,
            address_country,
        });
        res.status(201).json(newSupplier);
    }
    catch (error) {
        console.error("Błąd podczas tworzenia dostawcy:", error);
        res.status(500).json({ error: "Błąd serwera" });
    }
}));
/**
 * Aktualizuje dane dostawcy
 */
exports.updateSupplier = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // Sprawdź, czy dostawca istnieje
        const existingSupplier = yield supplierService.getSupplierById(id);
        if (!existingSupplier) {
            res.status(404).json({ error: "Dostawca nie został znaleziony" });
            return;
        }
        // Walidacja danych wejściowych - sprawdź unikalność emaila i NIP jeśli są zmieniane
        const { email, nip } = req.body;
        if (email && email !== existingSupplier.email) {
            const existingSupplierByEmail = yield supplierService.getSupplierByEmail(email);
            if (existingSupplierByEmail && existingSupplierByEmail.id_supplier !== id) {
                res.status(409).json({ error: "Dostawca o podanym adresie email już istnieje" });
                return;
            }
        }
        if (nip && nip !== existingSupplier.nip) {
            const existingSupplierByNip = yield supplierService.getSupplierByNip(nip);
            if (existingSupplierByNip && existingSupplierByNip.id_supplier !== id) {
                res.status(409).json({ error: "Dostawca o podanym numerze NIP już istnieje" });
                return;
            }
        }
        // Aktualizuj dane dostawcy
        const updatedSupplier = yield supplierService.updateSupplier(id, req.body);
        res.json(updatedSupplier);
    }
    catch (error) {
        console.error(`Błąd podczas aktualizacji dostawcy o ID ${id}:`, error);
        res.status(500).json({ error: "Błąd serwera" });
    }
}));
/**
 * Usuwa dostawcę
 */
exports.deleteSupplier = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // Sprawdź, czy dostawca istnieje
        const existingSupplier = yield supplierService.getSupplierById(id);
        if (!existingSupplier) {
            res.status(404).json({ error: "Dostawca nie został znaleziony" });
            return;
        }
        // Usuń dostawcę
        const deleted = yield supplierService.deleteSupplier(id);
        if (deleted) {
            res.status(200).json({ message: "Dostawca został usunięty" });
        }
        else {
            res.status(500).json({ error: "Nie udało się usunąć dostawcy" });
        }
    }
    catch (error) {
        console.error(`Błąd podczas usuwania dostawcy o ID ${id}:`, error);
        res.status(500).json({ error: "Błąd serwera" });
    }
}));
/**
 * Generuje ID dostawcy
 */
exports.generateSupplierId = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Generowanie ID dostawcy");
        const newId = yield supplierService.generateSupplierId();
        console.log(`Wygenerowane ID: ${newId}`);
        res.json({ id_supplier: newId });
    }
    catch (error) {
        console.error("Błąd podczas generowania ID dostawcy:", error);
        res.status(500).json({ error: "Błąd serwera" });
    }
}));
/**
 * Tworzy nowego dostawcę wraz z wygenerowanym hasłem
 */
exports.createSupplierWithPassword = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Walidacja danych wejściowych
        const { company_name, first_name, last_name, nip, email, phone, website, address_street, address_building, address_apartment, address_city, address_postal_code, address_country, } = req.body;
        if (!company_name ||
            !first_name ||
            !last_name ||
            !nip ||
            !email ||
            !phone ||
            !address_street ||
            !address_building ||
            !address_city ||
            !address_postal_code ||
            !address_country) {
            res.status(400).json({ error: "Wszystkie wymagane pola muszą być wypełnione" });
            return;
        }
        // Sprawdź, czy dostawca o podanym adresie email lub NIP już istnieje
        const existingSupplierByEmail = yield supplierService.getSupplierByEmail(email);
        if (existingSupplierByEmail) {
            res.status(409).json({ error: "Dostawca o podanym adresie email już istnieje" });
            return;
        }
        const existingSupplierByNip = yield supplierService.getSupplierByNip(nip);
        if (existingSupplierByNip) {
            res.status(409).json({ error: "Dostawca o podanym numerze NIP już istnieje" });
            return;
        }
        // Utwórz nowego dostawcę wraz z danymi logowania
        const result = yield supplierService.createSupplierWithPassword({
            company_name,
            first_name,
            last_name,
            nip,
            email,
            phone,
            website,
            address_street,
            address_building,
            address_apartment,
            address_city,
            address_postal_code,
            address_country,
        });
        if (result) {
            res.status(201).json(result);
        }
        else {
            res.status(500).json({ error: "Nie udało się utworzyć dostawcy" });
        }
    }
    catch (error) {
        console.error("Błąd podczas tworzenia dostawcy z hasłem:", error);
        res.status(500).json({ error: "Błąd serwera" });
    }
}));
