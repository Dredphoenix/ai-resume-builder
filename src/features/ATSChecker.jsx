import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { computeATSScore } from '../../services/AiModel';

function readTextFile(file) {
  return new Promise((resolve) => {
    if (!file) return resolve('');
    const reader = new FileReader();
    reader.onload = (e) => resolve(String(e.target.result || ''));
    reader.onerror = () => resolve('');
    reader.readAsText(file);
  });
}

// ── ADDED: live clock ──
function useLiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export default function ATSChecker() {
  const navigate = useNavigate();
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ── ADDED: clock + timer state ──
  const now = useLiveClock();
  const [elapsed, setElapsed] = useState(null);
  const [finalElapsed, setFinalElapsed] = useState(null);
  const timerRef = useRef(null);
  const startRef = useRef(null);

  const handleFile = async (f) => {
    setResumeFile(f);
    const text = await readTextFile(f);
    setResumeText(text);
  };

  const handleAnalyze = async () => {
    setError('');
    if (!resumeText) return setError('Upload or paste resume text');

    // ── ADDED: start timer ──
    setFinalElapsed(null);
    startRef.current = Date.now();
    setElapsed(0);
    timerRef.current = setInterval(() => setElapsed(Date.now() - startRef.current), 50);

    setLoading(true);
    try {
      const aiResp = await computeATSScore(resumeText);

      // ── ADDED: stop timer ──
      clearInterval(timerRef.current);
      setFinalElapsed(Date.now() - startRef.current);
      setElapsed(null);

      if (!aiResp || aiResp.error) return setError(aiResp?.error || 'AI ATS analysis failed');
      setResult(aiResp);
    } catch (err) {
      clearInterval(timerRef.current);
      setFinalElapsed(Date.now() - startRef.current);
      setElapsed(null);
      setError('ATS analysis failed: ' + String(err));
    } finally {
      setLoading(false);
    }
  };

  // ── ADDED: format helpers ──
  const fmtTime = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const fmtDate = (d) => d.toLocaleDateString([], { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  const fmtMs = (ms) => {
    if (ms == null) return '0.00s';
    const s = Math.floor(ms / 1000), cs = Math.floor((ms % 1000) / 10);
    return `${s}.${cs.toString().padStart(2, '0')}s`;
  };

  return (
    <div className="max-w-3xl mx-auto p-6 pb-14">
      <h2 className="text-2xl font-bold mb-4">ATS Checker</h2>
      <p className="text-sm text-gray-600 mb-4">Upload your resume and run a quick ATS compatibility check.</p>

      <div className="grid gap-3">
        <label className="text-sm">Resume Upload (PDF or text)</label>
        <input type="file" accept=".pdf,text/plain,application/pdf" onChange={e=>handleFile(e.target.files[0])} className='border-2 border-gray-400 rounded p-2'/>

        <label className="text-sm">Or paste resume text</label>
        <textarea rows={8} value={resumeText} onChange={e=>setResumeText(e.target.value)} className="textarea border-2 border-gray-400 rounded p-2" />

        {error && <div className="text-red-500">{error}</div>}

        {/* ── ADDED: analysis timer badge ── */}
        {(elapsed !== null || finalElapsed !== null) && (
          <div className={`flex items-center gap-2 text-sm font-mono px-3 py-1.5 rounded w-fit border
            ${elapsed !== null ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
            {elapsed !== null ? (
              <><span className="animate-pulse">⏱</span> Analyzing… {fmtMs(elapsed)}</>
            ) : (
              <><span>✓</span> Done in {fmtMs(finalElapsed)}</>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={handleAnalyze} disabled={loading}>{loading ? 'Analyzing...' : 'Analyze'}</Button>
          <Button variant="outline" onClick={()=>navigate(-1)}>Back</Button>
        </div>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow">
          <h3 className="font-semibold">ATS Results</h3>
          <p className="mt-2">ATS Score: <strong>{typeof result.score === 'number' ? result.score : 'N/A'}</strong></p>

          {result.breakdown && (
            <div className="mt-3">
              <h4 className="font-medium">Score Breakdown</h4>
              <ul className="list-disc ml-6 text-sm mt-2">
                {Object.entries(result.breakdown).map(([k,v]) => (
                  <li key={k}>{k}: {v}</li>
                ))}
              </ul>
            </div>
          )}

          {Array.isArray(result.topMatchedKeywords) && (
            <div className="mt-3">
              <h4 className="font-medium">Top Matched Keywords</h4>
              <p className="text-sm mt-1">{result.topMatchedKeywords.join(', ')}</p>
            </div>
          )}

          {Array.isArray(result.topMissingKeywords) && (
            <div className="mt-3">
              <h4 className="font-medium">Top Missing Keywords</h4>
              <p className="text-sm mt-1 text-red-600">{result.topMissingKeywords.join(', ')}</p>
            </div>
          )}

          {Array.isArray(result.suggestions) && (
            <div className="mt-3">
              <h4 className="font-medium">Suggestions</h4>
              <ul className="list-disc ml-6 mt-2">
                {result.suggestions.map((s, idx) => (<li key={idx}>{s}</li>))}
              </ul>
            </div>
          )}

          {Array.isArray(result.exampleBullets) && result.exampleBullets.length > 0 && (
            <div className="mt-3">
              <h4 className="font-medium">Example Bullet Rewrites</h4>
              <ul className="list-disc ml-6 mt-2">
                {result.exampleBullets.map((b, idx) => (<li key={idx}>{b}</li>))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ── ADDED: bottom bar — date left, time right ── */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-between px-6 py-2
                      bg-gray-50 border-t border-gray-200 text-xs text-gray-500 font-mono z-50">
        <span>{fmtDate(now)}</span>
        <span>{fmtTime(now)}</span>
      </div>
    </div>
  );
}