import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Image, File, CheckCircle, AlertTriangle, X, Sparkles, Briefcase, ArrowRight } from 'lucide-react';
import { C, cardStyle, inputStyle, btnPrimary } from '../theme';
import { api } from '../api';

export default function ResumeAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [matchedJobs, setMatchedJobs] = useState<any[]>([]);
  const [showJobs, setShowJobs] = useState(false);
  const [jobsLoading, setJobsLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const f = acceptedFiles[0]; if (!f) return;
    setFile(f); setResult(null); setMatchedJobs([]); setShowJobs(false);
    const ext = f.name.split('.').pop()?.toLowerCase() || ''; setFileType(ext);
    if (['png','jpg','jpeg','gif','webp'].includes(ext)) { const r = new FileReader(); r.onload = e => setPreview(e.target?.result as string); r.readAsDataURL(f); } else setPreview(null);
    const tr = new FileReader(); tr.onload = e => { const t = e.target?.result as string; if (t && !t.startsWith('data:')) setResumeText(t); }; tr.readAsText(f);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'], 'application/msword': ['.doc'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'], 'image/*': ['.png','.jpg','.jpeg','.gif','.webp'], 'text/plain': ['.txt'] }, maxFiles: 1, maxSize: 10*1024*1024 });

  const handleAnalyze = async () => { if (!resumeText.trim()) return; setLoading(true); try { setResult(await api.analyzeResume(resumeText, jobDesc)); } catch { alert('Backend not running on 8080'); } setLoading(false); };
  const handleFindJobs = async () => { if (!resumeText.trim()) return; setJobsLoading(true); setShowJobs(true); try { const d = await api.matchJobsForResume(resumeText); setMatchedJobs(d.jobs || []); } catch { } setJobsLoading(false); };

  const Spinner = () => <div style={{ width: '20px', height: '20px', border: `2px solid ${C.border}`, borderTopColor: C.blue, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />;

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 800, color: C.white, marginBottom: '4px' }}>Resume Analyzer</h1>
      <p style={{ color: C.textMuted, fontSize: '13px', marginBottom: '20px' }}>Upload your resume (PDF, DOC, Image) and get AI-powered feedback</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Dropzone */}
          <div {...getRootProps()} style={{ border: `2px dashed ${isDragActive ? C.blue : C.border}`, borderRadius: '16px', padding: '32px', textAlign: 'center', cursor: 'pointer', background: isDragActive ? C.blue + '08' : C.card, transition: 'all 0.2s' }}>
            <input {...getInputProps()} />
            {!file ? (<><Upload style={{ width: '40px', height: '40px', color: C.textDim, margin: '0 auto 12px' }} /><p style={{ color: C.white, fontWeight: 600, fontSize: '14px' }}>Drop your resume here or click to browse</p><p style={{ color: C.textMuted, fontSize: '12px', marginTop: '6px' }}>PDF, DOC, DOCX, PNG, JPG, TXT — Max 10MB</p></>) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left' }}>
                {preview ? <img src={preview} alt="" style={{ width: '48px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} /> : <FileText style={{ width: '32px', height: '32px', color: C.blue }} />}
                <div style={{ flex: 1 }}><p style={{ color: C.white, fontWeight: 600, fontSize: '13px' }}>{file.name}</p><p style={{ color: C.textMuted, fontSize: '11px' }}>{(file.size/1024).toFixed(1)} KB</p></div>
                <button onClick={e => { e.stopPropagation(); setFile(null); setPreview(null); setResult(null); setResumeText(''); }} style={{ background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer' }}><X style={{ width: '18px', height: '18px' }} /></button>
              </div>
            )}
          </div>

          {preview && <div style={cardStyle}><p style={{ fontSize: '12px', color: C.textMuted, marginBottom: '8px' }}>📷 Preview</p><img src={preview} alt="" style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', borderRadius: '10px' }} /></div>}

          <div style={cardStyle}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: C.white, marginBottom: '8px' }}>Resume Text</label>
            <textarea value={resumeText} onChange={e => setResumeText(e.target.value)} style={{ ...inputStyle, height: '100px', resize: 'none' }} placeholder="Paste your resume content..." />
          </div>

          <div style={cardStyle}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: C.white, marginBottom: '8px' }}>Target Job Description (Optional)</label>
            <textarea value={jobDesc} onChange={e => setJobDesc(e.target.value)} style={{ ...inputStyle, height: '80px', resize: 'none' }} placeholder="Paste job description for targeted analysis..." />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleAnalyze} disabled={!resumeText.trim() || loading} style={{ ...btnPrimary, flex: 1, opacity: !resumeText.trim() || loading ? 0.4 : 1 }}>
              {loading ? <Spinner /> : <Sparkles style={{ width: '16px', height: '16px' }} />} Analyze Resume
            </button>
            <button onClick={handleFindJobs} disabled={!resumeText.trim() || jobsLoading} style={{ ...btnPrimary, flex: 1, background: `linear-gradient(135deg, ${C.purple}, ${C.pink})`, color: '#fff', opacity: !resumeText.trim() || jobsLoading ? 0.4 : 1 }}>
              {jobsLoading ? <Spinner /> : <Briefcase style={{ width: '16px', height: '16px' }} />} Find Jobs
            </button>
          </div>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {!result && !loading && !showJobs && (
            <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', textAlign: 'center' }}>
              <FileText style={{ width: '48px', height: '48px', color: C.border, marginBottom: '12px' }} />
              <p style={{ color: C.textMuted, fontSize: '13px' }}>Upload a resume and click Analyze</p>
            </div>
          )}

          {loading && (
            <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', textAlign: 'center' }}>
              <div style={{ width: '40px', height: '40px', border: `3px solid ${C.border}`, borderTopColor: C.blue, borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: '16px' }} />
              <p style={{ color: C.white, fontWeight: 600 }}>AI analyzing your resume...</p>
            </div>
          )}

          {result && !loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', animation: 'fadeIn 0.3s ease-out' }}>
              {result.mode === 'DEMO' && <div style={{ background: C.amber + '12', border: `1px solid ${C.amber}30`, borderRadius: '10px', padding: '10px 16px', fontSize: '12px', color: C.amber, textAlign: 'center' }}>⚡ DEMO mode — Set Gemini API key for real AI</div>}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ ...cardStyle, textAlign: 'center' }}><p style={{ fontSize: '11px', color: C.textMuted, marginBottom: '6px' }}>Overall Score</p><p style={{ fontSize: '36px', fontWeight: 900, color: C.blue }}>{result.score}%</p></div>
                <div style={{ ...cardStyle, textAlign: 'center' }}><p style={{ fontSize: '11px', color: C.textMuted, marginBottom: '6px' }}>ATS Score</p><p style={{ fontSize: '36px', fontWeight: 900, color: C.amber }}>{result.atsScore}%</p></div>
              </div>

              <div style={cardStyle}><p style={{ fontSize: '13px', fontWeight: 700, color: C.white, marginBottom: '8px' }}>AI Summary</p><p style={{ fontSize: '13px', color: C.text, lineHeight: 1.7 }}>{result.summary}</p></div>

              {result.extractedSkills?.length > 0 && (
                <div style={{ ...cardStyle, background: C.blue + '08', borderColor: C.blue + '20' }}>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: C.blue, marginBottom: '10px' }}>Extracted Skills</p>
                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>{result.extractedSkills.map((s: string, i: number) => <span key={i} style={{ padding: '4px 10px', fontSize: '11px', color: C.blue, background: C.blue + '15', borderRadius: '999px' }}>{s}</span>)}</div>
                </div>
              )}

              <div style={{ ...cardStyle, background: C.green + '06', borderColor: C.green + '20' }}>
                <p style={{ fontSize: '13px', fontWeight: 700, color: C.green, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle style={{ width: '14px', height: '14px' }} /> Strengths</p>
                {(result.strengths||[]).map((s: string, i: number) => <p key={i} style={{ fontSize: '12px', color: C.text, marginBottom: '4px' }}>✓ {s}</p>)}
              </div>

              <div style={{ ...cardStyle, background: C.amber + '06', borderColor: C.amber + '20' }}>
                <p style={{ fontSize: '13px', fontWeight: 700, color: C.amber, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}><AlertTriangle style={{ width: '14px', height: '14px' }} /> Improvements</p>
                {(result.improvements||[]).map((s: string, i: number) => <p key={i} style={{ fontSize: '12px', color: C.text, marginBottom: '4px' }}>! {s}</p>)}
              </div>

              <div style={{ ...cardStyle, background: C.red + '06', borderColor: C.red + '20' }}>
                <p style={{ fontSize: '13px', fontWeight: 700, color: C.red, marginBottom: '10px' }}>Missing Keywords</p>
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>{(result.missingKeywords||[]).map((k: string, i: number) => <span key={i} style={{ padding: '4px 10px', fontSize: '11px', color: C.red, background: C.red + '15', borderRadius: '999px' }}>{k}</span>)}</div>
              </div>
            </div>
          )}

          {showJobs && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', animation: 'fadeIn 0.3s ease-out' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: C.white, display: 'flex', alignItems: 'center', gap: '8px' }}><Briefcase style={{ width: '18px', height: '18px', color: C.purple }} /> Matching Jobs</h2>
              {jobsLoading ? <div style={{ ...cardStyle, textAlign: 'center', padding: '40px' }}><div style={{ width: '32px', height: '32px', border: `3px solid ${C.border}`, borderTopColor: C.purple, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} /><p style={{ color: C.textMuted, fontSize: '12px' }}>Searching jobs...</p></div> :
                matchedJobs.slice(0, 8).map((job: any, i: number) => (
                  <div key={i} style={{ ...cardStyle, display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '14px 16px' }}>
                    <img src={job.logo} alt="" style={{ width: '36px', height: '36px', borderRadius: '8px', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p style={{ fontSize: '13px', fontWeight: 700, color: C.white, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.title}</p>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: C.purple, flexShrink: 0 }}>{job.match}%</span>
                      </div>
                      <p style={{ fontSize: '11px', color: C.textMuted }}>{job.company} • {job.location} • {job.salary}</p>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                        <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: C.blue, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}>Apply <ArrowRight style={{ width: '10px', height: '10px' }} /></a>
                        <a href={job.linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: C.linkedin, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}>LinkedIn <ArrowRight style={{ width: '10px', height: '10px' }} /></a>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
