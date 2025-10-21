//Import necessari
const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
const { authenticateToken } = require("../servizi/servizioAutenticazione");

//Definisco le rotte API degli item ed i suoi handler
router.get("/", authenticateToken, itemController.getItems);

module.exports = router;