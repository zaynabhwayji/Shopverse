const { protect, adminOnly } = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

router.get("/", categoryController.getAllCategories);
router.get("/:id/products", protect, adminOnly, categoryController.getProductsByCategory);
router.post("/", protect, adminOnly, categoryController.createCategory);
router.put("/:id", protect, adminOnly, categoryController.updateCategory);
router.delete("/:id", protect, adminOnly, categoryController.deleteCategory);

module.exports = router;