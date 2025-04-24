import { Request, Response } from 'express';
import * as staffService from '../services/login_table_staff.service';
import asyncHandler from 'express-async-handler';

/**
 * Pobiera listę wszystkich pracowników
 */
export const getAllStaff = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const staffList = await staffService.getAllStaff();
    res.json(staffList);
  } catch (error) {
    console.error('Błąd podczas pobierania pracowników:', error);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

/**
 * Pobiera pracownika na podstawie ID
 */
export const getStaffById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  
  try {
    const staff = await staffService.getStaffById(id);
    
    if (!staff) {
      res.status(404).json({ error: 'Pracownik nie został znaleziony' });
      return;
    }
    
    res.json(staff);
  } catch (error) {
    console.error(`Błąd podczas pobierania pracownika o ID ${id}:`, error);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

/**
 * Tworzy nowego pracownika
 */
export const createStaff = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    // Walidacja danych wejściowych
    const { id_staff, first_name, last_name, role, email, phone } = req.body;
    
    if (!id_staff || !first_name || !last_name || !role || !email) {
      res.status(400).json({ error: 'Wszystkie wymagane pola muszą być wypełnione' });
      return;
    }
    
    // Sprawdź, czy pracownik o tym ID lub adresie email już istnieje
    const existingStaffById = await staffService.getStaffById(id_staff);
    if (existingStaffById) {
      res.status(409).json({ error: 'Pracownik o podanym ID już istnieje' });
      return;
    }
    
    const existingStaffByEmail = await staffService.getStaffByEmail(email);
    if (existingStaffByEmail) {
      res.status(409).json({ error: 'Pracownik o podanym adresie email już istnieje' });
      return;
    }
    
    // Utwórz nowego pracownika
    const newStaff = await staffService.createStaff({
      id_staff,
      first_name,
      last_name,
      role,
      email,
      phone
    });
    
    res.status(201).json(newStaff);
  } catch (error) {
    console.error('Błąd podczas tworzenia pracownika:', error);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

/**
 * Aktualizuje dane pracownika
 */
export const updateStaff = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  
  try {
    // Sprawdź, czy pracownik istnieje
    const existingStaff = await staffService.getStaffById(id);
    if (!existingStaff) {
      res.status(404).json({ error: 'Pracownik nie został znaleziony' });
      return;
    }
    
    // Walidacja danych wejściowych
    const { first_name, last_name, role, email, phone } = req.body;
    
    // Jeśli zmieniamy email, sprawdź czy nowy email jest już używany
    if (email && email !== existingStaff.email) {
      const existingStaffByEmail = await staffService.getStaffByEmail(email);
      if (existingStaffByEmail && existingStaffByEmail.id_staff !== id) {
        res.status(409).json({ error: 'Pracownik o podanym adresie email już istnieje' });
        return;
      }
    }
    
    // Aktualizuj dane pracownika
    const updatedStaff = await staffService.updateStaff(id, {
      first_name,
      last_name,
      role,
      email,
      phone
    });
    
    res.json(updatedStaff);
  } catch (error) {
    console.error(`Błąd podczas aktualizacji pracownika o ID ${id}:`, error);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

/**
 * Usuwa pracownika
 */
export const deleteStaff = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  
  try {
    // Sprawdź, czy pracownik istnieje
    const existingStaff = await staffService.getStaffById(id);
    if (!existingStaff) {
      res.status(404).json({ error: 'Pracownik nie został znaleziony' });
      return;
    }
    
    // Usuń pracownika
    const deleted = await staffService.deleteStaff(id);
    
    if (deleted) {
      res.status(200).json({ message: 'Pracownik został usunięty' });
    } else {
      res.status(500).json({ error: 'Nie udało się usunąć pracownika' });
    }
  } catch (error) {
    console.error(`Błąd podczas usuwania pracownika o ID ${id}:`, error);
    res.status(500).json({ error: 'Błąd serwera' });
  }
}); 