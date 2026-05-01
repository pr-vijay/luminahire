import React, { useState } from 'react';
import { Sparkles, Mail, Lock, User } from 'lucide-react';
import { api } from '../api';

interface LoginProps {
  onLogin: (user: any) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = React.useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      const user = {
        email: params.get('email'),
        name: params.get('name'),
        avatar: params.get('avatar'),
        provider: 'oauth2'
      };
      onLogin(user);
      // Clean URL
      window.history.replaceState({}, document.title, "/");
    } else if (params.get('error')) {
      setError(params.get('error') || '');
    }
    return null;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let res;
      if (mode === 'login') {
        res = await api.auth.login({ email, password });
      } else {
        res = await api.auth.register({ name, email, password });
      }

      if (res.error) {
        setError(res.error);
      } else if (res.user) {
        onLogin(res.user);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px 12px 42px',
    background: '#0a0a0f',
    border: '1px solid #2a2a3d',
    borderRadius: '12px',
    color: '#f0f0ff',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box' as const,
  };

  const iconStyle = {
    position: 'absolute' as const,
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '16px',
    height: '16px',
    color: '#7a7a8e',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glows */}
      <div style={{
        position: 'absolute', top: '-20%', left: '-15%', width: '50%', height: '50%',
        background: 'rgba(102, 252, 241, 0.06)', filter: 'blur(160px)', borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', right: '-15%', width: '50%', height: '50%',
        background: 'rgba(168, 85, 247, 0.06)', filter: 'blur(160px)', borderRadius: '50%', pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img src="/logo.png" alt="LuminaHire" style={{ width: '180px', height: '180px', objectFit: 'contain', borderRadius: '24px' }} />
        </div>

        {/* Card */}
        <div style={{
          background: '#16161f',
          border: '1px solid #2a2a3d',
          borderRadius: '24px',
          padding: '40px 32px',
        }}>
          
          <div style={{ display: 'flex', background: '#0a0a0f', borderRadius: '12px', padding: '4px', marginBottom: '24px' }}>
            <button 
              onClick={() => { setMode('login'); setError(''); }}
              style={{ flex: 1, padding: '8px', background: mode === 'login' ? '#2a2a3d' : 'transparent', color: mode === 'login' ? '#fff' : '#7a7a8e', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, transition: 'all 0.2s' }}>
              Sign In
            </button>
            <button 
              onClick={() => { setMode('register'); setError(''); }}
              style={{ flex: 1, padding: '8px', background: mode === 'register' ? '#2a2a3d' : 'transparent', color: mode === 'register' ? '#fff' : '#7a7a8e', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, transition: 'all 0.2s' }}>
              Create Account
            </button>
          </div>

          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f0f0ff', textAlign: 'center', margin: '0 0 8px 0' }}>
            {mode === 'login' ? 'Welcome Back' : 'Join LuminaHire'}
          </h2>
          <p style={{ fontSize: '14px', color: '#7a7a8e', textAlign: 'center', margin: '0 0 24px 0' }}>
            {mode === 'login' ? 'Sign in to your account' : 'Start your AI-powered job search'}
          </p>

          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', marginBottom: '20px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {mode === 'register' && (
              <div style={{ position: 'relative' }}>
                <User style={iconStyle} />
                <input required type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
              </div>
            )}
            
            <div style={{ position: 'relative' }}>
              <Mail style={iconStyle} />
              <input required type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
            </div>

            <div style={{ position: 'relative' }}>
              <Lock style={iconStyle} />
              <input required type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '14px', background: '#66FCF1', color: '#0a0a0f', fontWeight: 700, fontSize: '15px',
                borderRadius: '12px', border: 'none', cursor: 'pointer', marginTop: '10px',
                opacity: loading ? 0.7 : 1, transition: 'all 0.2s',
              }}
            >
              {loading ? (
                <div style={{ width: '18px', height: '18px', border: '2px solid rgba(10,10,15,0.3)', borderTopColor: '#0a0a0f', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ margin: '24px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1, height: '1px', background: '#2a2a3d' }} />
            <span style={{ fontSize: '12px', color: '#7a7a8e' }}>or continue with</span>
            <div style={{ flex: 1, height: '1px', background: '#2a2a3d' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button
              onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '12px', background: '#f0f0ff', color: '#0a0a0f', fontWeight: 600, fontSize: '14px',
                borderRadius: '12px', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              <svg style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button
              onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/linkedin'}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '12px', background: '#0A66C2', color: '#fff', fontWeight: 600, fontSize: '14px',
                borderRadius: '12px', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              <svg style={{ width: '18px', height: '18px' }} fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn
            </button>
          </div>

          {/* Divider */}
          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #2a2a3d' }}>
            <p style={{ fontSize: '12px', color: '#7a7a8e', textAlign: 'center', margin: 0 }}>
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>

        <p style={{ fontSize: '12px', color: '#7a7a8e', textAlign: 'center', marginTop: '24px' }}>
          © 2026 LuminaHire. Powered by Gemini AI.
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
