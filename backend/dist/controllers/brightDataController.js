"use strict";
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
exports.brightDataController = exports.BrightDataController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const brightDataService_1 = require("../services/brightDataService");
class BrightDataController {
  constructor() {
    /**
     * @desc    Pobiera listę skonfigurowanych proxy z Bright Data Proxy Managera
     * @route   GET /api/brightdata/proxies
     * @access  Private (lub Public, w zależności od wymagań)
     */
    this.listBrightDataProxies = (0, express_async_handler_1.default)((req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        const proxies = yield brightDataService_1.brightDataService.listProxies();
        // Serwis rzuci błąd w przypadku niepowodzenia, więc zakładamy, że proxies jest tablicą (może być pusta)
        res.status(200).json({
          success: true,
          count: proxies.length,
          data: proxies,
          message: "Successfully fetched Bright Data proxies.",
        });
      })
    );
  }
}
exports.BrightDataController = BrightDataController;
exports.brightDataController = new BrightDataController();
