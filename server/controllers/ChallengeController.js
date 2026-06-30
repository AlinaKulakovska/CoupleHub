const Challenge = require("../models/Challenge");
const CoupleProgress = require("../models/CoupleProgress");

// Get all system challenges along with the couple's active XP progression metrics
exports.getDashboardData = async (req, res) => {
    try {
        const { coupleId } = req.params;

        // Ensure a progress tracking profile initialization document exists
        let progress = await CoupleProgress.findOne({ couple: coupleId });
        if (!progress) {
            progress = await CoupleProgress.create({ couple: coupleId, xp: 0, level: 1 });
        }

        const challenges = await Challenge.find({});
        res.status(200).json({ progress, challenges });
    } catch (error) {
        res.status(500).json({ message: "Error fetching challenge data." });
    }
};

// Mark a challenge complete, allocate rewards, and calculate level updates
exports.completeChallenge = async (req, res) => {
    try {
        const { coupleId, challengeId } = req.body;

        const challenge = await Challenge.findById(challengeId);
        if (!challenge) return res.status(404).json({ message: "Challenge not found" });

        let progress = await CoupleProgress.findOne({ couple: coupleId });
        if (!progress) progress = new CoupleProgress({ couple: coupleId });

        // Prevent duplicate completions
        if (progress.completedChallenges.includes(challengeId)) {
            return res.status(400).json({ message: "Challenge already completed!" });
        }

        progress.completedChallenges.push(challengeId);
        progress.xp += challenge.xpReward;

        // Simple leveling calculation threshold equation: e.g., 150 XP per level rank
        const newLevel = Math.floor(progress.xp / 150) + 1;
        progress.level = newLevel;

        await progress.save();
        res.status(200).json(progress);
    } catch (error) {
        res.status(500).json({ message: "Error completing challenge tracking entry." });
    }
};

// Add a new custom challenge
exports.createCustomChallenge = async (req, res) => {
    try {
        const { title, description, xpReward, icon } = req.body;

        if (!title || !description || !xpReward) {
            return res.status(400).json({ message: "Please fill in all fields." });
        }

        const newChallenge = await Challenge.create({
            title,
            description,
            xpReward: parseInt(xpReward, 10),
            icon: icon || "🏆"
        });

        res.status(201).json(newChallenge);
    } catch (error) {
        res.status(500).json({ message: "Error creating custom challenge." });
    }
};