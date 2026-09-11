const Order = require("../models/order");
const Product = require("../models/product");

// Create a new order create — server computes total from items
exports.createOrder = async (req, res, next) => {
    try {
        const { user, items } = req.body;

        let total = 0;

        for (const item of items) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({
                    message: `Product with ID ${item.product} not found`
                });
            }

            total += product.price * item.qty;
        }

        const order = await Order.create({
            user,
            items,
            total
        });

        res.status(201).json(order);

    } catch (err) {
        next(err);
    }
};

// Get all orders
exports.getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().populate("user", "name email").populate("items.product", "items.qty");
        res.json(orders);
    }
    catch (err) {
        next(err);
    }
};

// Get a single order by ID GET /orders/:id one order, fully populated
exports.getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("user", "name email")
            .populate({
                path: "items.product",
                populate: [
                    { path: "category" },
                    { path: "tags" }
                ]
            });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    }
    catch (err) {
        next(err);
    }
};

//PATCH /orders/:id update status (pending → paid → shipped)
exports.updateOrderStatus = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        const validStatuses = ['pending', 'paid', 'shipped'];
        const currentStatusIndex = validStatuses.indexOf(order.status);
        const newStatusIndex = validStatuses.indexOf(req.body.status);
        if (newStatusIndex === -1 || newStatusIndex !== currentStatusIndex + 1) {
            return res.status(400).json({ message: 'Invalid status transition' });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true, runValidators: true }
        );

        res.json(updatedOrder);
    }
    catch (err) {
        next(err);
    }
};

// Delete an order
exports.deleteOrder = async (req, res, next) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order deleted successfully' });
    }
    catch (err) {
        next(err);
    }
};