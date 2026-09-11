const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    inStock: { type: Boolean, default: true },
    // one-to-many: belongs to ONE category
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    // many-to-many: has MANY tags (array of refs)
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
}, { timestamps: true });
module.exports = mongoose.model("Product", productSchema);