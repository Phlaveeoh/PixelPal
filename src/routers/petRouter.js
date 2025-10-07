const express = require("express");
const router = express.Router();
const petController = require("../controllers/petController");
const { authenticateToken } = require("../servizi/servizioAutenticazione");

router.get("/", authenticateToken, petController.petDashboard);
router.get("/stato", authenticateToken, petController.stato);
router.patch("/nutri", authenticateToken, petController.nutri);
router.patch("/gioca", authenticateToken, petController.gioca);
router.post("/adotta", authenticateToken, petController.adotta);

module.exports = router;