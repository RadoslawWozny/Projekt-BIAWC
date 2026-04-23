import { Link } from 'react-router';

export default function Kontakt() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2', padding: '80px 48px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', background: '#fff', padding: '60px', borderRadius: 24, border: '1px solid #E8DDD0', boxShadow: '0 20px 40px rgba(28,18,9,0.05)' }}>
        <Link to="/" style={{ display: 'inline-block', marginBottom: 30, fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#9E7A5A', textDecoration: 'none' }}>
          ← Wróć do strony głównej
        </Link>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 42, color: '#1C1209', marginBottom: 24 }}>Kontakt</h1>
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: '#5C3D1E', lineHeight: 1.8 }}>
          <p style={{ marginBottom: 16 }}>Chcesz się z nami skontaktować? Masz pytania o produkt, a może chciałbyś nawiązać współpracę B2B?</p>
          
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, color: '#1C1209', marginTop: 32, marginBottom: 16 }}>Dane kontaktowe</h2>
          <p><strong>AromaBrew Sp. z o.o.</strong></p>
          <p>ul. Kawowa 42</p>
          <p>30-001 Kraków</p>
          <br/>
          <p>Email: <a href="mailto:hello@aromabrew.pl" style={{ color: '#5C8A9E' }}>hello@aromabrew.pl</a></p>
          <p>Telefon: +48 123 456 789 (Infolinia czynna Pn-Pt 8:00 - 16:00)</p>
        </div>
      </div>
    </div>
  );
}
