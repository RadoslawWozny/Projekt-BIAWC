import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router';

/* ── Mock data generators ── */
const MOCK_REVIEWS = [
  { author: 'Zofia K.', city: 'Warszawa', rating: 5, date: '2026-03-15', text: 'Absolutnie wspaniały smak! Zamawiam regularnie i nigdy się nie zawiodłam. Aromat jest niesamowity, a smak pełny i bogaty.' },
  { author: 'Tomasz M.', city: 'Kraków', rating: 5, date: '2026-03-02', text: 'Jeden z najlepszych produktów jakie próbowałem. Idealny do porannej rutyny — daje energię i przyjemność.' },
  { author: 'Ania W.', city: 'Gdańsk', rating: 4, date: '2026-02-18', text: 'Bardzo dobry produkt. Delikatny aromat i przyjemna tekstura. Jedyny minus to trochę za wysoka cena.' },
  { author: 'Michał R.', city: 'Wrocław', rating: 5, date: '2026-02-05', text: 'Polecam każdemu kto ceni sobie jakość. Świeży, aromatyczny i doskonale zapakowany.' },
  { author: 'Kasia P.', city: 'Poznań', rating: 4, date: '2026-01-22', text: 'Smak wyśmienity, choć spodziewałam się nieco bardziej intensywnego aromatu. Mimo to — kupię ponownie!' },
];

const FLAVOR_PROFILES: Record<string, { label: string; value: number }[]> = {
  'Herbata': [
    { label: 'Świeżość', value: 85 }, { label: 'Goryczka', value: 30 },
    { label: 'Słodycz', value: 60 }, { label: 'Umami', value: 45 },
    { label: 'Kwiatowość', value: 70 }, { label: 'Intensywność', value: 55 },
  ],
  'Kawa': [
    { label: 'Kwasowość', value: 65 }, { label: 'Goryczka', value: 50 },
    { label: 'Słodycz', value: 55 }, { label: 'Ciało', value: 75 },
    { label: 'Aromat', value: 85 }, { label: 'Intensywność', value: 70 },
  ],
  'Dodatki': [
    { label: 'Słodycz', value: 80 }, { label: 'Aromat', value: 90 },
    { label: 'Intensywność', value: 45 }, { label: 'Naturalność', value: 85 },
    { label: 'Uniwersalność', value: 70 }, { label: 'Gęstość', value: 60 },
  ],
};

const BREWING_TIPS: Record<string, string[]> = {
  'Herbata': ['Temperatura wody: 70–80°C', 'Czas parzenia: 2–3 min', 'Ilość: 2g na 200ml', 'Najlepsza w porcelanie'],
  'Kawa': ['Temperatura wody: 92–96°C', 'Mielenie: średnie', 'Proporcja: 1:15 (kawa:woda)', 'Najlepsza świeżo mielona'],
  'Dodatki': ['Dodaj 15–20ml na filiżankę', 'Mieszaj energicznie', 'Przechowuj w lodówce', 'Najlepszy w ciągu 30 dni'],
};

const NAME_TO_IMAGE: Record<string, string> = {
  'sencha premium': '/images/01_sencha_premium.jpg',
  'matcha ceremonial': '/images/02_matcha_ceremonial.jpg',
  'darjeeling first flush': '/images/03_darjeeling_first_flush.jpg',
  'earl grey classic': '/images/04_earl_grey_classic.jpg',
  'tie guan yin': '/images/05_tie_guan_yin.jpg',
  'bai hao yin zhen': '/images/06_bai_hao_yin_zhen.jpg',
  'rooibos naturalny': '/images/07_rooibos_naturalny.jpg',
  'ethiopia yirgacheffe': '/images/08_ethiopia_yirgacheffe.jpg',
  'panama geisha': '/images/09_panama_geisha.jpg',
  'espresso roma blend': '/images/10_espresso_roma_blend.jpg',
  'chai masala': '/images/11_chai_masala.jpg',
  'syrop waniliowy monin': '/images/12_syrop_waniliowy_monin.jpg',
};

const FALLBACK_IMGS = ['/images/prod1.jpg','/images/prod2.jpg','/images/prod3.jpg','/images/prod4.jpg','/images/prod5.jpg','/images/prod6.jpg','/images/prod7.jpg','/images/prod8.jpg'];

interface ProductData {
  id: number; nazwa: string; opis: string | null; kategoria: string | null;
  podkategoria: string | null; cena: number; waga_g: number | null;
  jednostka: string | null; kraj_pochodzenia: string | null;
  dostepnosc: boolean; ocena: number | null; podatek: number | null;
}

const accent = '#5C8A9E';

const Stars = ({ rating, size = 14 }: { rating: number; size?: number }) => (
  <div style={{ display: 'flex', gap: 2 }}>
    {[1,2,3,4,5].map(i => (
      <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= Math.round(rating) ? '#C4882A' : 'none'} stroke="#C4882A" strokeWidth={1.5}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ))}
  </div>
);

