"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const profileGenerationController_1 = require("../controllers/profileGenerationController");
const router = express_1.default.Router();
// Endpoint do przygotowywania wsadowej listy profili AdsPower
// Metoda POST, ponieważ operacja może być uznana za inicjującą proces generowania danych
// lub GET, jeśli tylko pobieramy pre-generowane/konfigurowalne dane (zostawiam POST jako bardziej elastyczny)
router.post("/prepare-adspower-batch", profileGenerationController_1.profileGenerationController.prepareBatch);
// W przyszłości można tu dodać endpoint do faktycznego tworzenia profili w AdsPower
// np. router.post('/create-adspower-batch', profileGenerationController.createAdsPowerBatch);
exports.default = router;
