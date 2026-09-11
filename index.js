require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const tagRoutes = require("./routes/tagRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("DB connected"))
    .catch((err) => console.log("DB error:", err));

app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/tags", tagRoutes);
app.use("/users", userRoutes);
app.use("/orders", orderRoutes);

app.use(notFound); // no route matched -> 404
app.use(errorHandler); // any next(err) lands here
app.listen(3000, () => console.log("Server on port 3000"));