import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./NavMenu.css";

const categories = [
  { id: "new", label: "Nowości", path: "/nowosci" },
  {
    id: "kawy",
    label: "Kawy",
    path: "/kawy",
    children: [
      { id: "kawa1", label: "kawa1", path: "/kawy/kawa1" },
      { id: "kawa2", label: "kawa2", path: "/kawy/kawa2" },
      { id: "kawa3", label: "kawa3", path: "/kawy/kawa3" }
    ]
  },
  {
    id: "herbaty",
    label: "Herbaty",
    path: "/herbaty",
    children: [
      { id: "herbata1", label: "herbata1", path: "/herbaty/herbata1" },
      { id: "herbata2", label: "herbata2", path: "/herbaty/herbata2" }
    ]
  },
];

function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return;
      handler(e);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

export default function NavMenu() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const navRef = useRef(null);

  useOnClickOutside(navRef, () => {
    setOpenSubmenu(null);
    setMobileOpen(false);
  });

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpenSubmenu(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <nav className="nav" ref={navRef} aria-label="Główne menu sklepu">
      <div className="nav__container">
        <button
          className="nav__burger"
          aria-expanded={mobileOpen}
          aria-controls="nav-menu"
          onClick={() => setMobileOpen((s) => !s)}
        >
          <span className="sr-only">Otwórz menu</span>
          <svg width="24" height="24" aria-hidden="true">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>


        <Link to="/" className="nav__brand">MojeSklep</Link>


<div id ="abcd"></div>
        <div className={`nav__menu ${mobileOpen ? "open" : ""}`} id="nav-menu">
          <ul className="nav__list" role="menubar" aria-label="Kategorie">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className={`nav__item ${cat.children ? "has-children" : ""}`}
                role="none"
                onMouseEnter={() => setOpenSubmenu(cat.id)}
                onMouseLeave={() => setOpenSubmenu((s) => (s === cat.id ? null : s))}
              >
                {cat.children ? (
                  <>
                    <button
                      className="nav__link"
                      aria-haspopup="true"
                      aria-expanded={openSubmenu === cat.id}
                      onClick={() => setOpenSubmenu((s) => (s === cat.id ? null : cat.id))}
                    >
                      {cat.label}
                      <svg className="chev" width="12" height="12" aria-hidden="true">
                        <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
                      </svg>
                    </button>

                    <ul
                      className={`submenu ${openSubmenu === cat.id ? "open" : ""}`}
                      role="menu"
                      aria-label={`${cat.label} podkategorie`}
                    >
                      {cat.children.map((sub) => (
                        <li key={sub.id} role="none">
                          <Link to={sub.path} className="submenu__link" role="menuitem" onClick={() => setMobileOpen(false)}>
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link to={cat.path} className="nav__link" role="menuitem" onClick={() => setMobileOpen(false)}>
                    {cat.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <div className="nav__actions">
            <form className="nav__search" role="search" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="site-search" className="sr-only">Szukaj produktów</label>
              <input id="site-search" className="nav__search-input" type="search" placeholder="Szukaj..." />
              <button className="nav__search-btn" aria-label="Szukaj">
                🔍
              </button>
            </form>

            <Link to="/login" className="nav__icon" aria-label="Konto użytkownika">
              <svg width="20" height="20" aria-hidden="true"><circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M3 18c1.5-4 12-4 14 0" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>
            </Link>

            <Link to="/koszyk" className="nav__icon nav__cart" aria-label="Koszyk">
              <svg width="20" height="20" aria-hidden="true"><path d="M3 3h2l1 11h10l1-6H7" stroke="currentColor" strokeWidth="1.5" fill="none"/><circle cx="10" cy="17" r="1" fill="currentColor"/></svg>
              <span className="nav__cart-count" aria-hidden="true">0</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
