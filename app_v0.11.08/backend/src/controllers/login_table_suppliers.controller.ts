import { Request, Response } from "express";
import * as supplierService from "../services/login_table_suppliers.service";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";

/**
 * Pobiera listę wszystkich dostawców
 */
export const getAllSuppliers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const suppliersList = await supplierService.getAllSuppliers();
    res.json(suppliersList);
  } catch (error) {
    console.error("Błąd podczas pobierania dostawców:", error);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

/**
 * Pobiera dostawcę na podstawie ID
 */
export const getSupplierById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const supplier = await supplierService.getSupplierById(id);

    if (!supplier) {
      res.status(404).json({ error: "Dostawca nie został znaleziony" });
      return;
    }

    res.json(supplier);
  } catch (error) {
    console.error(`Błąd podczas pobierania dostawcy o ID ${id}:`, error);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

/**
 * Tworzy nowego dostawcę
 */
export const createSupplier = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    // Walidacja danych wejściowych
    const {
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
    } = req.body;

    if (
      !id_supplier ||
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
      !address_country
    ) {
      res.status(400).json({ error: "Wszystkie wymagane pola muszą być wypełnione" });
      return;
    }

    // Sprawdź, czy dostawca o tym ID, NIP lub adresie email już istnieje
    const existingSupplierById = await supplierService.getSupplierById(id_supplier);
    if (existingSupplierById) {
      res.status(409).json({ error: "Dostawca o podanym ID już istnieje" });
      return;
    }

    const existingSupplierByEmail = await supplierService.getSupplierByEmail(email);
    if (existingSupplierByEmail) {
      res.status(409).json({ error: "Dostawca o podanym adresie email już istnieje" });
      return;
    }

    const existingSupplierByNip = await supplierService.getSupplierByNip(nip);
    if (existingSupplierByNip) {
      res.status(409).json({ error: "Dostawca o podanym numerze NIP już istnieje" });
      return;
    }

    // Utwórz nowego dostawcę
    const newSupplier = await supplierService.createSupplier({
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
  } catch (error) {
    console.error("Błąd podczas tworzenia dostawcy:", error);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

/**
 * Aktualizuje dane dostawcy
 */
export const updateSupplier = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    // Sprawdź, czy dostawca istnieje
    const existingSupplier = await supplierService.getSupplierById(id);
    if (!existingSupplier) {
      res.status(404).json({ error: "Dostawca nie został znaleziony" });
      return;
    }

    // Walidacja danych wejściowych - sprawdź unikalność emaila i NIP jeśli są zmieniane
    const { email, nip } = req.body;

    if (email && email !== existingSupplier.email) {
      const existingSupplierByEmail = await supplierService.getSupplierByEmail(email);
      if (existingSupplierByEmail && existingSupplierByEmail.id_supplier !== id) {
        res.status(409).json({ error: "Dostawca o podanym adresie email już istnieje" });
        return;
      }
    }

    if (nip && nip !== existingSupplier.nip) {
      const existingSupplierByNip = await supplierService.getSupplierByNip(nip);
      if (existingSupplierByNip && existingSupplierByNip.id_supplier !== id) {
        res.status(409).json({ error: "Dostawca o podanym numerze NIP już istnieje" });
        return;
      }
    }

    // Aktualizuj dane dostawcy
    const updatedSupplier = await supplierService.updateSupplier(id, req.body);

    res.json(updatedSupplier);
  } catch (error) {
    console.error(`Błąd podczas aktualizacji dostawcy o ID ${id}:`, error);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

/**
 * Usuwa dostawcę
 */
export const deleteSupplier = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    // Sprawdź, czy dostawca istnieje
    const existingSupplier = await supplierService.getSupplierById(id);
    if (!existingSupplier) {
      res.status(404).json({ error: "Dostawca nie został znaleziony" });
      return;
    }

    // Usuń dostawcę
    const deleted = await supplierService.deleteSupplier(id);

    if (deleted) {
      res.status(200).json({ message: "Dostawca został usunięty" });
    } else {
      res.status(500).json({ error: "Nie udało się usunąć dostawcy" });
    }
  } catch (error) {
    console.error(`Błąd podczas usuwania dostawcy o ID ${id}:`, error);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

/**
 * Generuje ID dostawcy
 */
export const generateSupplierId = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Generowanie ID dostawcy");
    const newId = await supplierService.generateSupplierId();
    console.log(`Wygenerowane ID: ${newId}`);
    res.json({ id_supplier: newId });
  } catch (error) {
    console.error("Błąd podczas generowania ID dostawcy:", error);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

/**
 * Tworzy nowego dostawcę wraz z wygenerowanym hasłem
 */
export const createSupplierWithPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    // Walidacja danych wejściowych
    const {
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
    } = req.body;

    if (
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
      !address_country
    ) {
      res.status(400).json({ error: "Wszystkie wymagane pola muszą być wypełnione" });
      return;
    }

    // Sprawdź, czy dostawca o podanym adresie email lub NIP już istnieje
    const existingSupplierByEmail = await supplierService.getSupplierByEmail(email);
    if (existingSupplierByEmail) {
      res.status(409).json({ error: "Dostawca o podanym adresie email już istnieje" });
      return;
    }

    const existingSupplierByNip = await supplierService.getSupplierByNip(nip);
    if (existingSupplierByNip) {
      res.status(409).json({ error: "Dostawca o podanym numerze NIP już istnieje" });
      return;
    }

    // Utwórz nowego dostawcę wraz z danymi logowania
    const result = await supplierService.createSupplierWithPassword({
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
    } else {
      res.status(500).json({ error: "Nie udało się utworzyć dostawcy" });
    }
  } catch (error) {
    console.error("Błąd podczas tworzenia dostawcy z hasłem:", error);
    res.status(500).json({ error: "Błąd serwera" });
  }
});
