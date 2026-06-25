const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Couple = require("../models/Couple"); 

exports.register = async (req, res) => {
    try {
        const { email, password, name, startDate, partnerId } = req.body;

        // 1. Validation: Check for existing email
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: "An account with this email already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the base user object for User 2 (the current registrant)
        const tempUser = new User({
            email: email.toLowerCase(),
            password: hashedPassword,
            name
        });

        // 2. SCENARIO B: Registering with a partner's User ID
        if (partnerId) {
            const partner = await User.findById(partnerId);
            if (!partner) {
                return res.status(400).json({ message: "Partner ID not found. Check the ID and try again." });
            }

            // Find the couple document that User 1 (the partner) already created
            const existingCouple = await Couple.findById(partner.couple);
            if (!existingCouple) {
                return res.status(400).json({ message: "Your partner has not initialized a couple hub layout yet." });
            }

            // Update the shared couple document to include User 2
            existingCouple.user2 = tempUser._id;
            await existingCouple.save();

            // Link User 2 to this existing couple block
            tempUser.couple = existingCouple._id;
            await tempUser.save();

        } else {
            // 3. SCENARIO A: Brand new registration (User 1 is creating the hub)
            await tempUser.save();
            
            // Create a brand new Couple document with User 1 assigned
            const newCouple = await Couple.create({
                user1: tempUser._id,
                user2: null, // Stays null until User 2 joins using User 1's ID
                anniversaryDate: startDate
            });

            // Link User 1 to their new couple document profile
            tempUser.couple = newCouple._id;
            await tempUser.save();
        }

        // 4. Issue the JWT login token for the newly registered user
        const token = jwt.sign({ id: tempUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        // 5. 👉 DEEP POPULATION FIX: Fetch the final saved state and populate user1 and user2 profiles
        const populatedUser = await User.findById(tempUser._id).populate({
            path: "couple",
            populate: [
                { path: "user1", select: "name email" },
                { path: "user2", select: "name email" }
            ]
        });

        // Send back a mirror payload matching the structure expected by login and AuthContext
        res.status(201).json({
            token,
            user: {
                id: populatedUser._id,
                email: populatedUser.email,
                name: populatedUser.name,
                couple: populatedUser.couple // Completely populated deep JSON nested object
            }
        });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Server error during registration." });
    }
};