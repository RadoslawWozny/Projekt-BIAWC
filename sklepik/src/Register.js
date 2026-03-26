import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

/* Prosta walidacja email */
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/* Prosty wskaźnik siły hasła */
const passwordStrength = (pwd) => {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score; // 0..4
};

/* Mock API rejestracji - zastąp prawdziwym wywołaniem */
const fakeRegister = (data) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!data.email || !data.login || !data.password) {
        reject({ message: "Uzupełnij wymagane pola." });
      } else if (!isEmail(data.email)) {
        reject({ message: "Nieprawidłowy adres email." });
      } else if (data.password.length < 8) {
        reject({ message: "Hasło musi mieć co najmniej 8 znaków." });
      } else {
        resolve({ ok: true, user: { id: Date.now(), ...data } });
      }
    }, 800);
  });

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    login: "",
    password: "",
    firstName: "",
    lastName: "",
    address: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const validate = () => {
    if (!form.email.trim()) return "Podaj adres email.";
    if (!isEmail(form.email.trim())) return "Podaj poprawny email.";
    if (!form.login.trim()) return "Podaj login.";
    if (!form.password) return "Podaj hasło.";
    if (form.password.length < 8) return "Hasło musi mieć co najmniej 8 znaków.";
    if (!form.firstName.trim()) return "Podaj imię.";
    if (!form.lastName.trim()) return "Podaj nazwisko.";
    if (!acceptTerms) return "Musisz zaakceptować regulamin.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setLoading(true);
    try {
      const payload = { ...form, email: form.email.trim(), login: form.login.trim() };
      const res = await fakeRegister(payload);
      if (res.ok) {
        setSuccess("Konto utworzone pomyślnie. Przekierowanie...");
        setTimeout(() => navigate("/login"), 900);
      }
    } catch (err) {
      setError(err?.message || "Błąd rejestracji. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  };

  const strength = passwordStrength(form.password);
  const strengthLabel = ["Bardzo słabe", "Słabe", "Średnie", "Dobre", "Bardzo dobre"][strength];

  return (
    <main className="register-page" aria-labelledby="register-heading">
      <section className="register-card" role="region" aria-label="Formularz rejestracji">
        <h1 id="register-heading" className="register-title">Utwórz konto</h1>

        <form className="register-form" onSubmit={handleSubmit} noValidate>
          <label className="label" htmlFor="email">Email
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              className="input"
              placeholder="jan@example.com"
              required
            />
          </label>

          <label className="label" htmlFor="login">Login
            <input
              id="login"
              name="login"
              type="text"
              autoComplete="username"
              value={form.login}
              onChange={handleChange}
              className="input"
              placeholder="Twój login"
              required
            />
          </label>

          <label className="label" htmlFor="password">Hasło
            <div className="password-row">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                className="input"
                placeholder="Hasło (min 8 znaków)"
                required
                aria-describedby="pwd-strength"
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

          <div id="pwd-strength" className="pwd-strength" aria-hidden="false">
            <div className={`strength-bar s-${strength}`} />
            <div className="strength-label">{strengthLabel}</div>
          </div>

          <label className="label" htmlFor="firstName">Imię
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={form.firstName}
              onChange={handleChange}
              className="input"
              placeholder="Jan"
              required
            />
          </label>

          <label className="label" htmlFor="lastName">Nazwisko
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={form.lastName}
              onChange={handleChange}
              className="input"
              placeholder="Kowalski"
              required
            />
          </label>

          <label className="label" htmlFor="address">Adres
            <input
              id="address"
              name="address"
              type="text"
              value={form.address}
              onChange={handleChange}
              className="input"
              placeholder="ul. Przykładowa 1, 50-001 Wrocław"
            />
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
            />
            Akceptuję regulamin serwisu
          </label>

          {error && <div className="form-error" role="alert">{error}</div>}
          {success && <div className="form-success" role="status">{success}</div>}

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Tworzenie konta..." : "Zarejestruj się"}
          </button>

          <div className="signup-note">
            Masz już konto? <Link to="/login">Zaloguj się</Link>
          </div>
        </form>
      </section>
    </main>
  );
}
