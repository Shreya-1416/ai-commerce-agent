import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Checkout from "./pages/Checkout";

function Home() {
  return (
    <div>
      <h1>AI Commerce Agent</h1>

      <p>AI-powered shopping and growth platform</p>

      <Link to="/checkout">
        <button>Go to Checkout</button>
      </Link>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/checkout"
          element={<Checkout />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;