const OpenAI = require("openai");

const tools = require("../agent/toolDefinitions");

const {
  searchProducts,
  getProduct,
  addToCart,
  createOrder,
} = require("../agent/agentTools");

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const {
  createPayment,
} = require("../agent/paymentTool");

const {
  getPendingOrder,
} = require("../agent/orderTools");

const executeTool = async (name, args) => {
  switch (name) {
    case "search_products":
      return await searchProducts(args);

    case "get_product":
      return await getProduct(args);

    case "add_to_cart":
      return await addToCart(args);

    case "create_order":
      return await createOrder(args);
    
    case "create_payment":
        return await createPayment(args);

    case "get_pending_order":
        return await getPendingOrder(args);

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
};


const runAgent = async (req, res) => {
  try {
    const { message, sessionId = "demo-user-001" } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "message is required",
      });
    }

    const messages = [
      {
        role: "system",
        content: `
You are an AI Commerce Agent for a merchant.

Customer session ID:
${sessionId}

IMPORTANT:
The customer's cart and orders are stored in the merchant database.
Do not ask the customer for product IDs or cart contents if they
have already been added through the tools.

Rules:

1. Use search_products when the customer asks for products.
2. Never invent products, prices, stock, or IDs.
3. Use get_product when detailed product information is required.
4. Use add_to_cart when the customer clearly asks to add/buy a product.
5. Use create_order when the customer clearly asks to place an order.
6. Creating an order does NOT mean payment has happened.
7. NEVER call create_payment unless the customer explicitly confirms
   that they want to proceed to payment.
8. Never claim payment succeeded unless payment verification confirms it.
9. Always use the database/tool results as the source of truth.
10. Do not ask the customer for product IDs when the product is already
    available in their cart.

Payment flow:

Before payment, tell the customer the exact order total.

Then ask:

"Your order total is ₹X. Would you like to proceed to payment?"

Only after an explicit confirmation such as:
"yes", "yes proceed", "proceed", "pay", or "go ahead"
may you call create_payment.

When create_payment succeeds, use the checkoutUrl returned by the tool.
Tell the customer that payment is ready and provide the checkout URL.
Do not ask the customer to manually enter or copy the Razorpay Order ID.
`,
      },
      {
        role: "user",
        content: message,
      },
    ];

    // Agentic tool loop
    for (let i = 0; i < 6; i++) {
      const response = await client.chat.completions.create({
        model:
          process.env.OPENROUTER_MODEL || "openai/gpt-oss-20b",
        messages,
        tools,
        tool_choice: "auto",
      });

      const assistantMessage = response.choices[0].message;

      messages.push(assistantMessage);

      // No more tools -> final answer
      if (!assistantMessage.tool_calls?.length) {
        return res.json({
          success: true,
          reply: assistantMessage.content,
        });
      }

      // Execute every requested tool
      for (const toolCall of assistantMessage.tool_calls) {
  let args;

  try {
    args = JSON.parse(toolCall.function.arguments);
  } catch (error) {
    messages.push({
      role: "tool",
      tool_call_id: toolCall.id,
      content: JSON.stringify({
        success: false,
        message: "Invalid tool arguments",
      }),
    });

    continue;
  }

  // Force the correct session ID from the server
  if (
    toolCall.function.name === "add_to_cart" ||
    toolCall.function.name === "create_order" ||
    toolCall.function.name === "get_pending_order"
  ) {
    args.sessionId = sessionId;
  }

  console.log("AI requested tool:", toolCall.function.name);
  console.log("Arguments:", args);

  const result = await executeTool(
    toolCall.function.name,
    args
  );

  messages.push({
    role: "tool",
    tool_call_id: toolCall.id,
    content: JSON.stringify(result),
  });
}
    }

    return res.status(500).json({
      success: false,
      message: "Agent reached maximum tool steps",
    });
  } catch (error) {
    console.error("Agent error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  runAgent,
};