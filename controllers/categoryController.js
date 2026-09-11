const Category = require("../models/category");
const Product = require("../models/product");

// Create a new category
exports.createCategory = async (req, res, next) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json(category);
    }
    catch (err) {
        next(err);
    }
};

//Get all Categories
exports.getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    }
    catch (err) {
        next(err);
    }
};

//Update a category
exports.updateCategory = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    } catch (err) {
        next(err);
    }
};

// Delete a category
exports.deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({ message: 'Category deleted successfully' });
    } catch (err) {
        next(err);
    }
};

// Get all products in a category all products in it (one-to-many read)
exports.getProductsByCategory = async (req, res, next) => {
    try {
        const products = await Product.find({
            category: req.params.id
        });

        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};
