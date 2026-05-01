import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Search, MessageSquare, Kanban, Zap, UserCircle, Target, Clock } from 'lucide-react';
import { C, cardStyle } from '../theme';
import { api } from '../api';

const actions = [
  { label: 'Analyze Resume', desc: 'Upload & get AI feedback', icon: FileText, path: '/resume', color: C.blue },
  { label: 'Search Jobs', desc: 'Browse all India jobs', icon: Search, path: '/jobs', color: C.purple },
  { label: 'AI Chat', desc: 'Get career advice', icon: MessageSquare, path: '/chat', color: C.amber },
  { label: 'Track Apps', desc: 'Manage your pipeline', icon: Kanban, path: '/tracker', color: C.green },
  { label: 'My Profile', desc: 'Social links & skills', icon: UserCircle, path: '/profile', color: C.blue },
];

export default function Dashboard({ user }: { user: any }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [appStats, setAppStats] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [s, a, as2] = await Promise.all([
        api.dashboardStats(),
        api.dashboardActivity(),
        api.appStats(user?.email || ''),
      ]);
      setStats(s); setActivity(a); setAppStats(as2);
    } catch { }
    setLoading(false);
  };

  const statCards = [
    { label: 'Jobs in DB', value: stats?.totalJobs ?? '—', icon: Search, color: C.teal },
    { label: 'Resumes Analyzed', value: stats?.resumesAnalyzed ?? '—', icon: FileText, color: C.blue },
    { label: 'Applications', value: appStats?.total ?? '—', icon: Target, color: C.purple },
    { label: 'Interviews', value: appStats?.interview ?? '—', icon: MessageSquare, color: C.green },
    { label: 'AI Chats', value: stats?.chatsCompleted ?? '—', icon: MessageSquare, color: C.amber },
    { label: 'AI Mode', value: stats?.aiMode ?? '—', icon: Zap, color: stats?.aiEnabled ? C.green : C.amber },
  ];

  const timeAgo = (iso: string) => {
    if (!iso) return '';
    const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (m < 1) return 'Just now'; if (m < 60) return m + 'm ago';
    const h = Math.floor(m / 60); if (h < 24) return h + 'h ago';
    return Math.floor(h / 24) + 'd ago';
  };

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 800, color: C.white, marginBottom: '4px' }}>Welcome back, {user?.name} 👋</h1>
      <p style={{ color: C.textMuted, fontSize: '14px', marginBottom: '28px' }}>Real-time stats from your database.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '28px' }}>
        {statCards.map((s, i) => (
          <div key={i} style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', opacity: loading ? 0.5 : 1 }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: s.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <s.icon style={{ width: '16px', height: '16px', color: s.color }} />
            </div>
            <div>
              <p style={{ fontSize: '20px', fontWeight: 800, color: C.white, lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: '11px', color: C.textMuted, marginTop: '2px' }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: '15px', fontWeight: 700, color: C.white, marginBottom: '10px' }}>Quick Actions</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '28px' }}>
        {actions.map((a, i) => (
          <button key={i} onClick={() => navigate(a.path)} style={{ ...cardStyle, cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.2s, transform 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = a.color + '40'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'none'; }}>
            <a.icon style={{ width: '24px', height: '24px', color: a.color, marginBottom: '8px' }} />
            <p style={{ fontSize: '13px', fontWeight: 700, color: C.white }}>{a.label}</p>
            <p style={{ fontSize: '11px', color: C.textMuted, marginTop: '2px' }}>{a.desc}</p>
          </button>
        ))}
      </div>

      <h2 style={{ fontSize: '15px', fontWeight: 700, color: C.white, marginBottom: '10px' }}>Recent Activity</h2>
      <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
        {activity.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <Clock style={{ width: '28px', height: '28px', color: C.border, margin: '0 auto 10px' }} />
            <p style={{ color: C.textMuted, fontSize: '13px' }}>No activity yet. Start by analyzing a resume or searching for jobs!</p>
          </div>
        ) : activity.map((item: any, i: number) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderBottom: i < activity.length - 1 ? `1px solid ${C.border}` : 'none' }}>
            <div><p style={{ fontSize: '13px', fontWeight: 600, color: C.white }}>{item.action}</p><p style={{ fontSize: '11px', color: C.textMuted }}>{item.detail}</p></div>
            <div style={{ textAlign: 'right' }}><p style={{ fontSize: '12px', fontWeight: 700, color: item.color || C.blue }}>{item.status}</p><p style={{ fontSize: '10px', color: C.textDim }}>{timeAgo(item.time)}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}
