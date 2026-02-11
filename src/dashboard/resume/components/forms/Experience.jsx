import { Input } from "@/components/ui/input";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import TiptapEditor from "../TipTapEditor";
import { CandyOff, LoaderCircle } from "lucide-react";
import { ResumeInfoContext } from "../../../../context/ResumeInfoContext";
// import dummy from "../../../../data/dummy";
import { Loader } from 'lucide-react';
import GlobalApi from "../../../../../services/GlobalApi";
import { generateExperienceSummary } from "../../../../../services/AiModel";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

function Experience({enabledNext}) {
  const [loading,setLoading]=useState(false);
  const [aiGeneratingIndex, setAiGeneratingIndex] = useState(null);
  const params = useParams();
  const {resumeInfo,setResumeInfo}=useContext(ResumeInfoContext);

  const formField = {
    title: "",
    companyName: "",
    city: "",
    state: "",
    startDate: "",
    endDate: "",
    workSummary: "",
  };

  const [experienceList, setExperienceList] = useState([]);

  // Initialize experienceList with existing data or default empty form
  useEffect(() => {
    if (resumeInfo?.experience && resumeInfo.experience.length > 0) {
      setExperienceList(resumeInfo.experience);
    } else {
      setExperienceList([{ ...formField }]);
    }
  }, [resumeInfo?.experience]);

  const handleChange = (index, event) => {
    enabledNext(false); // Disable next when user starts editing
    const newEntries = experienceList.slice();
    const { name, value } = event.target;
    newEntries[index][name] = value;
    setExperienceList(newEntries);
  };

  const handleTipTapEditor = (html, index) => {
    enabledNext(false); // Disable next when user starts editing
    const newEntries = [...experienceList];
    newEntries[index].workSummary = html;
    setExperienceList(newEntries);
  };

  // Update resumeInfo whenever experienceList changes
  useEffect(() => {
    if (experienceList.length > 0) {
      setResumeInfo({
        ...resumeInfo,
        experience: experienceList
      });
    }
  }, [experienceList]);

  const AddNewExperience = () => {
    setExperienceList([...experienceList, { ...formField }]);
  };

  const RemoveExperience = () => {
    if (experienceList.length > 1) {
      setExperienceList((experienceList) => experienceList.slice(0, -1));
    }
  };

  const GenerateExperienceSummary = async (index) => {
    const experience = experienceList[index];
    if (!experience.title || !experience.companyName) {
      toast.error("Please enter Position Title and Company Name first");
      return;
    }

    setAiGeneratingIndex(index);
    try {
      const summary = await generateExperienceSummary(
        experience.title,
        experience.companyName,
        experience.startDate,
        experience.endDate
      );

      if (summary && typeof summary === 'string') {
        const newEntries = [...experienceList];
        newEntries[index].workSummary = summary;
        setExperienceList(newEntries);
        toast.success("Experience summary generated!");
      } else if (summary?.error) {
        toast.error("Failed to generate summary: " + summary.error);
      }
    } catch (error) {
      console.error("AI generation error:", error);
      toast.error("Error generating summary. Please try again.");
    } finally {
      setAiGeneratingIndex(null);
    }
  };

const onSave = async (e) => {
  e.preventDefault();
  setLoading(true);

  const cleanedExperience = experienceList.map((exp) => ({
    title: exp.title?.trim() || "Untitled",
    companyName: exp.companyName?.trim() || "",
    city: exp.city?.trim() || "",
    state: exp.state?.trim() || "",
    startDate: exp.startDate || null,
    endDate: exp.endDate || null,
    workSummary: exp.workSummary || ""
  }));

  const data = {
    data: {
      experience: cleanedExperience
    }
  };

  try {
    console.log("Payload:", JSON.stringify(data, null, 2));
    const resp = await GlobalApi.UpdateResumeDetail(params?.resumeId, data);
    console.log(resp);
    enabledNext(true);
    toast("Experience updated!");
  } catch (error) {
    console.error("Update failed", error);
    console.log("Strapi says:", JSON.stringify(error?.response?.data, null, 2));
    toast.error("Failed to update experience");
  } finally {
    setLoading(false);
  }
};

  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-4">
        <h2 className="font-bold text-lg">Experience Detail</h2>
        <p>Add your work experience information</p>
        <form className="mt-7" onSubmit={onSave}>
          <div>      
            {experienceList.map((item, index) => (
              <div key={index}>
                <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
                  <div>
                    <label className="text-xs">Position Title</label>
                    <Input
                      name="title"
                      defaultValue={item?.title}
                      onChange={(event) => handleChange(index, event)}
                    />
                  </div>
                  <div>
                    <label className="text-xs">Company Name</label>
                    <Input
                      name="companyName"
                      defaultValue={item?.companyName}
                      onChange={(event) => handleChange(index, event)}
                    />
                  </div>
                  <div>
                    <label className="text-xs">City</label>
                    <Input
                      name="city"
                      defaultValue={item?.city}
                      onChange={(event) => handleChange(index, event)}
                    />
                  </div>
                  <div>
                    <label className="text-xs">State</label>
                    <Input
                      name="state"
                      defaultValue={item?.state}
                      onChange={(event) => handleChange(index, event)}
                    />
                  </div>
                  <div>
                    <label className="text-xs">Start Date</label>
                    <Input
                      type="date"
                      name="startDate"
                      defaultValue={item?.startDate}
                      onChange={(event) => handleChange(index, event)}
                    />
                  </div>
                  <div>
                    <label className="text-xs">End Date</label>
                    <Input
                      type="date"
                      name="endDate"
                      defaultValue={item?.endDate}
                      onChange={(event) => handleChange(index, event)}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs">Work Summary (Description)</label>
                    <div className="flex gap-2 mb-2">
                      <Button 
                        type="button"
                        variant="outline" 
                        size="sm"
                        className="text-primary"
                        onClick={() => GenerateExperienceSummary(index)}
                        disabled={aiGeneratingIndex === index}
                      >
                        {aiGeneratingIndex === index ? (
                          <>
                            <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          "✨ Generate from AI"
                        )}
                      </Button>
                    </div>
                    <TiptapEditor
                      index={index}
                      content={item?.workSummary || ""}
                      onChange={(html) => handleTipTapEditor(html, index)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Button 
                type="button"
                variant="outline" 
                className="text-primary" 
                onClick={AddNewExperience}
              >
                + Add More Experience
              </Button>
              <Button 
                type="button"
                variant="outline" 
                className="text-primary" 
                onClick={RemoveExperience}
                disabled={experienceList.length <= 1}
              >
                - Remove
              </Button>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Experience;