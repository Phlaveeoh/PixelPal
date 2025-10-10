const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
const { authenticateToken } = require("../servizi/servizioAutenticazione");

router.get("/cibi", authenticateToken, itemController.getCibi);
router.get("/giochi", authenticateToken, itemController.getGiochi);

module.exports = router;