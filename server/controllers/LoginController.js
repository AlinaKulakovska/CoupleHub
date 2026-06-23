const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
        return res.status(401).json("Wrong credentials");

    const valid = await bcrypt.compare(password, user.password);

    if (!valid)
        return res.status(401).json("Wrong credentials");

    const token = jwt.sign(
        {
            id: user._id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );

    res.json({
        token
    });
};