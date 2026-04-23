import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import './Login.css';

const USER_API = (import.meta.env.VITE_USER_API as string) || 'http://localhost:8001/api/v1';

const ACCENT = '#5C8A9E';
const SCENE_MS = 5400;

/* ── icons ─────────────────────────────── */
const Ic = ({ d, size = 18, stroke = '#FAF7F2', sw = 1.5 }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);
const IEye = (p: any) => <Ic {...p} d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z" />;
const IEyeOff = (p: any) => <Ic {...p} d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" />;
const ICheck = (p: any) => <Ic {...p} d="M20 6L9 17l-5-5" />;
const IArrowL = (p: any) => <Ic {...p} d="M19 12H5M12 5l-7 7 7 7" />;
const IMail = (p: any) => <Ic {...p} d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6" />;
const IUser = (p: any) => <Ic {...p} d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />;
const IMap = (p: any) => <Ic {...p} d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0zM12 13a3 3 0 100-6 3 3 0 000 6z" />;
const IHome = (p: any) => <Ic {...p} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2zM9 22V12h6v10" />;
const ICal = (p: any) => <Ic {...p} d="M8 7V3M16 7V3M3 11h18M5 5h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />;

/* ══════════════════════════════════════════
   ILLUSTRATION COMPONENTS
══════════════════════════════════════════ */

/* ── Coffee Cup ─────────────────────────── */
const CoffeeCup = ({ flipped = false }) => (
  <svg viewBox="0 0 90 98" width="90" height="98" style={{ transform: flipped ? 'scale(-1,1)' : 'none', overflow: 'visible' }}>
    <ellipse cx="45" cy="93" rx="36" ry="7" fill="#6B3808" opacity=".5" />
    <ellipse cx="45" cy="91" rx="36" ry="7" fill="#C4882A" opacity=".75" />
    <path d="M14 37 L20 84 L70 84 L76 37 Q45 31 14 37Z" fill="#F6EEE2" stroke="#DDC9A8" strokeWidth="1.5" />
    <ellipse cx="45" cy="38" rx="27" ry="8" fill="#2C1208" />
    <ellipse cx="40" cy="36" rx="10" ry="4" fill="#4A2012" opacity=".5" />
    <ellipse cx="45" cy="37" rx="28" ry="8" fill="none" stroke="#DDC9A8" strokeWidth="1.5" />
    <path d="M76 47 Q98 49 98 63 Q98 77 76 73" fill="none" stroke="#DEB880" strokeWidth="5" strokeLinecap="round" />
    <path d="M76 47 Q94 49 94 63 Q94 75 76 73" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="2" strokeLinecap="round" />
    <path d="M32 29 Q28 20 32 11" fill="none" stroke="#C8B898" strokeWidth="2" strokeLinecap="round" style={{ animation: 'steam-a 1.9s ease-in-out infinite', animationDelay: '0s' }} />
    <path d="M45 27 Q41 18 45 9" fill="none" stroke="#C8B898" strokeWidth="2" strokeLinecap="round" style={{ animation: 'steam-b 1.9s ease-in-out infinite', animationDelay: '.45s' }} />
    <path d="M58 29 Q54 20 58 11" fill="none" stroke="#C8B898" strokeWidth="2" strokeLinecap="round" style={{ animation: 'steam-c 1.9s ease-in-out infinite', animationDelay: '.2s' }} />
  </svg>
);

