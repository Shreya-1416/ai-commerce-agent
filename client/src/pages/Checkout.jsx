import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function Checkout() {
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const orderId = searchParams.get("orderId");
  const razorpayOrderId = searchParams.get("razorpayOrderId");
  const amount = searchParams.get("amount");

  useEffect(() => {
    let razorpay;

    const openRazorpay = () => {
      if (!orderId || !razorpayOrderId || !amount) {
        setError("Missing payment information.");
        setLoading(false);
        return;
      }

      if (!window.Razorpay) {
        setError(
          "Razorpay SDK not loaded. Please refresh the page and try again."
        );
        setLoading(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: Math.round(Number(amount) * 100),

        currency: "INR",

        name: "AI Commerce Agent",

        description: "AI-powered commerce purchase",

        order_id: razorpayOrderId,

        handler: async function (response) {
          try {
            setLoading(true);

            console.log("Razorpay response:", response);

            const verifyResponse = await fetch(
              `${import.meta.env.VITE_API_URL}/api/orders/payment/verify`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  orderId,

                  razorpay_order_id:
                    response.razorpay_order_id,

                  razorpay_payment_id:
                    response.razorpay_payment_id,

                  razorpay_signature:
                    response.razorpay_signature,
                }),
              }
            );

            const data = await verifyResponse.json();

            console.log("Verification response:", data);

            if (!verifyResponse.ok || !data.success) {
              setError(
                data.message || "Payment verification failed."
              );
              setLoading(false);
              return;
            }

            setPaymentSuccess(true);
            setLoading(false);

            alert("Payment verified successfully! 🎉");
          } catch (error) {
            console.error("Verification error:", error);

            setError("Could not verify payment.");
            setLoading(false);
          }
        },

        theme: {
          color: "#111827",
        },

        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        console.error("Payment failed:", response);

        setError(
          response.error?.description || "Payment failed."
        );

        setLoading(false);
      });

      razorpay.open();
    };

    // Give the Razorpay script a moment to initialize
    if (window.Razorpay) {
      openRazorpay();
    } else {
      const timer = setTimeout(() => {
        if (window.Razorpay) {
          openRazorpay();
        } else {
          setError("Razorpay SDK could not be loaded.");
          setLoading(false);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }

    return () => {
      razorpay = null;
    };
  }, [orderId, razorpayOrderId, amount]);

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Opening secure checkout...</h2>
        <p>Please wait.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Checkout Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>Payment Successful 🎉</h1>

        <p>
          Your payment has been verified successfully.
        </p>

        <p>
          Order ID: <strong>{orderId}</strong>
        </p>

        <p>
          Amount:{" "}
          <strong>
            ₹{Number(amount).toLocaleString("en-IN")}
          </strong>
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>AI Commerce Checkout</h1>

      <p>
        Order: <strong>{orderId}</strong>
      </p>

      <p>
        Amount:{" "}
        <strong>
          ₹{Number(amount).toLocaleString("en-IN")}
        </strong>
      </p>
    </div>
  );
}

export default Checkout;