const jwt = require("jsonwebtoken");
const User = require("../models/user");
// build a token carrying the user id + role, valid 7 days
function signToken(user) {
    return jwt.sign(
        { id: user._id, role: user.role }, // the payload
        process.env.JWT_SECRET, // the secret that signs it
        { expiresIn: "7d" }
    );
}
// POST /auth/register
exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.create({ name, email, password }); // hook hashes it
        const token = signToken(user);
        res.status(201).json({ token, user: { id: user._id, name, email } });
    } catch (err) { next(err); }
};

// POST /auth/login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        res.json({
            token: signToken(user),
            user: {
                id: user._id,
                name: user.name,
                role: user.role
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.me = async (req, res) => {
    res.json({ user: req.user });
};