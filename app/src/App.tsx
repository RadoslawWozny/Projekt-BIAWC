import { useState, useEffect, useRef, useCallback } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router';
import Login from './pages/Login';
import PolitykaPrywatnosci from './pages/PolitykaPrywatnosci';
import Regulamin from './pages/Regulamin';
import ONas from './pages/ONas';
import Dostawa from './pages/Dostawa';
import Zwroty from './pages/Zwroty';
import Blog from './pages/Blog';
import Kontakt from './pages/Kontakt';
import ChatBot from './components/ChatBot';
import Kasa from './pages/Kasa';
/* ═══════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════ */
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

interface TweakState {
  accentColor: string;
  heroHeading: string;
  showRatings: boolean;
  gridCols: string;
}

/* ═══════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════ */
const MEGA: Record<string, { label: string; sub: string; id: string }[]> = {
  'Kawy': [
    { label: 'Kawa Ziarnista', sub: 'Single origin & blends', id: 'kawa-ziarnista' },
    { label: 'Kawa Mielona', sub: 'Do ekspresu przelewowego', id: 'kawa-mielona' },
    { label: 'Kawa Espresso', sub: 'Intensywne blends', id: 'kawa-espresso' },
    { label: 'Cold Brew', sub: 'Na zimno, smooth', id: 'kawa-coldbrew' },
    { label: 'Specialty Coffee', sub: 'Ocena SCA 80+', id: 'kawa-specialty' },
    { label: 'Rozpuszczalna', sub: 'Szybka i wygodna', id: 'kawa-rozpuszczalna' },
  ],
  'Herbaty': [
    { label: 'Herbata Zielona', sub: 'Japońska & chińska', id: 'herbata-zielona' },
    { label: 'Herbata Czarna', sub: 'Assam, Darjeeling, Ceylon', id: 'herbata-czarna' },
    { label: 'Herbata Biała', sub: 'Delikatna, kwiatowa', id: 'herbata-biala' },
    { label: 'Oolong', sub: 'Częściowo utleniona', id: 'herbata-oolong' },
    { label: 'Ziołowe Napary', sub: 'Rumianek, mięta, imbir', id: 'herbata-ziolowa' },
    { label: 'Pu-erh', sub: 'Fermentowana, ziemista', id: 'herbata-puerh' },
  ],
  'Dodatki i Syropy': [
    { label: 'Syropy Smakowe', sub: 'Lawenda, wanilia, malina', id: 'dodatki-syropy' },
    { label: 'Mleko Roślinne', sub: 'Owsiane, migdałowe, sojowe', id: 'dodatki-mleka' },
    { label: 'Słodziki', sub: 'Miód, cukier trzcinowy', id: 'dodatki-slodziki' },
    { label: 'Przyprawy', sub: 'Cynamon, kardamon, imbir', id: 'dodatki-przyprawy' },
  ],
};

/* SVG icons for mega-menu tiles — keyed by subcategory id */
const MegaIcon = ({ id, color, size = 20 }: { id: string; color: string; size?: number }) => {
  const s = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (id) {
    /* ---- KAWY ---- */
    case 'kawa-ziarnista': return (
      <svg {...s}><ellipse cx="12" cy="12" rx="6" ry="9" /><path d="M10.5 5c1 2.5-1 7 .5 13" /></svg>
    );
    case 'kawa-mielona': return (
      <svg {...s}><rect x="4" y="4" width="16" height="16" rx="2"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="16" y2="14"/><path d="M10 4V2M14 4V2"/></svg>
    );
    case 'kawa-espresso': return (
      <svg {...s}><path d="M17 8h1a4 4 0 010 8h-1"/><path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z"/><line x1="6" y1="2" x2="6" y2="5"/><line x1="10" y1="2" x2="10" y2="5"/></svg>
    );
    case 'kawa-coldbrew': return (
      <svg {...s}><path d="M8 2v4M16 2v4"/><rect x="6" y="6" width="12" height="16" rx="2"/><path d="M6 12h12"/><circle cx="12" cy="16" r="2"/></svg>
    );
    case 'kawa-specialty': return (
      <svg {...s}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
    );
    case 'kawa-rozpuszczalna': return (
      <svg {...s}><path d="M12 2v6"/><path d="M8 4c0 0 2 2 4 2s4-2 4-2"/><rect x="6" y="8" width="12" height="14" rx="2"/><path d="M10 14h4"/></svg>
    );
    /* ---- HERBATY ---- */
    case 'herbata-zielona': return (
      <svg {...s}><path d="M11 20A7 7 0 019.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
    );
    case 'herbata-czarna': return (
      <svg {...s}><path d="M11 20A7 7 0 019.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" fill={`${color}30`}/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
    );
    case 'herbata-biala': return (
      <svg {...s}><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M2 12h3M19 12h3M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/></svg>
    );
    case 'herbata-oolong': return (
      <svg {...s}><path d="M12 3c-1.5 3-4 5-4 9a4 4 0 008 0c0-4-2.5-6-4-9z"/><path d="M12 16v5"/></svg>
    );
    case 'herbata-ziolowa': return (
      <svg {...s}><path d="M6 20c3-3 4.5-7 4.5-12"/><path d="M18 20c-3-3-4.5-7-4.5-12"/><path d="M12 8c-2 0-5 1-6.5 3"/><path d="M12 8c2 0 5 1 6.5 3"/><circle cx="12" cy="5" r="2"/></svg>
    );
    case 'herbata-puerh': return (
      <svg {...s}><circle cx="12" cy="12" r="8"/><path d="M12 4v4M12 16v4"/><path d="M8 12H4M20 12h-4"/><circle cx="12" cy="12" r="3"/></svg>
    );
    /* ---- DODATKI ---- */
    case 'dodatki-syropy': return (
      <svg {...s}><path d="M8 2h8l-1 6H9L8 2z"/><rect x="7" y="8" width="10" height="14" rx="2"/><path d="M12 12v6"/></svg>
    );
    case 'dodatki-mleka': return (
      <svg {...s}><path d="M8 2h8v4c0 1-1 2-2 2h-4c-1 0-2-1-2-2V2z"/><path d="M6 8h12v12a2 2 0 01-2 2H8a2 2 0 01-2-2V8z"/><path d="M10 13c0-1 1-2 2-2s2 1 2 2-1 2-2 3-2 2-2 3"/></svg>
    );
    case 'dodatki-slodziki': return (
      <svg {...s}><path d="M12 2C8 2 4 5 4 9c0 3 2 5 4 6l1 7h6l1-7c2-1 4-3 4-6 0-4-4-7-8-7z"/><path d="M10 14h4"/></svg>
    );
    case 'dodatki-przyprawy': return (
      <svg {...s}><path d="M12 2c-1 3-3 5-3 8a3 3 0 006 0c0-3-2-5-3-8z"/><line x1="12" y1="13" x2="12" y2="22"/><path d="M9 18h6"/></svg>
    );
    default: return (
      <svg {...s}><circle cx="12" cy="12" r="8"/><path d="M12 8v4l2 2"/></svg>
    );
  }
};

const CATS = [
  { id: 'all', label: 'Wszystkie' },
  { id: 'kawa', label: 'Kawa' },
  { id: 'kawa-ziarnista', label: 'Kawa Ziarnista' },
  { id: 'kawa-espresso', label: 'Espresso' },
  { id: 'herbata', label: 'Herbata' },
  { id: 'herbata-zielona', label: 'Herbata Zielona' },
  { id: 'herbata-czarna', label: 'Herbata Czarna' },
  { id: 'dodatki', label: 'Dodatki' },
  { id: 'bestseller', label: 'Bestsellery' },
];

