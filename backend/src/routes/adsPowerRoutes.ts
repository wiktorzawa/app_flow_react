import { Router } from "express";
import adsPowerController from "../controllers/adsPowerController";
import asyncHandler from "express-async-handler";

const router = Router();

// Trasa do sprawdzania statusu AdsPower API
// Dostępny pod adresem: /api/adspower/status (po zintegrowaniu w głównym routerze)
router.get("/status", asyncHandler(adsPowerController.checkAdsPowerApi));

// --- Trasy dla operacji na profilach ---
router.post("/create-profile", asyncHandler(adsPowerController.handleCreateProfile));
router.get("/profiles", asyncHandler(adsPowerController.listAdsPowerProfiles));
router.put("/profiles/:userId", asyncHandler(adsPowerController.updateAdsPowerProfile));
router.post("/profiles/delete-bulk", asyncHandler(adsPowerController.deleteAdsPowerProfiles));
router.post("/profiles/regroup", asyncHandler(adsPowerController.regroupAdsPowerProfiles));
router.post("/profiles/clear-all-cache", asyncHandler(adsPowerController.clearAllAdsPowerProfilesCache));
router.get("/profiles/:userId/start-browser", asyncHandler(adsPowerController.startAdsPowerBrowser));
router.get("/profiles/:userId/stop-browser", asyncHandler(adsPowerController.stopAdsPowerBrowser));
router.get("/profiles/:userId/browser-status", asyncHandler(adsPowerController.checkAdsPowerBrowserStatus));
router.get("/profiles/:userId/detail", asyncHandler(adsPowerController.getAdsPowerProfileDetail));

// --- Trasy dla operacji na grupach ---
// Trasa do tworzenia nowej grupy AdsPower
router.post("/groups", asyncHandler(adsPowerController.createAdsPowerGroup));

// Trasa do listowania grup AdsPower
router.get("/groups", asyncHandler(adsPowerController.listAdsPowerGroups));

// Trasa do aktualizacji grupy AdsPower
router.post("/groups/update", asyncHandler(adsPowerController.updateAdsPowerGroup));

// Trasa do usuwania grup AdsPower (bulk)
router.post("/groups/delete-bulk", asyncHandler(adsPowerController.deleteAdsPowerGroups));

// --- Miejsce na przyszłe endpointy związane z AdsPower ---
// np. router.post('/create-profile', asyncHandler(adsPowerController.createAdsPowerProfile));
// np. router.post('/open-browser', asyncHandler(adsPowerController.openAdsPowerBrowser));

export default router;
