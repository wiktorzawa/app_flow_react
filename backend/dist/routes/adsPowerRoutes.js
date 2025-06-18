'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = require('express');
const adsPowerController_1 = __importDefault(require('../controllers/adsPowerController'));
const express_async_handler_1 = __importDefault(require('express-async-handler'));
const router = (0, express_1.Router)();
// Trasa do sprawdzania statusu AdsPower API
// Dostępny pod adresem: /api/adspower/status (po zintegrowaniu w głównym routerze)
router.get(
  '/status',
  (0, express_async_handler_1.default)(adsPowerController_1.default.checkAdsPowerApi)
);
// --- Trasy dla operacji na profilach ---
router.post(
  '/create-profile',
  (0, express_async_handler_1.default)(adsPowerController_1.default.handleCreateProfile)
);
router.get(
  '/profiles',
  (0, express_async_handler_1.default)(adsPowerController_1.default.listAdsPowerProfiles)
);
router.put(
  '/profiles/:userId',
  (0, express_async_handler_1.default)(adsPowerController_1.default.updateAdsPowerProfile)
);
router.post(
  '/profiles/delete-bulk',
  (0, express_async_handler_1.default)(adsPowerController_1.default.deleteAdsPowerProfiles)
);
router.post(
  '/profiles/regroup',
  (0, express_async_handler_1.default)(adsPowerController_1.default.regroupAdsPowerProfiles)
);
router.post(
  '/profiles/clear-all-cache',
  (0, express_async_handler_1.default)(adsPowerController_1.default.clearAllAdsPowerProfilesCache)
);
router.get(
  '/profiles/:userId/start-browser',
  (0, express_async_handler_1.default)(adsPowerController_1.default.startAdsPowerBrowser)
);
router.get(
  '/profiles/:userId/stop-browser',
  (0, express_async_handler_1.default)(adsPowerController_1.default.stopAdsPowerBrowser)
);
router.get(
  '/profiles/:userId/browser-status',
  (0, express_async_handler_1.default)(adsPowerController_1.default.checkAdsPowerBrowserStatus)
);
router.get(
  '/profiles/:userId/detail',
  (0, express_async_handler_1.default)(adsPowerController_1.default.getAdsPowerProfileDetail)
);
// --- Trasy dla operacji na grupach ---
// Trasa do tworzenia nowej grupy AdsPower
router.post(
  '/groups',
  (0, express_async_handler_1.default)(adsPowerController_1.default.createAdsPowerGroup)
);
// Trasa do listowania grup AdsPower
router.get(
  '/groups',
  (0, express_async_handler_1.default)(adsPowerController_1.default.listAdsPowerGroups)
);
// Trasa do aktualizacji grupy AdsPower
router.post(
  '/groups/update',
  (0, express_async_handler_1.default)(adsPowerController_1.default.updateAdsPowerGroup)
);
// Trasa do usuwania grup AdsPower (bulk)
router.post(
  '/groups/delete-bulk',
  (0, express_async_handler_1.default)(adsPowerController_1.default.deleteAdsPowerGroups)
);
// --- Miejsce na przyszłe endpointy związane z AdsPower ---
// np. router.post('/create-profile', asyncHandler(adsPowerController.createAdsPowerProfile));
// np. router.post('/open-browser', asyncHandler(adsPowerController.openAdsPowerBrowser));
exports.default = router;
