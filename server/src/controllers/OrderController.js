const Cart = require("../models/Cart");
const Order = require("../models/Order");
const crypto = require("crypto");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// =====================================================
// CREATE RAZORPAY PAYMENT ORDER
// =====================================================

const createPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    console.log("Received orderId:", orderId);

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "orderId is required",
      });
    }

    const order = await Order.findById(orderId);

    console.log("Found order:", order);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Order is ${order.status}`,
      });
    }

    // If Razorpay order already exists, don't create another one
    if (order.razorpayOrderId) {
      return res.json({
        success: true,
        message: "Razorpay order already exists",
        razorpayOrderId: order.razorpayOrderId,
        orderId: order._id.toString(),
        amount: order.totalAmount,
        currency: "INR",
      });
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.totalAmount * 100),
      currency: "INR",
      receipt: order._id.toString(),
    });

    // Save Razorpay order ID
    order.razorpayOrderId = razorpayOrder.id;

    await order.save();

    console.log(
      "Razorpay order created:",
      razorpayOrder.id
    );

    return res.json({
      success: true,

      message: "Razorpay payment order created",

      orderId: order._id.toString(),

      razorpayOrderId: razorpayOrder.id,

      amount: order.totalAmount,

      currency: "INR",

      razorpayOrder,
    });
  } catch (error) {
    console.error(
      "Create payment order error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// VERIFY RAZORPAY PAYMENT
// =====================================================

const verifyPayment = async (req, res) => {
  try {
    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    console.log("Payment verification request:", {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
    });

    // Validate request
    if (
      !orderId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification details",
      });
    }

    // Find our MongoDB order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Make sure Razorpay order belongs to our order
    if (
      order.razorpayOrderId !== razorpay_order_id
    ) {
      return res.status(400).json({
        success: false,
        message: "Razorpay order mismatch",
      });
    }

    // Generate signature
    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    // Compare signatures
    if (
      generatedSignature !== razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // Payment verified
    order.status = "paid";
    order.paymentId = razorpay_payment_id;

    await order.save();

    console.log(
      "Payment verified successfully:",
      razorpay_payment_id
    );

    return res.json({
      success: true,

      message: "Payment verified successfully",

      order,
    });
  } catch (error) {
    console.error(
      "Payment verification error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// CREATE MERCHANT ORDER
// =====================================================

const createOrder = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "sessionId is required",
      });
    }

    // Find customer's cart
    const cart = await Cart.findOne({
      sessionId,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // Convert cart items into order items
    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.price,
    }));

    // Create pending order
    const order = await Order.create({
      sessionId,

      items: orderItems,

      totalAmount: cart.totalAmount,

      status: "pending",
    });

    console.log(
      "Merchant order created:",
      order._id.toString()
    );

    return res.status(201).json({
      success: true,

      message: "Order created successfully",

      order,
    });
  } catch (error) {
    console.error(
      "Create order error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  createOrder,
  createPaymentOrder,
  verifyPayment,
};