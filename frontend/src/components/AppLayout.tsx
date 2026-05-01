import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Search, MessageSquare, Kanban, UserCircle, LogOut, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/resume', label: 'Resume Analyzer', icon: FileText },
  { path: '/jobs', label: 'Job Search', icon: Search },
  { path: '/chat', label: 'AI Assistant', icon: MessageSquare },
  { path: '/tracker', label: 'App Tracker', icon: Kanban },
  { path: '/profile', label: 'My Profile', icon: UserCircle },
];

interface AppLayoutProps {
  user: any;
  onLogout: () => void;
  children: React.ReactNode;
}

export default function AppLayout({ user, onLogout, children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  const sidebarWidth = collapsed ? 72 : 260;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0f' }}>
      {/* Sidebar */}
      <aside style={{
        width: `${sidebarWidth}px`,
        minWidth: `${sidebarWidth}px`,
        background: '#060609',
        borderRight: '1px solid #2a2a3d',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        zIndex: 40,
        transition: 'width 0.3s ease, min-width 0.3s ease',
        overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '0 16px',
          borderBottom: '1px solid #2a2a3d',
          flexShrink: 0,
        }}>
          <img src="/logo.png" alt="LuminaHire Logo" style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover' }} />
          {!collapsed && <span style={{ fontSize: '18px', fontWeight: 700, color: '#f0f0ff', letterSpacing: '-0.3px', whiteSpace: 'nowrap' }}>LuminaHire</span>}
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '16px 8px', overflowY: 'auto' }}>
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: collapsed ? '10px 12px' : '10px 14px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 500,
                color: isActive ? '#66FCF1' : '#7a7a8e',
                background: isActive ? 'rgba(102, 252, 241, 0.08)' : 'transparent',
                textDecoration: 'none',
                marginBottom: '4px',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              })}
            >
              <item.icon style={{ width: '20px', height: '20px', flexShrink: 0 }} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div style={{ borderTop: '1px solid #2a2a3d', padding: '12px 8px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '8px 10px', borderRadius: '12px', background: 'rgba(22,22,31,0.6)',
            marginBottom: '8px', overflow: 'hidden',
          }}>
            <img src={user.avatar} alt={user.name} style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0 }} />
            {!collapsed && (
              <div style={{ overflow: 'hidden' }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#f0f0ff', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</p>
                <p style={{ fontSize: '11px', color: '#7a7a8e', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</p>
              </div>
            )}
          </div>
          <button onClick={onLogout} style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '8px 14px', borderRadius: '12px', fontSize: '13px',
            color: '#ef4444', background: 'transparent', border: 'none',
            width: '100%', cursor: 'pointer', textAlign: 'left',
            fontFamily: 'inherit',
          }}>
            <LogOut style={{ width: '16px', height: '16px', flexShrink: 0 }} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button onClick={() => setCollapsed(!collapsed)} style={{
          position: 'absolute', right: '-12px', top: '80px',
          width: '24px', height: '24px', background: '#16161f',
          border: '1px solid #2a2a3d', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#7a7a8e', padding: 0,
        }}>
          {collapsed ? <ChevronRight style={{ width: '12px', height: '12px' }} /> : <ChevronLeft style={{ width: '12px', height: '12px' }} />}
        </button>
      </aside>

      {/* Main content */}
      <main style={{
        marginLeft: `${sidebarWidth}px`,
        flex: 1,
        transition: 'margin-left 0.3s ease',
        minHeight: '100vh',
      }}>
        <div style={{ padding: '32px', maxWidth: '1280px', margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
