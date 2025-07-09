import React, { useState, useEffect } from "react";
import RicePacketCard from "./Components/RicePacketCard";
import "./App.css";

function App() {
  const [cart, setCart] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [toast, setToast] = useState("");
  const [clearCartSignal, setClearCartSignal] = useState(false);

  useEffect(() => {
    fetch("/products.json")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 3000);
  };

  const handleAddToCart = (packet) => {
    const exists = cart.find(
      (item) => item.id === packet.id && item.selectedSize === packet.selectedSize
    );

    if (exists) {
      setCart(
        cart.map((item) =>
          item.id === packet.id && item.selectedSize === packet.selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...packet, quantity: 1 }]);
    }

    showToast("Added to cart");
  };

  const handleRemoveFromCart = (packet) => {
    const updatedCart = cart
      .map((item) =>
        item.id === packet.id && item.selectedSize === packet.selectedSize
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);
    setCart(updatedCart);
    showToast("Removed from cart");
  };

  const handleClearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
    setClearCartSignal(true);
    setTimeout(() => setClearCartSignal(false), 100);
    showToast("Cart cleared");
  };

  const handlePayment = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const options = {
        key: "YOUR_RAZORPAY_KEY",
        amount: totalPrice * 100,
        currency: "INR",
        name: "Village Basket",
        description: "Order Payment",
        handler: function (response) {
          alert("Payment Successful! Transaction ID: " + response.razorpay_payment_id);
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    };
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.selectedPrice * item.quantity, 0);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>
          <span className="green">VILLAGE</span>{" "}
          <span className="yellow">BASKET</span> -{" "}
          <span className="black">Rice Packets</span>
        </h1>
        <button className="cart-toggle-btn" onClick={toggleDrawer}>
          🛒 Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
        </button>
      </header>

      <div className="card-container">
        {products.map((packet) => (
          <RicePacketCard
            key={`${packet.id}-${packet.name}`}
            packet={packet}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            cart={cart}
            clearCartSignal={clearCartSignal}
          />
        ))}
      </div>

      <div className={`cart-drawer ${drawerOpen ? "open" : ""}`}>
        <div className="cart-drawer-header">
          <h2>Shopping Cart</h2>
          <button className="close-drawer-btn" onClick={closeDrawer}>❌</button>
        </div>

        {cart.length === 0 ? (
          <p className="empty-cart">Your cart is empty.</p>
        ) : (
          <>
            <ul className="cart-items">
              {cart.map((item, idx) => (
                <li key={idx}>
                  <img src={item.image} alt={item.name} />
                  <div>
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-size">Size: {item.selectedSize}</div>
                    <div className="cart-item-qty">Qty: {item.quantity}</div>
                    <div>₹{item.selectedPrice * item.quantity}</div>
                  </div>
                </li>
              ))}
            </ul>
            <h3 className="total">Total: ₹{totalPrice}</h3>
            <button className="clear-cart-btn" onClick={handleClearCart}>Clear Cart</button>
            <button className="payment-btn" onClick={handlePayment}>Proceed to Payment 💳</button>
          </>
        )}
      </div>

      {drawerOpen && <div className="overlay" onClick={closeDrawer}></div>}
      {toast && <div className="toast">{toast}</div>}

      <div className="mini-cart" onClick={toggleDrawer}>
        🛒
        <span className="mini-cart-count">
          {cart.reduce((sum, item) => sum + item.quantity, 0)}
        </span>
      </div>
    </div>
  );
}

export default App;
