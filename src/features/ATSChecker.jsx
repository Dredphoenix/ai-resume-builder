import React, { useState } from 'react';
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

export default function ATSChecker() {
  const navigate = useNavigate();
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFile = async (f) => {
    setResumeFile(f);
    const text = await readTextFile(f);
    setResumeText(text);
  };

  const handleAnalyze = async () => {
    setError('');
    if (!resumeText) return setError('Upload or paste resume text');
    setLoading(true);
    try {
      const aiResp = await computeATSScore(resumeText);
      if (!aiResp || aiResp.error) return setError(aiResp?.error || 'AI ATS analysis failed');
      setResult(aiResp);
    } catch (err) {
      setError('ATS analysis failed: ' + String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">ATS Checker</h2>
      <p className="text-sm text-gray-600 mb-4">Upload your resume and run a quick ATS compatibility check.</p>

      <div className="grid gap-3">
        <label className="text-sm">Resume Upload (PDF or text)</label>
        <input type="file" accept=".pdf,text/plain,application/pdf" onChange={e=>handleFile(e.target.files[0])} className='border-2 border-gray-400 rounded p-2'/>

        <label className="text-sm">Or paste resume text</label>
        <textarea rows={8} value={resumeText} onChange={e=>setResumeText(e.target.value)} className="textarea border-2 border-gray-400 rounded p-2" />

        {error && <div className="text-red-500">{error}</div>}

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
    </div>
  );
}
