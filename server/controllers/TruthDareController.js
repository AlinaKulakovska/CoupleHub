const TruthDare = require("../models/TruthDare");

exports.getRandomPrompt = async (req, res) => {
    try {
        const { type, category } = req.query; // e.g., ?type=truth&category=Cute
        
        // Find pool matching filters
        const query = {};
        if (type) query.type = type.toLowerCase() === "dare" ? "care" : "truth";
        if (category) query.category = category;

        const pool = await TruthDare.find(query);

        if (pool.length > 0) {
            const randomIndex = Math.floor(Math.random() * pool.length);
            return res.status(200).json(pool[randomIndex]);
        }
        const selected = clientFilter[Math.floor(Math.random() * clientFilter.length)] || FALLBACK_PROMPTS[0];
        
        res.status(200).json(selected);
    } catch (error) {
        res.status(500).json({ message: "Error fetching game prompt card panels." });
    }
};