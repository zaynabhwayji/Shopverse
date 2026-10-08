const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.protect = async (req, res, next) => {
    try {
        // browsers send: Authorization: Bearer <token>
        const header = req.headers.authorization || "";
        const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;
        if (!token) return res.status(401).json({ error: "Not logged in" });
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // throws if invalid/expired
        req.user = await User.findById(decoded.id); // the real user
        if (!req.user) return res.status(401).json({ error: "User no longer exists" });
        next(); // allowed through
    } catch (err) {
        res.status(401).json({ error: "Invalid or expired token" });
    }
};
// only let admins pass (use AFTER protect)
exports.adminOnly = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Admins only" });
    }
    next();
};
