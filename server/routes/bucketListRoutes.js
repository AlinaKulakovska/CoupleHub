const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/BucketListController");

router.get("/:coupleId", ctrl.getItems);
router.post("/add", ctrl.addItem);
router.patch("/toggle/:id", ctrl.toggleItem);

module.exports = router;