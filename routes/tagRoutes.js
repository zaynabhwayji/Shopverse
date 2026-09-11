const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tagController");

router.get("/", tagController.getAllTags);
router.get("/:id/products", tagController.getProductsByTag);
router.post("/", tagController.createTag);
router.delete("/:id", tagController.deleteTag);

module.exports = router;