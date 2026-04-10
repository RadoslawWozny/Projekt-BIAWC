import React, { useState, useMemo, useEffect } from "react";
import "./Home.css"
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";





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
  { id: "p6", name: "Lorem Blend2", type: "Kawa", price: 59.0, description: "Magna aliqua lorem ipsum.", image: "https://via.placeholder.com/320x240?text=Blend" },
];


export default function NewArrivals( {productId: propProductId} ) {

const params = useParams();
  const productId = propProductId ?? params.productId ?? null;

  // stany
  const [loading, setLoading] = useState(Boolean(productId));
  const [error, setError] = useState(null);
  const [product, setProduct] = useState({ items: [] });

  useEffect(() => {
    // jeśli brak productId to ustaw pusty stan i zakończ
    if (!productId) {
      setProduct({ items: [] });
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    async function fetchItem() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/products/${encodeURIComponent(productId)}`, {
          method: "GET",
          headers: { "Accept": "application/json" },
          signal: controller.signal
        });
        if (!res.ok) throw new Error(`Błąd serwera: ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          // zapisujemy wynik do stanu, który jest renderowany poza fetch
          setProduct(data ?? { items: [] });
        }
      } catch (err) {
        if (!cancelled) {
          if (err.name === "AbortError") {
            // fetch anulowany, nic nie robimy
          } else {
            setError(err.message || "Nieznany błąd");
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchItem();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [productId]);

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

//   const HomeContext = React.createContext({
//   homeItem: null,
//   setHomeItem: () => {}
// });


// function ProductFetcher({ productId, onUpdateHome }) {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let cancelled = false;
//     async function fetchItem() {
//       setLoading(true);
//       setError(null);
//       try {
//         const res = await fetch(`/home/${encodeURIComponent(productId)}`, {
//           method: "GET",
//           headers: { "Accept": "application/json" },
//         });
//         if (!res.ok) throw new Error(`Błąd serwera: ${res.status}`);
//         const data = await res.json();
//         if (!cancelled) {
//           // zamiast setCart ustawiamy wynik w onUpdateHome
//           onUpdateHome?.(data);
//         }
//       } catch (err) {
//         if (!cancelled) setError(err.message || "Nieznany błąd");
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     }

//     if (productId) fetchItem();
//     return () => { cancelled = true; };
//   }, [productId, onUpdateHome]);

//   if (loading) return <div>Ładowanie…</div>;
//   if (error) return <div className="error">Błąd: {error}</div>;
//   return null;
// }

// const params = useParams();
//   const productId = propProductId ?? params.productId ?? null;


// async function fetchItem() {
//   setLoading(true);
//   setError(null);
//   try {
//     const res = await fetch(`/home/${encodeURIComponent(productId)}`, {
//       method: "GET",
//       headers: { "Accept": "application/json" },
//     });
//     if (!res.ok) throw new Error(`Błąd serwera: ${res.status}`);
//     const data = await res.json();
//     if (!cancelled) {
//       // zamiast setCart ustawiamy wynik w callbacku, kontekście lub dispatchujemy event
//       if (typeof onUpdateHome === "function") {
//         onUpdateHome(data);
//       } else {
//         // // alternatywnie: dispatch event
//         // window.dispatchEvent(new CustomEvent("home:update", { detail: data }));
//       }
//     }
//   } catch (err) {
//     if (!cancelled) setError(err.message || "Nieznany błąd");
//   } finally {
//     if (!cancelled) setLoading(false);
//   }
// }


  

  // renderowanie listy poza funkcją fetch
 


  return (
    <div className="calosc">
    <div className="tlo">
      <div className="content">
    <main className="na-root">

      <header className="na-header">
        <h1 className="na-title">Lorem ipsum dolor sit amet</h1>
        <p className="na-subtitle">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit.</p>



      <div className="bestsellery">

        <ul className="na-grid" role="list">
            {filtered.slice(0,3).map(product => (
                <Link to={`/products/${encodeURIComponent(productId)}`}>
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
              </Link>
            ))}
            </ul>




        
      </div>
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
            <>
          <ul className="na-grid" role="list">
            {filtered.map(product => (
                <Link to={`/products/${encodeURIComponent(productId)}`}>
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
              </Link>
            ))}

            <li>
<section className="na-grid">
      <h2>Produkty fetchowane z backendu</h2>

      {loading && <div>Ładowanie…</div>}
      {error && <div className="error">Błąd: {error}</div>}

      {!loading && !error && (!product.items || product.items.length === 0) && (
        <div>Brak produktów do wyświetlenia. zrobcie pls backend</div>
      )}

      {!loading && product.items && product.items.length > 0 && (
        <ul className="product-list">
          {product.items.map((it) => (
            <li key={it.id} className="product-item">
              <h3>{it.name}</h3>
              <p>{it.description}</p>
              <div className="price">{(it.price ?? 0).toFixed(2)} PLN</div>
            </li>
          ))}
        </ul>
      )}
    </section>

            </li>
          </ul>
     </>
        )}
      </section>

    </main>
    </div>
    </div>
    </div>
  );
}