/* ── Elegant Teapot (pour scene) ───────── */
const ElegantTeapot = ({ flipped = false }: { flipped?: boolean }) => (
  <svg viewBox="0 0 165 155" width="165" height="155" style={{ transform: flipped ? 'scale(-1,1)' : 'none', overflow: 'visible' }}>
    <defs>
      <radialGradient id="tpBodyG" cx="33%" cy="28%">
        <stop offset="0%" stopColor="#EAB040" />
        <stop offset="60%" stopColor="#B07820" />
        <stop offset="100%" stopColor="#7A4A08" />
      </radialGradient>
      <radialGradient id="tpLidG" cx="30%" cy="25%">
        <stop offset="0%" stopColor="#D4A030" />
        <stop offset="100%" stopColor="#8A5010" />
      </radialGradient>
    </defs>
    {/* shadow */}
    <ellipse cx="84" cy="149" rx="46" ry="7" fill="rgba(0,0,0,.3)" />
    {/* body base */}
    <ellipse cx="84" cy="87" rx="44" ry="36" fill="#7A4008" />
    {/* body */}
    <ellipse cx="84" cy="84" rx="44" ry="36" fill="url(#tpBodyG)" />
    {/* decorative band */}
    <path d="M40 90 Q84 97 128 90" stroke="#E0B030" strokeWidth="3.5" fill="none" />
    <path d="M42 82 Q84 89 126 82" stroke="#E0B030" strokeWidth="1.2" fill="none" opacity=".45" />
    {[0, 1, 2, 3, 4, 5, 6].map(i => (
      <circle key={i} cx={47 + i * 12} cy={91} r="2" fill="#F0C040" opacity=".7" />
    ))}
    {/* ornate dot border */}
    <path d="M40 90 Q84 97 128 90 Q128 96 84 99 Q40 96 40 90Z" fill="#C49020" opacity=".25" />
    {/* sheen */}
    <ellipse cx="70" cy="68" rx="15" ry="11" fill="rgba(255,255,255,.13)" transform="rotate(-22,70,68)" />
    <ellipse cx="78" cy="64" rx="6" ry="4" fill="rgba(255,255,255,.08)" transform="rotate(-22,78,64)" />
    {/* spout – elegant 2-curve shape */}
    <path d="M127 79 Q150 62 155 44" stroke="#6A3808" strokeWidth="12" strokeLinecap="round" fill="none" />
    <path d="M127 79 Q150 62 155 44" stroke="#B07820" strokeWidth="8" strokeLinecap="round" fill="none" />
    <path d="M127 79 Q150 62 155 44" stroke="#E8B840" strokeWidth="3" strokeLinecap="round" fill="none" opacity=".35" />
    {/* spout inner highlight */}
    <path d="M130 76 Q152 60 156 44" stroke="rgba(255,255,255,.1)" strokeWidth="2" strokeLinecap="round" fill="none" />
    {/* handle – ornate D-shape */}
    <path d="M40 72 Q12 72 12 88 Q12 104 40 98" stroke="#6A3808" strokeWidth="10" strokeLinecap="round" fill="none" />
    <path d="M40 72 Q16 72 16 88 Q16 102 40 98" stroke="#D4A030" strokeWidth="5.5" strokeLinecap="round" fill="none" />
    <path d="M40 72 Q18 72 18 88 Q18 100 40 98" stroke="rgba(255,255,255,.1)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    {/* handle rivets */}
    <circle cx="40" cy="72" r="3.5" fill="#C4882A" stroke="#6A3808" strokeWidth="1" />
    <circle cx="40" cy="98" r="3.5" fill="#C4882A" stroke="#6A3808" strokeWidth="1" />
    {/* lid */}
    <ellipse cx="84" cy="49" rx="24" ry="6" fill="#6A3808" />
    <ellipse cx="84" cy="47" rx="24" ry="6" fill="url(#tpLidG)" stroke="#6A3808" strokeWidth="1.5" />
    <path d="M60 47 Q84 37 108 47" fill="#C49030" stroke="#6A3808" strokeWidth="1.2" />
    {/* knob */}
    <circle cx="84" cy="36" r="8" fill="#6A3808" />
    <circle cx="84" cy="34" r="8" fill="url(#tpLidG)" stroke="#6A3808" strokeWidth="1.5" />
    <circle cx="80" cy="30" r="3" fill="rgba(255,255,255,.4)" />
  </svg>
);

/* ── Tea Glass (with embossed pattern) ─── */
const TeaGlass = ({ animDur = SCENE_MS }) => {
  const s = `${animDur}ms`;
  return (
    <svg viewBox="0 0 84 170" width="84" height="170" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="teaFillG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D4A030" stopOpacity=".9" />
          <stop offset="50%" stopColor="#A06820" stopOpacity=".8" />
          <stop offset="100%" stopColor="#7A4808" stopOpacity=".75" />
        </linearGradient>
        <clipPath id="glassClip2">
          <path d="M11 28 L7 160 L77 160 L73 28 Z" />
        </clipPath>
        <linearGradient id="glassShineG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(210,240,230,.18)" />
          <stop offset="40%" stopColor="rgba(210,240,230,.04)" />
          <stop offset="100%" stopColor="rgba(210,240,230,.0)" />
        </linearGradient>
      </defs>
      {/* shadow */}
      <ellipse cx="42" cy="165" rx="36" ry="6" fill="rgba(0,0,0,.32)" />
      {/* glass body outline */}
      <path d="M10 26 L6 158 L78 158 L74 26 Z" fill="rgba(210,240,230,.04)" stroke="rgba(210,240,230,.55)" strokeWidth="1.5" />
      {/* vertical ribs */}
      {[0, 1, 2, 3, 4, 5].map(i => (
        <line key={`v${i}`} x1={13 + i * 11} y1={95} x2={11 + i * 11} y2={156} stroke="rgba(210,240,230,.16)" strokeWidth="1.2" />
      ))}
      {/* horizontal bands */}
      {[95, 112, 130, 148].map((y, i) => (
        <path key={`h${i}`} d={`M${11 + i * .5} ${y} Q42 ${y - 4} ${73 - i * .5} ${y}`} stroke="rgba(210,240,230,.13)" strokeWidth="1" fill="none" />
      ))}
      {/* diamond dots at intersections */}
      {[0, 1, 2, 3, 4].map(col => [95, 112, 130].map((row, ri) => (
        <rect key={`d${col}${ri}`} x={14 + col * 11} y={row - 1.5} width="3" height="3" fill="rgba(210,240,230,.2)" transform={`rotate(45 ${15.5 + col * 11} ${row})`} />
      )))}
      {/* tea fill */}
      <g clipPath="url(#glassClip2)">
        <rect x="0" y="0" width="84" height="170" fill="url(#teaFillG)"
          style={{ transformOrigin: '42px 160px', animation: `tea-fill-rise ${s} ease forwards` }} />
      </g>
      {/* left-side glass shine */}
      <path d="M14 38 L10 148" stroke="url(#glassShineG)" strokeWidth="5" strokeLinecap="round" />
      <path d="M22 42 L19 110" stroke="rgba(255,255,255,.07)" strokeWidth="2.5" strokeLinecap="round" />
      {/* rim */}
      <ellipse cx="42" cy="26" rx="33" ry="8.5" fill="rgba(210,240,230,.06)" stroke="rgba(210,240,230,.6)" strokeWidth="1.5" />
      {/* bottom */}
      <ellipse cx="42" cy="158" rx="37" ry="6" fill="rgba(210,240,230,.05)" stroke="rgba(210,240,230,.28)" strokeWidth="1" />
      {/* steam after pour */}
      <path d="M30 18 Q26 5 30 -7" stroke="rgba(210,190,140,.6)" strokeWidth="1.8" fill="none" strokeLinecap="round" style={{ animation: `glass-steam-a ${s} ease forwards` }} />
      <path d="M42 16 Q38 3 42 -9" stroke="rgba(210,190,140,.5)" strokeWidth="1.8" fill="none" strokeLinecap="round" style={{ animation: `glass-steam-b ${s} ease forwards` }} />
      <path d="M54 18 Q50 4 54 -8" stroke="rgba(210,190,140,.55)" strokeWidth="1.8" fill="none" strokeLinecap="round" style={{ animation: `glass-steam-c ${s} ease forwards` }} />
    </svg>
  );
};

