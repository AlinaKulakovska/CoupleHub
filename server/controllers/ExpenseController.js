const Expense = require("../models/Expense");

// Fetch all expenses for a couple
exports.getExpenses = async (req, res) => {
    try {
        const { coupleId } = req.params;
        const expenses = await Expense.find({ couple: coupleId }).sort({ createdAt: -1 });
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: "Error fetching expenses." });
    }
};

// Add a new expense item
exports.addExpense = async (req, res) => {
    try {
        const { coupleId, title, amount, category, paidById } = req.body;
        const newExpense = await Expense.create({
            couple: coupleId,
            title,
            amount: parseFloat(amount),
            category,
            paidBy: paidById
        });
        res.status(201).json(newExpense);
    } catch (error) {
        res.status(500).json({ message: "Error creating expense log." });
    }
};