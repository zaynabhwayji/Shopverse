const { protect, adminOnly } = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", protect, adminOnly, userController.getAllUsers);
router.get("/:id/orders", protect, adminOnly, userController.getOrdersByUserId);
router.post("/", userController.createUser);

module.exports = router;