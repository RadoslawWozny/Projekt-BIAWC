import { Link } from 'react-router';

export default function Regulamin() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2', padding: '80px 48px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', background: '#fff', padding: '60px', borderRadius: 24, border: '1px solid #E8DDD0', boxShadow: '0 20px 40px rgba(28,18,9,0.05)' }}>
        <Link to="/" style={{ display: 'inline-block', marginBottom: 30, fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#9E7A5A', textDecoration: 'none' }}>
          ← Wróć do strony głównej
        </Link>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 42, color: '#1C1209', marginBottom: 24 }}>Regulamin Sklepu</h1>
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: '#5C3D1E', lineHeight: 1.8 }}>
          <p style={{ marginBottom: 16 }}>Sklep internetowy AromaBrew, działający pod adresem www.aromabrew.pl, prowadzony jest przez AromaBrew Sp. z o.o.</p>
          
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, color: '#1C1209', marginTop: 32, marginBottom: 16 }}>1. Postanowienia ogólne</h2>
          <p style={{ marginBottom: 16 }}>Niniejszy regulamin określa zasady korzystania ze sklepu internetowego, składania zamówień na produkty, dostarczania zamówionych produktów, uiszczania ceny zakupu, uprawnień do anulowania zamówienia i odstąpienia od umowy.</p>
          
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, color: '#1C1209', marginTop: 32, marginBottom: 16 }}>2. Zamówienia</h2>
          <p style={{ marginBottom: 16 }}>Zamówienia można składać 24 godziny na dobę, 7 dni w tygodniu. Realizacja zamówień odbywa się w dni robocze od poniedziałku do piątku.</p>
          
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, color: '#1C1209', marginTop: 32, marginBottom: 16 }}>3. Ceny i Płatności</h2>
          <p style={{ marginBottom: 16 }}>Wszystkie ceny podane w sklepie są cenami brutto (zawierają podatek VAT). Sklep oferuje następujące formy płatności: BLIK, szybki przelew online, karty płatnicze Visa/Mastercard.</p>
          
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, color: '#1C1209', marginTop: 32, marginBottom: 16 }}>4. Dostawa</h2>
          <p style={{ marginBottom: 16 }}>Darmowa dostawa obowiązuje dla zamówień od 150 zł. Czas realizacji zamówienia wynosi zwykle do 24 godzin roboczych od zaksięgowania płatności.</p>
          
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, color: '#1C1209', marginTop: 32, marginBottom: 16 }}>5. Zwroty i Reklamacje</h2>
          <p style={{ marginBottom: 16 }}>Konsument ma prawo odstąpić od umowy bez podania przyczyny w terminie 30 dni od otrzymania przesyłki, z zastrzeżeniem produktów o krótkim terminie przydatności lub produktów odpieczętowanych, których nie można zwrócić ze względów higienicznych.</p>
        </div>
      </div>
    </div>
  );
}
