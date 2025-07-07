import { Input } from "@/components/ui/input";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle } from "lucide-react";
import { ResumeInfoContext } from "../../../../context/ResumeInfoContext";
import { useParams } from "react-router-dom";
import GlobalApi from "../../../../../services/GlobalApi";
import { toast } from "sonner";

function Education({ enabledNext }) {
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

  const formField = {
    universityName: "",
    degree: "",
    major: "",
    startDate: "",
    endDate: "",
    description: "",
  };

  const [educationalList, setEducationalList] = useState([]);

  // Initialize educationalList with existing data or default empty form
  useEffect(() => {
    if (resumeInfo?.education && resumeInfo.education.length > 0) {
      setEducationalList(resumeInfo.education);
    } else {
      setEducationalList([{ ...formField }]);
    }
  }, [resumeInfo?.education]);

  const handleChange = (event, index) => {
    enabledNext && enabledNext(false); // Disable next when user starts editing
    const newEntries = educationalList.slice();
    const { name, value } = event.target;
    newEntries[index][name] = value;
    setEducationalList(newEntries);
  };

  const AddNewEducation = () => {
    setEducationalList([
      ...educationalList,
      { ...formField }
    ]);
  };

  const RemoveEducation = () => {
    if (educationalList.length > 1) {
      setEducationalList((educationalList) => educationalList.slice(0, -1));
    }
  };

  // Update resumeInfo whenever educationalList changes
  useEffect(() => {
    if (educationalList.length > 0) {
      setResumeInfo({
        ...resumeInfo,
        education: educationalList,
      });
    }
  }, [educationalList]);

 const onSave = () => {
  setLoading(true);

  const cleanedEducation = educationalList.map((edu) => ({
    universityName: edu.universityName?.trim() || "Untitled University",
    degree: edu.degree?.trim() || "",
    major: edu.major?.trim() || "",
    startDate: edu.startDate || null, // must be YYYY-MM-DD or null
    endDate: edu.endDate || null,
    description: edu.description || ""
  }));

  const data = {
    data: {
      education: cleanedEducation
    }
  };

  console.log("Sending to Strapi:", JSON.stringify(data, null, 2));

  GlobalApi.UpdateResumeDetail(params.resumeId, data)
    .then((resp) => {
      console.log(resp);
      setLoading(false);
      enabledNext && enabledNext(true);
      toast("Educational Details Updated!");
    })
    .catch((error) => {
      console.error("Update failed", error);
      console.log("Strapi says:", JSON.stringify(error?.response?.data, null, 2));
      setLoading(false);
      toast.error("Server Error, Please try again!");
    });
};


  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-4">
      <h2 className="font-bold text-lg">Education</h2>
      <p>Add your educational details</p>
      <div>
        {educationalList.map((item, index) => (
          <div key={index}>
            <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
              <div className="col-span-2">
                <label className="text-xs">University Name</label>
                <Input
                  name="universityName"
                  defaultValue={item?.universityName}
                  onChange={(e) => handleChange(e, index)}
                />
              </div>
              <div>
                <label className="text-xs">Degree</label>
                <Input 
                  name="degree" 
                  defaultValue={item?.degree}
                  onChange={(e) => handleChange(e, index)} 
                />
              </div>
              <div>
                <label className="text-xs">Major</label>
                <Input 
                  name="major" 
                  defaultValue={item?.major}
                  onChange={(e) => handleChange(e, index)} 
                />
              </div>
              <div>
                <label className="text-xs">Start Date</label>
                <Input
                  type="date"
                  name="startDate"
                  defaultValue={item?.startDate}
                  onChange={(e) => handleChange(e, index)}
                />
              </div>
              <div>
                <label className="text-xs">End Date</label>
                <Input
                  type="date"
                  name="endDate"
                  defaultValue={item?.endDate}
                  onChange={(e) => handleChange(e, index)}
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs">Description</label>
                <Textarea
                  name="description"
                  defaultValue={item?.description}
                  onChange={(e) => handleChange(e, index)}
                  placeholder="Brief description of your education, achievements, or relevant coursework..."
                />
              </div>
            </div>
          </div>
        ))}
        <div className="flex justify-between">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="text-primary"
              onClick={AddNewEducation}
            >
              + Add More Education
            </Button>
            <Button
              type="button"
              variant="outline"
              className="text-primary"
              onClick={RemoveEducation}
              disabled={educationalList.length <= 1}
            >
              - Remove
            </Button>
          </div>
          <Button type="button" disabled={loading} onClick={onSave}>
            {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Education;