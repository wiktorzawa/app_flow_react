'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const brightDataController_1 = require('../controllers/brightDataController');
// import { protect, admin } from '../middleware/authMiddleware'; // Jeśli potrzebna autoryzacja
const router = express_1.default.Router();
router.route('/proxies').get(brightDataController_1.brightDataController.listBrightDataProxies); // Można dodać protect, jeśli endpoint ma być chroniony
// .get(protect, brightDataController.listBrightDataProxies); // Przykład z autoryzacją
exports.default = router;
