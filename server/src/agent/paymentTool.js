const Order = require("../models/Order");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createPayment = async ({ orderId }) => {
  const order = await Order.findById(orderId);

  if (!order) {
    return {
      success: false,
      message: "Order not found",
    };
  }

  if (order.status !== "pending") {
    return {
      success: false,
      message: `Order is ${order.status}`,
    };
  }

  const razorpayOrder = await razorpay.orders.create({
    amount: order.totalAmount * 100,
    currency: "INR",
    receipt: order._id.toString(),
  });

  order.razorpayOrderId = razorpayOrder.id;
  await order.save();

  return {
  success: true,
  orderId: order._id.toString(),
  razorpayOrderId: razorpayOrder.id,
  amount: order.totalAmount,
  currency: "INR",

  checkoutUrl:
    `http://localhost:5173/checkout?orderId=${razorpayOrder.id}&amount=${order.totalAmount}`,

  message: "Payment order created. Customer can proceed to checkout.",
};
};

module.exports = {
  createPayment,
};