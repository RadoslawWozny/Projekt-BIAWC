import React, { useState, useMemo } from "react";
import "./Home.css"



/**
 * NewArrivals.jsx
 * - statyczna przykładowa lista nowości
 * - obsługa filtrowania po typie (Kawa / Herbata / Wszystkie)
 * - sortowanie po cenie i nazwie
 * - responsywna siatka produktów
 *
 * Użycie:
 * import NewArrivals from "./NewArrivals";
 * <Route path="/nowosci" element={<NewArrivals />} />
 */

const SAMPLE_PRODUCTS = [
  { id: "p1", name: "Lorem Coffee 1", type: "Kawa", price: 39.99, description: "Lorem ipsum dolor sit amet.", image: "https://via.placeholder.com/320x240?text=Kawa+1" },
  { id: "p2", name: "Lorem Tea 1", type: "Herbata", price: 24.5, description: "Consectetur adipiscing elit.", image: "https://via.placeholder.com/320x240?text=Herbata+1" },
  { id: "p3", name: "Lorem Coffee 2", type: "Kawa", price: 49.0, description: "Sed do eiusmod tempor.", image: "https://via.placeholder.com/320x240?text=Kawa+2" },
  { id: "p4", name: "Lorem Tea 2", type: "Herbata", price: 29.0, description: "Incididunt ut labore et dolore.", image: "https://via.placeholder.com/320x240?text=Herbata+2" },
  { id: "p5", name: "Lorem Blend", type: "Kawa", price: 59.0, description: "Magna aliqua lorem ipsum.", image: "https://via.placeholder.com/320x240?text=Blend" },
  { id: "p5", name: "Lorem Blend", type: "Kawa", price: 59.0, description: "Magna aliqua lorem ipsum.", image: "https://via.placeholder.com/320x240?text=Blend" },
];

export default function NewArrivals() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Wszystkie");
  const [sort, setSort] = useState("popularne");

  const filtered = useMemo(() => {
    let list = SAMPLE_PRODUCTS.slice();

    if (filter !== "Wszystkie") {
      list = list.filter(p => p.type === filter);
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    if (sort === "cena-rosn") list.sort((a, b) => a.price - b.price);
    if (sort === "cena-malej") list.sort((a, b) => b.price - a.price);
    if (sort === "nazwa") list.sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [query, filter, sort]);

  return (
    <main className="na-root">
      <header className="na-header">
        <h1 className="na-title">Lorem ipsum dolor sit amet</h1>
        <p className="na-subtitle">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit.</p>

        <div className="na-controls">
          <label className="na-search">
            <span className="visually-hidden">Szukaj</span>
            <input
              type="search"
              placeholder="Szukaj produktów lorem..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Szukaj produktów"
            />
          </label>

          <div className="na-filters">
            <select value={filter} onChange={e => setFilter(e.target.value)} aria-label="Filtruj typ">
              <option>Wszystkie</option>
              <option>Kawa</option>
              <option>Herbata</option>
            </select>

            <select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sortuj">
              <option value="popularne">Najpopularniejsze</option>
              <option value="cena-rosn">Cena rosnąco</option>
              <option value="cena-malej">Cena malejąco</option>
              <option value="nazwa">Nazwa</option>
            </select>
          </div>
        </div>
      </header>

      <section className="na-grid-section" aria-live="polite">
        {filtered.length === 0 ? (
          <div className="na-empty">
            <h2>Lorem ipsum</h2>
            <p>Nie znaleziono produktów pasujących do kryteriów. Lorem ipsum dolor sit amet.</p>
          </div>
        ) : (
          <ul className="na-grid" role="list">
            {filtered.map(product => (
              <li key={product.id} className="na-card" role="listitem">
                <img src={product.image} alt={product.name} className="na-image" />
                <div className="na-card-body">
                  <div className="na-card-top">
                    <h3 className="na-product-name">{product.name}</h3>
                    <div className="na-price">{product.price.toFixed(2)} PLN</div>
                  </div>
                  <p className="na-desc">{product.description}</p>
                  <div className="na-actions">
                    <button className="btn btn-primary">Lorem ipsum</button>
                    <button className="btn btn-outline">Dolor sit</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

    </main>
  );
}
