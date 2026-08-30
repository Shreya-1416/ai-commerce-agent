const Product = require("../models/Product");
const Cart = require("../models/Cart");
const Order = require("../models/Order");

const searchProducts = async ({ query, maxPrice }) => {
  const filter = {};

  if (query) {
    filter.$or = [
      { name: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
      { category: { $regex: query, $options: "i" } },
    ];
  }

  if (maxPrice !== undefined) {
    filter.price = { $lte: Number(maxPrice) };
  }

  const products = await Product.find(filter).limit(10);

  return products.map((product) => ({
    id: product._id.toString(),
    name: product.name,
    price: product.price,
    category: product.category,
    description: product.description,
    stock: product.stock,
  }));
};


const getProduct = async ({ productId }) => {
  const product = await Product.findById(productId);

  if (!product) {
    return {
      success: false,
      message: "Product not found",
    };
  }

  return {
    success: true,
    product: {
      id: product._id.toString(),
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      stock: product.stock,
    },
  };
};


const addToCart = async ({ sessionId, productId, quantity = 1 }) => {
  const product = await Product.findById(productId);

  if (!product) {
    return {
      success: false,
      message: "Product not found",
    };
  }

  if (product.stock < quantity) {
    return {
      success: false,
      message: "Insufficient stock",
    };
  }

  let cart = await Cart.findOne({ sessionId });

  if (!cart) {
    cart = await Cart.create({
      sessionId,
      items: [],
      totalAmount: 0,
    });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      product: product._id,
      quantity,
      price: product.price,
    });
  }

  cart.totalAmount = cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  await cart.save();

  return {
    success: true,
    message: "Product added to cart",
    cart: {
      sessionId: cart.sessionId,
      totalAmount: cart.totalAmount,
      items: cart.items.map((item) => ({
        productId: item.product.toString(),
        quantity: item.quantity,
        price: item.price,
      })),
    },
  };
};


const createOrder = async ({ sessionId }) => {
  const cart = await Cart.findOne({ sessionId }).populate(
    "items.product"
  );

  if (!cart || cart.items.length === 0) {
    return {
      success: false,
      message: "Cart is empty",
    };
  }

  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    quantity: item.quantity,
    price: item.price,
  }));

  const order = await Order.create({
    sessionId,
    items: orderItems,
    totalAmount: cart.totalAmount,
    status: "pending",
  });

  return {
    success: true,
    orderId: order._id.toString(),
    totalAmount: order.totalAmount,
    status: order.status,
    items: order.items,
  };
};


module.exports = {
  searchProducts,
  getProduct,
  addToCart,
  createOrder,
};