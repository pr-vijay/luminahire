/** Shared design tokens */
export const C = {
  dark: '#0a0a0f',
  darker: '#060609',
  card: '#111118',
  cardHover: '#16161f',
  border: '#1e1e2d',
  borderLight: '#2a2a3d',
  text: '#e0e0ee',
  textMuted: '#7a7a8e',
  textDim: '#55556a',
  white: '#f0f0ff',
  blue: '#66FCF1',
  teal: '#45A29E',
  purple: '#a855f7',
  pink: '#ec4899',
  amber: '#f59e0b',
  red: '#ef4444',
  green: '#22c55e',
  linkedin: '#0A66C2',
};

export const cardStyle: React.CSSProperties = {
  background: C.card,
  border: `1px solid ${C.border}`,
  borderRadius: '16px',
  padding: '20px',
};

export const inputStyle: React.CSSProperties = {
  width: '100%',
  background: C.dark,
  border: `1px solid ${C.border}`,
  borderRadius: '12px',
  padding: '12px 16px',
  fontSize: '14px',
  color: C.text,
  outline: 'none',
  transition: 'border-color 0.2s',
};

export const btnPrimary: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
  padding: '12px 24px', background: `linear-gradient(135deg, ${C.blue}, ${C.teal})`,
  color: C.dark, fontWeight: 700, fontSize: '14px', borderRadius: '12px',
  border: 'none', cursor: 'pointer', transition: 'opacity 0.2s',
};

export const badge = (color: string, bg: string): React.CSSProperties => ({
  display: 'inline-block', padding: '4px 12px', fontSize: '11px', fontWeight: 600,
  color, background: bg, borderRadius: '999px',
});
