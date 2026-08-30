const OpenAI = require("openai");
const Product = require("../models/Product");

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

const searchProducts = async ({
  query = "",
  category = "",
  maxPrice = null,
}) => {
  const conditions = [];

  if (category) {
    conditions.push({
      category: {
        $regex: category,
        $options: "i",
      },
    });
  }

  if (maxPrice !== null && maxPrice !== undefined) {
    conditions.push({
      price: {
        $lte: Number(maxPrice),
      },
    });
  }

  if (query) {
    conditions.push({
      $or: [
        {
          name: {
            $regex: query,
            $options: "i",
          },
        },
        {
          description: {
            $regex: query,
            $options: "i",
          },
        },
        {
          tags: {
            $elemMatch: {
              $regex: query,
              $options: "i",
            },
          },
        },
      ],
    });
  }

  const filter =
    conditions.length > 0
      ? { $and: conditions }
      : {};

  return await Product.find(filter).limit(10);
};

const recommendUpsell = async ({ productId }) => {
  const product = await Product.findById(productId);

  if (!product) {
    return [];
  }

  // First use merchant-defined recommendations if available
  if (product.upsellProducts?.length > 0) {
    return await Product.find({
      _id: { $in: product.upsellProducts },
      stock: { $gt: 0 },
    });
  }

  // Fallback: find complementary products
  const complementaryCategories = {
    Laptops: ["Accessories"],
    Phones: ["Accessories"],
    Cameras: ["Accessories"],
    Accessories: ["Accessories"],
  };

  const categories =
    complementaryCategories[product.category] || ["Accessories"];

  return await Product.find({
    _id: { $ne: product._id },
    category: { $in: categories },
    stock: { $gt: 0 },
  }).limit(3);
};

const tools = [
  {
    type: "function",
    function: {
      name: "search_products",
      description:
        "Search the merchant product catalog using keywords, category, and maximum price.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Keywords such as coding, laptop, wireless, etc.",
          },
          category: {
            type: "string",
            description: "Product category such as Laptops or Accessories.",
          },
          maxPrice: {
            type: "number",
            description: "Maximum acceptable product price.",
          },
        },
        required: [],
      },
    },
  },

  {
  type: "function",
  function: {
    name: "recommend_upsell",
    description:
      "Find relevant complementary products that can increase the customer's basket value.",
    parameters: {
      type: "object",
      properties: {
        productId: {
          type: "string",
          description:
            "MongoDB ID of the main product the customer is considering.",
        },
      },
      required: ["productId"],
    },
  },
},
];

const executeTool = async (toolName, argumentsObject) => {
  if (toolName === "search_products") {
    return await searchProducts(argumentsObject);
  }

  if (toolName === "recommend_upsell") {
    return await recommendUpsell(argumentsObject);
  }

  throw new Error(`Unknown tool: ${toolName}`);
};

const chatWithAgent = async (message) => {
  const messages = [
    {
      role: "system",
      content: `
You are an AI shopping and growth agent.

Your job is to help customers discover products and increase merchant revenue through relevant recommendations.

Rules:
- Use search_products whenever you need product information.
- After finding a suitable main product, use recommend_upsell when complementary products could be useful.
- NEVER invent product specifications, features, prices, stock, or claims.
- Only mention information explicitly returned by the tools.
- Never assume a specification from a product name.
- Use Indian Rupees (₹) for prices.
- Recommendations must be relevant to the customer's intent.
- Never pressure the customer to buy.
- Keep responses concise.
`,
    },
    {
      role: "user",
      content: message,
    },
  ];

  while (true) {
    const response = await client.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages,
      tools,
      tool_choice: "auto",
    });

    const assistantMessage = response.choices[0].message;

    messages.push(assistantMessage);

    // No more tools needed → final answer
    if (!assistantMessage.tool_calls) {
      return assistantMessage.content;
    }

    // Execute every requested tool
    for (const toolCall of assistantMessage.tool_calls) {
      const toolName = toolCall.function.name;

      const argumentsObject = JSON.parse(
        toolCall.function.arguments || "{}"
      );

      const toolResult = await executeTool(
        toolName,
        argumentsObject
      );

      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(toolResult),
      });
    }
  }
};

module.exports = {
  searchProducts,
  recommendUpsell,
  chatWithAgent,
};