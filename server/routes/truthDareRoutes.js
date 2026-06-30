const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/TruthDareController");

router.get("/random", ctrl.getRandomPrompt);

module.exports = router;