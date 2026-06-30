const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/MemoryController");

router.get("/:coupleId", ctrl.getMemories);
router.post("/add", ctrl.addMemory);

module.exports = router;