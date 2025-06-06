import express from "express";
import { profileGenerationController } from "../controllers/profileGenerationController";

const router = express.Router();

// Endpoint do przygotowywania wsadowej listy profili AdsPower
// Metoda POST, ponieważ operacja może być uznana za inicjującą proces generowania danych
// lub GET, jeśli tylko pobieramy pre-generowane/konfigurowalne dane (zostawiam POST jako bardziej elastyczny)
router.post("/prepare-adspower-batch", profileGenerationController.prepareBatch);

// W przyszłości można tu dodać endpoint do faktycznego tworzenia profili w AdsPower
// np. router.post('/create-adspower-batch', profileGenerationController.createAdsPowerBatch);

export default router;
