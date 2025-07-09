// src/Components/CartDrawer.js
import React from "react";
// import "./CartDrawer.css";

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  increaseQuantity,
  decreaseQuantity,
  removeItem,
  clearCart,
}) {
  // Calculate total price
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.selectedPrice * item.quantity,
    0
  );

  return (
    <>
      <div className={`cart-drawer ${isOpen ? "open" : ""}`}>
        <h2>Shopping Cart</h2>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <ul className="cart-items">
              {cart.map((item, idx) => (
                <li key={idx} className="cart-item">
                  <div>
                    {item.name} ({item.selectedSize}) - ₹{item.selectedPrice} x{" "}
                    {item.quantity} = ₹{item.selectedPrice * item.quantity}
                  </div>
                  <div className="cart-item-controls">
                    <button onClick={() => decreaseQuantity(idx)}>-</button>
                    <button onClick={() => increaseQuantity(idx)}>+</button>
                    <button
                      className="remove-btn"
                      onClick={() => removeItem(idx)}
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <h3>Total: ₹{totalPrice}</h3>
            <button className="clear-cart-btn" onClick={clearCart}>
              Clear Cart
            </button>
          </>
        )}
      </div>
      {isOpen && <div className="overlay" onClick={onClose}></div>}
    </>
  );
}
