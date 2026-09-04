# 🤖 AI Commerce Agent

> **AI-powered Agentic Commerce MVP** — a conversational shopping agent that understands natural-language intent, searches a merchant catalog, compares products, makes recommendations, manages the cart, creates orders, and prepares secure payments with **Razorpay Test Mode**.

[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![OpenRouter](https://img.shields.io/badge/LLM-OpenRouter-111827)](https://openrouter.ai/)
[![Razorpay](https://img.shields.io/badge/Payments-Razorpay%20Test%20Mode-528FF0)](https://razorpay.com/)

---

## 📌 What Is This?

Traditional e-commerce interfaces make users search, filter, compare, select, add to cart, create an order, and then pay.

This project replaces much of that interaction with an **AI shopping agent**.

The customer can simply say:

> "I need a laptop for everyday home use under ₹60,000."

The agent can then:

1. Understand the shopping intent.
2. Search the merchant's MongoDB catalog.
3. Compare relevant products.
4. Recommend the most suitable option.
5. Suggest complementary products.
6. Add products to the cart when explicitly requested.
7. Show and manage the cart.
8. Create an order when requested.
9. Ask for explicit payment confirmation.
10. Create a Razorpay Test Mode payment order.
11. Open the Razorpay checkout.
12. Verify the payment on the backend.
13. Report the final order/payment status.
14. Record agent activity through an audit trail.

The MongoDB catalog is treated as the **source of truth** for products, prices, stock, orders, and payment state.

---

# ✨ Key Features

### 🧠 Conversational Shopping
Users interact using natural language rather than rigid search forms.

### 🔎 Product Discovery
Search products by:
- Category
- Budget
- Use case
- Brand
- Features
- Preferences

### ⚖️ Product Comparison
The agent can compare available products and explain which one better matches the customer's requirements.

### 💡 Smart Recommendations
The agent uses the customer's stated:
- Budget
- Intended use
- Category
- Features
- Preferences

to recommend a suitable product.

### 🛍️ Cross-Selling
The agent can suggest relevant accessories without automatically adding them to the cart.

Example:

**Laptop**
- Keyboard
- Mouse
- Headphones
- Earbuds

### 🛒 Cart Management
The agent can:
- Add products
- View the cart
- Check quantities
- Check total
- Remove products
- Decrease quantities

### 📦 Order Creation
The agent creates an order from the current cart only when the customer wants to proceed with the purchase.

### 💳 Agentic Payment Flow
Payment initiation requires explicit customer confirmation.

Example:

> Agent: Your order total is ₹59,999. Would you like to proceed to payment?

> Customer: Yes, proceed to payment.

Only then does the agent create the Razorpay payment order.

### 🔐 Payment Verification
The frontend never decides that a payment is successful.

The backend verifies the Razorpay signature before marking the merchant order as `paid`.

### 📋 Audit Trail
Agent tool activity is logged so the system can provide visibility into actions performed during the shopping journey.

---

# 🏗️ Architecture

```text
┌───────────────────────────────────────────────┐
│                 React Frontend                │
│                                               │
│  Chat UI → Agent Activity → Checkout UI       │
└───────────────────────┬───────────────────────┘
                        │
                        │ HTTP
                        ▼
┌───────────────────────────────────────────────┐
│              Node.js + Express API            │
│                                               │
│  Agent Controller                             │
│       │                                       │
│       ├── Product Tools                       │
│       ├── Cart Tools                          │
│       ├── Order Tools                         │
│       └── Payment Tool                        │
└───────────────┬───────────────────┬───────────┘
                │                   │
                ▼                   ▼
       ┌────────────────┐   ┌─────────────────┐
       │    MongoDB     │   │   OpenRouter    │
       │                │   │                 │
       │ Products       │   │ LLM + Tool      │
       │ Cart           │   │ Calling         │
       │ Orders         │   │                 │
       │ Audit Logs     │   └─────────────────┘
       └────────────────┘
                │
                │ Payment order
                ▼
       ┌─────────────────┐
       │    Razorpay     │
       │   Test Mode     │
       │                 │
       │ Checkout        │
       │ Payment         │
       └────────┬────────┘
                │
                │ Payment response
                ▼
       ┌─────────────────┐
       │ Backend HMAC    │
       │ Verification    │
       └─────────────────┘
```

---

# 🔄 Agent Workflow

```text
Customer Intent
      ↓
LLM understands request
      ↓
Search merchant catalog
      ↓
Compare / Recommend
      ↓
Customer explicitly asks to add
      ↓
Add to cart
      ↓
Customer asks to purchase
      ↓
Create merchant order
      ↓
Show exact total
      ↓
Ask for payment confirmation
      ↓
Customer confirms
      ↓
Create Razorpay payment order
      ↓
Open Razorpay Checkout
      ↓
Customer completes Test Mode payment
      ↓
Backend verifies Razorpay signature
      ↓
Order status = paid
      ↓
Customer can ask for payment/order status
```

---

# 🧰 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React | Conversational shopping UI |
| Build Tool | Vite | Frontend development/build |
| Styling | CSS | UI styling |
| Markdown | React Markdown + remark-gfm | Render structured agent responses |
| Backend | Node.js | Server runtime |
| API | Express.js | REST API |
| Database | MongoDB + Mongoose | Catalog, cart, orders, audit logs |
| AI | OpenRouter | LLM access |
| Agent | Tool Calling | Allows the LLM to invoke commerce actions |
| Payments | Razorpay Test Mode | Simulated checkout |
| Payment Security | HMAC verification | Server-side payment verification |
| Version Control | Git + GitHub | Source control |

---

# 🧠 Agent Tools

The agent currently has access to the following commerce tools:

| Tool | Purpose |
|---|---|
| `search_products` | Search the merchant catalog |
| `get_product` | Get details for a specific product |
| `add_to_cart` | Add a requested product |
| `get_cart` | View the current cart |
| `remove_from_cart` | Remove/decrease products |
| `create_order` | Create a merchant order |
| `create_payment` | Create a Razorpay payment order |
| `get_pending_order` | Find the latest pending order |
| `get_order_status` | Check the latest order/payment status |

The LLM does not directly access MongoDB. Commerce actions are performed through backend tools.

---

# 🔐 Trust & Safety Design

A key design principle is:

> **The AI decides what action is appropriate, but the backend remains the trust boundary.**

The agent is instructed not to invent:
- Products
- Product IDs
- Prices
- Stock
- Specifications
- Order information
- Payment status

Real catalog, cart, order, and payment information is obtained through backend tools.

Payment also follows a strict approval flow:

```text
Recommendation
      ↓
Cart
      ↓
Order
      ↓
Exact total shown
      ↓
Explicit customer confirmation
      ↓
Payment initiation
```

The agent must **not initiate payment without explicit customer confirmation**.

Payment is considered complete only after backend verification.

---

# 💬 Example Conversation

## Example 1 — Product Discovery

**Customer**

```text
I need an Android phone under ₹30,000.
```

**Agent**

```text
I found several Android phones within your budget.

1. Samsung Galaxy A55 — ₹32,999
2. OnePlus Nord CE 4 — ₹24,999
3. Nothing Phone 2a — ₹23,999

Based on your budget, OnePlus Nord CE 4 and Nothing Phone 2a are the strongest matches.
```

---

## Example 2 — Comparison

**Customer**

```text
Compare the options.
```

**Agent**

```text
Here is a comparison of the available options based on price,
category, catalog description, and stock.

I would recommend the option that best matches your stated
budget and intended use.
```

The important point is that the agent uses catalog data rather than inventing specifications.

---

## Example 3 — Contextual Recommendation

**Customer**

```text
Which one do you recommend for me?
```

**Agent**

```text
Based on your budget and requirements, I recommend the
OnePlus Nord CE 4.

It fits your budget and is a strong match among the products
available in the merchant catalog.
```

---

## Example 4 — Contextual Cart Action

**Customer**

```text
Add the laptop you recommend to my cart.
```

The agent uses the conversation context to identify the previously recommended product and calls the cart tool.

---

## Example 5 — Cross-Selling

**Customer**

```text
What accessories should I get with the laptop?
```

**Agent**

```text
For the laptop, useful optional accessories include:

- Logitech K380 — ₹2,499
- Logitech M331 — ₹1,599
- Sony WH-CH520 — ₹4,499

These are suggestions only. I won't add them unless you ask.
```

---

## Example 6 — Order Creation

**Customer**

```text
Create my order.
```

**Agent**

```text
Your order has been created from the items in your cart.

Order total: ₹X

Would you like to proceed to payment?
```

---

## Example 7 — Payment Approval

**Customer**

```text
Yes, proceed to payment.
```

**Agent**

```text
Your payment is ready.

Open the checkout link to complete the Razorpay payment.
```

The agent does not claim that payment is complete until the backend verifies it.

---

## Example 8 — Payment Status

**Customer**

```text
What is the status of my payment?
```

**Agent**

```text
Your payment was successfully verified.
```

The status is obtained from the order/payment system rather than guessed by the LLM.

---

# 🧪 Recommended Demo Conversation

For a hackathon presentation, use this flow:

```text
Customer:
I need a laptop for everyday home use under ₹60,000.

Agent:
Searches catalog and presents relevant laptops.

Customer:
Which one do you recommend?

Agent:
Recommends the best match.

Customer:
What accessories should I get?

Agent:
Suggests available keyboard/mouse/headphones.

Customer:
Add the laptop you recommended to my cart.

Agent:
Adds the correct product.

Customer:
Add the mouse too.

Agent:
Adds the requested accessory.

Customer:
Show my cart.

Agent:
Displays cart contents and total.

Customer:
Create my order.

Agent:
Creates the merchant order and shows the exact total.

Agent:
Your order total is ₹X. Would you like to proceed to payment?

Customer:
Yes, proceed to payment.

Agent:
Provides the Razorpay checkout.

Customer:
Completes Test Mode payment.

Agent:
Payment is verified.

Customer:
What is my payment status?

Agent:
Payment successfully verified.
```

This demonstrates the complete agentic-commerce loop rather than only a chatbot.

---

# 🛍️ Available Product Catalog

The current demo catalog contains the following products.

| # | Product | Category | Price |
|---:|---|---|---:|
| 1 | OnePlus Nord Buds 3 | Earbuds | ₹2,999 |
| 2 | Samsung Galaxy Buds FE | Earbuds | ₹4,999 |
| 3 | boAt Airdopes 141 | Earbuds | ₹1,299 |
| 4 | Sony WH-CH520 | Headphones | ₹4,499 |
| 5 | JBL Tune 760NC | Headphones | ₹5,999 |
| 6 | Samsung Galaxy A55 | Smartphone | ₹32,999 |
| 7 | OnePlus Nord CE 4 | Smartphone | ₹24,999 |
| 8 | Google Pixel 8a | Smartphone | ₹42,999 |
| 9 | Nothing Phone 2a | Smartphone | ₹23,999 |
| 10 | Logitech K380 | Keyboard | ₹2,499 |
| 11 | Redragon K552 | Keyboard | ₹2,999 |
| 12 | Logitech M331 | Mouse | ₹1,599 |
| 13 | HP Z3700 | Mouse | ₹999 |
| 14 | JBL Flip 6 | Speaker | ₹9,999 |
| 15 | OnePlus Watch 2R | Smartwatch | ₹17,999 |
| 16 | Samsung Galaxy Tab A9+ | Tablet | ₹19,999 |
| 17 | HP Pavilion 15 | Laptop | ₹64,999 |
| 18 | Lenovo IdeaPad Slim 5 | Laptop | — |
| 19 | ASUS Vivobook 15 | Laptop | — |
| 20 | TechPro X1 Laptop | Laptop | ₹59,999 |
| 21 | AluLift Laptop Stand | Accessories | ₹2,499 |

> **Note:** The product names above reflect the current demo catalog available during development. Prices are included where they were explicitly available in the current project data used to prepare this README.

### Featured Catalog Details

**HP Pavilion 15**

> Powerful laptop with Intel Core i5 processor, 16GB RAM and 512GB SSD, suitable for software development, productivity and everyday computing.

Tags:
`laptop` `HP` `Intel` `16GB RAM` `512GB SSD` `development`

**TechPro X1 Laptop**

> High-performance laptop suitable for software development and AI workloads.

**AluLift Laptop Stand**

Category:
`Accessories`

---

# 💳 Razorpay Test Mode

This project uses **Razorpay Test Mode**. Test transactions are simulated and do not deduct real money. Razorpay's documentation states that test cards are for Test Mode only. citeturn0search0turn0search11

Official documentation:

https://razorpay.com/docs/payments/payments/test-card-details/

## Important

- Use **Test Mode** only.
- Never put Razorpay Test credentials in the frontend except the public Test Key ID where required.
- Never commit `RAZORPAY_KEY_SECRET`.
- Test card numbers must never be used for real payments.
- Use a future expiry date.
- For the standard test-card flow, Razorpay documents using a random CVV and then selecting the simulated success/failure result. citeturn2search0

---

# 🧪 Razorpay Test Cards

The following are test credentials documented by Razorpay for testing different payment flows. Availability can change, so check the official Razorpay documentation for the latest list.

## Domestic / Indian Payments

| Network | Test Card Number | CVV | Expiry |
|---|---|---|---|
| Mastercard | `5267 3181 8797 5449` | Random CVV | Any future date |
| Visa | `4111 1111 1111 1111` | Random CVV | Any future date |

These are the domestic cards listed in Razorpay's published test-card documentation. citeturn3search0

## International Payments

| Network | Test Card Number | CVV | Expiry |
|---|---|---|---|
| Mastercard | `5555 5555 5555 4444` | Random CVV | Any future date |
| Mastercard | `5105 1051 0510 5100` | Random CVV | Any future date |
| Visa | `4012 8888 8888 1881` | Random CVV | Any future date |
| Visa | `5104 0600 0000 0008` | Random CVV | Any future date |

Razorpay notes that the `5105 1051 0510 5100` international Mastercard may request a US billing address in some flows. citeturn2search0

## Subscription Test Cards

| Type | Network | Card Type | Test Card Number |
|---|---|---|---|
| Domestic | Mastercard | Debit | `5104 0600 0000 0008` |
| Domestic | Visa | Credit | `4718 6091 0820 4366` |
| International | Mastercard | Credit | `5104 0155 5555 5558` |

These are included in Razorpay's published test-card documentation for subscription flows. citeturn3search0

## EMI Test Card

| Network | Test Card Number | CVV | Expiry |
|---|---|---|---|
| Mastercard | `5241 8100 0000 0000` | Random CVV | Any future date |

citeturn3search0

---

# ⚡ Razorpay Test UPI

For domestic UPI testing, Razorpay documents these test IDs:

| UPI ID | Result |
|---|---|
| `success@razorpay` | Successful payment |
| `failure@razorpay` | Failed payment |

citeturn0search12

---

# 🧾 How to Test a Razorpay Card Payment

1. Start the application in Razorpay **Test Mode**.
2. Add products to the cart.
3. Create an order.
4. Confirm payment when the agent asks.
5. Open Razorpay Checkout.
6. Select **Card**.
7. Enter a test card number.
8. Use a future expiry date.
9. Enter a random CVV where applicable.
10. Complete the simulated payment flow.
11. Return to the application.
12. Ask:

```text
What is the status of my payment?
```

The backend should verify the payment and return the correct order status.

Razorpay states that Test Mode uses simulated transactions and does not deduct real money. citeturn0search0

---

# 🔧 Environment Variables

Create the required environment files locally.

## Server `.env`

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=openai/gpt-oss-20b

RAZORPAY_KEY_ID=your_razorpay_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_key_secret
```

## Client `.env`

```env
VITE_RAZORPAY_KEY_ID=your_razorpay_test_key_id
```

### ⚠️ Never commit secrets

Add environment files to `.gitignore`:

```gitignore
.env
.env.*
!.env.example
node_modules/
dist/
```

Never publish:

```text
RAZORPAY_KEY_SECRET
OPENROUTER_API_KEY
MONGO_URI
```

---

# 🚀 How to Run Locally

## 1. Clone the Repository

```bash
git clone https://github.com/Shreya-1416/ai-commerce-agent.git
cd ai-commerce-agent
```

## 2. Install Server Dependencies

```bash
cd server
npm install
```

Create the server `.env` file with your local credentials.

Start the backend:

```bash
npm run dev
```

or:

```bash
npm start
```

The backend runs on:

```text
http://localhost:5000
```

## 3. Install Client Dependencies

Open another terminal:

```bash
cd client
npm install
```

Create the client `.env` file.

Start the frontend:

```bash
npm run dev
```

The frontend normally runs on:

```text
http://localhost:5173
```

---

# 🗄️ Database

MongoDB is used as the source of truth.

The application uses collections/models for:

### Products

Stores:
- Name
- Description
- Category
- Price
- Stock
- Tags
- Upsell products
- Cross-sell products

### Cart

Stores:
- Session ID
- Product
- Quantity
- Price
- Total amount

### Orders

Stores:
- Session ID
- Products
- Quantities
- Prices
- Total amount
- Order status
- Razorpay order ID
- Payment ID

### Audit Logs

Stores:
- Session ID
- Action
- Tool
- Status
- Details
- Timestamp

---

# 📂 Project Structure

```text
ai-commerce-agent/
│
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   └── Checkout.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── agent/
│   │   │   ├── agentTools.js
│   │   │   ├── orderTools.js
│   │   │   ├── paymentTool.js
│   │   │   └── toolDefinitions.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── AgentController.js
│   │   │   ├── CartController.js
│   │   │   ├── OrderController.js
│   │   │   └── ProductController.js
│   │   │
│   │   ├── models/
│   │   │   ├── AuditLog.js
│   │   │   ├── Cart.js
│   │   │   ├── Order.js
│   │   │   └── Product.js
│   │   │
│   │   ├── routes/
│   │   │   ├── agentRoutes.js
│   │   │   ├── cartRoutes.js
│   │   │   ├── orderRoutes.js
│   │   │   └── productRoutes.js
│   │   │
│   │   └── services/
│   │       ├── agentService.js
│   │       ├── auditService.js
│   │       └── razorpayService.js
│   │
│   └── package.json
│
├── .gitignore
└── README.md
```

---

# 🔌 API / Agent Flow

The main agent endpoint receives natural-language messages:

```http
POST /api/agent/chat
Content-Type: application/json
```

Example:

```json
{
  "message": "Find me a laptop under ₹60000",
  "sessionId": "demo-user-002"
}
```

The backend:
1. Sends the request to the LLM.
2. Allows the LLM to select available tools.
3. Executes the selected backend tool.
4. Sends tool results back to the LLM.
5. Continues the tool-calling loop.
6. Returns the final natural-language response.

---

# 🧩 Agentic Design Principles

## 1. Tool Calling

The LLM does not simply generate text.

It can decide to invoke real commerce actions such as:

```text
search_products
get_product
add_to_cart
get_cart
create_order
create_payment
get_order_status
```

This is what makes the application **agentic** rather than a basic recommendation chatbot.

## 2. Backend as Trust Boundary

The LLM cannot be trusted with authoritative business state.

MongoDB and backend services remain responsible for:
- Product data
- Stock
- Cart
- Orders
- Payment state
- Verification

## 3. Explicit Payment Approval

The agent cannot silently start payment.

The customer must explicitly confirm.

## 4. Explainability

The agent explains why a product is recommended based on the customer's stated requirements.

## 5. Auditability

Agent actions can be recorded through audit logs.

---

# 🧪 Suggested Test Cases

## Product Search

```text
Find me a laptop under ₹60000.
```

## Product Details

```text
Show me the details of TechPro X1 Laptop.
```

## Comparison

```text
Compare the laptops you found.
```

## Recommendation

```text
Which one do you recommend for me?
```

## Cross-Selling

```text
What accessories should I get with this?
```

## Add to Cart

```text
Add the recommended laptop to my cart.
```

## View Cart

```text
Show my cart.
```

## Remove Item

```text
Remove the mouse from my cart.
```

## Create Order

```text
Create my order.
```

## Payment Confirmation

```text
Yes, proceed to payment.
```

## Payment Status

```text
What is the status of my payment?
```

## Empty Cart

```text
Create my order.
```

Expected behavior: the agent should explain that the cart is empty instead of creating an invalid order.

---

# ❌ What This MVP Does Not Try to Do

To keep the hackathon implementation focused, this project intentionally avoids unnecessary complexity such as:

- Real-money payment processing
- Amazon/Flipkart integrations
- Vector databases
- RAG pipelines
- Complex ML recommendation models
- Microservice architecture
- Production authentication/authorization
- Production-scale inventory reservation
- Production webhook infrastructure

The goal is to demonstrate the **agentic commerce workflow** clearly and reliably.

---

# 🏆 Hackathon Value Proposition

### Problem

Traditional shopping experiences require users to manually:

```text
Search → Filter → Compare → Decide → Add to Cart → Checkout → Pay
```

### Solution

An AI commerce agent converts this into:

```text
Tell the agent what you need
          ↓
AI understands intent
          ↓
Agent searches catalog
          ↓
Agent compares and recommends
          ↓
Agent manages cart
          ↓
Agent creates order
          ↓
Customer approves payment
          ↓
Secure payment + verification
```

### Why It Is Agentic

The system combines:
- Natural-language reasoning
- Tool calling
- Stateful shopping context
- Real backend actions
- Multi-step task execution
- Human approval before a sensitive action
- Payment verification
- Auditability

---

# 🔒 Security Notes

For development/demo use:

- Use Razorpay **Test Mode** only.
- Keep `RAZORPAY_KEY_SECRET` on the backend.
- Never expose OpenRouter API keys to the browser.
- Never commit `.env` files.
- Never use real customer card information for testing.
- Never treat an LLM-generated statement as authoritative payment status.
- Always verify payment server-side.

---

# 📚 Official Documentation

- **Razorpay Test Cards:** https://razorpay.com/docs/payments/payments/test-card-details/
- **Razorpay Standard Checkout:** https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps/
- **Razorpay Test UPI:** https://razorpay.com/docs/payments/payments/test-upi-details/
- **OpenRouter:** https://openrouter.ai/
- **React:** https://react.dev/
- **Express:** https://expressjs.com/
- **MongoDB:** https://www.mongodb.com/

---

# 👩‍💻 Author

**Shreya Gupta**

GitHub:  
https://github.com/Shreya-1416

Project:  
https://github.com/Shreya-1416/ai-commerce-agent

---

# ⭐ Final Demo Checklist

Before presenting:

- [ ] MongoDB is running
- [ ] Server starts successfully
- [ ] Client starts successfully
- [ ] OpenRouter key works
- [ ] Razorpay is in Test Mode
- [ ] Test Key ID is configured
- [ ] Payment checkout opens
- [ ] Payment verification succeeds
- [ ] Product search works
- [ ] Product comparison works
- [ ] Recommendation works
- [ ] Contextual follow-up works
- [ ] Cart add/remove works
- [ ] Order creation works
- [ ] Payment confirmation is required
- [ ] Payment status can be checked
- [ ] Audit activity is visible
- [ ] `.env` files are not committed

---

## 🚀 The Core Idea

**Don't make the customer operate the store. Let the customer talk to the store.**

> **AI understands → AI acts → Customer approves → Backend verifies.**

That is the core of this AI Commerce Agent.
