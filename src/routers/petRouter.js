const express = require("express");
const router = express.Router();
const petController = require("../controllers/petController");
const { authenticateToken } = require("../servizi/servizioAutenticazione");

router.patch("/", authenticateToken, petController.decadimento);
router.get("/stato", authenticateToken, petController.stato);
router.patch("/nutri", authenticateToken, petController.nutri);
router.patch("/gioca", authenticateToken, petController.gioca);
router.post("/adotta", authenticateToken, petController.adotta);
router.patch("/libera", authenticateToken, petController.libera);

module.exports = router;