/* Maps frontend pill IDs to backend query params */
const BACKEND_FILTER: Record<string, { kategoria?: string; podkategoria?: string }> = {
  'all': {},
  'kawa': { kategoria: 'Kawa' },
  'kawa-ziarnista': { kategoria: 'Kawa', podkategoria: 'Ziarnista' },
  'kawa-mielona': { kategoria: 'Kawa', podkategoria: 'Mielona' },
  'kawa-espresso': { kategoria: 'Kawa', podkategoria: 'Espresso' },
  'kawa-coldbrew': { kategoria: 'Kawa', podkategoria: 'Cold Brew' },
  'kawa-specialty': { kategoria: 'Kawa', podkategoria: 'Specialty' },
  'kawa-rozpuszczalna': { kategoria: 'Kawa', podkategoria: 'Rozpuszczalna' },
  'herbata': { kategoria: 'Herbata' },
  'herbata-zielona': { kategoria: 'Herbata', podkategoria: 'Zielona' },
  'herbata-czarna': { kategoria: 'Herbata', podkategoria: 'Czarna' },
  'herbata-biala': { kategoria: 'Herbata', podkategoria: 'Biała' },
  'herbata-oolong': { kategoria: 'Herbata', podkategoria: 'Oolong' },
  'herbata-ziolowa': { kategoria: 'Herbata', podkategoria: 'Ziołowa' },
  'herbata-puerh': { kategoria: 'Herbata', podkategoria: 'Pu-erh' },
  'dodatki': { kategoria: 'Dodatki' },
  'dodatki-syropy': { kategoria: 'Dodatki', podkategoria: 'Syropy' },
  'dodatki-mleka': { kategoria: 'Dodatki', podkategoria: 'Mleka roślinne' },
  'dodatki-slodziki': { kategoria: 'Dodatki', podkategoria: 'Słodziki' },
  'dodatki-przyprawy': { kategoria: 'Dodatki', podkategoria: 'Przyprawy' },
  'bestseller': {},
};

const PRODUCTS: Product[] = [
  { id: 1, category: 'ziarnista', name: 'Ethiopia Yirgacheffe', subtitle: 'Kawa ziarnista single origin', tags: ['100% Arabica', 'Single Origin', 'Owocowy'], price: 89, weight: '250g', rating: 4.8, reviews: 124, color: '#8B6642', desc: 'Delikatna, kwiatowa z nutami czarnej porzeczki i bergamotki.', image: '/images/prod1.jpg' },
  { id: 2, category: 'espresso', name: 'Roma Classico', subtitle: 'Kawa do espresso blend', tags: ['Arabica & Robusta', 'Intensywny', 'Ciemny Palnik'], price: 72, weight: '250g', rating: 4.6, reviews: 87, color: '#5C3520', desc: 'Klasyczne włoskie espresso — głęboka gorzkość, kremowa pianka.', image: '/images/prod2.jpg' },
  { id: 3, category: 'zielona', name: 'Sencha Kyoto Premium', subtitle: 'Herbata zielona japońska', tags: ['Japan', 'Umami', 'Wiosenny Zbiór'], price: 64, weight: '100g', rating: 4.9, reviews: 203, color: '#6B8C6B', desc: 'Świeża, trawiasta z delikatną słodyczą i charakterystycznym umami.', image: '/images/prod3.jpg' },
  { id: 4, category: 'czarna', name: 'Darjeeling First Flush', subtitle: 'Herbata czarna górska', tags: ['India', 'First Flush', 'Muskatelowy'], price: 78, weight: '100g', rating: 4.7, reviews: 156, color: '#A0522D', desc: 'Szlachetna, z nutami muscatel i świeżego siana.', image: '/images/prod4.jpg' },
  { id: 5, category: 'matcha', name: 'Matcha Ceremonial Grade', subtitle: 'Matcha ceremonial Uji', tags: ['Uji Japan', 'Ceremonial', 'L-Teanina'], price: 112, weight: '30g', rating: 5.0, reviews: 89, color: '#4A7A4A', desc: 'Jedwabista, intensywnie zielona, bez goryczy.', image: '/images/prod5.jpg' },
  { id: 6, category: 'syropy', name: 'Syrop Lawendowy', subtitle: 'Syrop do kawy i herbaty', tags: ['Naturalny', 'Prowansja', 'Bez GMO'], price: 34, weight: '250ml', rating: 4.5, reviews: 61, color: '#8E7AB5', desc: 'Delikatny kwiatowy aromat — idealny do flat white i herbat.', image: '/images/prod6.jpg' },
  { id: 7, category: 'ziarnista', name: 'Rwanda Bourbon Reserve', subtitle: 'Kawa ziarnista specialty', tags: ['100% Arabica', 'Specialty', 'Czerwone Owoce'], price: 95, weight: '250g', rating: 4.8, reviews: 42, color: '#9E4A2A', desc: 'Soczysta, winna — maliny i hibiskus w każdym łyku.', image: '/images/prod7.jpg' },
  { id: 8, category: 'czarna', name: 'Earl Grey Royal', subtitle: 'Herbata czarna z bergamotką', tags: ['Ceylon', 'Bergamotka', 'Klasyk'], price: 48, weight: '100g', rating: 4.6, reviews: 178, color: '#6B5B8A', desc: 'Elegancki, cytrusowy aromat bergamotki na cejlońskiej bazie.', image: '/images/prod8.jpg' },
  { id: 9, category: 'ziarnista', name: 'Colombia Huila Supremo', subtitle: 'Kawa ziarnista premium', tags: ['100% Arabica', 'Supremo', 'Czekoladowy'], price: 79, weight: '250g', rating: 4.7, reviews: 93, color: '#6B4C3B', desc: 'Bogata, pełna ciała z nutami ciemnej czekolady i karmelu.', image: '/images/prod1.jpg' },
  { id: 10, category: 'espresso', name: 'Napoli Intenso', subtitle: 'Kawa do espresso premium', tags: ['Arabica & Robusta', 'Extra Intenso', 'Włoski'], price: 68, weight: '250g', rating: 4.5, reviews: 112, color: '#3C2415', desc: 'Potężny, gęsty body z długim finiszem i nutami kakao.', image: '/images/prod2.jpg' },
  { id: 11, category: 'zielona', name: 'Dragon Well Longjing', subtitle: 'Herbata zielona chińska', tags: ['China', 'Pan Fired', 'Orzechowy'], price: 82, weight: '100g', rating: 4.8, reviews: 67, color: '#7A9A5A', desc: 'Słynna herbata z Hangzhou — orzechowy smak i aksamitna tekstura.', image: '/images/prod3.jpg' },
  { id: 12, category: 'specialty', name: 'Cold Brew Blend', subtitle: 'Kawa do cold brew', tags: ['Cold Brew', 'Smooth', 'Niskie Kwasy'], price: 58, weight: '250g', rating: 4.6, reviews: 145, color: '#4A6741', desc: 'Specjalny blend do parzenia na zimno — słodki, gładki, orzeźwiający.', image: '/images/prod7.jpg' },
];

const BANNERS = [
  {
    tag: 'Flash Sale',
    title: 'Ethiopia Yirgacheffe',
    sub: 'Kawa single origin z regionu Sidamo — teraz 25% taniej.',
    cta: 'Kup teraz — 89 zł',
    badge: '-25%',
    color: '#8B6642',
    bg: 'linear-gradient(125deg,#2C1208,#1A0A02)',
    accent: '#C4882A',
  },
  {
    tag: 'Promocja',
    title: '2 + 1 GRATIS',
    sub: 'Kup dwie herbaty zielone, trzecią dostaniesz zupełnie za darmo.',
    cta: 'Wybierz herbaty',
    badge: '2+1',
    color: '#6B8C6B',
    bg: 'linear-gradient(125deg,#0C1A0C,#060E06)',
    accent: '#8BBF8B',
  },
  {
    tag: 'Dostawa',
    title: 'Gratis od 150 zł',
    sub: 'Darmowa dostawa na terenie całej Polski. Ekspresowa w 24h.',
    cta: 'Sprawdź',
    badge: 'FREE',
    color: '#5C8A9E',
    bg: 'linear-gradient(125deg,#081420,#040C14)',
    accent: '#7AB0C8',
  },
];



const STEPS = [
  { num: '01', title: 'Wybierz', desc: 'Przeglądaj naszą kolekcję ponad 240 odmian kawy i herbaty. Użyj filtrów aby znaleźć swój idealny smak.', icon: (color: string) => <ICoffee size={42} stroke={color} /> },
  { num: '02', title: 'Zamów', desc: 'Dodaj produkty do koszyka i sfinalizuj zamówienie w 2 minuty. Darmowa dostawa od 150 zł.', icon: (color: string) => <ICart size={42} stroke={color} sw={1.2} /> },
  { num: '03', title: 'Delektuj się', desc: 'Odbierz paczkę w 24h i ciesz się świeżo paloną kawą oraz aromatyczną herbatą.', icon: (color: string) => <ISparkles size={42} stroke={color} /> },
];

const TWEAK_DEFAULTS: TweakState = {
  accentColor: '#5C8A9E',
  heroHeading: 'Odkryj smak prawdziwej natury',
  showRatings: true,
  gridCols: '3',
};

/* ═══════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════ */
const formatPrice = (p: number) => `${p} zł`;

/* ═══════════════════════════════════════════════════════════
   ICONS
   ═══════════════════════════════════════════════════════════ */
