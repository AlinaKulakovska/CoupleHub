const Memory = require("../models/Memory");

// Fetch all shared memories for a couple, sorted newest first
exports.getMemories = async (req, res) => {
    try {
        const { coupleId } = req.params;
        const memories = await Memory.find({ couple: coupleId }).sort({ date: -1 });
        res.status(200).json(memories);
    } catch (error) {
        res.status(500).json({ message: "Error loading shared memories." });
    }
};

// Log a new couple memory milestone
exports.addMemory = async (req, res) => {
    try {
        const { coupleId, title, description, date, category, image, userId } = req.body;
        
        const newMemory = await Memory.create({
            couple: coupleId,
            title,
            description,
            date,
            category,
            image, // Base64 payload string
            createdBy: userId
        });
        
        res.status(201).json(newMemory);
    } catch (error) {
        res.status(500).json({ message: "Error preserving your memory card." });
    }
};