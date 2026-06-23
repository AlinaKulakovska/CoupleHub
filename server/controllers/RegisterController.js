const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.register = async (req, res) => {

    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({

        email,
        password: hashedPassword,
        name: req.body.name,
        startDate: req.body.startDate

    });

    res.json(user);
};