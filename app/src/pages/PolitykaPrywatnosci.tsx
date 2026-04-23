import { Link } from 'react-router';

export default function PolitykaPrywatnosci() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2', padding: '80px 48px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', background: '#fff', padding: '60px', borderRadius: 24, border: '1px solid #E8DDD0', boxShadow: '0 20px 40px rgba(28,18,9,0.05)' }}>
        <Link to="/" style={{ display: 'inline-block', marginBottom: 30, fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#9E7A5A', textDecoration: 'none' }}>
          ← Wróć do strony głównej
        </Link>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 42, color: '#1C1209', marginBottom: 24 }}>Polityka Prywatności</h1>
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: '#5C3D1E', lineHeight: 1.8 }}>
          <p style={{ marginBottom: 16 }}>Niniejsza polityka prywatności określa zasady przetwarzania i ochrony danych osobowych przekazanych przez użytkowników w związku z korzystaniem z usług sklepu AromaBrew.</p>
          
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, color: '#1C1209', marginTop: 32, marginBottom: 16 }}>1. Administrator Danych</h2>
          <p style={{ marginBottom: 16 }}>Administratorem Twoich danych osobowych jest AromaBrew Sp. z o.o. z siedzibą w Krakowie, ul. Kawowa 42, 30-001 Kraków.</p>
          
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, color: '#1C1209', marginTop: 32, marginBottom: 16 }}>2. Cele i podstawy przetwarzania</h2>
          <p style={{ marginBottom: 16 }}>Przetwarzamy Twoje dane w celu:</p>
          <ul style={{ marginLeft: 24, marginBottom: 16 }}>
            <li>Realizacji zamówień i świadczenia usług drogą elektroniczną (art. 6 ust. 1 lit. b RODO).</li>
            <li>Obsługi zapytań i reklamacji (art. 6 ust. 1 lit. f RODO).</li>
            <li>Wysyłki newslettera, jeśli wyraziłeś na to zgodę (art. 6 ust. 1 lit. a RODO).</li>
          </ul>

          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, color: '#1C1209', marginTop: 32, marginBottom: 16 }}>3. Odbiorcy danych</h2>
          <p style={{ marginBottom: 16 }}>Twoje dane mogą być przekazywane podmiotom przetwarzającym dane na nasze zlecenie (np. dostawcom usług IT, firmom kurierskim, operatorom płatności).</p>
          
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, color: '#1C1209', marginTop: 32, marginBottom: 16 }}>4. Twoje prawa</h2>
          <p style={{ marginBottom: 16 }}>Masz prawo do dostępu do swoich danych, ich sprostowania, usunięcia lub ograniczenia przetwarzania, prawo sprzeciwu, prawo wniesienia skargi do organu nadzorczego.</p>

          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, color: '#1C1209', marginTop: 32, marginBottom: 16 }}>5. Pliki Cookies</h2>
          <p style={{ marginBottom: 16 }}>Nasz sklep używa plików cookies w celu zapewnienia prawidłowego działania serwisu oraz w celach analitycznych i marketingowych.</p>
        </div>
      </div>
    </div>
  );
}
