const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/ExpenseController");

router.get("/:coupleId", ctrl.getExpenses);
router.post("/add", ctrl.addExpense);

module.exports = router;