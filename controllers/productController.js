const Product = require('../models/product');

// Create a new product
exports.createProduct = async (req, res, next) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (err) {
        next(err);
    }
};

// GET all (+ filters)
exports.getProducts = async (req, res, next) => {
    try {
        const filter = {};

        if (req.query.inStock) {
            filter.inStock = req.query.inStock === "true";
        }

        if (req.query.category) {
            filter.category = req.query.category;
        }

        if (req.query.tag) {
            filter.tags = req.query.tag;
        }

        if (req.query.minPrice || req.query.maxPrice) {
            filter.price = {}; if (req.query.minPrice) {
                filter.price.$gte = Number(req.query.minPrice);
            }
            if (req.query.maxPrice) {
                filter.price.$lte = Number(req.query.maxPrice);
            }
        }

        const products = await Product.find(filter)
            .sort(req.query.sort || "-price")
            .limit(Number(req.query.limit) || 10)
            .skip(((Number(req.query.page) || 1) - 1) * (Number(req.query.limit) || 10))
            .populate('category')
            .populate('tags');

        res.json(products);
    } catch (err) {
        next(err);
    }
};

// Get a single product by ID
exports.getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate('category').populate('tags');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        next(err);
    }
};

// update 
exports.updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        next(err);
    }
};

// Delete a product
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        next(err);
    }
};