/* ── Pour Scene (teapot + glass) ──────── */
const PourScene = ({ animDur = SCENE_MS }) => {
  const s = `${animDur}ms`;
  return (
    <div style={{ position: 'relative', width: 290, height: 195 }}>
      {/* glass */}
      <div style={{ position: 'absolute', left: 8, top: 25, animation: `pour-scene-fade ${s} ease forwards` }}>
        <TeaGlass animDur={animDur} />
      </div>
      {/* tea stream overlay */}
      <svg style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' }} viewBox="0 0 290 195" width="290" height="195">
        <path d="M135 24 Q 90 20 50 51" fill="none" stroke="#C4882A" strokeWidth="4" strokeLinecap="round"
          style={{ animation: `pour-stream-show ${s} ease forwards` }} />
        <path d="M135 24 Q 90 20 50 51" fill="none" stroke="#EAC060" strokeWidth="1.8" strokeLinecap="round" opacity=".5"
          style={{ animation: `pour-stream-show ${s} ease forwards` }} />
        <circle cx="50" cy="53" r="3" fill="#C4882A" style={{ animation: `pour-stream-show ${s} ease forwards` }} />
        <circle cx="54" cy="58" r="2" fill="#C4882A" opacity=".7" style={{ animation: `pour-stream-show ${s} ease forwards` }} />
      </svg>
      {/* teapot */}
      <div style={{
        position: 'absolute', right: 0, top: -20,
        animation: `teapot-tilt ${s} ease forwards`,
        transformOrigin: '10px 44px'
      }}>
        <ElegantTeapot flipped={true} />
      </div>
    </div>
  );
};

