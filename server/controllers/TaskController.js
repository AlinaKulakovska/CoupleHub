const Task = require("../models/Task");

exports.getTasks = async (req, res) => {
    try {
        const { coupleId } = req.params;
        const tasks = await Task.find({ couple: coupleId }).sort({ dueDate: 1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tasks." });
    }
};

exports.addTask = async (req, res) => {
    try {
        const { coupleId, title, assignedTo, priority, dueDate, userId } = req.body;
        const newTask = await Task.create({
            couple: coupleId,
            title,
            assignedTo,
            priority,
            dueDate,
            createdBy: userId
        });
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: "Error adding task." });
    }
};

exports.toggleTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ message: "Task not found" });

        task.isCompleted = !task.isCompleted;
        await task.save();
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: "Error updating task status." });
    }
};