import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { detectAgeRequirement, checkAgeEligibility } from '@/lib/analysisUtils';
import { analyzeSkillGap } from '../../services/AiModel';

function readTextFile(file) {
  return new Promise((resolve) => {
    if (!file) return resolve('');
    const reader = new FileReader();
    reader.onload = (e) => resolve(String(e.target.result || ''));
    reader.onerror = () => resolve('');
    // For PDFs, we do not attempt full extraction here — request pasted text instead
    if (file.type === 'application/pdf') {
      reader.readAsText(file);
    } else {
      reader.readAsText(file);
    }
  });
}

export default function SkillGapAnalyzer() {
  const navigate = useNavigate();
  const [age, setAge] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [jobText, setJobText] = useState('');
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
    if (!age) return setError('Please enter your age');
    if (!resumeText && !resumeFile) return setError('Upload or paste your resume text');
    if (!jobText) return setError('Paste the job requirement summary');

    setLoading(true);
    try {
      const aiResp = await analyzeSkillGap(resumeText, jobText);
      if (!aiResp || aiResp.error) {
        return setError(aiResp?.error || 'AI analysis failed');
      }

      const jobSkills = Array.isArray(aiResp.jobSkills) ? aiResp.jobSkills : [];
      const matched = Array.isArray(aiResp.matchedSkills) ? aiResp.matchedSkills : (Array.isArray(aiResp.matched) ? aiResp.matched : []);
      const matchPercentage = jobSkills.length ? Math.round((matched.length / jobSkills.length) * 100) : (matched.length ? 100 : 0);
      const eligibility = matchPercentage >= 70 ? 'Good' : matchPercentage >= 40 ? 'Average' : 'Low';

      const ageDetected = detectAgeRequirement(jobText);
      const ageCheck = checkAgeEligibility(Number(age), ageDetected);

      setResult({ ...aiResp, matchPercentage, eligibility, ageDetected, ageCheck });
    } catch (err) {
      setError('Analysis failed: ' + String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Skill Gap Analyzer</h2>
      <p className="text-sm text-gray-600 mb-4">Enter your age, upload or paste your resume, paste the job requirement, and click Analyze.</p>

      <div className="grid gap-3">
        <label className="text-sm font-bold">Your Age (required)</label>
        <input type="number" value={age} onChange={e=>setAge(e.target.value)} className="input border-2 border-gray-400 rounded p-2" />

        <label className="text-sm">Resume Upload (PDF or text)</label>
        <input type="file" accept=".pdf,text/plain,application/pdf" onChange={e=>handleFile(e.target.files[0])} className='border-2 border-gray-400 rounded p-2' />

        <label className="text-sm">Or paste resume text</label>
        <textarea rows={6} value={resumeText} onChange={e=>setResumeText(e.target.value)} className="textarea border-2 border-gray-400 rounded p-1" />

        <label className="text-sm">Job Requirement Summary (paste)</label>
        <textarea rows={6} value={jobText} onChange={e=>setJobText(e.target.value)} className="textarea border-2 border-gray-400 rounded p-1" />

        {error && <div className="text-red-500">{error}</div>}

        <div className="flex gap-2">
          <Button onClick={handleAnalyze} disabled={loading}>{loading ? 'Analyzing...' : 'Analyze'}</Button>
          <Button variant="outline" onClick={()=>navigate(-1)}>Back</Button>
        </div>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow">
          <h3 className="font-semibold">Results</h3>
          <p className="mt-2">Skill Match Percentage: <strong>{result.matchPercentage}%</strong> ({result.eligibility})</p>
          <p className="mt-2">Matched Skills: {Array.isArray(result.matchedSkills) && result.matchedSkills.length ? result.matchedSkills.join(', ') : (Array.isArray(result.matched) && result.matched.length ? result.matched.join(', ') : 'None')}</p>

          <div className="mt-4">
            <h4 className="font-semibold">Missing / Recommended Skills</h4>
            {Array.isArray(result.missingSkills) && result.missingSkills.length ? (
              <ul className="mt-2 list-disc ml-6">
                {result.missingSkills.map((m, idx) => (
                  <li key={idx} className="mb-2">
                    <div className="font-medium">{m.skill} <span className="text-sm text-gray-500">({m.priority})</span></div>
                    {m.reason && <div className="text-sm text-gray-600">{m.reason}</div>}
                    {m.estimatedTime && <div className="text-xs text-gray-500">Estimated time: {m.estimatedTime}</div>}
                    {Array.isArray(m.resources) && m.resources.length > 0 && (
                      <div className="text-sm text-primary mt-1">Resources: {m.resources.join(', ')}</div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2">No missing skills identified.</p>
            )}
          </div>

          <p className="mt-4">Age Requirement Detected: {result.ageDetected?.ageRequirementDetected ? 'Yes' : 'No'}</p>
          {result.ageDetected?.ageRequirementDetected && (
            <div>
              <p>Extracted Age Range: {result.ageDetected.extractedAgeRange ? (result.ageDetected.extractedAgeRange.min ? `${result.ageDetected.extractedAgeRange.min}-${result.ageDetected.extractedAgeRange.max}` : `<= ${result.ageDetected.extractedAgeRange.max}`) : result.ageDetected.raw}</p>
              <p>Age Eligibility: {result.ageCheck?.ageEligibilityStatus}</p>
            </div>
          )}

          {Array.isArray(result.quickFixes) && result.quickFixes.length > 0 && (
            <div className="mt-3 p-3 bg-gray-50 rounded">
              <strong>Quick Resume Fixes</strong>
              <ul className="list-disc ml-6 mt-2">
                {result.quickFixes.map((q, i) => <li key={i} className="text-sm">{q}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
