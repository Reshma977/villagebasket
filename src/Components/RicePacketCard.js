import React, { useState, useEffect } from "react";

function RicePacketCard({ packet, onAddToCart, onRemoveFromCart, cart, clearCartSignal }) {
  const [selectedPack, setSelectedPack] = useState(packet.packSizes?.[0]);

  useEffect(() => {
    if (clearCartSignal) {
      setSelectedPack(packet.packSizes?.[0]);
    }
  }, [clearCartSignal, packet.packSizes]);

  const handlePackChange = (e) => {
    const selected = packet.packSizes.find((p) => p.size === e.target.value);
    setSelectedPack(selected);
  };

  const cartItem = cart.find(
    (item) => item.id === packet.id && item.selectedSize === selectedPack?.size
  );

  return (
    <div className="rice-card">
      <img src={packet.image} alt={packet.name} className="rice-image" />
      <h3 className="rice-name">{packet.name}</h3>

      <select
        value={selectedPack?.size}
        onChange={handlePackChange}
        className="pack-select"
      >
        {packet.packSizes.map((pack, idx) => (
          <option key={idx} value={pack.size}>
            {pack.size}
          </option>
        ))}
      </select>

      <p className="price">₹{selectedPack?.price}</p>

      {!cartItem ? (
        <button
          className="add-btn"
          onClick={() =>
            onAddToCart({
              ...packet,
              selectedSize: selectedPack.size,
              selectedPrice: selectedPack.price,
            })
          }
        >
          ADD
        </button>
      ) : (
        <div className="quantity-btns">
          <button
            className="qty-btn"
            onClick={() =>
              onRemoveFromCart({
                ...packet,
                selectedSize: selectedPack.size,
                selectedPrice: selectedPack.price,
              })
            }
          >
            −
          </button>
          <span className="qty-count">{cartItem.quantity}</span>
          <button
            className="qty-btn"
            onClick={() =>
              onAddToCart({
                ...packet,
                selectedSize: selectedPack.size,
                selectedPrice: selectedPack.price,
              })
            }
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}

export default RicePacketCard;
