const Tag = require("../models/tag");
const Product = require("../models/product");

// Create a new tag
exports.createTag = async (req, res, next) => {
    try {
        const tag = await Tag.create(req.body);
        res.status(201).json(tag);
    } catch (err) {
        next(err);
    }
};

// Get all tags
exports.getAllTags = async (req, res, next) => {
    try {
        const tags = await Tag.find();
        res.json(tags);
    } catch (err) {
        next(err);
    }
};

// Get all products by tag (one-to-many read)
exports.getProductsByTag = async (req, res, next) => {
    try {
        const products = await Product.find({
            tags: req.params.id
        });

        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

// Delete a tag 
exports.deleteTag = async (req, res, next) => {
    try {
        const tag = await Tag.findByIdAndDelete(req.params.id);
        if (!tag) {
            return res.status(404).json({ message: 'Tag not found' });
        }
        res.json({ message: 'Tag deleted successfully' });
    } catch (err) {
        next(err);
    }
};