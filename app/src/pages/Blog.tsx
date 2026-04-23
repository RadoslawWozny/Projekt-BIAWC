import { Link } from 'react-router';

export default function Blog() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2', padding: '80px 48px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', background: '#fff', padding: '60px', borderRadius: 24, border: '1px solid #E8DDD0', boxShadow: '0 20px 40px rgba(28,18,9,0.05)' }}>
        <Link to="/" style={{ display: 'inline-block', marginBottom: 30, fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#9E7A5A', textDecoration: 'none' }}>
          ← Wróć do strony głównej
        </Link>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 42, color: '#1C1209', marginBottom: 24 }}>Blog AromaBrew</h1>
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: '#5C3D1E', lineHeight: 1.8 }}>
          <p style={{ marginBottom: 16 }}>Witaj na naszym blogu! Sekcja ta jest w trakcie przebudowy. Wkrótce pojawią się tutaj artykuły od naszych Q-Graderów na temat alternatywnych metod parzenia, relacje z plantacji i przepisy na idealne flat white.</p>
          <p style={{ marginBottom: 16 }}>Zapisz się do naszego newslettera, aby nie przegapić premiery!</p>
        </div>
      </div>
    </div>
  );
}