/* ── Improved Iced Americano ─────────── */
const IcedCup = ({ flipped = false, animDur = SCENE_MS }) => {
  const s = `${animDur}ms`;
  return (
    <svg viewBox="0 0 72 138" width="72" height="138" style={{ transform: flipped ? 'scale(-1,1)' : 'none', overflow: 'visible' }}>
      <defs>
        <linearGradient id={`iceGrad${flipped ? 'R' : 'L'}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E0C04" stopOpacity=".95" />
          <stop offset="70%" stopColor="#150802" stopOpacity=".92" />
          <stop offset="100%" stopColor="#0E0502" stopOpacity=".88" />
        </linearGradient>
        <linearGradient id={`glassWallG${flipped ? 'R' : 'L'}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(210,235,245,.22)" />
          <stop offset="15%" stopColor="rgba(210,235,245,.06)" />
          <stop offset="85%" stopColor="rgba(210,235,245,.03)" />
          <stop offset="100%" stopColor="rgba(210,235,245,.14)" />
        </linearGradient>
        <clipPath id={`cupClip${flipped ? 'R' : 'L'}`}>
          <path d="M2 16 L12 128 L60 128 L70 16 Z" />
        </clipPath>
      </defs>
      {/* shadow */}
      <ellipse cx="36" cy="132" rx="26" ry="5" fill="rgba(0,0,0,.35)" />
      {/* coffee liquid */}
      <g clipPath={`url(#cupClip${flipped ? 'R' : 'L'})`}>
        <rect x="0" y="0" width="72" height="138" fill={`url(#iceGrad${flipped ? 'R' : 'L'})`} />
        {/* subtle coffee texture / gradient at top */}
        <ellipse cx="36" cy="18" rx="32" ry="7" fill="rgba(100,50,20,.4)" />
        {/* crema ring */}
        <ellipse cx="36" cy="18" rx="28" ry="5.5" fill="none" stroke="rgba(200,120,40,.3)" strokeWidth="2" />
      </g>
      
      {/* Starbucks Logo Circle */}
      <g transform="translate(36, 75)">
        <circle cx="0" cy="0" r="14" fill="#00704A" />
        <circle cx="0" cy="0" r="11" fill="none" stroke="#FFF" strokeWidth="1" opacity="0.8" />
        <path d="M-5 4 Q 0 -5 5 4" fill="none" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="0" cy="-2" r="2.5" fill="#FFF" />
      </g>

      {/* glass wall – outer */}
      <path d="M2 16 L12 128 L60 128 L70 16 Z" fill={`url(#glassWallG${flipped ? 'R' : 'L'})`} stroke="rgba(210,235,245,.52)" strokeWidth="1.5" />
      {/* glass wall inner edge (thickness effect) */}
      <path d="M5 18 L14 127 L58 127 L67 18 Z" fill="none" stroke="rgba(210,235,245,.12)" strokeWidth="1" />
      
      {/* === ICE CUBES (isometric 3D look) === */}
      {/* Ice 1 */}
      <g style={{ animation: `ice-shake-a ${s} ease forwards` }}>
        <rect x="7" y="64" width="20" height="17" rx="2" fill="rgba(195,228,242,.68)" />
        <path d="M7 64 L11 58 L31 58 L27 64 Z" fill="rgba(228,248,255,.82)" />
        <path d="M27 64 L31 58 L31 75 L27 81 Z" fill="rgba(155,198,218,.58)" />
        <line x1="9" y1="68" x2="25" y2="68" stroke="rgba(255,255,255,.28)" strokeWidth=".9" />
        <line x1="15" y1="64" x2="15" y2="81" stroke="rgba(255,255,255,.22)" strokeWidth=".9" />
        <path d="M7 64 L7 81 L27 81" stroke="rgba(255,255,255,.1)" strokeWidth="1" fill="none" />
      </g>
      {/* Ice 2 */}
      <g style={{ animation: `ice-shake-b ${s} ease forwards`, transform: 'rotate(10deg)', transformOrigin: '46px 56px' }}>
        <rect x="36" y="50" width="17" height="22" rx="2" fill="rgba(190,225,240,.62)" />
        <path d="M36 50 L40 44 L57 44 L53 50 Z" fill="rgba(225,248,255,.78)" />
        <path d="M53 50 L57 44 L57 66 L53 72 Z" fill="rgba(150,195,215,.55)" />
        <line x1="38" y1="56" x2="51" y2="56" stroke="rgba(255,255,255,.26)" strokeWidth=".9" />
        <line x1="44" y1="50" x2="44" y2="72" stroke="rgba(255,255,255,.2)" strokeWidth=".9" />
      </g>
      {/* Ice 3 */}
      <g style={{ animation: `ice-shake-c ${s} ease forwards`, transform: 'rotate(-5deg)', transformOrigin: '28px 94px' }}>
        <rect x="10" y="88" width="22" height="14" rx="2" fill="rgba(195,228,242,.65)" />
        <path d="M10 88 L14 82 L36 82 L32 88 Z" fill="rgba(228,248,255,.8)" />
        <path d="M32 88 L36 82 L36 96 L32 102 Z" fill="rgba(155,198,218,.54)" />
        <line x1="12" y1="93" x2="30" y2="93" stroke="rgba(255,255,255,.25)" strokeWidth=".9" />
        <line x1="20" y1="88" x2="20" y2="102" stroke="rgba(255,255,255,.2)" strokeWidth=".9" />
      </g>
      
      {/* === DOME LID === */}
      <path d="M1 16 C 1 -8, 71 -8, 71 16" fill="rgba(210,235,245,.15)" stroke="rgba(210,235,245,.4)" strokeWidth="1.5" />
      <path d="M10 5 C 20 -5, 52 -5, 62 5" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="1.5" strokeLinecap="round" />
      <ellipse cx="36" cy="-2" rx="12" ry="3" fill="none" stroke="rgba(210,235,245,.6)" strokeWidth="1.5" />

      {/* === GREEN STRAW (straight) === */}
      <path d="M36 -32 L44 125" stroke="#00704A" strokeWidth="6" strokeLinecap="round" />
      <path d="M36 -32 L44 125" stroke="#006241" strokeWidth="2" strokeLinecap="round" opacity=".5" />
      <path d="M35 -31 L43 125" stroke="rgba(255,255,255,.2)" strokeWidth="1.5" strokeLinecap="round" />

      {/* rim */}
      <ellipse cx="36" cy="16" rx="34" ry="7" fill="rgba(210,235,245,.07)" stroke="rgba(210,235,245,.58)" strokeWidth="1.5" />
      <ellipse cx="36" cy="16" rx="32" ry="6" fill="none" stroke="rgba(210,235,245,.15)" strokeWidth="2.5" />
      {/* bottom */}
      <ellipse cx="36" cy="128" rx="24" ry="5" fill="rgba(210,235,245,.06)" stroke="rgba(210,235,245,.28)" strokeWidth="1" />
    </svg>
  );
};

/* ── Impact sparkle ──────────────────── */
const Spark = ({ color = '#FFF8E8', animDur = SCENE_MS }) => (
  <svg viewBox="0 0 60 60" width="60" height="60" style={{ animation: `impact-pop ${animDur}ms ease forwards`, position: 'absolute', pointerEvents: 'none' }}>
    {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
      <line key={i} x1="30" y1="30" x2={30 + 20 * Math.cos(a * Math.PI / 180)} y2={30 + 20 * Math.sin(a * Math.PI / 180)} stroke={color} strokeWidth={i % 2 === 0 ? 2 : 1.2} strokeLinecap="round" opacity={i % 2 === 0 ? 1 : .6} />
    ))}
    <circle cx="30" cy="30" r="4" fill={color} opacity=".9" />
  </svg>
);

