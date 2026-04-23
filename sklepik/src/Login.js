import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

/**
 * Prosty helper rozpoznający czy pole to email
 */
const isEmail = (value) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

/**
 * Mock funkcja logowania - zastąp wywołaniem API
 */
const fakeLogin = ({ identifier, password }) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!identifier || !password) {
        reject({ message: "Uzupełnij wszystkie pola." });
      } else if (password.length < 6) {
        reject({ message: "Hasło musi mieć co najmniej 6 znaków." });
      } else {
        resolve({ ok: true, user: { id: 1, name: "Jan Kowalski", identifier } });
      }
    }, 700);
  });

export default function Login() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    if (!identifier.trim()) return "Podaj login lub email.";
    if (!password) return "Podaj hasło.";
    if (password.length < 6) return "Hasło musi mieć co najmniej 6 znaków.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setLoading(true);
    try {
      const payload = { identifier: identifier.trim(), password };
      // Tutaj wywołaj swoje API zamiast fakeLogin
      const res = await fakeLogin(payload);
      // Przykładowe zachowanie po sukcesie
      if (res.ok) {
        // zapisz token / user do localStorage lub context
        if (remember) localStorage.setItem("authUser", JSON.stringify(res.user));
        navigate("/"); // przekieruj po zalogowaniu
      }
    } catch (err) {
      setError(err?.message || "Błąd logowania. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page" aria-labelledby="login-heading">
      <section className="login-card" role="region" aria-label="Formularz logowania">
        <h1 id="login-heading" className="login-title">Zaloguj się</h1>

        <form className="login-form" method="POST" action="/login" noValidate>
          <label htmlFor="identifier" className="label">
            Login lub email
            <input
              id="identifier"
              name="identifier"
              type="text"
              inputMode="email"
              autoComplete="username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="input"
              placeholder="np. jan.kowalski lub jan@example.com"
              aria-invalid={!!error && !identifier}
              aria-describedby="identifier-help"
            />
          </label>
          <div id="identifier-help" className="field-hint">
            Możesz użyć loginu lub adresu e‑mail.
          </div>

          <label htmlFor="password" className="label">
            Hasło
            <div className="password-row">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete={isEmail(identifier) ? "current-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Twoje hasło"
                aria-invalid={!!error && !password}
              />
              <button
                type="button"
                className="toggle-btn"
                onClick={() => setShowPassword((s) => !s)}
                aria-pressed={showPassword}
                aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"}
              >
                {showPassword ? "Ukryj" : "Pokaż"}
              </button>
            </div>
          </label>

          <div className="row-between">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Zapamiętaj mnie
            </label>

            <Link to="/reset-hasla" className="link-small">Zapomniałeś hasła?</Link>
          </div>

          {error && <div className="form-error" role="alert">{error}</div>}

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Logowanie..." : "Zaloguj się"}
          </button>

          <div className="divider">albo</div>

        

          <p className="signup">
            Nie masz konta? <Link to="/rejestracja">Zarejestruj się</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
