const Mood = require("../models/Mood");

// Fetch the current mood for both partners in the couple
exports.getCoupleMoods = async (req, res) => {
    try {
        const { coupleId } = req.params;
        const moods = await Mood.find({ couple: coupleId });
        res.status(200).json(moods);
    } catch (error) {
        res.status(500).json({ message: "Error fetching couple moods." });
    }
};

// Set or update a user's current mood state
exports.setMood = async (req, res) => {
    try {
        const { coupleId, userId, emoji, label, color } = req.body;

        // Use findOneAndUpdate to replace the old mood record so it stays updated
        const updatedMood = await Mood.findOneAndUpdate(
            { couple: coupleId, user: userId },
            { emoji, label, color },
            { new: true, upsert: true }
        );

        res.status(200).json(updatedMood);
    } catch (error) {
        res.status(500).json({ message: "Error updating your mood status." });
    }
};