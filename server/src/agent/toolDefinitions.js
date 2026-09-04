const tools = [
  {
    type: "function",
    function: {
      name: "search_products",
      description:
        "Search the merchant catalog for products matching the customer's request.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description:
              "Product type, keyword, category, or feature to search for.",
          },
          maxPrice: {
            type: "number",
            description:
              "Maximum price in INR. Omit this if the customer did not specify a maximum.",
          },
        },
        required: ["query"],
      },
    },
  },

  {
    type: "function",
    function: {
      name: "get_product",
      description:
        "Get complete information about a specific product.",
      parameters: {
        type: "object",
        properties: {
          productId: {
            type: "string",
            description: "MongoDB ObjectId of the product.",
          },
        },
        required: ["productId"],
      },
    },
  },

  {
    type: "function",
    function: {
      name: "add_to_cart",
      description:
        "Add a product to the customer's cart.",
      parameters: {
        type: "object",
        properties: {
          sessionId: {
            type: "string",
            description: "Customer session ID.",
          },
          productId: {
            type: "string",
            description: "MongoDB ObjectId of the product.",
          },
          quantity: {
            type: "integer",
            description: "Quantity to add.",
            minimum: 1,
          },
        },
        required: ["sessionId", "productId"],
      },
    },
  },

  {
    type: "function",
    function: {
      name: "create_order",
      description:
        "Create a pending merchant order from the customer's cart. This does not charge the customer.",
      parameters: {
        type: "object",
        properties: {
          sessionId: {
            type: "string",
            description: "Customer session ID.",
          },
        },
        required: ["sessionId"],
      },
    },
  },

  {
    type: "function",
    function: {
      name: "create_payment",
      description:
        "Create a Razorpay payment order for an existing pending order. NEVER use this without explicit customer confirmation to proceed to payment.",
      parameters: {
        type: "object",
        properties: {
          orderId: {
            type: "string",
            description: "MongoDB Order ID.",
          },
        },
        required: ["orderId"],
      },
    },
  },

  {
    type: "function",
    function: {
      name: "get_pending_order",
      description:
        "Find the customer's latest pending order using their session ID.",
      parameters: {
        type: "object",
        properties: {
          sessionId: {
            type: "string",
            description: "Customer session ID.",
          },
        },
        required: ["sessionId"],
      },
    },
  },

  // NEW TOOL
  {
    type: "function",
    function: {
      name: "get_order_status",
      description:
        "Get the customer's latest order and payment status using their session ID. Use this when the customer asks about payment status, order status, whether payment succeeded, whether payment was successful, or whether an order has been paid.",
      parameters: {
        type: "object",
        properties: {
          sessionId: {
            type: "string",
            description: "Customer session ID.",
          },
        },
        required: ["sessionId"],
      },
    },
  },
  {
  type: "function",
  function: {
    name: "get_cart",
    description: "Get the customer's current cart contents and total amount.",
    parameters: {
      type: "object",
      properties: {
        sessionId: {
          type: "string",
          description: "Customer session ID.",
        },
      },
      required: ["sessionId"],
    },
  },
},
{
  type: "function",
  function: {
    name: "remove_from_cart",
    description: "Remove a specified quantity of a product from the customer's cart.",
    parameters: {
      type: "object",
      properties: {
        sessionId: {
          type: "string",
          description: "Customer session ID.",
        },
        productId: {
          type: "string",
          description: "MongoDB ObjectId of the product.",
        },
        quantity: {
          type: "integer",
          description: "Quantity to remove.",
          minimum: 1,
        },
      },
      required: ["sessionId", "productId"],
    },
  },
},
];

module.exports = tools;