/* ══════════════════════════════════════════
   SCENE MANAGER
══════════════════════════════════════════ */
const SCENES = [
  { id: 'coffee', label: 'Kawa Espresso', hint: 'Filiżanki single origin', spark: '#F0DEB0' },
  { id: 'pour', label: 'Herbata Premium', hint: 'Ceremonia nalewania' },
  { id: 'iced', label: 'Americano z lodem', hint: 'Cold brew w szklance', spark: '#A8D8EE' },
];

const AnimPanel = () => {
  const [scene, setScene] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => { setScene(s => (s + 1) % SCENES.length); setAnimKey(k => k + 1); }, SCENE_MS + 300);
    return () => clearTimeout(t);
  }, [scene]);

  const sc = SCENES[scene];
  const dur = SCENE_MS;
  const aL = { animation: `obj-left ${dur}ms cubic-bezier(.22,1,.36,1) forwards` };
  const aR = { animation: `obj-right ${dur}ms cubic-bezier(.22,1,.36,1) forwards` };

  return (
    <div style={{ position: 'relative', background: 'linear-gradient(155deg,#190E04,#0D0905)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '52px 52px 48px', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -80, right: -80, width: 420, height: 420, borderRadius: '50%', background: `${ACCENT}09` }} />
      <div style={{ position: 'absolute', bottom: -60, left: -40, width: 300, height: 300, borderRadius: '50%', background: 'rgba(196,136,42,.07)' }} />

      {/* logo */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${ACCENT}25`, border: `1.5px solid ${ACCENT}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 13, height: 13, borderRadius: '50%', background: ACCENT }} />
        </div>
        <span style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 22, fontWeight: 500, color: '#FAF7F2', letterSpacing: '.02em' }}>AromaBrew</span>
      </div>

      {/* animation stage */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* label */}
        <div key={`lbl-${animKey}`} style={{ animation: `label-show ${dur}ms ease forwards`, marginBottom: 20, textAlign: 'center' }}>
          <p style={{ fontFamily: 'DM Sans', fontSize: 11, letterSpacing: '.14em', color: ACCENT, textTransform: 'uppercase', marginBottom: 4, fontWeight: 500 }}>{sc.label}</p>
          <p style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 16, color: 'rgba(250,247,242,.38)', fontStyle: 'italic' }}>{sc.hint}</p>
        </div>

        {/* objects */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', minHeight: 185, gap: 0 }}>
          {scene === 1 ? (
            /* pour scene – special layout */
            <div key={`pour-${animKey}`}>
              <PourScene animDur={dur} />
            </div>
          ) : (
            <>
              {/* impact sparkle */}
              <div key={`spk-${animKey}`} style={{ position: 'absolute', top: '42%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 10 }}>
                <Spark color={sc.spark} animDur={dur} />
              </div>
              <div key={`l-${animKey}`} style={{ ...aL, display: 'flex', alignItems: 'flex-end' } as any}>
                {scene === 0 && <CoffeeCup flipped />}
                {scene === 2 && <IcedCup flipped />}
              </div>
              <div key={`r-${animKey}`} style={{ ...aR, display: 'flex', alignItems: 'flex-end' } as any}>
                {scene === 0 && <CoffeeCup />}
                {scene === 2 && <IcedCup />}
              </div>
            </>
          )}
        </div>

        {/* dots */}
        <div style={{ display: 'flex', gap: 8, marginTop: 22 }}>
          {SCENES.map((_, i) => (
            <div key={i} style={{ width: i === scene ? 24 : 8, height: 4, borderRadius: 4, background: i === scene ? ACCENT : 'rgba(255,255,255,.14)', transition: 'all .4s ease' }} />
          ))}
        </div>
      </div>

      {/* bottom */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <p style={{ fontFamily: 'DM Sans', fontSize: 11, letterSpacing: '.12em', color: ACCENT, textTransform: 'uppercase', marginBottom: 14, fontWeight: 500 }}>Twój świat smaku</p>
        <h2 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 36, fontWeight: 300, color: '#FAF7F2', lineHeight: 1.18, marginBottom: 18 }}>Poczuj różnicę<br />prawdziwego<br /><em>specialty</em></h2>
        <div style={{ display: 'flex', gap: 24 }}>
          {[['12k+', 'Klientów'], ['240+', 'Produktów'], ['18', 'Krajów']].map(([n, l]) => (
            <div key={n}>
              <p style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 22, fontWeight: 500, color: '#FAF7F2', lineHeight: 1 }}>{n}</p>
              <p style={{ fontFamily: 'DM Sans', fontSize: 10, color: 'rgba(250,247,242,.35)', marginTop: 3, letterSpacing: '.05em' }}>{l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   FORM COMPONENTS
══════════════════════════════════════════ */
const Field = ({ label, type = 'text', value, onChange, placeholder, error, icon, hint, min, max }: any) => {
  const [sp, setSp] = useState(false);
  const isP = type === 'password';
  return (
    <div className="field-wrap" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontFamily: 'DM Sans', fontSize: 11, color: '#9E7A5A', letterSpacing: '.05em', fontWeight: 500 }}>{label}</label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {icon && <div style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: .5 }}>{icon}</div>}
        <input type={isP ? (sp ? 'text' : 'password') : type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} min={min} max={max}
          style={{ width: '100%', padding: icon ? '11px 14px 11px 40px' : '11px 14px', paddingRight: isP ? 42 : 14, border: `1.5px solid ${error ? '#C04040' : '#2C1C0C'}`, borderRadius: 11, fontFamily: 'DM Sans', fontSize: 14, color: '#FAF7F2', background: '#180E04', letterSpacing: '.01em' }} />
        {isP && <button type="button" onClick={() => setSp(!sp)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', opacity: .5 }}>
          {sp ? <IEyeOff size={16} stroke="#9E7A5A" /> : <IEye size={16} stroke="#9E7A5A" />}
        </button>}
      </div>
      {error && <p style={{ fontFamily: 'DM Sans', fontSize: 11, color: '#E05050', marginTop: 1 }}>{error}</p>}
      {hint && !error && <p style={{ fontFamily: 'DM Sans', fontSize: 10, color: '#4A3A2A', marginTop: 1 }}>{hint}</p>}
    </div>
  );
};

const StepDots = ({ total, cur }: { total: number, cur: number }) => (
  <div style={{ display: 'flex', gap: 7, alignItems: 'center', marginBottom: 28 }}>
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} style={{ height: 4, width: i === cur ? 26 : 14, borderRadius: 4, background: i === cur ? ACCENT : i < cur ? `${ACCENT}55` : '#2C1C0C', transition: 'all .3s' }} />
    ))}
    <span style={{ fontFamily: 'DM Sans', fontSize: 11, color: '#5A4A3A', marginLeft: 4 }}>{cur + 1}/{total}</span>
  </div>
);

