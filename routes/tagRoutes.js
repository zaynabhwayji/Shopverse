const { protect, adminOnly } = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tagController");

router.get("/", tagController.getAllTags);
router.get("/:id/products",protect, adminOnly, tagController.getProductsByTag);
router.post("/", protect, adminOnly, tagController.createTag);
router.delete("/:id", protect, adminOnly, tagController.deleteTag);

module.exports = router;