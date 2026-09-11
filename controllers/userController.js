const User = require("../models/user");
const Order = require("../models/order");

// Create a new user
exports.createUser = async (req, res, next) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (err) {
        next(err);
    }
};

// Get all users
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        next(err);
    }
};

// Get all orders by user id (one-to-many read)
exports.getOrdersByUserId = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.params.id });
        res.json(orders);
    } catch (err) {
        next(err);
    }   
};