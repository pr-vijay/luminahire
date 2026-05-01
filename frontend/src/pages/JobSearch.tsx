import React, { useState, useEffect } from 'react';
import { Search, MapPin, ExternalLink, Building2, Briefcase, Clock, DollarSign, Globe, Tag, Users } from 'lucide-react';
import { C, cardStyle, inputStyle, btnPrimary } from '../theme';
import { api } from '../api';

export default function JobSearch() {
  const [query, setQuery] = useState('');
  const [loc, setLoc] = useState('');
  const [jobs, setJobs] = useState<any[]>([]);
  const [sel, setSel] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async (q = '', l = '', exp = '') => {
    setLoading(true);
    try { const d = await api.searchJobs(q, l, exp); setJobs(d.jobs || []); } catch { }
    setLoading(false);
  };

  const cityFilters = ['All', 'Bangalore', 'Mumbai', 'Pune', 'Hyderabad', 'Chennai', 'Gurugram', 'Noida', 'Remote, India', 'San Francisco', 'Stockholm'];
  const expFilters = ['All Levels', 'Fresher', 'Mid', 'Senior'];
  
  const [selectedExp, setSelectedExp] = useState('All Levels');

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 800, color: C.white, marginBottom: '4px' }}>Job Search — Global & Local</h1>
      <p style={{ color: C.textMuted, fontSize: '13px', marginBottom: '20px' }}>Find companies hiring freshers and experienced professionals globally</p>

      {/* Search */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: C.textDim }} />
          <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && load(query, loc, selectedExp)}
            style={{ ...inputStyle, paddingLeft: '38px' }} placeholder="Job title, skill, or company (e.g. React, Startup, Stripe)..." />
        </div>
        <div style={{ width: '180px', position: 'relative' }}>
          <MapPin style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: C.textDim }} />
          <input value={loc} onChange={e => setLoc(e.target.value)} onKeyDown={e => e.key === 'Enter' && load(query, loc, selectedExp)}
            style={{ ...inputStyle, paddingLeft: '38px' }} placeholder="City, Country, or Remote..." />
        </div>
        <button onClick={() => load(query, loc, selectedExp)} style={{ ...btnPrimary, padding: '12px 20px' }}>
          <Search style={{ width: '14px', height: '14px' }} /> Search
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: C.textMuted, marginRight: '8px' }}>Location:</span>
          {cityFilters.map(c => {
            const active = (c === 'All' && !loc) || loc.toLowerCase() === c.toLowerCase();
            return (
              <button key={c} onClick={() => { const v = c === 'All' ? '' : c; setLoc(v); load(query, v, selectedExp); }}
                style={{ padding: '6px 14px', fontSize: '12px', borderRadius: '999px', border: `1px solid ${active ? C.blue + '40' : C.border}`, background: active ? C.blue + '12' : 'transparent', color: active ? C.blue : C.textMuted, cursor: 'pointer', transition: 'all 0.2s' }}>
                {c}
              </button>
            );
          })}
        </div>
        
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: C.textMuted, marginRight: '8px' }}>Experience:</span>
          {expFilters.map(e => (
              <button key={e} onClick={() => { setSelectedExp(e); load(query, loc, e); }}
                style={{ padding: '6px 14px', fontSize: '12px', borderRadius: '999px', border: `1px solid ${selectedExp === e ? C.purple + '40' : C.border}`, background: selectedExp === e ? C.purple + '12' : 'transparent', color: selectedExp === e ? C.purple : C.textMuted, cursor: 'pointer', transition: 'all 0.2s' }}>
                {e}
              </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: C.textMuted }}>
          <div style={{ width: '32px', height: '32px', border: `3px solid ${C.border}`, borderTopColor: C.blue, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          Loading jobs...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px' }}>
          {/* Job list */}
          <div>
            <p style={{ fontSize: '12px', color: C.textMuted, marginBottom: '10px' }}>{jobs.length} jobs found</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {jobs.map((job: any) => (
                <button key={job.id} onClick={() => setSel(job)} style={{
                  ...cardStyle, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'flex-start', gap: '14px',
                  borderColor: sel?.id === job.id ? C.blue + '50' : C.border, transition: 'border-color 0.2s',
                  background: sel?.id === job.id ? C.blue + '06' : C.card,
                }}>
                  <img src={job.logo} alt="" style={{ width: '44px', height: '44px', borderRadius: '10px', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: 700, color: C.white, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.title}</h3>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: C.blue, background: C.blue + '15', padding: '3px 10px', borderRadius: '999px', flexShrink: 0, marginLeft: '8px' }}>{job.match}%</span>
                    </div>
                    <p style={{ fontSize: '12px', color: C.textMuted, marginTop: '2px' }}>{job.company}</p>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '6px', fontSize: '11px', color: C.textDim, flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><MapPin style={{ width: '11px', height: '11px' }} />{job.location}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Briefcase style={{ width: '11px', height: '11px' }} />{job.type}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><DollarSign style={{ width: '11px', height: '11px' }} />{job.salary}</span>
                      {job.experienceLevel && <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Tag style={{ width: '11px', height: '11px' }} />{job.experienceLevel}</span>}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Detail panel */}
          <div style={{ position: 'sticky', top: '20px', alignSelf: 'flex-start' }}>
            {!sel ? (
              <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', textAlign: 'center' }}>
                <Building2 style={{ width: '48px', height: '48px', color: C.border, marginBottom: '12px' }} />
                <p style={{ color: C.textMuted, fontSize: '13px' }}>Select a job to view details</p>
              </div>
            ) : (
              <div style={{ ...cardStyle, animation: 'fadeIn 0.3s ease-out' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                  <img src={sel.logo} alt="" style={{ width: '52px', height: '52px', borderRadius: '12px' }} />
                  <div>
                    <h2 style={{ fontSize: '16px', fontWeight: 800, color: C.white }}>{sel.title}</h2>
                    <p style={{ fontSize: '13px', color: C.textMuted }}>{sel.company}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', fontSize: '11px', fontWeight: 600, color: C.blue, background: C.blue + '15', borderRadius: '999px' }}>{sel.match}% Match</span>
                  <span style={{ padding: '4px 12px', fontSize: '11px', color: C.textMuted, background: C.card, border: `1px solid ${C.border}`, borderRadius: '999px' }}>{sel.location}</span>
                  <span style={{ padding: '4px 12px', fontSize: '11px', color: C.textMuted, background: C.card, border: `1px solid ${C.border}`, borderRadius: '999px' }}>{sel.salary}</span>
                </div>

                <p style={{ fontSize: '13px', color: C.text, lineHeight: 1.7, marginBottom: '16px' }}>{sel.description}</p>

                {sel.requirements && (
                  <div style={{ marginBottom: '20px' }}>
                    <p style={{ fontSize: '11px', fontWeight: 700, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Skills Required</p>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                      {sel.requirements.split(',').map((s: string, i: number) => (
                        <span key={i} style={{ padding: '4px 10px', fontSize: '11px', color: C.text, background: C.cardHover, borderRadius: '8px' }}>{s.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <a href={sel.applyUrl} target="_blank" rel="noopener noreferrer" style={{ ...btnPrimary, textDecoration: 'none', width: '100%' }}>
                    <ExternalLink style={{ width: '14px', height: '14px' }} /> Apply on {sel.company}
                  </a>
                  <a href={sel.linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ ...btnPrimary, background: C.linkedin, color: '#fff', width: '100%', textDecoration: 'none' }}>
                    <svg style={{ width: '14px', height: '14px' }} fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    Apply via LinkedIn
                  </a>
                  <a href={sel.website} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '12px', color: C.text, fontSize: '14px', fontWeight: 600, textDecoration: 'none', cursor: 'pointer', transition: 'border-color 0.2s' }}>
                    <Globe style={{ width: '14px', height: '14px' }} /> Visit Careers Page
                  </a>
                </div>

                <div style={{ marginTop: '20px', padding: '16px', background: C.cardHover, borderRadius: '12px', border: `1px solid ${C.border}` }}>
                  <p style={{ fontSize: '12px', fontWeight: 700, color: C.white, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users style={{ width: '14px', height: '14px', color: C.purple }} /> Reach out for Referrals
                  </p>
                  <p style={{ fontSize: '11px', color: C.textMuted, marginBottom: '12px', lineHeight: 1.5 }}>Connect with HRs and employees at <strong>{sel.company}</strong> to boost your chances of getting interviewed.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <a href={`https://www.linkedin.com/search/results/people/?keywords=HR OR Recruiter OR Talent Acquisition company:"${encodeURIComponent(sel.company)}" ${encodeURIComponent(sel.location.split(',')[0])}`} target="_blank" rel="noopener noreferrer" style={{ ...btnPrimary, background: 'transparent', border: `1px solid ${C.purple}50`, color: C.purple, width: '100%', textDecoration: 'none', fontSize: '12px', padding: '8px', justifyContent: 'flex-start' }}>
                      <Search style={{ width: '12px', height: '12px' }} /> Find HRs near {sel.location.split(',')[0]}
                    </a>
                    <a href={`https://www.linkedin.com/search/results/people/?keywords=HR OR Recruiter OR Talent Acquisition company:"${encodeURIComponent(sel.company)}"`} target="_blank" rel="noopener noreferrer" style={{ ...btnPrimary, background: 'transparent', border: `1px solid ${C.border}`, color: C.text, width: '100%', textDecoration: 'none', fontSize: '12px', padding: '8px', justifyContent: 'flex-start' }}>
                      <Globe style={{ width: '12px', height: '12px' }} /> Find HRs Globally
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