const LoginForm = ({ onSwitch }: any) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const navigate = useNavigate();
  const submit = async (e: any) => {
    e.preventDefault();
    const er: any = {};
    if (!email.includes('@')) er.email = 'Niepoprawny email';
    if (pass.length < 6) er.pass = 'Min. 6 znaków';
    setErr(er);
    if (Object.keys(er).length) return;
    setLoading(true);
    try {
      const res = await fetch(`${USER_API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErr({ pass: data.detail || 'Błąd logowania' });
        setLoading(false);
        return;
      }
      localStorage.setItem('access_token', data.access_token || '');
      localStorage.setItem('id_token', data.id_token || '');
      localStorage.setItem('refresh_token', data.refresh_token || '');
      localStorage.setItem('user_email', email);
      window.dispatchEvent(new Event('auth-change'));
      setLoading(false);
      setOk(true);
      setTimeout(() => navigate('/'), 900);
    } catch (ex: any) {
      setErr({ pass: 'Błąd połączenia z serwerem' });
      setLoading(false);
    }
  };
  if (ok) return (
    <div style={{ textAlign: 'center', padding: '36px 0' }}>
      <div style={{ width: 68, height: 68, borderRadius: '50%', background: `${ACCENT}1A`, margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1.5px solid ${ACCENT}50` }}><ICheck size={28} stroke={ACCENT} /></div>
      <h3 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 32, color: '#FAF7F2', marginBottom: 8 }}>Witaj z powrotem!</h3>
      <p style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#7A6A5A', marginBottom: 28 }}>Logowanie pomyślne.</p>
      <Link to="/" style={{ display: 'inline-block', padding: '12px 30px', borderRadius: 12, background: ACCENT, color: '#fff', textDecoration: 'none', fontFamily: 'DM Sans', fontSize: 14 }}>Przejdź do sklepu →</Link>
    </div>
  );
  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="jan@example.com" error={err.email} icon={<IMail size={15} stroke="#9E7A5A" />} />
      <Field label="Hasło" type="password" value={pass} onChange={setPass} placeholder="••••••••" error={err.pass} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -4 }}>
        <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: 12, color: ACCENT, textDecoration: 'underline', textUnderlineOffset: 3 }}>Zapomniałeś hasła?</button>
      </div>
      <button type="submit" className="btn-main" disabled={loading} style={{ padding: '13px', borderRadius: 12, border: 'none', cursor: loading ? 'default' : 'pointer', background: loading ? '#2C1C0C' : ACCENT, color: loading ? '#5A4030' : '#fff', fontFamily: 'DM Sans', fontSize: 14, fontWeight: 500, marginTop: 2 }}>
        {loading ? 'Logowanie...' : 'Zaloguj się'}
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1, height: 1, background: '#2C1C0C' }} /><span style={{ fontFamily: 'DM Sans', fontSize: 11, color: '#4A3A2A' }}>lub</span><div style={{ flex: 1, height: 1, background: '#2C1C0C' }} />
      </div>
      <p style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#7A6A5A', textAlign: 'center' }}>
        Nie masz konta?{' '}
        <button type="button" onClick={onSwitch} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: 13, color: ACCENT, fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: 3 }}>Zarejestruj się</button>
      </p>
    </form>
  );
};

