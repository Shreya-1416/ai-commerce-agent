const Order = require("../models/Order");

const getPendingOrder = async ({ sessionId }) => {
  const order = await Order.findOne({
    sessionId,
    status: "pending",
  }).sort({ createdAt: -1 });

  if (!order) {
    return {
      success: false,
      message: "No pending order found",
    };
  }

  return {
    success: true,
    orderId: order._id.toString(),
    totalAmount: order.totalAmount,
    status: order.status,
    razorpayOrderId: order.razorpayOrderId || null,
    paymentId: order.paymentId || null,
  };
};

// NEW
const getOrderStatus = async ({ sessionId }) => {
  const order = await Order.findOne({ sessionId })
    .sort({ createdAt: -1 });

  if (!order) {
    return {
      success: false,
      message: "No order found",
    };
  }

  return {
    success: true,
    orderId: order._id.toString(),
    totalAmount: order.totalAmount,
    status: order.status,
    razorpayOrderId: order.razorpayOrderId || null,
    paymentId: order.paymentId || null,
  };
};

module.exports = {
  getPendingOrder,
  getOrderStatus,
};