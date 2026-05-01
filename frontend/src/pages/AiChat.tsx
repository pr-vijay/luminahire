import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot } from 'lucide-react';
import { C, cardStyle, inputStyle } from '../theme';
import { api } from '../api';

interface Message { id: number; role: 'user' | 'ai'; content: string; }

const SUGGESTIONS = ['How to prepare for system design interviews?', 'Review my resume for a React role', 'Write a cover letter for Google', 'Top skills for 2026 job market?'];

export default function AiChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: 'ai', content: 'Hello! 👋 I\'m **Lumina**, your AI career assistant.\n\nI can help with:\n• **Resume reviews**\n• **Cover letter generation**\n• **Interview prep**\n• **Career advice**\n\nHow can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottom = useRef<HTMLDivElement>(null);
  useEffect(() => { bottom.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (text?: string) => {
    const msg = text || input.trim(); if (!msg || loading) return;
    setMessages(p => [...p, { id: Date.now(), role: 'user', content: msg }]); setInput(''); setLoading(true);
    try { const d = await api.chat(msg); setMessages(p => [...p, { id: Date.now()+1, role: 'ai', content: d.reply }]); }
    catch { setMessages(p => [...p, { id: Date.now()+1, role: 'ai', content: '⚠️ Backend not running.' }]); }
    setLoading(false);
  };

  const fmt = (s: string) => s.split('\n').map((line, i) => {
    let h = line.replace(/\*\*(.*?)\*\*/g, `<strong style="color:${C.white}">$1</strong>`);
    return <p key={i} style={{ marginBottom: '3px' }} dangerouslySetInnerHTML={{ __html: h || '&nbsp;' }} />;
  });

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out', height: 'calc(100vh - 96px)', display: 'flex', flexDirection: 'column' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 800, color: C.white, marginBottom: '4px' }}>AI Career Assistant</h1>
      <p style={{ color: C.textMuted, fontSize: '13px', marginBottom: '16px' }}>Chat with Lumina AI — powered by LangChain + Gemini</p>

      {/* Chat area */}
      <div style={{ flex: 1, overflow: 'auto', background: C.card, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '16px', marginBottom: '12px' }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', gap: '10px', marginBottom: '14px', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: msg.role === 'ai' ? `linear-gradient(135deg, ${C.blue}, ${C.teal})` : C.purple }}>
              {msg.role === 'ai' ? <Bot style={{ width: '16px', height: '16px', color: C.dark }} /> : <User style={{ width: '16px', height: '16px', color: '#fff' }} />}
            </div>
            <div style={{ maxWidth: '70%', padding: '12px 16px', borderRadius: '16px', fontSize: '13px', lineHeight: 1.6, color: C.text, background: msg.role === 'ai' ? C.cardHover : C.blue + '12', border: `1px solid ${msg.role === 'ai' ? C.border : C.blue + '20'}` }}>
              {fmt(msg.content)}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: `linear-gradient(135deg, ${C.blue}, ${C.teal})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Bot style={{ width: '16px', height: '16px', color: C.dark }} />
            </div>
            <div style={{ padding: '12px 16px', borderRadius: '16px', background: C.cardHover, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '16px', height: '16px', border: `2px solid ${C.border}`, borderTopColor: C.blue, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <span style={{ fontSize: '13px', color: C.textMuted }}>Thinking...</span>
            </div>
          </div>
        )}
        <div ref={bottom} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
          {SUGGESTIONS.map((s, i) => (
            <button key={i} onClick={() => send(s)} style={{ padding: '6px 14px', fontSize: '11px', borderRadius: '999px', border: `1px solid ${C.border}`, background: 'transparent', color: C.textMuted, cursor: 'pointer' }}>{s}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
          disabled={loading} style={{ ...inputStyle, flex: 1 }} placeholder="Ask Lumina anything..." />
        <button onClick={() => send()} disabled={loading || !input.trim()} style={{ padding: '12px 20px', background: C.blue, color: C.dark, fontWeight: 700, borderRadius: '12px', border: 'none', cursor: 'pointer', opacity: loading || !input.trim() ? 0.3 : 1 }}>
          <Send style={{ width: '16px', height: '16px' }} />
        </button>
      </div>
    </div>
  );
}
