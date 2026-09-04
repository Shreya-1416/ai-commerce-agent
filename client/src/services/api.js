import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Checkout from "./pages/Checkout";
import { useState } from "react";

const API_URL = "http://localhost:5000";

function Home() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setReply("");

    try {
      const response = await fetch(`${API_URL}/api/agent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          sessionId: "demo-user-002",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setReply(data.reply || data.message || JSON.stringify(data));
    } catch (error) {
      setReply(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          background: "#111827",
          color: "white",
          padding: "20px 50px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>🤖 AI Commerce Agent</h2>
          <small>AI-powered shopping assistant</small>
        </div>

        <Link to="/checkout" style={{ textDecoration: "none" }}>
          <button
            style={{
              padding: "10px 18px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Checkout
          </button>
        </Link>
      </header>

      {/* Main */}
      <main
        style={{
          maxWidth: "900px",
          margin: "50px auto",
          padding: "0 20px",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "16px",
            boxShadow: "0 5px 25px rgba(0,0,0,0.08)",
          }}
        >
          <h1 style={{ marginTop: 0 }}>
            What are you looking for?
          </h1>

          <p style={{ color: "#6b7280" }}>
            Tell the AI shopping agent what you need. It can search products,
            manage your cart, create an order, and prepare payment.
          </p>

          {/* Example prompts */}
          <div style={{ margin: "25px 0" }}>
            <strong>Try:</strong>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginTop: "12px",
              }}
            >
              {[
                "Find me a laptop under ₹60000",
                "Add the TechPro X1 Laptop to my cart",
                "Create my order",
              ].map((text) => (
                <button
                  key={text}
                  onClick={() => setMessage(text)}
                  style={{
                    padding: "10px 14px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    background: "white",
                    cursor: "pointer",
                  }}
                >
                  {text}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Example: Find me a laptop under ₹60000..."
            rows={4}
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              fontSize: "16px",
              resize: "vertical",
              boxSizing: "border-box",
            }}
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            style={{
              marginTop: "15px",
              padding: "13px 25px",
              borderRadius: "9px",
              border: "none",
              background: "#111827",
              color: "white",
              fontSize: "16px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "AI is thinking..." : "Ask AI Agent →"}
          </button>

          {/* AI Response */}
          {reply && (
            <div
              style={{
                marginTop: "30px",
                padding: "20px",
                background: "#f3f4f6",
                borderRadius: "12px",
                whiteSpace: "pre-wrap",
              }}
            >
              <strong>🤖 AI Agent</strong>

              <p style={{ lineHeight: "1.6" }}>{reply}</p>
            </div>
          )}

          {/* Agent Activity */}
          <div
            style={{
              marginTop: "35px",
              borderTop: "1px solid #e5e7eb",
              paddingTop: "25px",
            }}
          >
            <h3>Agent capabilities</h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "12px",
              }}
            >
              <div>🔍 Product Search</div>
              <div>🛒 Cart Management</div>
              <div>📦 Order Creation</div>
              <div>💳 Razorpay Payment</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;