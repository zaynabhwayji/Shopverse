const { protect, adminOnly } = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.get("/", protect, adminOnly, orderController.getAllOrders);
router.get("/my-orders", protect, orderController.getMyOrders);
router.get("/:id", protect, adminOnly, orderController.getOrderById);
router.post("/", protect, orderController.createOrder);
router.patch("/:id", protect, adminOnly, orderController.updateOrderStatus);
router.delete("/:id", protect, adminOnly, orderController.deleteOrder);

module.exports = router;