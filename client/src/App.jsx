import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Checkout from "./pages/Checkout";
import "./App.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

  const SESSION_ID = "demo-user-002";


// ======================================================
// HUMAN-READABLE TOOL LABELS
// ======================================================

const activityLabels = {
  search_products: "Searching products",
  get_product: "Getting product details",
  add_to_cart: "Adding product to cart",
  get_cart: "Checking cart",
  remove_from_cart: "Removing from cart",
  create_order: "Creating your order",
  get_pending_order: "Checking pending order",
  create_payment: "Preparing payment",
  get_order_status: "Checking order/payment status",
};


// ======================================================
// ACTIVITY ICONS
// ======================================================

const activityIcons = {
  search_products: "🔎",
  get_product: "📦",
  add_to_cart: "🛒",
  get_cart: "🛒",
  remove_from_cart: "🗑️",
  create_order: "🧾",
  get_pending_order: "🔄",
  create_payment: "💳",
  get_order_status: "🔍",
};


// ======================================================
// APP
// ======================================================

function Dashboard() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  // ====================================================
  // SEND MESSAGE
  // ====================================================

  const sendMessage = async () => {
    const userMessage = message.trim();

    if (!userMessage || loading) {
      return;
    }

    setLoading(true);
    setError("");
    setReply("");
    setActivities([]);

    try {
      const response = await fetch(
        `${API_URL}/api/agent/chat`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            message: userMessage,
            sessionId: SESSION_ID,
          }),
        }
      );


      const data = await response.json();


      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Something went wrong."
        );
      }


      // ================================================
      // AGENT RESPONSE
      // ================================================

      setReply(data.reply || "");


      // ================================================
      // REAL AGENT ACTIVITY
      // ================================================

      if (data.activity) {
        setActivities(
          data.activity.map((item, index) => ({
            id: `${item.tool}-${index}-${Date.now()}`,
            tool: item.tool,
            status: item.status,
          }))
        );
      }

    } catch (err) {
      console.error("Agent request failed:", err);

      setError(
        err.message || "Unable to connect to the AI agent."
      );

    } finally {
      setLoading(false);
    }
  };


  // ====================================================
  // HANDLE ENTER
  // ====================================================

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };


  // ====================================================
  // EXAMPLE PROMPT
  // ====================================================

  const useExample = (text) => {
    setMessage(text);
  };


  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="app">


      {/* =================================================
          HEADER
      ================================================= */}

      <header className="header">

        <div className="brand">

          <div className="brand-icon">
            ✦
          </div>

          <div>
            <h1>AI Commerce Agent</h1>

            <p>
              Your intelligent shopping assistant
            </p>
          </div>

        </div>


        <div className="status">

          <span className="status-dot"></span>

          AI Agent Online

        </div>

      </header>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="main">


        {/* =================================================
            LEFT / MAIN CONTENT
        ================================================= */}

        <section className="content">


          {/* =================================================
              HERO
          ================================================= */}

          <div className="hero">

            <div className="hero-badge">
              AI-POWERED COMMERCE
            </div>

            <h2>
              Shop smarter with an
              <span> AI agent.</span>
            </h2>

            <p>
              Tell me what you're looking for.
              I'll search the catalog, compare products,
              manage your cart, create your order,
              and prepare secure payment.
            </p>

          </div>


          {/* =================================================
              EXAMPLE PROMPTS
          ================================================= */}

          <div className="examples">

            <button
              onClick={() =>
                useExample(
                  "Find me a laptop under ₹60000"
                )
              }
            >
              💻 Find a laptop under ₹60,000
            </button>

            <button
              onClick={() =>
                useExample(
                  "Show me the details of TechPro X1 Laptop"
                )
              }
            >
              📦 Show TechPro X1 details
            </button>

            <button
              onClick={() =>
                useExample(
                  "Add TechPro X1 Laptop to my cart"
                )
              }
            >
              🛒 Add TechPro X1 to cart
            </button>

            <button
              onClick={() =>
                useExample(
                  "What is the status of my payment?"
                )
              }
            >
              💳 Check payment status
            </button>

          </div>


          {/* =================================================
              CHAT INPUT
          ================================================= */}

          <div className="chat-box">

            <textarea
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about shopping..."
              rows={4}
              disabled={loading}
            />


            <div className="chat-footer">

              <span>
                Press Enter to send • Shift + Enter for new line
              </span>


              <button
                onClick={sendMessage}
                disabled={
                  loading || !message.trim()
                }
              >
                {loading
                  ? "Thinking..."
                  : "Ask Agent →"}
              </button>

            </div>

          </div>


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (

            <div className="error-box">

              ⚠️

              <span>
                {error}
              </span>

            </div>

          )}


          {/* =================================================
              RESPONSE
          ================================================= */}

          {reply && (

            <div className="response-card">

              <div className="response-header">

                <div className="response-title">

                  <span className="response-icon">
                    ✦
                  </span>

                  <span>
                    AI Agent Response
                  </span>

                </div>

              </div>


              <div className="response-content">

                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                >
                  {reply}
                </ReactMarkdown>

              </div>

            </div>

          )}

        </section>


        {/* =================================================
            SIDEBAR
        ================================================= */}

        <aside className="sidebar">


          {/* =================================================
              AGENT ACTIVITY
          ================================================= */}

          <div className="sidebar-card">

            <div className="sidebar-title">

              <span>
                ⚡
              </span>

              <span>
                Agent Activity
              </span>

            </div>


            {activities.length === 0 ? (

              <div className="empty-activity">

                <div className="empty-icon">
                  ◌
                </div>

                <p>
                  Agent activity will appear here
                </p>

              </div>

            ) : (

              <div className="activity-list">

                {activities.map((activity) => (

                  <div
                    className="activity-item"
                    key={activity.id}
                  >

                    <div className="activity-icon">

                      {activityIcons[activity.tool] || "⚙️"}

                    </div>


                    <div className="activity-info">

                      <div className="activity-name">

                        {activityLabels[activity.tool] ||
                          activity.tool}

                      </div>


                      <div
                        className={`activity-status ${activity.status}`}
                      >

                        {activity.status === "completed"
                          ? "Completed"
                          : activity.status === "failed"
                          ? "Failed"
                          : "Working..."}

                      </div>

                    </div>


                    <div className="activity-check">

                      {activity.status === "completed"
                        ? "✓"
                        : activity.status === "failed"
                        ? "!"
                        : "…"}

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>


          {/* =================================================
              CAPABILITIES
          ================================================= */}

          <div className="sidebar-card">

            <div className="sidebar-title">

              <span>
                ✨
              </span>

              <span>
                Capabilities
              </span>

            </div>


            <div className="capability-list">

              <div>
                <span>🔎</span>
                <p>Product discovery</p>
              </div>

              <div>
                <span>📋</span>
                <p>Product information</p>
              </div>

              <div>
                <span>🛒</span>
                <p>Cart management</p>
              </div>

              <div>
                <span>🧾</span>
                <p>Order creation</p>
              </div>

              <div>
                <span>💳</span>
                <p>Secure payment</p>
              </div>

              <div>
                <span>🔐</span>
                <p>Payment verification</p>
              </div>

            </div>

          </div>


          {/* =================================================
              TRUST NOTE
          ================================================= */}

          <div className="trust-card">

            <div className="trust-icon">
              🔐
            </div>

            <div>

              <strong>
                Secure by design
              </strong>

              <p>
                Payment secrets stay on the server.
                You approve payment before checkout.
              </p>

            </div>

          </div>


        </aside>

      </main>

    </div>
  );
}


function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/checkout" element={<Checkout />} />
    </Routes>
  );
}

export default App;