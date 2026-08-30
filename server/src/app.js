const express = require("express");
const cors = require("cors");

const productRoutes = require("./routes/productRoutes");
const agentRoutes = require("./routes/agentRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "AI Commerce Agent API is running",
  });
});

app.use("/api/products", productRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

module.exports = app;