import express from "express";
import * as authController from "../controllers/login_auth_data.controller";

const router = express.Router();

// Trasa do logowania
router.post("/login", authController.login);

export default router;
