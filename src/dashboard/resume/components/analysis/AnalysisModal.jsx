import React, { useContext, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {ResumeInfoContext} from "../../../../context/ResumeInfoContext"
import { analyzeSkillGap, computeATSScore } from "../../../../../services/AiModel";

function buildResumeText(resumeInfo) {
  if (!resumeInfo) return "";
  const parts = [];
  if (resumeInfo?.personal) parts.push(JSON.stringify(resumeInfo.personal));
  if (resumeInfo?.summary) parts.push(String(resumeInfo.summary));
  if (Array.isArray(resumeInfo?.experience)) {
    resumeInfo.experience.forEach((e) => {
      parts.push(`${e.title || ""} ${e.company || ""} ${e.description || ""}`);
    });
  }
  if (Array.isArray(resumeInfo?.education)) {
    resumeInfo.education.forEach((ed) => parts.push(`${ed.degree || ""} ${ed.institution || ""}`));
  }
  if (Array.isArray(resumeInfo?.skills)) parts.push(resumeInfo.skills.join(", "));
  return parts.join("\n\n");
}

export default function AnalysisModal() {
  const { resumeInfo } = useContext(ResumeInfoContext);
  const [open, setOpen] = useState(false);
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [skillResult, setSkillResult] = useState(null);
  const [atsResult, setAtsResult] = useState(null);

  const resumeText = buildResumeText(resumeInfo);

  const runSkillGap = async () => {
    setLoading(true);
    setSkillResult(null);
    try {
      const res = await analyzeSkillGap(resumeText, jobDesc);
      setSkillResult(res);
    } catch (err) {
      setSkillResult({ error: String(err) });
    } finally {
      setLoading(false);
    }
  };

  const runAts = async () => {
    setLoading(true);
    setAtsResult(null);
    try {
      const res = await computeATSScore(resumeText);
      setAtsResult(res);
    } catch (err) {
      setAtsResult({ error: String(err) });
    } finally {
      setLoading(false);
    }
  };

  const renderResources = (resources = []) => (
    <ul className="list-disc pl-5 mt-2">
      {resources.map((r, i) => (
        <li key={i} className="text-sm">
          {/^https?:\/\//.test(r) ? (
            <a href={r} target="_blank" rel="noreferrer" className="text-primary underline">
              {r}
            </a>
          ) : (
            <span>{r}</span>
          )}
        </li>
      ))}
    </ul>
  );

  const renderPriority = (p) => {
    const cls = p === "High" ? "text-red-700" : p === "Medium" ? "text-yellow-700" : "text-green-700";
    return <span className={`font-semibold ${cls}`}>{p}</span>;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex justify-end mb-4">
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">Analyze Resume</Button>
        </DialogTrigger>
      </div>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resume Analysis</DialogTitle>
          <DialogDescription>
            Run Skill Gap analysis and ATS score checks. No changes will be made to your
            resume automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <label className="text-sm">Optional Job Description (paste here):</label>
          <textarea
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            className="w-full h-24 mt-2 p-2 border rounded"
            placeholder="Paste job description to compare skills"
          />

          <div className="flex gap-2 mt-4">
            <Button variant="default" onClick={runSkillGap} disabled={loading}>
              {loading ? "Running..." : "Skill Gap Analyzer"}
            </Button>
            <Button variant="secondary" onClick={runAts} disabled={loading}>
              {loading ? "Running..." : "Check ATS Score"}
            </Button>
          </div>

          <div className="mt-4 max-h-64 overflow-auto">
            {skillResult && (
              <div className="mb-4 p-3 bg-white rounded border">
                <h3 className="font-semibold">Skill Gap Result</h3>
                {skillResult.error ? (
                  <div className="text-sm text-red-600">Error: {skillResult.error}
                    {skillResult.raw && <pre className="mt-2 text-xs whitespace-pre-wrap">{skillResult.raw}</pre>}
                  </div>
                ) : (
                  <div>
                    <div className="mt-2 text-sm">
                      <strong>Resume Skills:</strong> {skillResult.resumeSkills?.slice(0,20).join(", ") || "—"}
                    </div>
                    <div className="mt-2 text-sm">
                      <strong>Matched Skills:</strong> {skillResult.matchedSkills?.join(", ") || "—"}
                    </div>

                    <div className="mt-3">
                      <strong className="block">Missing Skills</strong>
                      {skillResult.missingSkills.length === 0 ? (
                        <div className="text-sm mt-1">No missing skills detected.</div>
                      ) : (
                        <div className="mt-2 space-y-2">
                          {skillResult.missingSkills.map((m, idx) => (
                            <div key={idx} className="p-2 border rounded">
                              <div className="flex justify-between items-center">
                                <div className="font-medium">{m.skill}</div>
                                <div>{renderPriority(m.priority)}</div>
                              </div>
                              {m.reason && <div className="text-sm text-muted mt-1">{m.reason}</div>}
                              {m.estimatedTime && <div className="text-sm mt-1">Estimated: {m.estimatedTime}</div>}
                              {Array.isArray(m.resources) && m.resources.length > 0 && renderResources(m.resources)}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {skillResult.quickFixes && skillResult.quickFixes.length > 0 && (
                      <div className="mt-3">
                        <strong className="block">Quick Resume Fixes</strong>
                        <ul className="list-disc pl-5 mt-2 text-sm">
                          {skillResult.quickFixes.map((q, i) => <li key={i}>{q}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {atsResult && (
              <div className="mb-4 p-3 bg-white rounded border">
                <h3 className="font-semibold">ATS Score Result</h3>
                {atsResult.error ? (
                  <div className="text-sm text-red-600">Error: {atsResult.error}
                    {atsResult.raw && <pre className="mt-2 text-xs whitespace-pre-wrap">{atsResult.raw}</pre>}
                  </div>
                ) : (
                  <div>
                    <div className="mt-2 flex items-center gap-4">
                      <div className="text-2xl font-bold">{atsResult.score ?? "—"}</div>
                      <div className="text-sm">Overall ATS compatibility</div>
                    </div>

                    <div className="mt-3">
                      <strong className="block">Breakdown</strong>
                      <div className="mt-2 space-y-2">
                        {Object.entries(atsResult.breakdown || {}).map(([k, v]) => {
                          const pct = Math.round((v || 0) * 1); // assume v is already 0-100 or 0-10 weights
                          return (
                            <div key={k} className="text-sm">
                              <div className="flex justify-between"><span>{k}</span><span>{v}</span></div>
                              <div className="w-full bg-gray-100 h-2 rounded mt-1">
                                <div className="bg-primary h-2 rounded" style={{ width: `${Math.min(100, pct)}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {atsResult.topMatchedKeywords && atsResult.topMatchedKeywords.length > 0 && (
                      <div className="mt-3">
                        <strong className="block">Top Matched Keywords</strong>
                        <div className="text-sm mt-1">{atsResult.topMatchedKeywords.join(", ")}</div>
                      </div>
                    )}

                    {atsResult.topMissingKeywords && atsResult.topMissingKeywords.length > 0 && (
                      <div className="mt-3">
                        <strong className="block">Top Missing Keywords</strong>
                        <div className="text-sm mt-1">{atsResult.topMissingKeywords.join(", ")}</div>
                      </div>
                    )}

                    {atsResult.suggestions && atsResult.suggestions.length > 0 && (
                      <div className="mt-3">
                        <strong className="block">Suggestions</strong>
                        <ul className="list-disc pl-5 mt-2 text-sm">
                          {atsResult.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                    )}

                    {atsResult.exampleBullets && atsResult.exampleBullets.length > 0 && (
                      <div className="mt-3">
                        <strong className="block">Example Bullet Rewrites</strong>
                        <ul className="list-disc pl-5 mt-2 text-sm">
                          {atsResult.exampleBullets.map((b, i) => <li key={i}>{b}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