const STEPS = [{ t: 'Dane konta', s: 'Stwórz dane logowania' }, { t: 'Dane osobowe', s: 'Kilka słów o Tobie' }, { t: 'Adres dostawy', s: 'Gdzie wysyłamy zamówienia?' }];

const RegisterForm = ({ onSwitch }: any) => {
  const [step, setStep] = useState(0);
  const [f, setF] = useState({ email: '', pass: '', passC: '', name: '', age: '', city: '', street: '', houseNo: '', postal: '' });
  const [err, setErr] = useState<any>({});
  const [done, setDone] = useState(false);
  const [animCls, setAnimCls] = useState('slide-l');
  const upd = (k: string) => (v: string) => setF(p => ({ ...p, [k]: v }));
  const validate = () => {
    const e: any = {};
    if (step === 0) { if (!f.email.includes('@')) e.email = 'Podaj poprawny email'; if (f.pass.length < 6) e.pass = 'Min. 6 znaków'; if (f.pass !== f.passC) e.passC = 'Hasła nie są zgodne'; }
    if (step === 1) { if (!f.name.trim()) e.name = 'Podaj imię i nazwisko'; const a = parseInt(f.age); if (!f.age || a < 13 || a > 120) e.age = 'Wiek: 13–120'; }
    if (step === 2) { if (!f.city.trim()) e.city = 'Wymagane'; if (!f.street.trim()) e.street = 'Wymagane'; if (!f.houseNo.trim()) e.houseNo = 'Wymagane'; if (!/^\d{2}-\d{3}$/.test(f.postal)) e.postal = 'Format: XX-XXX'; }
    return e;
  };
  const next = (e: any) => { e.preventDefault(); const er = validate(); setErr(er); if (Object.keys(er).length) return; if (step < STEPS.length - 1) { setAnimCls('slide-l'); setStep(s => s + 1); } else setDone(true); };
  const back = () => { setErr({}); setAnimCls('slide-r2'); setStep(s => s - 1); };
  if (done) return (
    <div style={{ textAlign: 'center', padding: '28px 0' }}>
      <div style={{ width: 68, height: 68, borderRadius: '50%', background: `${ACCENT}1A`, margin: '0 auto 18px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1.5px solid ${ACCENT}50` }}><ICheck size={28} stroke={ACCENT} /></div>
      <h3 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 30, color: '#FAF7F2', marginBottom: 8 }}>Konto utworzone!</h3>
      <p style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#7A6A5A', marginBottom: 6 }}>Witamy, <strong style={{ color: '#FAF7F2' }}>{f.name.split(' ')[0]}</strong>!</p>
      <p style={{ fontFamily: 'DM Sans', fontSize: 11, color: '#4A3A2A', marginBottom: 26 }}>Link aktywacyjny wysłany na {f.email}</p>
      <Link to="/" style={{ display: 'inline-block', padding: '12px 30px', borderRadius: 12, background: ACCENT, color: '#fff', textDecoration: 'none', fontFamily: 'DM Sans', fontSize: 14 }}>Przejdź do sklepu →</Link>
    </div>
  );
  return (
    <form onSubmit={next} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <StepDots total={STEPS.length} cur={step} />
      <div key={step} className={animCls} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {step === 0 && <><Field label="Email" type="email" value={f.email} onChange={upd('email')} placeholder="jan@example.com" error={err.email} icon={<IMail size={15} stroke="#9E7A5A" />} /><Field label="Hasło" type="password" value={f.pass} onChange={upd('pass')} placeholder="Min. 6 znaków" error={err.pass} hint="Użyj liter, cyfr i znaków specjalnych" /><Field label="Potwierdź hasło" type="password" value={f.passC} onChange={upd('passC')} placeholder="Powtórz hasło" error={err.passC} /></>}
        {step === 1 && <><Field label="Imię i nazwisko" value={f.name} onChange={upd('name')} placeholder="Jan Kowalski" error={err.name} icon={<IUser size={15} stroke="#9E7A5A" />} /><Field label="Wiek" type="number" value={f.age} onChange={upd('age')} placeholder="np. 28" error={err.age} min={13} max={120} icon={<ICal size={15} stroke="#9E7A5A" />} /></>}
        {step === 2 && <><Field label="Miasto" value={f.city} onChange={upd('city')} placeholder="Warszawa" error={err.city} icon={<IMap size={15} stroke="#9E7A5A" />} /><Field label="Ulica" value={f.street} onChange={upd('street')} placeholder="ul. Marszałkowska" error={err.street} icon={<IHome size={15} stroke="#9E7A5A" />} /><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}><Field label="Nr domu / mieszk." value={f.houseNo} onChange={upd('houseNo')} placeholder="12A / 3" error={err.houseNo} /><Field label="Kod pocztowy" value={f.postal} onChange={upd('postal')} placeholder="00-001" error={err.postal} /></div></>}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
        {step > 0 && <button type="button" onClick={back} style={{ padding: '12px 16px', borderRadius: 11, border: '1.5px solid #2C1C0C', background: 'transparent', color: '#7A6A5A', cursor: 'pointer', display: 'flex', alignItems: 'center', fontFamily: 'DM Sans', fontSize: 13, transition: 'border-color .2s' }} onMouseEnter={e => e.currentTarget.style.borderColor = ACCENT} onMouseLeave={e => e.currentTarget.style.borderColor = '#2C1C0C'}><IArrowL size={14} stroke="#7A6A5A" /></button>}
        <button type="submit" className="btn-main" style={{ flex: 1, padding: '12px', borderRadius: 11, border: 'none', cursor: 'pointer', background: ACCENT, color: '#fff', fontFamily: 'DM Sans', fontSize: 14, fontWeight: 500 }}>{step < STEPS.length - 1 ? 'Dalej →' : 'Utwórz konto'}</button>
      </div>
      <p style={{ fontFamily: 'DM Sans', fontSize: 12, color: '#5A4A3A', textAlign: 'center', marginTop: 14 }}>
        Masz już konto?{' '}<button type="button" onClick={onSwitch} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: 12, color: ACCENT, textDecoration: 'underline', textUnderlineOffset: 3 }}>Zaloguj się</button>
      </p>
    </form>
  );
};

