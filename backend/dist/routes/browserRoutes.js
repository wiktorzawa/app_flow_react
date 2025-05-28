"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const browserController_1 = require("../controllers/browserController");
const router = express_1.default.Router();
// Endpoint do scrapowania dowolnej strony
router.get("/scrape", browserController_1.browserController.scrapeWebsite);
exports.default = router;