const Ic = ({ d, size = 20, stroke = '#1C1209', sw = 1.5, fill = 'none' }: { d: string; size?: number; stroke?: string; sw?: number; fill?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);

const ISearch = (p: any) => <Ic {...p} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />;
const ICart = (p: any) => <Ic {...p} d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />;
const IUser = (p: any) => <Ic {...p} d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />;
const IX = (p: any) => <Ic {...p} d="M18 6L6 18M6 6l12 12" />;
const ICheck = (p: any) => <Ic {...p} d="M20 6L9 17l-5-5" />;
const IMinus = (p: any) => <Ic {...p} d="M5 12h14" />;
const IPlus = (p: any) => <Ic {...p} d="M12 5v14M5 12h14" />;
const IChevDown = (p: any) => <Ic {...p} d="M6 9l6 6 6-6" />;

const IStar = ({ filled, size = 13 }: { filled: boolean; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? '#C4882A' : 'none'} stroke="#C4882A" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const ITruck = ({ size = 24, stroke = '#1C1209' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"></rect>
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
    <circle cx="5.5" cy="18.5" r="2.5"></circle>
    <circle cx="18.5" cy="18.5" r="2.5"></circle>
  </svg>
);

const IReturn = ({ size = 24, stroke = '#1C1209' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 14 4 9 9 4"></polyline>
    <path d="M20 20v-7a4 4 0 0 0-4-4H4"></path>
  </svg>
);

const IZap = ({ size = 24, stroke = '#1C1209' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

const ILeaf = ({ size = 24, stroke = '#1C1209' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
  </svg>
);

const ILock = ({ size = 24, stroke = '#1C1209' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const ICoffee = ({ size = 24, stroke = '#1C1209' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
    <line x1="6" y1="1" x2="6" y2="4"></line>
    <line x1="10" y1="1" x2="10" y2="4"></line>
    <line x1="14" y1="1" x2="14" y2="4"></line>
  </svg>
);

const ISparkles = ({ size = 24, stroke = '#1C1209' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
    <path d="M5 3v4"></path>
    <path d="M19 17v4"></path>
    <path d="M3 5h4"></path>
    <path d="M17 19h4"></path>
  </svg>
);

const TRUST_ITEMS = [
  { icon: <ITruck size={28} stroke="#C4882A" />, title: 'Darmowa dostawa', desc: 'Od 150 zł' },
  { icon: <IReturn size={28} stroke="#C4882A" />, title: '30 dni na zwrot', desc: 'Bez podawania przyczyny' },
  { icon: <IZap size={28} stroke="#C4882A" />, title: 'Wysyłka 24h', desc: 'Ekspresowa dostawa' },
  { icon: <ILeaf size={28} stroke="#C4882A" />, title: '100% naturalne', desc: 'Certyfikowane źródła' },
  { icon: <ILock size={28} stroke="#C4882A" />, title: 'Bezpieczna płatność', desc: 'SSL & szyfrowanie' },
];

const Stars = ({ rating }: { rating: number }) => (
  <div style={{ display: 'flex', gap: 2 }}>
    {[1, 2, 3, 4, 5].map(i => <IStar key={i} filled={i <= Math.round(rating)} size={12} />)}
  </div>
);

/* ═══════════════════════════════════════════════════════════
   MEGA MENU
   ═══════════════════════════════════════════════════════════ */
const MegaMenu = ({ open, section, accent, onCatClick }: { open: boolean; section: string | null; accent: string; onCatClick: (id: string) => void }) => {
  const items = section ? MEGA[section] || [] : [];
  return (
    <div style={{ 
      overflow: 'hidden', 
      transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
      maxHeight: open && section ? 600 : 0, 
      opacity: open && section ? 1 : 0,
      background: 'rgba(250,247,242,0.97)', 
      borderTop: open && section ? '1px solid #E8DDD0' : '1px solid transparent',
      boxShadow: open && section ? '0 16px 48px rgba(28,18,9,0.09)' : 'none'
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 48px 40px' }}>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: accent, marginBottom: 24, fontWeight: 500 }}>{section}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
          {items.map(it => (
            <button key={it.id} onClick={() => onCatClick(it.id)} className="step-card"
              style={{ textAlign: 'left', padding: '16px', borderRadius: 14, background: '#F5EFE6', border: '1px solid #EDE5D8', cursor: 'pointer', transition: 'all .2s ease' }}
              onMouseEnter={e => { e.currentTarget.style.background = `${accent}14`; e.currentTarget.style.borderColor = `${accent}50`; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#F5EFE6'; e.currentTarget.style.borderColor = '#EDE5D8'; }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${accent}18`, marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MegaIcon id={it.id} color={accent} size={18} /></div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 500, color: '#1C1209', marginBottom: 4, lineHeight: 1.3 }}>{it.label}</p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: '#9E7A5A', lineHeight: 1.4 }}>{it.sub}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   NAVBAR
   ═══════════════════════════════════════════════════════════ */
const useAuth = () => {
  const [email, setEmail] = useState<string | null>(() => localStorage.getItem('user_email'));
  useEffect(() => {
    const sync = () => setEmail(localStorage.getItem('user_email'));
    window.addEventListener('auth-change', sync);
    window.addEventListener('storage', sync);
    return () => { window.removeEventListener('auth-change', sync); window.removeEventListener('storage', sync); };
  }, []);
  const logout = () => {
    ['access_token', 'id_token', 'refresh_token', 'user_email'].forEach(k => localStorage.removeItem(k));
    window.dispatchEvent(new Event('auth-change'));
  };
  return { email, isAuthed: !!email, logout };
};

const AuthControl = ({ accent, onCartClick }: { accent: string; onCartClick: () => void }) => {
  const { email, isAuthed, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  if (!isAuthed) return (
    <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 20px', borderRadius: 24, background: '#1C1209', color: '#FAF7F2', border: 'none', fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 400, letterSpacing: '.03em', transition: 'background .2s ease', cursor: 'pointer', textDecoration: 'none' }}
      onMouseEnter={e => e.currentTarget.style.background = accent}
      onMouseLeave={e => e.currentTarget.style.background = '#1C1209'}>
      <IUser size={15} stroke="#FAF7F2" />Zaloguj się
    </Link>
  );
  const initial = (email || '?').charAt(0).toUpperCase();
  const items: { label: string; onClick?: () => void; icon: any }[] = [
    { label: 'Moje konto', icon: <IUser size={15} stroke="#5C3D1E" /> },
    { label: 'Ustawienia', icon: <Ic d="M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" size={15} stroke="#5C3D1E" /> },
    { label: 'Koszyk', icon: <ICart size={15} stroke="#5C3D1E" />, onClick: () => { setOpen(false); onCartClick(); } },
  ];
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px 6px 6px', borderRadius: 24, background: '#1C1209', color: '#FAF7F2', border: 'none', fontFamily: "'DM Sans',sans-serif", fontSize: 13, cursor: 'pointer', transition: 'background .2s ease' }}
        onMouseEnter={e => e.currentTarget.style.background = accent}
        onMouseLeave={e => e.currentTarget.style.background = '#1C1209'}>
        <span style={{ width: 28, height: 28, borderRadius: '50%', background: accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond',serif", fontSize: 15, fontWeight: 500 }}>{initial}</span>
        <span style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email}</span>
        <IChevDown size={12} stroke="#FAF7F2" />
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, minWidth: 240, background: '#FAF7F2', border: '1px solid #E8DDD0', borderRadius: 14, boxShadow: '0 12px 32px rgba(28,18,9,.12)', padding: 8, zIndex: 200 }}>
          <div style={{ padding: '10px 14px 12px', borderBottom: '1px solid #F2EBE0', marginBottom: 6 }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: '#9E7A5A', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 3 }}>Zalogowano jako</p>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#1C1209', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{email}</p>
          </div>
          {items.map(it => (
            <button key={it.label} onClick={it.onClick || (() => setOpen(false))} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#1C1209', borderRadius: 8, textAlign: 'left', transition: 'background .15s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#F2EBE0'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              {it.icon}{it.label}
            </button>
          ))}
          <div style={{ borderTop: '1px solid #F2EBE0', marginTop: 6, paddingTop: 6 }}>
            <button onClick={() => { logout(); setOpen(false); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#A04040', borderRadius: 8, textAlign: 'left', transition: 'background .15s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#FCEBEB'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <Ic d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" size={15} stroke="#A04040" />
              Wyloguj się
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Navbar = ({ cartCount, onCartClick, searchQuery, setSearchQuery, accent, onCatFilter, cartBump }: {
  cartCount: number; onCartClick: () => void; searchQuery: string; setSearchQuery: (s: string) => void;
  accent: string; onCatFilter: (id: string) => void; cartBump: boolean;
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState<string | null>(null);
  const navSections = ['Kawy', 'Herbaty', 'Dodatki i Syropy'];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(250,247,242,0.96)' : 'rgba(250,247,242,0.7)',
        backdropFilter: 'blur(14px)',
        borderBottom: scrolled && !megaOpen ? '1px solid #E8DDD0' : '1px solid transparent',
        transition: 'background .4s ease, border-bottom .4s ease'
      }}
        onMouseLeave={() => setMegaOpen(null)}>
        <div style={{ padding: '0 48px' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32 }}>
          {/* logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flexShrink: 0 }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: `${accent}20`, border: `1.5px solid ${accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 13, height: 13, borderRadius: '50%', background: accent }} />
            </div>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 500, color: '#1C1209', letterSpacing: '.02em' }}>AromaBrew</span>
          </div>

          {/* nav */}
          <div className="hidden md:flex" style={{ gap: 36, alignItems: 'center' }}>
            {navSections.map(s => (
              <button key={s} className={`nav-link${megaOpen === s ? ' active' : ''}`}
                onMouseEnter={() => setMegaOpen(s)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: megaOpen === s ? 500 : 400, color: megaOpen === s ? accent : '#5C3D1E', letterSpacing: '.02em', transition: 'color .2s', display: 'flex', alignItems: 'center', gap: 4 }}>
                {s}<IChevDown size={12} stroke={megaOpen === s ? accent : '#9E7A5A'} />
              </button>
            ))}
          </div>

          {/* right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: searchOpen ? '#F2EBE0' : 'transparent', borderRadius: 24, padding: searchOpen ? '6px 14px' : '6px', transition: 'all .3s ease' }}>
              {searchOpen && <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Szukaj..."
                style={{ border: 'none', background: 'transparent', outline: 'none', fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: '#1C1209', width: 140 }} />}
              <button onClick={() => { setSearchOpen(!searchOpen); if (searchOpen) setSearchQuery(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}>
                {searchOpen ? <IX size={17} stroke="#5C3D1E" /> : <ISearch size={17} stroke="#5C3D1E" />}
              </button>
            </div>

            <button onClick={onCartClick} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 4 }}>
              <ICart size={20} stroke="#5C3D1E" />
              {cartCount > 0 && (
                <span className={cartBump ? 'bump' : ''} style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: '50%', background: accent, color: '#fff', fontSize: 10, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans',sans-serif" }}>{cartCount}</span>
              )}
            </button>

            <AuthControl accent={accent} onCartClick={onCartClick} />
          </div>
        </div>
        </div>

        <MegaMenu open={!!megaOpen} section={megaOpen} accent={accent} onCatClick={id => { onCatFilter(id); setMegaOpen(null); }} />
      </nav>
    </>
  );
};

/* ═══════════════════════════════════════════════════════════
   CART DRAWER
   ═══════════════════════════════════════════════════════════ */
const CartDrawer = ({ cart, open, onClose, onAdd, onRemove, accent }: {
  cart: CartItem[]; open: boolean; onClose: () => void;
  onAdd: (p: Product) => void; onRemove: (id: number) => void; accent: string;
}) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const PREVIEW = 4;
  const hasMore = cart.length > PREVIEW;
  const visible = expanded ? cart : cart.slice(0, PREVIEW);
  const total = cart.reduce((s, p) => s + p.price * p.qty, 0);

  useEffect(() => { if (!open) setExpanded(false); }, [open]);
  if (!open) return null;

  return (
    <div className="fade-in" onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 150, background: 'rgba(28,18,9,0.35)', backdropFilter: 'blur(3px)' }}>
      <div className="slide-right" onClick={e => e.stopPropagation()} style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 420, maxWidth: '90vw', background: '#FAF7F2', display: 'flex', flexDirection: 'column', boxShadow: '-20px 0 60px rgba(28,18,9,0.12)' }}>
        <div style={{ padding: '28px 28px 20px', borderBottom: '1px solid #E8DDD0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: accent, marginBottom: 4, fontWeight: 500 }}>Twój koszyk</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 400, color: '#1C1209' }}>{cart.length} {cart.length === 1 ? 'produkt' : cart.length < 5 ? 'produkty' : 'produktów'}</h3>
          </div>
          <button onClick={onClose} style={{ width: 38, height: 38, borderRadius: '50%', background: '#F2EBE0', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IX size={16} stroke="#5C3D1E" />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 28px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <ICart size={40} stroke="#D0C4B8" />
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: '#9E7A5A', marginTop: 16 }}>Koszyk jest pusty</p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: '#D0C4B8', marginTop: 8 }}>Dodaj coś pysznego!</p>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {visible.map((p, i) => (
                  <div key={p.id} className="fade-up" style={{ animationDelay: `${i * 0.04}s`, display: 'flex', gap: 14, padding: '14px', background: '#fff', borderRadius: 16, border: '1px solid #F2EBE0', alignItems: 'center' }}>
                    <div style={{ width: 60, height: 60, borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
                      <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, fontWeight: 500, color: '#1C1209', lineHeight: 1.2, marginBottom: 2 }}>{p.name}</p>
                      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: '#9E7A5A', marginBottom: 8 }}>{p.weight}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <button onClick={() => onRemove(p.id)} style={{ width: 26, height: 26, borderRadius: '50%', background: '#F2EBE0', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#E8DDD0'}
                          onMouseLeave={e => e.currentTarget.style.background = '#F2EBE0'}>
                          <IMinus size={12} stroke="#5C3D1E" />
                        </button>
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 500, color: '#1C1209', minWidth: 14, textAlign: 'center' }}>{p.qty}</span>
                        <button onClick={() => onAdd(p)} style={{ width: 26, height: 26, borderRadius: '50%', background: '#F2EBE0', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#E8DDD0'}
                          onMouseLeave={e => e.currentTarget.style.background = '#F2EBE0'}>
                          <IPlus size={12} stroke="#5C3D1E" />
                        </button>
                      </div>
                    </div>
                    <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 500, color: '#1C1209', flexShrink: 0 }}>{p.price * p.qty} zł</p>
                  </div>
                ))}
              </div>
              {hasMore && !expanded && (
                <button onClick={() => setExpanded(true)} style={{ width: '100%', marginTop: 10, padding: '12px', borderRadius: 12, background: 'transparent', border: '1.5px dashed #D0C4B8', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#9E7A5A', transition: 'all .2s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#D0C4B8'; e.currentTarget.style.color = '#9E7A5A'; }}>
                  + Pokaż więcej ({cart.length - PREVIEW} produktów)
                </button>
              )}
            </>
          )}
        </div>

        {cart.length > 0 && (
          <div style={{ padding: '20px 28px 28px', borderTop: '1px solid #E8DDD0', flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#7A5C3A' }}>Łącznie</span>
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 500, color: '#1C1209' }}>{total} zł</span>
            </div>
            <button onClick={() => { onClose(); navigate('/kasa'); }} className="btn-primary" style={{ width: '100%', padding: '15px', borderRadius: 14, background: '#1C1209', color: '#FAF7F2', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 400, letterSpacing: '.04em' }}
              onMouseEnter={e => e.currentTarget.style.background = accent}
              onMouseLeave={e => e.currentTarget.style.background = '#1C1209'}>
              Przejdź do kasy
            </button>
            <button onClick={onClose} style={{ width: '100%', padding: '11px', marginTop: 8, borderRadius: 14, background: 'transparent', color: '#9E7A5A', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
              Kontynuuj zakupy
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   CATEGORY PILLS
   ═══════════════════════════════════════════════════════════ */
const CatPills = ({ active, setActive, accent }: { active: string; setActive: (id: string) => void; accent: string }) => (
  <div style={{ padding: '0 48px', marginBottom: 44 }}>
    <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {CATS.map(c => {
        const on = active === c.id;
        return (
          <button key={c.id} className="pill" onClick={() => setActive(c.id)}
            style={{ padding: '9px 20px', borderRadius: 30, border: on ? 'none' : '1.5px solid #E8DDD0', background: on ? accent : 'transparent', color: on ? '#fff' : '#5C3D1E', fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: on ? 500 : 400, cursor: 'pointer', boxShadow: on ? `0 4px 14px ${accent}38` : 'none', transform: on ? 'scale(1.02)' : 'scale(1)' }}>
            {c.label}
          </button>
        );
      })}
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   PRODUCT CARD
   ═══════════════════════════════════════════════════════════ */
const ProductCard = ({ product, onAdd, accent, showRatings }: { product: Product; onAdd: (p: Product) => void; accent: string; showRatings: boolean }) => {
  const [added, setAdded] = useState(false);
  const handle = () => { onAdd(product); setAdded(true); setTimeout(() => setAdded(false), 1800); };
  return (
    <div className="card" style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1px solid #F2EBE0', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ height: 240, position: 'relative', flexShrink: 0, overflow: 'hidden' }}>
        <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
        <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(250,247,242,0.9)', borderRadius: 10, padding: '3px 10px', backdropFilter: 'blur(6px)' }}>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 14, fontWeight: 500, color: '#1C1209' }}>{product.weight}</span>
        </div>
      </div>
      <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: '#9E7A5A', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 4 }}>{product.subtitle}</p>
        <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 21, fontWeight: 500, color: '#1C1209', marginBottom: 6, lineHeight: 1.2 }}>{product.name}</h3>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: '#7A5C3A', marginBottom: 10, lineHeight: 1.6, fontWeight: 300 }}>{product.desc}</p>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12 }}>
          {product.tags.map(t => (
            <span key={t} style={{ padding: '2px 9px', borderRadius: 20, background: `${product.color}13`, color: product.color, fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 500 }}>{t}</span>
          ))}
        </div>
        {showRatings && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
            <Stars rating={product.rating} />
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: '#9E7A5A' }}>{product.rating} ({product.reviews})</span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 500, color: '#1C1209' }}>{formatPrice(product.price)}</span>
          <button onClick={handle} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 22, background: added ? '#6B8C6B' : accent, color: '#fff', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 400, transition: 'all .3s ease', boxShadow: `0 4px 14px ${added ? '#6B8C6B' : accent}38` }}>
            {added ? <><ICheck size={13} stroke="#fff" /> Dodano</> : '+ Koszyk'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ICoffeeBean = ({ size = 24, color = '#1C1209', angle = 0 }: { size?: number, color?: string, angle?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: `rotate(${angle}deg)`, opacity: 0.3 }}>
    <ellipse cx="12" cy="12" rx="7" ry="10" fill={`${color}20`} />
    <path d="M10.5 4.5c1.5 3-1.5 9 1 15" />
  </svg>
);

const AnimatedBackground = ({ accent }: { accent: string }) => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, #FAF7F2 0%, ${accent}0A 100%)` }} />
    
    <div className="float-anim" style={{ position: 'absolute', top: '15%', left: '8%', animationDuration: '8s' }}>
      <ICoffeeBean size={54} color={accent} angle={-20} />
    </div>
    <div className="float-anim" style={{ position: 'absolute', top: '65%', left: '12%', animationDuration: '12s', animationDelay: '1s' }}>
      <div style={{ transform: 'rotate(30deg)', opacity: 0.3 }}><ILeaf size={64} stroke={accent} /></div>
    </div>
    <div className="float-anim" style={{ position: 'absolute', top: '25%', left: '45%', animationDuration: '9s', animationDelay: '2s' }}>
      <ICoffeeBean size={42} color={accent} angle={45} />
    </div>
    <div className="float-anim" style={{ position: 'absolute', top: '75%', left: '55%', animationDuration: '10s', animationDelay: '0.5s' }}>
      <div style={{ transform: 'rotate(-25deg)', opacity: 0.3 }}><ILeaf size={50} stroke={accent} /></div>
    </div>
    <div className="float-anim" style={{ position: 'absolute', top: '12%', right: '25%', animationDuration: '11s', animationDelay: '1.5s' }}>
      <ICoffeeBean size={48} color={accent} angle={70} />
    </div>
    <div className="float-anim" style={{ position: 'absolute', top: '85%', right: '15%', animationDuration: '8.5s', animationDelay: '3s' }}>
      <ICoffeeBean size={36} color={accent} angle={-40} />
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════════════════ */
const Hero = ({ onCTA, accent, heading }: { onCTA: () => void; accent: string; heading: string }) => (
  <section style={{ position: 'relative', minHeight: '90vh', overflow: 'hidden', background: '#FAF7F2' }}>
    <AnimatedBackground accent={accent} />
    {/* Decorative circles */}
    <div style={{ position: 'absolute', right: '-8%', top: '45%', transform: 'translateY(-50%)', width: '45vw', height: '45vw', maxWidth: 640, maxHeight: 640, borderRadius: '50%', background: '#F2EBE0', opacity: 0.7 }} />
    <div style={{ position: 'absolute', right: '8%', top: '50%', transform: 'translateY(-50%)', width: '30vw', height: '30vw', maxWidth: 420, maxHeight: 420, borderRadius: '50%', background: `${accent}16` }} />

    {/* Hero image */}
    <div className="float-anim hidden lg:block" style={{ position: 'absolute', right: '6%', top: '50%', transform: 'translateY(-50%)', zIndex: 1, width: 380, height: 520, borderRadius: 24, overflow: 'hidden', boxShadow: '0 28px 72px rgba(28,18,9,0.15)' }}>
      <img src="/images/hero.jpg" alt="Kawa i herbata premium" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>

    <div style={{ position: 'relative', zIndex: 2, maxWidth: 1280, margin: '0 auto', padding: '80px 48px 80px', width: '100%' }}>
      <div className="fade-up" style={{ maxWidth: 540 }}>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: '.14em', color: accent, textTransform: 'uppercase', marginBottom: 22, fontWeight: 500 }}>Specialty Coffee & Premium Tea</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(44px, 5vw, 72px)', fontWeight: 300, color: '#1C1209', lineHeight: 1.1, marginBottom: 26, letterSpacing: '-.01em' }}>{heading}</h1>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: '#7A5C3A', lineHeight: 1.7, marginBottom: 38, fontWeight: 300, maxWidth: 400 }}>Starannie selekcjonowane kawy single origin i herbaty z najlepszych regionów świata. Każdy łyk to podróż.</p>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
          <button onClick={onCTA} className="btn-primary" style={{ padding: '13px 34px', borderRadius: 30, background: '#1C1209', color: '#FAF7F2', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13, letterSpacing: '.04em' }}
            onMouseEnter={e => e.currentTarget.style.background = accent}
            onMouseLeave={e => e.currentTarget.style.background = '#1C1209'}>
            Zobacz nowości
          </button>
          <button style={{ padding: '13px 34px', borderRadius: 30, background: 'transparent', color: '#1C1209', border: '1.5px solid #E8DDD0', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13, transition: 'all .2s ease' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8DDD0'; e.currentTarget.style.color = '#1C1209'; }}>
            O nas
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="fade-up" style={{ display: 'flex', gap: 44, marginTop: 72, paddingTop: 36, borderTop: '1px solid #E8DDD0', flexWrap: 'wrap' }}>
        {[['240+', 'Odmian kawy i herbaty'], ['18', 'Krajów origin'], ['12k+', 'Zadowolonych klientów'], ['4.9', 'Średnia ocena']].map(([n, l]) => (
          <div key={n}>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 30, fontWeight: 500, color: '#1C1209', lineHeight: 1 }}>{n}</p>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: '#9E7A5A', marginTop: 4, letterSpacing: '.05em' }}>{l}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════
   TRUST BAR
   ═══════════════════════════════════════════════════════════ */
const TrustBar = () => (
  <section style={{ padding: '40px 48px', background: '#FAF7F2', borderBottom: '1px solid #E8DDD0', borderTop: '1px solid #E8DDD0' }}>
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
        {TRUST_ITEMS.map((item, i) => (
          <div key={i} className="trust-item" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', background: '#fff', borderRadius: 16, border: '1px solid #F2EBE0' }}>
            <span className="trust-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: 12, background: 'rgba(196,136,42,0.1)' }}>{item.icon}</span>
            <div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 500, color: '#1C1209', marginBottom: 2 }}>{item.title}</p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: '#9E7A5A' }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════
   HOW IT WORKS
   ═══════════════════════════════════════════════════════════ */
const HowItWorks = ({ accent }: { accent: string }) => (
  <section style={{ padding: '100px 48px', background: '#FAF7F2' }}>
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: '.14em', color: accent, textTransform: 'uppercase', marginBottom: 16, fontWeight: 500 }}>Jak to działa</p>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(36px, 3.5vw, 52px)', fontWeight: 300, color: '#1C1209', lineHeight: 1.15 }}>
          Trzy kroki do <em style={{ color: accent }}> idealnego naparu</em>
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 30 }}>
        {STEPS.map((step, i) => (
          <div key={i} className="step-card" style={{ background: '#fff', borderRadius: 22, padding: '40px 36px', border: '1px solid #F2EBE0', textAlign: 'center', position: 'relative' }}>
            <span style={{ position: 'absolute', top: 20, right: 24, fontFamily: "'Cormorant Garamond',serif", fontSize: 64, fontWeight: 300, color: `${accent}12`, lineHeight: 1 }}>{step.num}</span>
            <span style={{ display: 'flex', justifyContent: 'center', marginBottom: 24, padding: '16px', background: `${accent}0A`, borderRadius: 20, width: 'fit-content', margin: '0 auto 24px' }}>{step.icon(accent)}</span>
            <h4 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 500, color: '#1C1209', marginBottom: 12 }}>{step.title}</h4>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#7A5C3A', lineHeight: 1.7, fontWeight: 300 }}>{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════
   PROMO BANNERS
   ═══════════════════════════════════════════════════════════ */
const PromoBanners = () => (
  <section style={{ padding: '0 48px 80px' }}>
    <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
      {BANNERS.map((b, i) => (
        <div key={i} style={{ background: b.bg, borderRadius: 22, padding: '32px 30px', position: 'relative', overflow: 'hidden', cursor: 'pointer', transition: 'transform .3s ease, box-shadow .3s ease', border: `1px solid ${b.color}30` }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 20px 48px ${b.color}25`; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
          <div style={{ position: 'absolute', top: -14, right: -14, width: 90, height: 90, borderRadius: '50%', background: `${b.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: `${b.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 600, color: b.accent, letterSpacing: '-.01em' }}>{b.badge}</span>
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: -40, left: -30, width: 180, height: 180, borderRadius: '50%', background: `${b.color}08` }} />
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: '.14em', color: b.accent, textTransform: 'uppercase', marginBottom: 12, fontWeight: 500 }}>{b.tag}</p>
          <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 400, color: '#FAF7F2', marginBottom: 10, lineHeight: 1.2 }}>{b.title}</h3>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'rgba(250,247,242,.5)', lineHeight: 1.6, marginBottom: 24, fontWeight: 300, maxWidth: 260 }}>{b.sub}</p>
          <button style={{ padding: '9px 20px', borderRadius: 20, border: `1.5px solid ${b.accent}60`, background: 'transparent', color: b.accent, fontFamily: "'DM Sans',sans-serif", fontSize: 12, cursor: 'pointer', letterSpacing: '.03em', transition: 'all .2s ease' }}
            onMouseEnter={e => { e.currentTarget.style.background = `${b.accent}20`; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
            {b.cta}
          </button>
        </div>
      ))}
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════
   ABOUT SECTION
   ═══════════════════════════════════════════════════════════ */
const AboutSection = ({ accent }: { accent: string }) => (
  <section style={{ background: '#1C1209', padding: '100px 48px' }}>
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
      {/* header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 72, paddingBottom: 40, borderBottom: '1px solid rgba(255,255,255,.08)', flexWrap: 'wrap', gap: 24 }}>
        <div style={{ maxWidth: 520 }}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: '.14em', color: accent, textTransform: 'uppercase', marginBottom: 16, fontWeight: 500 }}>O nas</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(36px, 3.5vw, 56px)', fontWeight: 300, color: '#FAF7F2', lineHeight: 1.12 }}>
            Jesteśmy obsesyjnie zakochani<br /><em>w każdym ziarnku</em>
          </h2>
        </div>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: 'rgba(250,247,242,.4)', lineHeight: 1.8, maxWidth: 320, fontWeight: 300 }}>
          Od 2018 roku ręcznie selekcjonujemy najlepsze kawy i herbaty ze 18 krajów świata. Każdy produkt przechodzi rygorystyczną ocenę naszych Q-Graderów.
        </p>
      </div>

      {/* Image */}
      <div style={{ marginBottom: 80, borderRadius: 20, overflow: 'hidden', maxHeight: 400 }}>
        <img src="/images/about.jpg" alt="Nasza palarnia" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} />
      </div>

      {/* 3 pillars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2, marginBottom: 80 }}>
        {[
          { num: '01', title: 'Bezpośrednie relacje', body: 'Współpracujemy bezpośrednio z farmerami w Etiopii, Rwandzie, Japonii i Indiach. Płacimy minimum 30% powyżej ceny rynkowej — bo dobra kawa zaczyna się od uczciwego handlu.', color: '#C4882A' },
          { num: '02', title: 'Świeże palenie', body: 'Każda partia kawy jest palona na zamówienie w naszej mikro-palarni w Krakowie. Wysyłamy wyłącznie kawę paloną nie wcześniej niż 48h przed wysyłką.', color: accent },
          { num: '03', title: 'Certyfikowane źródła herbaty', body: 'Nasze herbaty pochodzą z certyfikowanych ogrodów herbaciarskich. Współpracujemy z mistrzem herbaty z Kioto, który osobiście dobiera każdy zbiór.', color: '#8BBF8B' },
        ].map(p => (
          <div key={p.num} style={{ padding: '44px 40px', background: 'rgba(255,255,255,.03)', borderLeft: '1px solid rgba(255,255,255,.06)' }}>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 48, fontWeight: 300, color: `${p.color}30`, lineHeight: 1, display: 'block', marginBottom: 20 }}>{p.num}</span>
            <h4 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 400, color: '#FAF7F2', marginBottom: 14, lineHeight: 1.2 }}>{p.title}</h4>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'rgba(250,247,242,.4)', lineHeight: 1.8, fontWeight: 300 }}>{p.body}</p>
          </div>
        ))}
      </div>

      {/* testimonials */}
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: '.14em', color: accent, textTransform: 'uppercase', marginBottom: 32, fontWeight: 500 }}>Co mówią klienci</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        {[
          { q: 'Najlepsza kawa jaką piłam poza Etiopią. Filiżanka Yirgacheffe to jak podróż.', name: 'Zofia K.', loc: 'Warszawa', stars: 5 },
          { q: 'Matcha ceremonial grade zachwyciła mnie już od pierwszego przygotowania. Jedwabista i bez goryczy.', name: 'Tomasz M.', loc: 'Kraków', stars: 5 },
          { q: 'Syrop lawendowy zupełnie zmienił moje poranne flat white. Zamawiałem już cztery razy.', name: 'Ania W.', loc: 'Gdańsk', stars: 5 },
        ].map((r, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,.04)', borderRadius: 18, padding: '28px 28px', border: '1px solid rgba(255,255,255,.06)' }}>
            <div style={{ display: 'flex', gap: 3, marginBottom: 18 }}>
              {[1, 2, 3, 4, 5].map(s => (
                <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill="#C4882A" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
              ))}
            </div>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 19, fontStyle: 'italic', color: 'rgba(250,247,242,.8)', lineHeight: 1.55, marginBottom: 20 }}>"{r.q}"</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${accent}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, color: accent, fontWeight: 500 }}>{r.name[0]}</span>
              </div>
              <div>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'rgba(250,247,242,.7)', fontWeight: 500 }}>{r.name}</p>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: 'rgba(250,247,242,.3)' }}>{r.loc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════
   NEWSLETTER
   ═══════════════════════════════════════════════════════════ */
const Newsletter = ({ accent }: { accent: string }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('@')) {
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <section style={{ padding: '100px 48px', background: `${accent}08` }}>
      <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: '.14em', color: accent, textTransform: 'uppercase', marginBottom: 16, fontWeight: 500 }}>Newsletter</p>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(32px, 3vw, 48px)', fontWeight: 300, color: '#1C1209', lineHeight: 1.15, marginBottom: 16 }}>
          Zapisz się i zgarnij <span style={{ color: accent }}>10% rabatu</span>
        </h2>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: '#7A5C3A', lineHeight: 1.7, marginBottom: 36, fontWeight: 300 }}>
          Co tydzień wysyłamy nowości, przepisy i ekskluzywne oferty. Żadnego spamu — tylko dobra kawa i herbata.
        </p>

        {submitted ? (
          <div className="fade-up" style={{ padding: '24px', background: '#fff', borderRadius: 16, border: `1px solid ${accent}40`, display: 'inline-flex', alignItems: 'center', gap: 12 }}>
            <ICheck size={20} stroke="#6B8C6B" />
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: '#1C1209' }}>Dziękujemy! Sprawdź swoją skrzynkę.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, maxWidth: 480, margin: '0 auto', flexWrap: 'wrap' }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Twój adres email"
              required
              className="newsletter-input"
              style={{ flex: 1, minWidth: 220, padding: '14px 22px', borderRadius: 30, border: '1.5px solid #E8DDD0', background: '#fff', fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: '#1C1209', outline: 'none', transition: 'all .2s ease' }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '14px 32px', borderRadius: 30, background: '#1C1209', color: '#FAF7F2', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13, letterSpacing: '.04em', whiteSpace: 'nowrap' }}
              onMouseEnter={e => e.currentTarget.style.background = accent}
              onMouseLeave={e => e.currentTarget.style.background = '#1C1209'}>
              Zapisz się
            </button>
          </form>
        )}

        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: '#9E7A5A', marginTop: 20 }}>
          Zapisując się, akceptujesz naszą politykę prywatności. Wypisz się w dowolnym momencie.
        </p>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════════ */
const Footer = ({ accent }: { accent: string }) => (
  <footer style={{ borderTop: '1px solid #E8DDD0', padding: '60px 48px 30px', background: '#1C1209' }}>
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 48, marginBottom: 48 }}>
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: `${accent}20`, border: `1.5px solid ${accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 13, height: 13, borderRadius: '50%', background: accent }} />
            </div>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 500, color: '#FAF7F2', letterSpacing: '.02em' }}>AromaBrew</span>
          </div>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'rgba(250,247,242,.4)', lineHeight: 1.7, fontWeight: 300, marginBottom: 20 }}>
            Specialty Coffee & Premium Tea od 2018. Ręcznie selekcjonowane, z pasją dostarczane.
          </p>
          <div style={{ display: 'flex', gap: 14 }}>
            {['IG', 'FB', 'YT'].map(social => (
              <span key={social} style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: 'rgba(250,247,242,.5)', cursor: 'pointer', transition: 'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = accent; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.06)'; e.currentTarget.style.color = 'rgba(250,247,242,.5)'; }}>
                {social}
              </span>
            ))}
          </div>
        </div>

        {/* Links - Shop */}
        <div>
          <h4 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: accent, marginBottom: 20, fontWeight: 500 }}>Sklep</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Kawa Ziarnista', id: 'ziarnista' },
              { label: 'Kawa Espresso', id: 'espresso' },
              { label: 'Herbata Zielona', id: 'zielona' },
              { label: 'Herbata Czarna', id: 'czarna' },
              { label: 'Matcha', id: 'matcha' },
              { label: 'Syropy', id: 'syropy' },
              { label: 'Akcesoria', id: 'akcesoria' },
            ].map(l => (
              <Link key={l.id} to={`/?cat=${l.id}`} className="footer-link" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'rgba(250,247,242,.4)', textDecoration: 'none', cursor: 'pointer' }}>{l.label}</Link>
            ))}
          </div>
        </div>

        {/* Links - Info */}
        <div>
          <h4 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: accent, marginBottom: 20, fontWeight: 500 }}>Informacje</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Link to="/o-nas" className="footer-link" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'rgba(250,247,242,.4)', textDecoration: 'none', cursor: 'pointer' }}>O nas</Link>
            <Link to="/dostawa" className="footer-link" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'rgba(250,247,242,.4)', textDecoration: 'none', cursor: 'pointer' }}>Dostawa</Link>
            <Link to="/zwroty" className="footer-link" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'rgba(250,247,242,.4)', textDecoration: 'none', cursor: 'pointer' }}>Zwroty i reklamacje</Link>
            <Link to="/polityka-prywatnosci" className="footer-link" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'rgba(250,247,242,.4)', textDecoration: 'none', cursor: 'pointer' }}>Polityka prywatności</Link>
            <Link to="/regulamin" className="footer-link" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'rgba(250,247,242,.4)', textDecoration: 'none', cursor: 'pointer' }}>Regulamin</Link>
            <Link to="/blog" className="footer-link" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'rgba(250,247,242,.4)', textDecoration: 'none', cursor: 'pointer' }}>Blog</Link>
            <Link to="/kontakt" className="footer-link" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'rgba(250,247,242,.4)', textDecoration: 'none', cursor: 'pointer' }}>Kontakt</Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: accent, marginBottom: 20, fontWeight: 500 }}>Kontakt</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'rgba(250,247,242,.4)', lineHeight: 1.6 }}>
              AromaBrew Sp. z o.o.<br />
              ul. Kawowa 42<br />
              30-001 Kraków
            </p>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'rgba(250,247,242,.4)', lineHeight: 1.6 }}>
              hello@aromabrew.pl<br />
              +48 123 456 789
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              {['blik', 'visa', 'mastercard'].map(p => (
                <span key={p} style={{ padding: '4px 10px', background: 'rgba(255,255,255,.06)', borderRadius: 6, fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: 'rgba(250,247,242,.4)', textTransform: 'uppercase' }}>{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,.06)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: 'rgba(250,247,242,.25)', letterSpacing: '.04em' }}>© 2026 AromaBrew · Specialty Coffee & Tea</span>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: 'rgba(250,247,242,.25)' }}>Made with ☕ in Kraków</span>
      </div>
    </div>
  </footer>
);

