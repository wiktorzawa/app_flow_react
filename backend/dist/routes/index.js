"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const login_auth_data_routes_1 = __importDefault(require("./login_auth_data.routes"));
const login_table_staff_routes_1 = __importDefault(require("./login_table_staff.routes"));
const login_table_suppliers_routes_1 = __importDefault(require("./login_table_suppliers.routes"));
const router = express_1.default.Router();
// Trasy do uwierzytelniania
router.use('/auth', login_auth_data_routes_1.default);
// Trasy dla pracowników
router.use('/staff', login_table_staff_routes_1.default);
// Trasy dla dostawców
router.use('/suppliers', login_table_suppliers_routes_1.default);
exports.default = router;
