import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

// Types
interface Product {
  id: number;
  category: string;
  name: string;
  subtitle: string;
  tags: string[];
  price: number;
  weight: string;
  rating: number;
  reviews: number;
  color: string;
  desc: string;
  image: string;
}

interface CartItem extends Product {
  qty: number;
}

// Icons
const Ic = ({ d, size = 20, stroke = '#1C1209', sw = 1.5, fill = 'none' }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);
const IChevLeft = (p: any) => <Ic {...p} d="M15 18l-6-6 6-6" />;
const ICheck = (p: any) => <Ic {...p} d="M20 6L9 17l-5-5" />;
const ITrash = (p: any) => (
  <svg width={p.size || 20} height={p.size || 20} viewBox="0 0 24 24" fill="none" stroke={p.stroke || '#1C1209'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
  </svg>
);

export default function Kasa({ cart, setCart }: { cart: CartItem[], setCart: any }) {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', address: '', city: '', zip: '', payment: 'blik' });

  const total = cart.reduce((s, p) => s + p.price * p.qty, 0);
  const delivery = total > 150 || total === 0 ? 0 : 15;
  const finalTotal = total + delivery;

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setSuccess(true);
    setCart([]);
  };

  const handleRemove = (id: number) => {
    setCart((prev: CartItem[]) => prev.filter(p => p.id !== id));
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: '#fff', padding: '60px 48px', borderRadius: 24, textAlign: 'center', maxWidth: 480, border: '1px solid #E8DDD0', boxShadow: '0 24px 64px rgba(28,18,9,0.08)' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#6B8C6B20', color: '#6B8C6B', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <ICheck size={40} stroke="#6B8C6B" />
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, color: '#1C1209', marginBottom: 16 }}>Dziękujemy za zamówienie!</h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: '#7A5C3A', marginBottom: 32, lineHeight: 1.6 }}>Twoje zamówienie zostało przyjęte do realizacji. Na podany adres email ({form.email}) przesłaliśmy potwierdzenie oraz szczegóły.</p>
          <button onClick={() => navigate('/')} className="btn-primary" style={{ padding: '14px 32px', borderRadius: 30, background: '#1C1209', color: '#FAF7F2', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 14 }}>
            Wróć do sklepu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2', paddingBottom: 100 }}>
      {/* Header */}
      <header style={{ background: '#fff', borderBottom: '1px solid #E8DDD0', padding: '24px 48px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#5C3D1E', textDecoration: 'none', fontFamily: "'DM Sans',sans-serif", fontSize: 14 }}>
            <IChevLeft size={16} /> Kontynuuj zakupy
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#5C8A9E20', border: '1.5px solid #5C8A9E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#5C8A9E' }} />
            </div>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 500, color: '#1C1209' }}>AromaBrew Kasa</span>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1080, margin: '48px auto 0', padding: '0 48px', display: 'flex', gap: 48, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        
        {/* Left: Form */}
        <div style={{ flex: '1 1 500px', background: '#fff', borderRadius: 24, padding: '40px', border: '1px solid #E8DDD0' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, color: '#1C1209', marginBottom: 32 }}>Dane do wysyłki</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Imię i nazwisko</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={inputStyle} placeholder="Jan Kowalski" />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Email</label>
                <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={inputStyle} placeholder="jan@example.com" />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Adres</label>
              <input required value={form.address} onChange={e => setForm({...form, address: e.target.value})} style={inputStyle} placeholder="ul. Przykładowa 12/3" />
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Kod pocztowy</label>
                <input required value={form.zip} onChange={e => setForm({...form, zip: e.target.value})} style={inputStyle} placeholder="00-000" />
              </div>
              <div style={{ flex: 2 }}>
                <label style={labelStyle}>Miasto</label>
                <input required value={form.city} onChange={e => setForm({...form, city: e.target.value})} style={inputStyle} placeholder="Warszawa" />
              </div>
            </div>

            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, color: '#1C1209', marginTop: 16, marginBottom: 8 }}>Metoda płatności</h3>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {['blik', 'karta', 'przelew'].map(m => (
                <label key={m} style={{ flex: 1, padding: '16px', border: form.payment === m ? '2px solid #5C8A9E' : '1px solid #E8DDD0', borderRadius: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, background: form.payment === m ? '#5C8A9E08' : '#fff', transition: 'all .2s' }}>
                  <input type="radio" name="payment" value={m} checked={form.payment === m} onChange={() => setForm({...form, payment: m})} style={{ accentColor: '#5C8A9E' }} />
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: '#1C1209', textTransform: 'capitalize' }}>{m === 'karta' ? 'Karta płatnicza' : m}</span>
                </label>
              ))}
            </div>

            <button type="submit" disabled={cart.length === 0} style={{ marginTop: 24, padding: '16px', borderRadius: 30, background: cart.length === 0 ? '#D0C4B8' : '#1C1209', color: '#FAF7F2', border: 'none', cursor: cart.length === 0 ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 500, transition: 'background .2s' }}>
              Zamawiam i płacę ({finalTotal} zł)
            </button>
          </form>
        </div>

        {/* Right: Cart Summary */}
        <div style={{ flex: '1 1 350px', background: '#F5EFE6', borderRadius: 24, padding: '40px', border: '1px solid #EDE5D8' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, color: '#1C1209', marginBottom: 24 }}>Podsumowanie koszyka</h2>
          
          {cart.length === 0 ? (
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: '#7A5C3A' }}>Twój koszyk jest pusty.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {cart.map(p => (
                <div key={p.id} style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div style={{ width: 64, height: 64, borderRadius: 12, overflow: 'hidden', background: '#fff', border: '1px solid #E8DDD0' }}>
                    <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: '#1C1209', fontWeight: 500, marginBottom: 4 }}>{p.name}</p>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: '#7A5C3A' }}>Ilość: {p.qty} × {p.price} zł</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: '#1C1209', fontWeight: 500 }}>{p.price * p.qty} zł</p>
                    <button onClick={() => handleRemove(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, marginTop: 4 }}>
                      <ITrash size={16} stroke="#9E7A5A" />
                    </button>
                  </div>
                </div>
              ))}

              <div style={{ borderTop: '1px solid #E8DDD0', margin: '12px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: '#7A5C3A' }}>Dostawa</span>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: '#1C1209', fontWeight: 500 }}>{delivery === 0 ? '0 zł' : `${delivery} zł`}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8 }}>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: '#1C1209', fontWeight: 500 }}>Łącznie do zapłaty</span>
                <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, color: '#1C1209', fontWeight: 500 }}>{finalTotal} zł</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontFamily: "'DM Sans',sans-serif",
  fontSize: 12,
  color: '#5C3D1E',
  marginBottom: 6,
  fontWeight: 500
};

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: 12,
  border: '1.5px solid #E8DDD0',
  background: '#FAF7F2',
  fontFamily: "'DM Sans',sans-serif",
  fontSize: 14,
  color: '#1C1209',
  outline: 'none',
  transition: 'border-color .2s'
};
