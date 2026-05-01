import React, { useState, useEffect } from 'react';
import { Plus, X, Building2, ExternalLink, Calendar, Loader2 } from 'lucide-react';
import { C, cardStyle, inputStyle, btnPrimary } from '../theme';
import { api } from '../api';

interface App { id: number; company: string; title: string; status: string; date: string; url?: string; }

const COLS = [
  { key: 'wishlist', label: 'Wishlist', color: C.textMuted },
  { key: 'applied', label: 'Applied', color: C.blue },
  { key: 'interview', label: 'Interviewing', color: C.purple },
  { key: 'offer', label: 'Offered', color: C.green },
  { key: 'rejected', label: 'Rejected', color: C.red },
];

export default function Tracker() {
  const [apps, setApps] = useState<App[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newApp, setNewApp] = useState({ company: '', title: '', url: '' });
  const [dragId, setDragId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const userEmail = (() => {
    try { const u = JSON.parse(localStorage.getItem('luminahire_user') || '{}'); return u.email || ''; } catch { return ''; }
  })();

  useEffect(() => { loadApps(); }, []);

  const loadApps = async () => {
    try {
      const data = await api.getApplications(userEmail);
      setApps(data);
    } catch { }
    setLoading(false);
  };

  const add = async () => {
    if (!newApp.company || !newApp.title) return;
    try {
      const result = await api.addApplication({ email: userEmail, ...newApp, status: 'wishlist' });
      if (result.success) {
        setNewApp({ company: '', title: '', url: '' });
        setShowForm(false);
        loadApps(); // Reload from backend
      }
    } catch { }
  };

  const remove = async (id: number) => {
    try {
      await api.deleteApplication(id);
      setApps(p => p.filter(a => a.id !== id));
    } catch { }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.updateAppStatus(id, status);
      setApps(p => p.map(a => a.id === id ? { ...a, status } : a));
    } catch { }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '32px', height: '32px', border: `3px solid ${C.border}`, borderTopColor: C.blue, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
        <p style={{ color: C.textMuted, fontSize: '13px' }}>Loading applications...</p>
      </div>
    </div>
  );

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: C.white, marginBottom: '4px' }}>Application Tracker</h1>
          <p style={{ color: C.textMuted, fontSize: '13px' }}>Drag & drop to update status — saved to database</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ ...btnPrimary, padding: '10px 18px', fontSize: '13px' }}><Plus style={{ width: '14px', height: '14px' }} /> Add</button>
      </div>

      {showForm && (
        <div style={{ ...cardStyle, marginBottom: '16px', animation: 'fadeIn 0.2s ease-out' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <input value={newApp.company} onChange={e => setNewApp(p => ({ ...p, company: e.target.value }))} style={inputStyle} placeholder="Company" />
            <input value={newApp.title} onChange={e => setNewApp(p => ({ ...p, title: e.target.value }))} style={inputStyle} placeholder="Job title" />
            <input value={newApp.url} onChange={e => setNewApp(p => ({ ...p, url: e.target.value }))} style={inputStyle} placeholder="URL (optional)" />
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
            <button onClick={add} style={{ ...btnPrimary, padding: '8px 16px', fontSize: '12px' }}>Add</button>
            <button onClick={() => setShowForm(false)} style={{ padding: '8px 16px', fontSize: '12px', background: C.card, border: `1px solid ${C.border}`, borderRadius: '10px', color: C.textMuted, cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
        {COLS.map(col => {
          const items = apps.filter(a => a.status === col.key);
          return (
            <div key={col.key}
              onDragOver={e => e.preventDefault()}
              onDrop={() => { if (dragId !== null) { updateStatus(dragId, col.key); setDragId(null); } }}
              style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '14px', padding: '12px', minHeight: '200px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '0 4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: col.color }}>{col.label}</span>
                <span style={{ fontSize: '11px', color: col.color, background: col.color + '15', padding: '2px 8px', borderRadius: '999px' }}>{items.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {items.map(app => (
                  <div key={app.id} draggable onDragStart={() => setDragId(app.id)}
                    style={{ background: C.cardHover, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '10px 12px', cursor: 'grab', transition: 'border-color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = col.color + '40')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Building2 style={{ width: '12px', height: '12px', color: C.textDim }} />
                        <span style={{ fontSize: '12px', fontWeight: 700, color: C.white }}>{app.company}</span>
                      </div>
                      <button onClick={() => remove(app.id)} style={{ background: 'none', border: 'none', color: C.textDim, cursor: 'pointer', padding: 0, opacity: 0.5 }}>
                        <X style={{ width: '12px', height: '12px' }} />
                      </button>
                    </div>
                    <p style={{ fontSize: '11px', color: C.textMuted, marginLeft: '18px' }}>{app.title}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', marginLeft: '18px' }}>
                      <span style={{ fontSize: '10px', color: C.textDim, display: 'flex', alignItems: 'center', gap: '3px' }}><Calendar style={{ width: '10px', height: '10px' }} />{app.date}</span>
                      {app.url && <a href={app.url} target="_blank" rel="noopener noreferrer" style={{ color: C.blue }} onClick={e => e.stopPropagation()}><ExternalLink style={{ width: '10px', height: '10px' }} /></a>}
                    </div>
                  </div>
                ))}
                {items.length === 0 && <p style={{ fontSize: '11px', color: C.textDim, textAlign: 'center', padding: '20px 0' }}>Drop here</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
