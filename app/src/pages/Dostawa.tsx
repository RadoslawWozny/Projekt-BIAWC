import { Link } from 'react-router';

export default function Dostawa() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2', padding: '80px 48px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', background: '#fff', padding: '60px', borderRadius: 24, border: '1px solid #E8DDD0', boxShadow: '0 20px 40px rgba(28,18,9,0.05)' }}>
        <Link to="/" style={{ display: 'inline-block', marginBottom: 30, fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#9E7A5A', textDecoration: 'none' }}>
          ← Wróć do strony głównej
        </Link>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 42, color: '#1C1209', marginBottom: 24 }}>Koszty i czas dostawy</h1>
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: '#5C3D1E', lineHeight: 1.8 }}>
          <p style={{ marginBottom: 16 }}>Zapewniamy darmową dostawę dla wszystkich zamówień powyżej <strong>150 zł</strong>!</p>
          <ul style={{ marginLeft: 24, marginBottom: 16 }}>
            <li>Kurier InPost - 14.99 zł (1-2 dni robocze)</li>
            <li>Paczkomaty InPost - 12.99 zł (1-2 dni robocze)</li>
            <li>Kurier DPD - 16.99 zł (1-2 dni robocze)</li>
          </ul>
          <p>Zamówienia złożone do godziny 13:00 wysyłamy tego samego dnia roboczego!</p>
        </div>
      </div>
    </div>
  );
}
