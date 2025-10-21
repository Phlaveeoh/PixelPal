//Import necessari
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticateToken } = require("../servizi/servizioAutenticazione");

//Definisco le rotte API di autenticazione ed i suoi handler
router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/logout", authenticateToken, authController.logout);

module.exports = router;
