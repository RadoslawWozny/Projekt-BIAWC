import { useState, useRef, useEffect } from 'react';

const IMessage = ({ size = 24, stroke = '#FAF7F2' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const IX = ({ size = 20, stroke = '#FAF7F2' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ISend = ({ size = 18, stroke = '#FAF7F2' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

interface Msg {
  id: number;
  text: string;
  sender: 'bot' | 'user';
}

export default function ChatBot({ accent = '#5C8A9E' }: { accent?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { id: 1, text: 'Cześć! Jestem wirtualnym asystentem AromaBrew ☕ W czym mogę pomóc?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Msg = { id: Date.now(), text: input.trim(), sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const botMsg: Msg = { id: Date.now(), text: 'Przekazałem Twoje pytanie do naszego zespołu. Odpowiemy najszybciej jak to możliwe! 🍃', sender: 'bot' };
      setMessages(prev => [...prev, botMsg]);
    }, 1000);
  };

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      
      {/* Chat Window */}
      {isOpen && (
        <div className="fade-in" style={{ 
          width: 320, 
          height: 440, 
          background: '#FAF7F2', 
          borderRadius: 20, 
          boxShadow: '0 20px 40px rgba(28,18,9,0.15)', 
          marginBottom: 16, 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid #E8DDD0'
        }}>
          {/* Header */}
          <div style={{ background: accent, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4CAF50' }} />
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 500, color: '#FAF7F2' }}>AromaBrew AI</span>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 4 }}>
              <IX size={18} stroke="#FAF7F2" />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {messages.map(m => (
              <div key={m.id} style={{ 
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                background: m.sender === 'user' ? '#1C1209' : '#fff',
                color: m.sender === 'user' ? '#FAF7F2' : '#1C1209',
                padding: '10px 14px',
                borderRadius: 16,
                borderBottomRightRadius: m.sender === 'user' ? 4 : 16,
                borderBottomLeftRadius: m.sender === 'bot' ? 4 : 16,
                maxWidth: '85%',
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 13,
                lineHeight: 1.5,
                border: m.sender === 'bot' ? '1px solid #E8DDD0' : 'none'
              }}>
                {m.text}
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} style={{ padding: '16px', background: '#fff', borderTop: '1px solid #E8DDD0', display: 'flex', gap: 10 }}>
            <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Napisz wiadomość..." 
              style={{ flex: 1, padding: '10px 14px', borderRadius: 20, border: '1px solid #E8DDD0', outline: 'none', fontFamily: "'DM Sans',sans-serif", fontSize: 13, background: '#FAF7F2' }}
            />
            <button type="submit" style={{ width: 40, height: 40, borderRadius: '50%', background: accent, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
              <ISend size={16} stroke="#fff" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          style={{
            width: 60, height: 60, borderRadius: '50%', background: accent, border: 'none',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 10px 24px ${accent}40`, transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <IMessage size={26} />
        </button>
      )}
    </div>
  );
}
