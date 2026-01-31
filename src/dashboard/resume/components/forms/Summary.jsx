import React, { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ResumeInfoContext } from "../../../../context/ResumeInfoContext";
import { useParams } from "react-router-dom";
import GlobalApi from "../../../../../services/GlobalApi";
import { toast } from "sonner";
import { Brain, LoaderCircle } from "lucide-react";
import { AIChatSession } from "../../../../../services/AiModel";

function Summary({ enabledNext }) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const [aiGeneretedSummaryList, setAiGeneretedSummaryList] = useState();

  // Initialize summary with existing data from resumeInfo
  useEffect(() => {
    if (resumeInfo?.summary) {
      setSummary(resumeInfo.summary);
    }
  }, [resumeInfo?.summary]);

  // Update resumeInfo when summary changes
  useEffect(() => {
    if (summary) {
      setResumeInfo({
        ...resumeInfo,
        summary: summary,
      });
    }
  }, [summary]);

  // Handle textarea changes and disable next button
  const handleSummaryChange = (e) => {
    enabledNext(false); // Disable next when user starts editing
    setSummary(e.target.value);
  };

  const GenerateSummaryFromAI = async () => {
    setLoading(true);

    const PROMPT = `
You are a professional resume writer.

Job Title: ${resumeInfo?.jobTitle || "Software Developer"}

Task:
Write a 4–6 line resume summary for each of the following experience levels:
- Fresher
- Mid-Level
- Experienced

Return ONLY in this strict JSON format:

[
  {
    "experienceLevel": "Fresher",
    "summary": "..."
  },
  {
    "experienceLevel": "Mid-Level",
    "summary": "..."
  },
  {
    "experienceLevel": "Experienced",
    "summary": "..."
  }
]
`;

    try {
      const result = await AIChatSession.sendMessage(PROMPT);
      const rawText = await result.response.text();

      console.log("Raw Text From Gemini:", rawText);

      if (!rawText || rawText.trim() === "") {
        throw new Error("No text returned from Gemini");
      }

      const cleanedText = rawText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(cleanedText);
      const summaryList = Array.isArray(parsed) ? parsed : [parsed];

      console.log("Parsed Summary List:", summaryList);

      setAiGeneretedSummaryList(summaryList);
    } catch (error) {
      console.error("AI Error:", error.message);
      toast.error("Gemini returned bad data. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle using AI generated summary
  const handleUseSummary = (aiSummary) => {
    setSummary(aiSummary);
    enabledNext(false); // Disable next since data changed
  };

  const onSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      data: {
        summary: summary,
      },
    };

    try {
      const resp = await GlobalApi.UpdateResumeDetail(params?.resumeId, data);
      console.log(resp);
      enabledNext(true);
      toast("Summary updated!");
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update summary");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-4">
        <h2 className="font-bold text-lg">Summary Detail</h2>
        <p>Add summary for your job title</p>

        <form className="mt-7" onSubmit={onSave}>
          <div className="flex justify-between items-end">
            <label>Add Summary</label>
            <Button
              type="button"
              className="border-primary text-primary flex gap-2"
              size="sm"
              variant="outline"
              onClick={GenerateSummaryFromAI}
              disabled={loading}
            >
              <Brain className="h-4 w-4" /> 
              {loading ? "Generating..." : "Generate from AI"}
            </Button>
          </div>

          <Textarea
            className="mt-5"
            value={summary}
            onChange={handleSummaryChange}
            placeholder="Enter your professional summary here..."
            required
          />

          <div className="mt-2 flex justify-end">
            <Button type="submit" disabled={loading || !summary.trim()}>
              {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
            </Button>
          </div>
        </form>
      </div>

      {aiGeneretedSummaryList && (
        <div className="mt-6 p-4 bg-muted rounded-lg border">
          <h2 className="font-bold text-lg mb-3">AI Suggestions</h2>
          {aiGeneretedSummaryList.map((item, index) => (
            <div
              key={index}
              className="border p-3 rounded my-2 bg-white shadow-sm"
            >
              <h3 className="font-semibold text-primary">
                Level: {item.experienceLevel}
              </h3>
              <p className="text-sm mt-1">{item.summary}</p>
              <Button
                size="sm"
                className="mt-2"
                onClick={() => handleUseSummary(item.summary)}
              >
                Use This Summary
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Summary;