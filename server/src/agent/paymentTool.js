const Order = require("../models/Order");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createPayment = async ({ orderId }) => {
  try {
    // Find merchant order
    const order = await Order.findById(orderId);

    if (!order) {
      return {
        success: false,
        message: "Order not found",
      };
    }

    // Payment can only be created for pending orders
    if (order.status !== "pending") {
      return {
        success: false,
        message: `Order is ${order.status}`,
      };
    }

    // Frontend URL:
    // Production → FRONTEND_URL from Render
    // Local development → http://localhost:5173
    const frontendUrl =
      process.env.FRONTEND_URL || "http://localhost:5173";

    /*
     * If a Razorpay order already exists,
     * reuse it instead of creating another one.
     */
    if (order.razorpayOrderId) {
      return {
        success: true,
        orderId: order._id.toString(),
        razorpayOrderId: order.razorpayOrderId,
        amount: order.totalAmount,
        currency: "INR",

        checkoutUrl:
          `${frontendUrl}/checkout` +
          `?orderId=${encodeURIComponent(order._id.toString())}` +
          `&razorpayOrderId=${encodeURIComponent(
            order.razorpayOrderId
          )}` +
          `&amount=${encodeURIComponent(order.totalAmount)}`,

        message:
          "Payment order already exists. Customer can proceed to checkout.",
      };
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.totalAmount * 100),
      currency: "INR",
      receipt: order._id.toString(),
    });

    // Save Razorpay order ID in MongoDB
    order.razorpayOrderId = razorpayOrder.id;

    await order.save();

    // Return payment information to frontend
    return {
      success: true,

      orderId: order._id.toString(),

      razorpayOrderId: razorpayOrder.id,

      amount: order.totalAmount,

      currency: "INR",

      checkoutUrl:
        `${frontendUrl}/checkout` +
        `?orderId=${encodeURIComponent(order._id.toString())}` +
        `&razorpayOrderId=${encodeURIComponent(
          razorpayOrder.id
        )}` +
        `&amount=${encodeURIComponent(order.totalAmount)}`,

      message:
        "Payment order created. Customer can proceed to checkout.",
    };
  } catch (error) {
    console.error("Create payment error:", error);

    return {
      success: false,
      message: error.message,
    };
  }
};

module.exports = {
  createPayment,
};