/* ═══════════════════════════════════════════════════════════
   TWEAKS PANEL
   ═══════════════════════════════════════════════════════════ */
const TweaksPanel = ({ tweaks, setTweaks, visible }: { tweaks: TweakState; setTweaks: React.Dispatch<React.SetStateAction<TweakState>>; visible: boolean }) => {
  if (!visible) return null;
  const upd = (k: keyof TweakState, v: any) => { const n = { ...tweaks, [k]: v }; setTweaks(n); };
  const colors = ['#5C8A9E', '#C4882A', '#6B8C6B', '#8E7AB5', '#A0522D'];
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 300, background: '#FAF7F2', border: '1px solid #E8DDD0', borderRadius: 20, padding: '22px 24px', width: 280, boxShadow: '0 16px 48px rgba(28,18,9,.13)' }}>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: '#9E7A5A', marginBottom: 18, fontWeight: 500 }}>Tweaks</p>
      <div style={{ marginBottom: 18 }}>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: '#5C3D1E', marginBottom: 10 }}>Kolor akcentu</p>
        <div style={{ display: 'flex', gap: 8 }}>
          {colors.map(c => (
            <button key={c} onClick={() => upd('accentColor', c)} style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: tweaks.accentColor === c ? '3px solid #1C1209' : '2px solid transparent', cursor: 'pointer', transition: 'transform .15s', transform: tweaks.accentColor === c ? 'scale(1.2)' : 'scale(1)' }} />
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 18 }}>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: '#5C3D1E', marginBottom: 8 }}>Hasło hero</p>
        <input value={tweaks.heroHeading} onChange={e => upd('heroHeading', e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1.5px solid #E8DDD0', borderRadius: 10, fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: '#1C1209', background: '#fff', outline: 'none' }} />
      </div>
      <div style={{ marginBottom: 18 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <div onClick={() => upd('showRatings', !tweaks.showRatings)} style={{ width: 38, height: 22, borderRadius: 12, background: tweaks.showRatings ? tweaks.accentColor : '#E8DDD0', transition: 'background .2s', position: 'relative', flexShrink: 0 }}>
            <div style={{ position: 'absolute', top: 3, left: tweaks.showRatings ? 18 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left .2s', boxShadow: '0 1px 4px rgba(0,0,0,.2)' }} />
          </div>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: '#5C3D1E' }}>Pokaż oceny</span>
        </label>
      </div>
      <div>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: '#5C3D1E', marginBottom: 8 }}>Kolumny</p>
        <div style={{ display: 'flex', gap: 6 }}>
          {['2', '3', '4'].map(n => (
            <button key={n} onClick={() => upd('gridCols', n)} style={{ flex: 1, padding: '6px', borderRadius: 8, border: tweaks.gridCols === n ? 'none' : '1.5px solid #E8DDD0', background: tweaks.gridCols === n ? tweaks.accentColor : 'transparent', color: tweaks.gridCols === n ? '#fff' : '#5C3D1E', fontFamily: "'DM Sans',sans-serif", fontSize: 12, cursor: 'pointer' }}>{n}</button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════════ */
function Home({ cart, setCart }: { cart: CartItem[], setCart: React.Dispatch<React.SetStateAction<CartItem[]>> }) {
  const [tweaks, setTweaks] = useState<TweakState>(TWEAK_DEFAULTS);
  
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [cartBump, setCartBump] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const productsRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const API = (import.meta.env.VITE_PRODUCTS_API as string) || 'http://localhost:8002/api/v1';

  /* Map product names (lowercase) → dedicated image files in /images/ */
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

  const mapRows = useCallback((rows: any[]): Product[] => {
    const fallbackImgs = ['/images/prod1.jpg','/images/prod2.jpg','/images/prod3.jpg','/images/prod4.jpg','/images/prod5.jpg','/images/prod6.jpg','/images/prod7.jpg','/images/prod8.jpg'];
    const colorMap: Record<string, string> = { 'Kawa': '#6B4C3B', 'Herbata': '#6B8C6B', 'Dodatki': '#8E7AB5' };
    return rows.map((r, i) => {
      const nameKey = (r.nazwa || '').toLowerCase();
      const dedicatedImg = NAME_TO_IMAGE[nameKey];
      return {
      id: 1000 + (r.id ?? i),
      category: (r.podkategoria || r.kategoria || '').toLowerCase(),
      name: r.nazwa,
      subtitle: r.podkategoria || r.kategoria || 'Z bazy danych',
      tags: [r.kraj_pochodzenia, r.kategoria, r.podkategoria].filter(Boolean),
      price: Number(r.cena) || 0,
      weight: r.waga_g ? `${r.waga_g}${r.jednostka === 'ml' ? 'ml' : 'g'}` : (r.jednostka || ''),
      rating: Number(r.ocena) || 0,
      reviews: 0,
      color: colorMap[r.kategoria] || '#6B4C3B',
      desc: r.opis || '',
      image: dedicatedImg || fallbackImgs[i % fallbackImgs.length],
    };
    });
  }, []);

  const fetchProducts = useCallback((catId: string) => {
    setLoading(true);
    const filter = BACKEND_FILTER[catId] || {};
    const params = new URLSearchParams();
    if (filter.kategoria) params.set('kategoria', filter.kategoria);
    if (filter.podkategoria) params.set('podkategoria', filter.podkategoria);
    const qs = params.toString();
    const url = `${API}/products${qs ? `?${qs}` : ''}`;

    fetch(url)
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then((rows: any[]) => {
        let mapped = mapRows(rows);
        // 'bestseller' = kliencki filtr po ocenie
        if (catId === 'bestseller') mapped = mapped.filter(p => p.rating >= 4.7);
        setDbProducts(mapped);
      })
      .catch(err => console.warn('Nie udało się pobrać produktów z backendu:', err))
      .finally(() => setLoading(false));
  }, [API, mapRows]);

  // Initial load + re-fetch when category changes
  useEffect(() => {
    fetchProducts(category);
  }, [category, fetchProducts]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('cat');
    if (cat) {
      // Map old-style URL params (e.g. ?cat=ziarnista) to new pill IDs
      const oldToNew: Record<string, string> = {
        'ziarnista': 'kawa-ziarnista', 'espresso': 'kawa-espresso',
        'zielona': 'herbata-zielona', 'czarna': 'herbata-czarna',
        'syropy': 'dodatki', 'matcha': 'herbata',
      };
      setCategory(oldToNew[cat] || cat);
      setTimeout(() => productsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [location.search]);

  useEffect(() => { setCurrentPage(1); }, [category, searchQuery]);

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const ex = prev.find(p => p.id === product.id);
      return ex ? prev.map(p => p.id === product.id ? { ...p, qty: p.qty + 1 } : p) : [...prev, { ...product, qty: 1 }];
    });
    setCartBump(true); setTimeout(() => setCartBump(false), 400);
    setCartOpen(true);
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setCart(prev => {
      const ex = prev.find(p => p.id === id);
      if (ex && ex.qty > 1) return prev.map(p => p.id === id ? { ...p, qty: p.qty - 1 } : p);
      return prev.filter(p => p.id !== id);
    });
  }, []);

  const cartCount = cart.reduce((s, p) => s + p.qty, 0);
  const accent = tweaks.accentColor;

  // Search is still client-side on the fetched set
  const filtered = dbProducts.filter(p => {
    const q = searchQuery.toLowerCase();
    return !q || p.name.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q)) || p.subtitle.toLowerCase().includes(q);
  });

  const cols = parseInt(tweaks.gridCols) || 3;

  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2', ['--accent-color' as any]: accent }}>
      <Navbar cartCount={cartCount} onCartClick={() => setCartOpen(true)} searchQuery={searchQuery} setSearchQuery={setSearchQuery} accent={accent} onCatFilter={id => { setCategory(id); productsRef.current?.scrollIntoView({ behavior: 'smooth' }); }} cartBump={cartBump} />

      <Hero onCTA={() => productsRef.current?.scrollIntoView({ behavior: 'smooth' })} accent={accent} heading={tweaks.heroHeading} />

      <TrustBar />

      <PromoBanners />

      {/* Products section */}
      <section ref={productsRef} style={{ padding: '80px 48px 100px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ marginBottom: 44, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: '.12em', color: accent, textTransform: 'uppercase', marginBottom: 8, fontWeight: 500 }}>Kolekcja</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 46, fontWeight: 300, color: '#1C1209' }}>
                {searchQuery ? `Wyniki dla "${searchQuery}"` : 'Nasze produkty'}
              </h2>
            </div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#9E7A5A' }}>{filtered.length} produktów</p>
          </div>

          <CatPills active={category} setActive={setCategory} accent={accent} />

          {filtered.length === 0 ? (
            <div className="fade-up" style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ fontSize: 48, marginBottom: 16 }}>🔍</p>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, color: '#1C1209', marginBottom: 12 }}>Brak wyników</p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: '#9E7A5A', marginBottom: 24 }}>Spróbuj innej frazy lub kategorii.</p>
              <button onClick={() => { setSearchQuery(''); setCategory('all'); }} className="btn-primary" style={{ padding: '10px 24px', borderRadius: 24, background: accent, color: '#fff', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
                Wyczyść filtry
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 26 }}>
                {filtered.slice((currentPage - 1) * 6, currentPage * 6).map((p, i) => (
                  <div key={p.id} className="fade-up" style={{ animationDelay: `${(i % 6) * .07}s`, height: '100%' }}>
                    <ProductCard product={p} onAdd={addToCart} accent={accent} showRatings={tweaks.showRatings} />
                  </div>
                ))}
              </div>
              
              {Math.ceil(filtered.length / 6) > 1 && (
                <div className="fade-up" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 48 }}>
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ padding: '8px 18px', borderRadius: 20, border: '1px solid #E8DDD0', background: 'transparent', color: '#5C3D1E', fontFamily: "'DM Sans',sans-serif", fontSize: 13, cursor: currentPage === 1 ? 'default' : 'pointer', opacity: currentPage === 1 ? 0.3 : 1, transition: 'all .2s ease' }}
                    onMouseEnter={e => { if (currentPage > 1) { e.currentTarget.style.background = '#F2EBE0'; } }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                    Poprzednia
                  </button>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {Array.from({ length: Math.ceil(filtered.length / 6) }).map((_, i) => (
                      <button key={i} onClick={() => setCurrentPage(i + 1)} style={{ width: 34, height: 34, borderRadius: '50%', border: currentPage === i + 1 ? 'none' : '1px solid #E8DDD0', background: currentPage === i + 1 ? accent : 'transparent', color: currentPage === i + 1 ? '#fff' : '#1C1209', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s ease' }}>
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setCurrentPage(p => Math.min(Math.ceil(filtered.length / 6), p + 1))} disabled={currentPage === Math.ceil(filtered.length / 6)} style={{ padding: '8px 18px', borderRadius: 20, border: '1px solid #E8DDD0', background: 'transparent', color: '#5C3D1E', fontFamily: "'DM Sans',sans-serif", fontSize: 13, cursor: currentPage === Math.ceil(filtered.length / 6) ? 'default' : 'pointer', opacity: currentPage === Math.ceil(filtered.length / 6) ? 0.3 : 1, transition: 'all .2s ease' }}
                    onMouseEnter={e => { if (currentPage < Math.ceil(filtered.length / 6)) { e.currentTarget.style.background = '#F2EBE0'; } }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                    Następna
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <HowItWorks accent={accent} />

      <AboutSection accent={accent} />

      <Newsletter accent={accent} />

      <Footer accent={accent} />

      <CartDrawer cart={cart} open={cartOpen} onClose={() => setCartOpen(false)} onAdd={addToCart} onRemove={removeFromCart} accent={accent} />
      <TweaksPanel tweaks={tweaks} setTweaks={setTweaks} visible={false} />
    </div>
  );
}

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home cart={cart} setCart={setCart} />} />
        <Route path="/kasa" element={<Kasa cart={cart} setCart={setCart} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/polityka-prywatnosci" element={<PolitykaPrywatnosci />} />
        <Route path="/regulamin" element={<Regulamin />} />
        <Route path="/o-nas" element={<ONas />} />
        <Route path="/dostawa" element={<Dostawa />} />
        <Route path="/zwroty" element={<Zwroty />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/kontakt" element={<Kontakt />} />
      </Routes>
      <ChatBot />
    </>
  );
}
