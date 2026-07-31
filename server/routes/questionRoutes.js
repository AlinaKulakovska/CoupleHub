const express = require("express");
const router = express.Router();
const questionCtrl = require("../controllers/QuestionController");

router.get("/today", questionCtrl.getTodayQuestion);
router.post("/answer", questionCtrl.submitAnswer);
router.get("/history", questionCtrl.getHistory);

module.exports = router;