const FlavorBar = ({ label, value }: { label: string; value: number }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: '#5C3D1E', fontWeight: 500 }}>{label}</span>
      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: '#9E7A5A' }}>{value}%</span>
    </div>
    <div style={{ height: 6, borderRadius: 3, background: '#F2EBE0', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${value}%`, borderRadius: 3, background: `linear-gradient(90deg, ${accent}, ${accent}CC)`, transition: 'width 1s ease' }} />
    </div>
  </div>
);

export default function ProduktSzczegoly() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState<'opis' | 'profil' | 'opinie'>('opis');
  const API = (import.meta.env.VITE_PRODUCTS_API as string) || 'http://localhost:8002/api/v1';

  // The product.id in the grid is offset by 1000 (see mapRows in App.tsx)
  const realId = Number(id) >= 1000 ? Number(id) - 1000 : Number(id);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/products/${realId}`)
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then((data: ProductData) => setProduct(data))
      .catch(err => console.warn('Product fetch error:', err))
      .finally(() => setLoading(false));
  }, [realId, API]);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: '#9E7A5A' }}>Ładowanie...</p>
    </div>
  );

  if (!product) return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2', padding: '80px 48px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: 64, marginBottom: 16 }}>😕</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, color: '#1C1209', marginBottom: 12 }}>Nie znaleziono produktu</h1>
        <Link to="/" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: accent, textDecoration: 'none' }}>← Wróć do sklepu</Link>
      </div>
    </div>
  );

  const mainImage = NAME_TO_IMAGE[(product.nazwa || '').toLowerCase()] || FALLBACK_IMGS[product.id % FALLBACK_IMGS.length];
  const gallery = [mainImage, ...FALLBACK_IMGS.slice(0, 3)];
  const kategoria = product.kategoria || 'Herbata';
  const flavors = FLAVOR_PROFILES[kategoria] || FLAVOR_PROFILES['Herbata'];
  const tips = BREWING_TIPS[kategoria] || BREWING_TIPS['Herbata'];
  const avgRating = product.ocena || 4.7;

  const detailedDesc = product.opis
    ? `${product.opis}\n\nTen wyjątkowy produkt pochodzi z regionu ${product.kraj_pochodzenia || 'nieznanego'}, gdzie lokalni producenci od pokoleń dbają o najwyższą jakość. Starannie wyselekcjonowany i zapakowany, zachowuje pełnię swoich właściwości smakowych i aromatycznych. Idealny zarówno dla koneserów, jak i osób dopiero odkrywających świat ${kategoria === 'Kawa' ? 'kawy speciality' : kategoria === 'Herbata' ? 'herbat premium' : 'naturalnych dodatków'}.`
    : 'Brak szczegółowego opisu.';

  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      {/* ── Top bar ── */}
      <div style={{ background: 'rgba(250,247,242,0.96)', borderBottom: '1px solid #E8DDD0', padding: '0 48px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', height: 60, display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#9E7A5A', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9E7A5A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Wróć do sklepu
          </Link>
          <span style={{ margin: '0 12px', color: '#D0C4B8' }}>·</span>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: '#D0C4B8' }}>{kategoria}</span>
          {product.podkategoria && <>
            <span style={{ margin: '0 8px', color: '#D0C4B8' }}>/</span>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: '#D0C4B8' }}>{product.podkategoria}</span>
          </>}
          <span style={{ margin: '0 8px', color: '#D0C4B8' }}>/</span>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: '#5C3D1E', fontWeight: 500 }}>{product.nazwa}</span>
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 48px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'start' }}>

          {/* ── Left: Gallery ── */}
          <div>
            <div style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 16, aspectRatio: '1', background: '#F2EBE0' }}>
              <img src={gallery[activeImg]} alt={product.nazwa} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity .3s ease' }} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {gallery.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} style={{
                  width: 72, height: 72, borderRadius: 12, overflow: 'hidden', border: activeImg === i ? `2px solid ${accent}` : '2px solid transparent',
                  cursor: 'pointer', opacity: activeImg === i ? 1 : 0.6, transition: 'all .2s ease', padding: 0, background: 'none'
                }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          </div>

          {/* ── Right: Info ── */}
          <div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: accent, marginBottom: 8, fontWeight: 500 }}>{product.podkategoria || kategoria}</p>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 42, fontWeight: 400, color: '#1C1209', marginBottom: 12, lineHeight: 1.15 }}>{product.nazwa}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <Stars rating={avgRating} size={16} />
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#9E7A5A' }}>{avgRating} · {MOCK_REVIEWS.length} opinii</span>
            </div>

            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 38, fontWeight: 500, color: '#1C1209', marginBottom: 6 }}>{product.cena} zł</p>
            {product.podatek != null && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: '#9E7A5A', marginBottom: 24 }}>w tym VAT {product.podatek}%</p>}

            {/* Tags */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
              {[product.kraj_pochodzenia, kategoria, product.podkategoria].filter(Boolean).map(t => (
                <span key={t} style={{ padding: '5px 14px', borderRadius: 20, background: `${accent}12`, color: accent, fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 500 }}>{t}</span>
              ))}
              {product.dostepnosc && <span style={{ padding: '5px 14px', borderRadius: 20, background: '#6B8C6B15', color: '#6B8C6B', fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 500 }}>✓ Dostępny</span>}
            </div>

            {/* Quick info */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
              {[
                { label: 'Waga', value: product.waga_g ? `${product.waga_g}${product.jednostka === 'ml' ? 'ml' : 'g'}` : '-' },
                { label: 'Pochodzenie', value: product.kraj_pochodzenia || '-' },
                { label: 'Ocena', value: `${avgRating}/5` },
              ].map(item => (
                <div key={item.label} style={{ padding: '14px 16px', background: '#fff', borderRadius: 14, border: '1px solid #F2EBE0', textAlign: 'center' }}>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: '#9E7A5A', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>{item.label}</p>
                  <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 500, color: '#1C1209' }}>{item.value}</p>
                </div>
              ))}
            </div>

            {/* Brewing tips */}
            <div style={{ background: `${accent}08`, borderRadius: 16, padding: '20px 24px', marginBottom: 28 }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: accent, fontWeight: 500, marginBottom: 14 }}>Wskazówki przygotowania</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {tips.map(tip => (
                  <div key={tip} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: accent, flexShrink: 0 }} />
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: '#5C3D1E' }}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button style={{ width: '100%', padding: '16px', borderRadius: 16, background: '#1C1209', color: '#FAF7F2', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 14, letterSpacing: '.04em', transition: 'background .2s ease' }}
              onMouseEnter={e => e.currentTarget.style.background = accent}
              onMouseLeave={e => e.currentTarget.style.background = '#1C1209'}>
              + Dodaj do koszyka — {product.cena} zł
            </button>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div style={{ marginTop: 64 }}>
          <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid #E8DDD0', marginBottom: 36 }}>
            {([['opis', 'Szczegółowy opis'], ['profil', 'Profil smakowy'], ['opinie', `Opinie (${MOCK_REVIEWS.length})`]] as const).map(([key, label]) => (
              <button key={key} onClick={() => setActiveTab(key as any)} style={{
                padding: '14px 28px', border: 'none', background: 'transparent', cursor: 'pointer',
                fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: activeTab === key ? 500 : 400,
                color: activeTab === key ? accent : '#9E7A5A', borderBottom: activeTab === key ? `2px solid ${accent}` : '2px solid transparent',
                transition: 'all .2s ease', marginBottom: -1,
              }}>{label}</button>
            ))}
          </div>

          {/* Tab: Opis */}
          {activeTab === 'opis' && (
            <div style={{ maxWidth: 800 }}>
              {detailedDesc.split('\n\n').map((p, i) => (
                <p key={i} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: '#5C3D1E', lineHeight: 1.8, marginBottom: 18, fontWeight: 300 }}>{p}</p>
              ))}
            </div>
          )}

          {/* Tab: Profil smakowy */}
          {activeTab === 'profil' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, maxWidth: 800 }}>
              <div>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, color: '#1C1209', marginBottom: 24 }}>Profil smakowy</h3>
                {flavors.map(f => <FlavorBar key={f.label} {...f} />)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 220, height: 220, borderRadius: '50%', background: `${accent}0A`, border: `2px solid ${accent}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <div style={{ width: 140, height: 140, borderRadius: '50%', background: `${accent}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 500, color: accent }}>{avgRating}</p>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: '#9E7A5A', textTransform: 'uppercase', letterSpacing: '.1em' }}>Ocena</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Opinie */}
          {activeTab === 'opinie' && (
            <div style={{ maxWidth: 800 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32, padding: '20px 24px', background: '#fff', borderRadius: 16, border: '1px solid #F2EBE0' }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 48, fontWeight: 500, color: '#1C1209', lineHeight: 1 }}>{avgRating}</p>
                  <Stars rating={avgRating} size={14} />
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: '#9E7A5A', marginTop: 4 }}>{MOCK_REVIEWS.length} opinii</p>
                </div>
                <div style={{ flex: 1, marginLeft: 24 }}>
                  {[5,4,3,2,1].map(star => {
                    const count = MOCK_REVIEWS.filter(r => r.rating === star).length;
                    const pct = (count / MOCK_REVIEWS.length) * 100;
                    return (
                      <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: '#9E7A5A', width: 12 }}>{star}</span>
                        <div style={{ flex: 1, height: 5, borderRadius: 3, background: '#F2EBE0' }}>
                          <div style={{ height: '100%', width: `${pct}%`, borderRadius: 3, background: '#C4882A' }} />
                        </div>
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: '#D0C4B8', width: 16 }}>{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {MOCK_REVIEWS.map((review, i) => (
                  <div key={i} style={{ padding: '24px', background: '#fff', borderRadius: 16, border: '1px solid #F2EBE0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 38, height: 38, borderRadius: '50%', background: `${accent}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, color: accent, fontWeight: 500 }}>{review.author[0]}</span>
                        </div>
                        <div>
                          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#1C1209', fontWeight: 500 }}>{review.author}</p>
                          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: '#9E7A5A' }}>{review.city} · {review.date}</p>
                        </div>
                      </div>
                      <Stars rating={review.rating} size={12} />
                    </div>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#5C3D1E', lineHeight: 1.7, fontWeight: 300 }}>{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
