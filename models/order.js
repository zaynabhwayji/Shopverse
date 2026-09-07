const orderSchema = new mongoose.Schema({
    // one-to-many: placed by ONE user
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // many-to-many: many products, each with a quantity
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            qty: { type: Number, default: 1, min: 1 },
        },
    ],
    total: { type: Number, default: 0 },
    status: { type: String, enum: ["pending", "paid", "shipped"], default: "pending" },
}, { timestamps: true });
module.exports = mongoose.model("Order", orderSchema);
