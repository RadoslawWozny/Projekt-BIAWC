import { Link } from 'react-router';

export default function Zwroty() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2', padding: '80px 48px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', background: '#fff', padding: '60px', borderRadius: 24, border: '1px solid #E8DDD0', boxShadow: '0 20px 40px rgba(28,18,9,0.05)' }}>
        <Link to="/" style={{ display: 'inline-block', marginBottom: 30, fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#9E7A5A', textDecoration: 'none' }}>
          ← Wróć do strony głównej
        </Link>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 42, color: '#1C1209', marginBottom: 24 }}>Zwroty i reklamacje</h1>
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: '#5C3D1E', lineHeight: 1.8 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, color: '#1C1209', marginTop: 32, marginBottom: 16 }}>Zwroty</h2>
          <p style={{ marginBottom: 16 }}>Masz pełne prawo zwrócić zakupione produkty (nieotwarte i nieużywane, w fabrycznym opakowaniu) w ciągu 30 dni od momentu odebrania paczki. Wystarczy, że wyślesz je na nasz adres wraz z formularzem zwrotu.</p>
          
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, color: '#1C1209', marginTop: 32, marginBottom: 16 }}>Reklamacje</h2>
          <p style={{ marginBottom: 16 }}>Jeśli produkt jest niezgodny z opisem, wadliwy lub uszkodził się w transporcie, zgłoś to na nasz e-mail reklamacje@aromabrew.pl w ciągu 2 lat od zakupu. Ustosunkujemy się do Twojego zgłoszenia w ciągu 14 dni.</p>
        </div>
      </div>
    </div>
  );
}
