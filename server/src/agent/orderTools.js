const Order = require("../models/Order");

const getPendingOrder = async ({ sessionId }) => {
  const order = await Order.findOne({
    sessionId,
    status: "pending",
  }).sort({ createdAt: -1 });

  if (!order) {
    return {
      success: false,
      message: "No pending order found.",
    };
  }

  return {
    success: true,
    order: {
      orderId: order._id.toString(),
      totalAmount: order.totalAmount,
      status: order.status,
      items: order.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    },
  };
};

module.exports = {
  getPendingOrder,
};