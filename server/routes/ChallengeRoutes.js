const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/ChallengeController");

router.get("/:coupleId", ctrl.getDashboardData);
router.post("/complete", ctrl.completeChallenge);
router.post("/add", ctrl.createCustomChallenge);

module.exports = router;