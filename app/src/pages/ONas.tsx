import { Link } from 'react-router';

export default function ONas() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2', padding: '80px 48px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', background: '#fff', padding: '60px', borderRadius: 24, border: '1px solid #E8DDD0', boxShadow: '0 20px 40px rgba(28,18,9,0.05)' }}>
        <Link to="/" style={{ display: 'inline-block', marginBottom: 30, fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#9E7A5A', textDecoration: 'none' }}>
          ← Wróć do strony głównej
        </Link>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 42, color: '#1C1209', marginBottom: 24 }}>O nas</h1>
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: '#5C3D1E', lineHeight: 1.8 }}>
          <p style={{ marginBottom: 16 }}>AromaBrew powstało z czystej pasji do doskonałej kawy i herbaty. Od 2018 roku nieustannie poszukujemy unikalnych smaków w najdalszych zakątkach świata.</p>
          <p style={{ marginBottom: 16 }}>Wierzymy w uczciwy handel (Direct Trade), dlatego płacimy rolnikom znacznie więcej niż wynosi rynkowa cena minimalna. Wiemy, że najwyższa jakość zaczyna się od szacunku dla ludzkiej pracy i natury.</p>
          <p style={{ marginBottom: 16 }}>Każde ziarno wypalane w naszej krakowskiej mikropalarni traktowane jest z rzemieślniczą uwagą, by wydobyć z niego pełnię ukrytych aromatów. Spróbuj i przekonaj się sam!</p>
        </div>
      </div>
    </div>
  );
}
