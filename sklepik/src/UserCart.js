import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

/**
 * UserCart:
 *  - jeśli przekazano prop userId -> używa go
 *  - jeśli prop userId nie ma -> próbuje pobrać userId z useParams()
 *  - jeśli nadal brak userId -> traktuje koszyk jako pusty (nie wywołuje endpointu)
 *
 * Endpoint:
 *  GET /cart/{userid}
 *  PATCH /cart/{userid}/item/{itemId}
 *  DELETE /cart/{userid}/item/{itemId}
 */

export default function UserCart({ userId: propUserId }) {
  const params = useParams();
  const userId = propUserId ?? params.userId ?? null;

  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(Boolean(userId)); // jeśli brak userId, nie ładujemy
  const [error, setError] = useState(null);
  const [updatingItemId, setUpdatingItemId] = useState(null);

  useEffect(() => {
    if (!userId) {
      // brak userId -> pusty koszyk, nie wywołujemy endpointu
      setCart({ items: [] });
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    async function fetchCart() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/koszyk/${encodeURIComponent(userId)}`, {
          method: "GET",
          headers: { "Accept": "application/json" },
        });
        if (!res.ok) throw new Error(`Błąd serwera: ${res.status}`);
        const data = await res.json();
        if (!cancelled) setCart(data || { items: [] });
      } catch (err) {
        if (!cancelled) setError(err.message || "Nieznany błąd");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchCart();
    return () => { cancelled = true; };
  }, [userId]);

  function calcTotal() {
    return cart.items.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 0), 0);
  }

  async function updateQuantity(itemId, newQty) {
    if (!userId) return; // nie aktualizujemy jeśli brak userId
    if (newQty < 1) return;
    setUpdatingItemId(itemId);
    try {
      const res = await fetch(`/koszyk/${encodeURIComponent(userId)}/item/${encodeURIComponent(itemId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ quantity: newQty }),
      });
      if (!res.ok) throw new Error(`Błąd aktualizacji: ${res.status}`);
      const updated = await res.json();
      setCart(prev => ({
        ...prev,
        items: prev.items.map(it => it.id === itemId ? { ...it, quantity: updated.quantity ?? newQty } : it)
      }));
    } catch (err) {
      setError(err.message || "Błąd podczas aktualizacji ilości");
    } finally {
      setUpdatingItemId(null);
    }
  }

  async function removeItem(itemId) {
  if (!userId) return;
  if (!window.confirm("Usunąć ten przedmiot z koszyka?")) return;
  setUpdatingItemId(itemId);
  try {
    const res = await fetch(`/koszyk/${encodeURIComponent(userId)}/item/${encodeURIComponent(itemId)}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`Błąd usuwania: ${res.status}`);
    setCart(prev => ({ ...prev, items: prev.items.filter(it => it.id !== itemId) }));
  } catch (err) {
    setError(err.message || "Błąd podczas usuwania przedmiotu");
  } finally {
    setUpdatingItemId(null);
  }
}


  function handleQtyChange(itemId, delta) {
    const item = cart.items.find(it => it.id === itemId);
    if (!item) return;
    const newQty = (item.quantity || 0) + delta;
    if (newQty < 1) return;
    updateQuantity(itemId, newQty);
  }

  // UI: jeśli brak userId i brak pozycji -> pokaż pusty koszyk
  if (loading) {
    return <div className="cart-root">Ładowanie koszyka…</div>;
  }

  if (error) {
    return <div className="cart-root error">Wystąpił błąd: {error}</div>;
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="cart-root empty">
        <h2>Twój koszyk</h2>
        <p>Twój koszyk jest pusty.</p>
        <style jsx>{`
          .cart-root { max-width: 900px; margin: 24px auto; padding: 16px; font-family: Arial, sans-serif; }
          .empty p { color: #666; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="cart-root">
      <h2>Twój koszyk</h2>
      <ul className="cart-list">
        {cart.items.map(item => (
          <li key={item.id} className="cart-item">
            <div className="item-left">
              {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="item-image" /> : <div className="item-image placeholder" />}
              <div className="item-meta">
                <div className="item-name">{item.name}</div>
                <div className="item-price">{(item.price ?? 0).toFixed(2)} {cart.currency || "PLN"}</div>
              </div>
            </div>

            <div className="item-controls">
              <div className="qty-controls">
                <button disabled={updatingItemId === item.id} onClick={() => handleQtyChange(item.id, -1)}>-</button>
                <span className="qty">{item.quantity}</span>
                <button disabled={updatingItemId === item.id} onClick={() => handleQtyChange(item.id, +1)}>+</button>
              </div>
              <div className="item-subtotal">
                {( (item.price || 0) * (item.quantity || 0) ).toFixed(2)} {cart.currency || "PLN"}
              </div>
              <button className="remove-btn" disabled={updatingItemId === item.id} onClick={() => removeItem(item.id)}>Usuń</button>
            </div>
          </li>
        ))}
      </ul>

      <div className="cart-summary">
        <div className="summary-row">
          <strong>Razem</strong>
          <strong>{calcTotal().toFixed(2)} {cart.currency || "PLN"}</strong>
        </div>
        <div className="summary-actions">
          <button className="checkout-btn">Przejdź do płatności</button>
        </div>
      </div>

      
    </div>
  );
}
