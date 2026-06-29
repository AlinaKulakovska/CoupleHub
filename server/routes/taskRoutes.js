const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/TaskController");

router.get("/:coupleId", ctrl.getTasks);
router.post("/add", ctrl.addTask);
router.patch("/toggle/:id", ctrl.toggleTask);

module.exports = router;