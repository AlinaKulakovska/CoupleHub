const BucketListItem = require("../models/BucketList");

// Fetch all items for the couple
exports.getItems = async (req, res) => {
    try {
        const { coupleId } = req.params;
        const items = await BucketListItem.find({ couple: coupleId }).sort({ createdAt: -1 });
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bucket list items." });
    }
};

// Create a new item
exports.addItem = async (req, res) => {
    try {
        const { coupleId, title, category, userId } = req.body;
        const newItem = await BucketListItem.create({
            couple: coupleId,
            title,
            category,
            createdBy: userId
        });
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: "Error adding item." });
    }
};

// Toggle item completion state
exports.toggleItem = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await BucketListItem.findById(id);
        if (!item) return res.status(404).json({ message: "Item not found" });

        item.isCompleted = !item.isCompleted;
        await item.save();
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: "Error updating item." });
    }
};