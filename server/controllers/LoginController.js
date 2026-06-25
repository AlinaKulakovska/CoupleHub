const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validation: Ensure both fields are provided
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        // 2. Find user AND join their Couple data in ONE single step using .populate()
      const user = await User.findOne({ email: email.toLowerCase() }).populate({
    path: "couple",
    populate: [
        { path: "user1", select: "name email" }, // Pulls name and email for user1
        { path: "user2", select: "name email" }  // Pulls name and email for user2
    ]
});
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // 3. Compare the provided password with the hashed password in MongoDB
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // 4. Generate the JWT token using your environment variable
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // 5. Send back a safe response containing the token, user details, AND their couple data
       res.status(200).json({
    token,
    user: {
        id: user._id,
        email: user.email,
        name: user.name,
        couple: user.couple // 👈 Keep it named 'couple' to match your DB model field
    }
});

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error during login." });
    }
    

    
};


// 👉 ADD THIS AT THE BOTTOM OF THE FILE:
exports.checkStatus = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        // Look up the user and deeply populate their couple data
        const user = await User.findById(userId).populate({
            path: "couple",
            populate: [
                { path: "user1", select: "name email" },
                { path: "user2", select: "name email" }
            ]
        });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Send back the couple object (which now contains user2 once they register!)
        res.status(200).json({ couple: user.couple });

    } catch (error) {
        console.error("Check Status Error:", error);
        res.status(500).json({ message: "Server error checking status." });
    }
};