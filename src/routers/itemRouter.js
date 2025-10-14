const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
const { authenticateToken } = require("../servizi/servizioAutenticazione");

router.get("/", authenticateToken, itemController.getItems);

module.exports = router;