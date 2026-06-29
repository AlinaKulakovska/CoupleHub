const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/MoodController");

router.get("/:coupleId", ctrl.getCoupleMoods);
router.post("/set", ctrl.setMood);

module.exports = router;