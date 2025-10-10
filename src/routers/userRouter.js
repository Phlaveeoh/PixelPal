const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken } = require("../servizi/servizioAutenticazione");

router.get("/", authenticateToken, userController.getInfo);
router.patch("/update", authenticateToken, userController.aggiornaInfo);
router.patch("/cambiaPassword", authenticateToken, userController.cambiaPassword);
router.delete("/elimina", authenticateToken, userController.eliminaUtente);

module.exports = router;