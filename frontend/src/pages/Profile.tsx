import React, { useState, useEffect } from 'react';
import { GitBranch, Link2, Globe, Share2, Mail, Phone, MapPin, Edit3, Save, X, Briefcase, GraduationCap, Award, Link as LinkIcon, Plus, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import { C, cardStyle, inputStyle, btnPrimary } from '../theme';
import { api } from '../api';

interface ProfileData {
  name: string; email: string; phone: string; location: string; bio: string;
  title: string; experience: string; avatar: string;
  socials: { github: string; linkedin: string; twitter: string; portfolio: string; };
  skills: string[]; education: { degree: string; school: string; year: string; }[];
  certifications: string[];
}

const EMPTY: ProfileData = {
  name: '', email: '', phone: '', location: '', bio: '', title: '', experience: '', avatar: '',
  socials: { github: '', linkedin: '', twitter: '', portfolio: '' },
  skills: [], education: [{ degree: '', school: '', year: '' }], certifications: [],
};

export default function Profile({ user }: { user: any }) {
  const [profile, setProfile] = useState<ProfileData>({ ...EMPTY, name: user?.name || '', email: user?.email || '', avatar: user?.avatar || '' });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ProfileData>(profile);
  const [newSkill, setNewSkill] = useState('');
  const [newCert, setNewCert] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    try {
      const data = await api.getProfile(user.email);
      if (data.exists) {
        setProfile({ ...data, avatar: data.avatar || user.avatar });
        setDraft({ ...data, avatar: data.avatar || user.avatar });
      }
    } catch { }
    setLoading(false);
  };

  const save = async () => {
    setSaving(true);
    try {
      await api.saveProfile(draft);
      setProfile(draft);
      setEditing(false);
    } catch { alert('Failed to save'); }
    setSaving(false);
  };

  const cancel = () => { setDraft(profile); setEditing(false); };
  const addSkill = () => { if (newSkill.trim()) { setDraft(p => ({ ...p, skills: [...p.skills, newSkill.trim()] })); setNewSkill(''); } };
  const removeSkill = (i: number) => setDraft(p => ({ ...p, skills: p.skills.filter((_, idx) => idx !== i) }));
  const addCert = () => { if (newCert.trim()) { setDraft(p => ({ ...p, certifications: [...p.certifications, newCert.trim()] })); setNewCert(''); } };
  const addEdu = () => setDraft(p => ({ ...p, education: [...p.education, { degree: '', school: '', year: '' }] }));

  const socialLinks = [
    { key: 'github' as const, label: 'GitHub', icon: GitBranch, prefix: 'https://github.com/', color: '#fff' },
    { key: 'linkedin' as const, label: 'LinkedIn', icon: Link2, prefix: 'https://linkedin.com/in/', color: '#0A66C2' },
    { key: 'twitter' as const, label: 'Twitter / X', icon: Share2, prefix: 'https://twitter.com/', color: '#1DA1F2' },
    { key: 'portfolio' as const, label: 'Portfolio', icon: Globe, prefix: '', color: C.blue },
  ];

  const completeness = (() => {
    let s = 0;
    if (profile.name) s += 15; if (profile.email) s += 10; if (profile.bio) s += 15;
    if (profile.title) s += 10; if (profile.skills.length > 0) s += 15;
    if (profile.socials.github) s += 10; if (profile.socials.linkedin) s += 10;
    if (profile.education[0]?.degree) s += 10; if (profile.certifications.length > 0) s += 5;
    return Math.min(100, s);
  })();

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '32px', height: '32px', border: `3px solid ${C.border}`, borderTopColor: C.blue, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
        <p style={{ color: C.textMuted, fontSize: '13px' }}>Loading profile...</p>
      </div>
    </div>
  );

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: C.white, marginBottom: '4px' }}>My Profile</h1>
          <p style={{ color: C.textMuted, fontSize: '13px' }}>Stored in database — persists across sessions</p>
        </div>
        {!editing ? (
          <button onClick={() => { setDraft(profile); setEditing(true); }} style={{ ...btnPrimary, padding: '10px 18px', fontSize: '13px' }}>
            <Edit3 style={{ width: '14px', height: '14px' }} /> Edit Profile
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={save} disabled={saving} style={{ ...btnPrimary, padding: '10px 18px', fontSize: '13px', opacity: saving ? 0.5 : 1 }}>
              {saving ? <Loader2 style={{ width: '14px', height: '14px', animation: 'spin 0.8s linear infinite' }} /> : <Save style={{ width: '14px', height: '14px' }} />} Save
            </button>
            <button onClick={cancel} style={{ padding: '10px 18px', fontSize: '13px', background: C.card, border: `1px solid ${C.border}`, borderRadius: '12px', color: C.textMuted, cursor: 'pointer' }}>Cancel</button>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ ...cardStyle, textAlign: 'center', padding: '28px 20px' }}>
            <img src={profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || 'U')}&background=66FCF1&color=0a0a0f&bold=true&size=128`}
              alt="" style={{ width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 14px', border: `3px solid ${C.blue}30` }} />
            {editing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input value={draft.name} onChange={e => setDraft(p => ({ ...p, name: e.target.value }))} style={{ ...inputStyle, textAlign: 'center' }} placeholder="Full Name" />
                <input value={draft.title} onChange={e => setDraft(p => ({ ...p, title: e.target.value }))} style={{ ...inputStyle, textAlign: 'center', fontSize: '12px' }} placeholder="Job Title" />
                <input value={draft.location} onChange={e => setDraft(p => ({ ...p, location: e.target.value }))} style={{ ...inputStyle, textAlign: 'center', fontSize: '12px' }} placeholder="Location" />
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: C.white }}>{profile.name || 'Your Name'}</h2>
                {profile.title && <p style={{ fontSize: '13px', color: C.blue, marginTop: '4px' }}>{profile.title}</p>}
                {profile.location && <p style={{ fontSize: '12px', color: C.textMuted, marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}><MapPin style={{ width: '12px', height: '12px' }} />{profile.location}</p>}
              </>
            )}
          </div>

          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: C.textMuted }}>Completeness</span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: completeness === 100 ? C.green : C.amber }}>{completeness}%</span>
            </div>
            <div style={{ height: '6px', background: C.dark, borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${completeness}%`, background: completeness === 100 ? C.green : `linear-gradient(90deg, ${C.blue}, ${C.teal})`, borderRadius: '999px', transition: 'width 0.5s' }} />
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: C.white, marginBottom: '12px' }}>Contact</h3>
            {editing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input value={draft.email} onChange={e => setDraft(p => ({ ...p, email: e.target.value }))} style={inputStyle} placeholder="Email" />
                <input value={draft.phone} onChange={e => setDraft(p => ({ ...p, phone: e.target.value }))} style={inputStyle} placeholder="Phone" />
                <input value={draft.experience} onChange={e => setDraft(p => ({ ...p, experience: e.target.value }))} style={inputStyle} placeholder="Experience (e.g. 3 years)" />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {profile.email && <p style={{ fontSize: '12px', color: C.text, display: 'flex', alignItems: 'center', gap: '6px' }}><Mail style={{ width: '12px', height: '12px', color: C.textDim }} />{profile.email}</p>}
                {profile.phone && <p style={{ fontSize: '12px', color: C.text, display: 'flex', alignItems: 'center', gap: '6px' }}><Phone style={{ width: '12px', height: '12px', color: C.textDim }} />{profile.phone}</p>}
                {profile.experience && <p style={{ fontSize: '12px', color: C.text, display: 'flex', alignItems: 'center', gap: '6px' }}><Briefcase style={{ width: '12px', height: '12px', color: C.textDim }} />{profile.experience}</p>}
              </div>
            )}
          </div>

          <div style={cardStyle}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: C.white, marginBottom: '12px' }}>Social Links</h3>
            {socialLinks.map(sl => (
              <div key={sl.key} style={{ marginBottom: '8px' }}>
                {editing ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <sl.icon style={{ width: '16px', height: '16px', color: sl.color, flexShrink: 0 }} />
                    <input value={draft.socials[sl.key]} onChange={e => setDraft(p => ({ ...p, socials: { ...p.socials, [sl.key]: e.target.value } }))}
                      style={{ ...inputStyle, flex: 1, fontSize: '12px', padding: '8px 12px' }} placeholder={sl.prefix || sl.label + ' URL'} />
                  </div>
                ) : profile.socials[sl.key] ? (
                  <a href={profile.socials[sl.key].startsWith('http') ? profile.socials[sl.key] : sl.prefix + profile.socials[sl.key]} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', color: sl.color, textDecoration: 'none', fontSize: '12px', padding: '6px 0' }}>
                    <sl.icon style={{ width: '16px', height: '16px' }} /><span>{profile.socials[sl.key]}</span>
                    <ExternalLink style={{ width: '10px', height: '10px', marginLeft: 'auto', color: C.textDim }} />
                  </a>
                ) : (
                  <p style={{ fontSize: '11px', color: C.textDim, display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 0' }}><sl.icon style={{ width: '14px', height: '14px' }} /> Not added</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={cardStyle}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: C.white, marginBottom: '10px' }}>About Me</h3>
            {editing ? <textarea value={draft.bio} onChange={e => setDraft(p => ({ ...p, bio: e.target.value }))} style={{ ...inputStyle, height: '100px', resize: 'none' }} placeholder="Professional bio..." />
              : <p style={{ fontSize: '13px', color: C.text, lineHeight: 1.7 }}>{profile.bio || 'Click "Edit Profile" to add a bio.'}</p>}
          </div>

          <div style={cardStyle}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: C.white, marginBottom: '10px' }}>Skills</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: editing ? '10px' : 0 }}>
              {(editing ? draft.skills : profile.skills).map((skill, i) => (
                <span key={i} style={{ padding: '5px 12px', fontSize: '12px', color: C.blue, background: C.blue + '12', borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {skill}
                  {editing && <button onClick={() => removeSkill(i)} style={{ background: 'none', border: 'none', color: C.red, cursor: 'pointer', padding: 0 }}><Trash2 style={{ width: '10px', height: '10px' }} /></button>}
                </span>
              ))}
              {(editing ? draft.skills : profile.skills).length === 0 && <p style={{ fontSize: '12px', color: C.textDim }}>No skills added</p>}
            </div>
            {editing && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <input value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill()} style={{ ...inputStyle, flex: 1, fontSize: '12px', padding: '8px 12px' }} placeholder="Add skill..." />
                <button onClick={addSkill} style={{ padding: '8px 14px', background: C.blue + '20', color: C.blue, border: `1px solid ${C.blue}30`, borderRadius: '10px', cursor: 'pointer', fontSize: '12px' }}><Plus style={{ width: '12px', height: '12px' }} /></button>
              </div>
            )}
          </div>

          <div style={cardStyle}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: C.white, marginBottom: '10px' }}>Education</h3>
            {(editing ? draft.education : profile.education).map((edu, i) => (
              <div key={i} style={{ marginBottom: '10px' }}>
                {editing ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px', gap: '6px' }}>
                    <input value={edu.degree} onChange={e => { const ed = [...draft.education]; ed[i] = { ...ed[i], degree: e.target.value }; setDraft(p => ({ ...p, education: ed })); }} style={{ ...inputStyle, fontSize: '12px', padding: '8px 12px' }} placeholder="Degree" />
                    <input value={edu.school} onChange={e => { const ed = [...draft.education]; ed[i] = { ...ed[i], school: e.target.value }; setDraft(p => ({ ...p, education: ed })); }} style={{ ...inputStyle, fontSize: '12px', padding: '8px 12px' }} placeholder="University" />
                    <input value={edu.year} onChange={e => { const ed = [...draft.education]; ed[i] = { ...ed[i], year: e.target.value }; setDraft(p => ({ ...p, education: ed })); }} style={{ ...inputStyle, fontSize: '12px', padding: '8px 12px' }} placeholder="Year" />
                  </div>
                ) : edu.degree && (
                  <div style={{ padding: '6px 0' }}><p style={{ fontSize: '13px', fontWeight: 600, color: C.white }}>{edu.degree}</p><p style={{ fontSize: '11px', color: C.textMuted }}>{edu.school} {edu.year && `• ${edu.year}`}</p></div>
                )}
              </div>
            ))}
            {editing && <button onClick={addEdu} style={{ fontSize: '11px', color: C.blue, background: 'none', border: 'none', cursor: 'pointer' }}><Plus style={{ width: '12px', height: '12px', display: 'inline' }} /> Add education</button>}
          </div>

          <div style={cardStyle}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: C.white, marginBottom: '10px' }}>Certifications</h3>
            {(editing ? draft.certifications : profile.certifications).map((cert, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                <span style={{ fontSize: '12px', color: C.text }}>🏆 {cert}</span>
                {editing && <button onClick={() => setDraft(p => ({ ...p, certifications: p.certifications.filter((_, idx) => idx !== i) }))} style={{ background: 'none', border: 'none', color: C.red, cursor: 'pointer' }}><Trash2 style={{ width: '10px', height: '10px' }} /></button>}
              </div>
            ))}
            {(editing ? draft.certifications : profile.certifications).length === 0 && <p style={{ fontSize: '12px', color: C.textDim }}>No certifications</p>}
            {editing && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <input value={newCert} onChange={e => setNewCert(e.target.value)} onKeyDown={e => e.key === 'Enter' && addCert()} style={{ ...inputStyle, flex: 1, fontSize: '12px', padding: '8px 12px' }} placeholder="Add certification..." />
                <button onClick={addCert} style={{ padding: '8px 14px', background: C.amber + '20', color: C.amber, border: `1px solid ${C.amber}30`, borderRadius: '10px', cursor: 'pointer', fontSize: '12px' }}><Plus style={{ width: '12px', height: '12px' }} /></button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