/* ── App ─────────────────────────────── */
export default function Login() {
  const [mode, setMode] = useState('login');
  const [k, setK] = useState(0);
  const sw = (m: string) => { setMode(m); setK(x => x + 1); };
  const titles: any = { login: ['Zaloguj się', 'Dostęp do konta i historii zamówień.'], register: [STEPS[0].t, STEPS[0].s] };
  return (
    <div className="login-page">
      <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#0D0905' }}>
        <AnimPanel />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '56px 60px', background: '#120A03', position: 'relative', overflowY: 'auto' }}>
          <Link to="/" style={{ position: 'absolute', top: 28, left: 36, display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', fontFamily: 'DM Sans', fontSize: 12, color: '#4A3A2A', transition: 'color .2s' }} onMouseEnter={e => e.currentTarget.style.color = ACCENT} onMouseLeave={e => e.currentTarget.style.color = '#4A3A2A'}>
            <IArrowL size={13} stroke="currentColor" /> Powrót do sklepu
          </Link>
          <div style={{ maxWidth: 410, width: '100%', margin: '0 auto' }}>
            <div style={{ display: 'flex', background: '#1C0E04', borderRadius: 13, padding: 4, marginBottom: 32, border: '1px solid #2C1C0C' }}>
              {['login', 'register'].map(m => (
                <button key={m} onClick={() => sw(m)} style={{ flex: 1, padding: '10px', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: 13, fontWeight: mode === m ? 500 : 400, background: mode === m ? ACCENT : 'transparent', color: mode === m ? '#fff' : '#7A6A5A', transition: 'all .22s', letterSpacing: '.02em' }}>
                  {m === 'login' ? 'Logowanie' : 'Rejestracja'}
                </button>
              ))}
            </div>
            <div key={`h${k}`} className="fade-up" style={{ marginBottom: 28 }}>
              <p style={{ fontFamily: 'DM Sans', fontSize: 11, letterSpacing: '.12em', color: ACCENT, textTransform: 'uppercase', marginBottom: 8, fontWeight: 500 }}>AromaBrew</p>
              <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 36, fontWeight: 300, color: '#FAF7F2', marginBottom: 6, lineHeight: 1.15 }}>{titles[mode][0]}</h1>
              <p style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#7A6A5A', lineHeight: 1.6 }}>{titles[mode][1]}</p>
            </div>
            <div key={`f${k}`} className="fade-up" style={{ animationDelay: '.06s' }}>
              {mode === 'login' ? <LoginForm onSwitch={() => sw('register')} /> : <RegisterForm onSwitch={() => sw('login')} />}
            </div>
          </div>
          <p style={{ position: 'absolute', bottom: 24, left: 0, right: 0, textAlign: 'center', fontFamily: 'DM Sans', fontSize: 11, color: '#2C1C0C', letterSpacing: '.04em' }}>© 2026 AromaBrew · Specialty Coffee & Tea</p>
        </div>
      </div>
    </div>
  );
}
