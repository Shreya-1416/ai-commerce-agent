import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function Checkout() {
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const razorpayOrderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  useEffect(() => {
    if (!razorpayOrderId) {
      setError("No Razorpay order ID provided.");
      setLoading(false);
      return;
    }

    const openRazorpay = () => {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: Number(amount) * 100,

        currency: "INR",

        name: "AI Commerce Agent",

        description: "AI-powered commerce purchase",

        order_id: razorpayOrderId,

        handler: async function (response) {
  try {
    console.log("Razorpay response:", response);

    const verifyResponse = await fetch(
      "http://localhost:5000/api/orders/payment/verify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        }),
      }
    );

    const data = await verifyResponse.json();

    console.log("Verification response:", data);

    if (!data.success) {
      setError(data.message || "Payment verification failed.");
      return;
    }

    alert("Payment verified successfully! 🎉");

  } catch (error) {
    console.error(error);
    setError("Could not verify payment.");
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

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        console.error("Payment failed:", response);

        setError(
          response.error?.description || "Payment failed."
        );

        setLoading(false);
      });

      razorpay.open();

      setLoading(false);
    };

    if (window.Razorpay) {
      openRazorpay();
    } else {
      setError("Razorpay SDK not loaded.");
      setLoading(false);
    }
  }, [razorpayOrderId, amount]);

  if (loading) {
    return <h2>Opening secure checkout...</h2>;
  }

  if (error) {
    return (
      <div>
        <h2>Checkout Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>AI Commerce Checkout</h1>

      <p>
        Order: <strong>{razorpayOrderId}</strong>
      </p>

      <p>
        Amount: <strong>₹{Number(amount).toLocaleString("en-IN")}</strong>
      </p>
    </div>
  );
}

export default Checkout;