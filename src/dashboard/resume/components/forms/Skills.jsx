import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from 'lucide-react';
import { ResumeInfoContext } from '../../../../context/ResumeInfoContext';
import { useParams } from 'react-router-dom';
import GlobalApi from '../../../../../services/GlobalApi';
import { toast } from 'sonner';

function Skills() {
  const { resumeId } = useParams();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [skillsList, setSkillsList] = useState([{ name: '' }]);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    let loadedFromContext = false;

    if (resumeInfo?.Skills && Array.isArray(resumeInfo.Skills) && resumeInfo.Skills.length > 0) {
      const validSkills = resumeInfo.Skills
        .filter(skill => skill && skill.name && skill.name.trim() !== '')
        .map(s => ({ name: s.name.trim() }));
      if (validSkills.length > 0) {
        setSkillsList(validSkills);
        loadedFromContext = true;
      }
    }

    if (!loadedFromContext && resumeId) {
      GlobalApi.GetResumeById(resumeId)
        .then((resp) => {
          const data = resp?.data?.data?.attributes;
          if (data?.Skills && Array.isArray(data.Skills) && data.Skills.length > 0) {
            const validSkills = data.Skills
              .filter(skill => skill && skill.name && skill.name.trim() !== '')
              .map(s => ({ name: s.name.trim() }));
            setSkillsList(validSkills.length > 0 ? validSkills : [{ name: '' }]);
            setResumeInfo(prev => ({ ...prev, Skills: validSkills }));
          } else {
            setSkillsList([{ name: '' }]);
          }
          setDataLoaded(true);
        })
        .catch((err) => {
          console.error("Failed to load skills:", err);
          toast.error("Failed to load skills");
          setSkillsList([{ name: '' }]);
          setDataLoaded(true);
        });
    } else {
      setDataLoaded(true);
    }
  }, [resumeId]);

  useEffect(() => {
    if (dataLoaded) {
      setResumeInfo(prev => ({
        ...prev,
        Skills: skillsList
      }));
    }
  }, [skillsList, dataLoaded, setResumeInfo]);

  const handleChange = useCallback((index, name, value) => {
    setSkillsList(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [name]: value
      };
      return updated;
    });
  }, []);

  const AddNewSkill = useCallback(() => {
    setSkillsList(prev => [...prev, { name: '' }]);
  }, []);

  const RemoveSkill = useCallback(() => {
    setSkillsList(prev => prev.length > 1 ? prev.slice(0, -1) : prev);
  }, []);

  const onSave = useCallback(async () => {
    if (!dataLoaded) {
      toast.error("Please wait for data to load before saving!");
      return;
    }

    setLoading(true);

    const cleaned = skillsList
      .filter(skill => skill && skill.name && skill.name.trim() !== '')
      .map(skill => ({ name: skill.name.trim() }));

    if (cleaned.length === 0) {
      toast.error("Please add at least one valid skill");
      setLoading(false);
      return;
    }

    const payload = {
      data: { Skills: cleaned }
    };

    console.log("Final payload sent to Strapi:", JSON.stringify(payload, null, 2));

    try {
      const resp = await GlobalApi.UpdateResumeDetail(resumeId, payload);
      console.log("Save successful:", resp);
      toast.success("Skills updated successfully!");
    } catch (err) {
      console.error("Save failed:", err?.response?.data || err.message);
      toast.error("Failed to save skills. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [skillsList, resumeId, dataLoaded]);

  return (
    <div className="p-5 sm:p-6 shadow-lg rounded-lg border-t-primary border-t-4 mt-4">
      <h2 className="font-bold text-lg">Skills</h2>
      <p>Add your professional key skills</p>

      <div className="mt-4">
        {skillsList.map((item, index) => (
          <div key={`skill-${index}`} className="mb-4">
            <div className="border rounded-lg p-3">
              <label className="text-xs font-medium text-gray-600">Skill Name</label>
              <Input
                value={item.name || ''}
                onChange={(e) => handleChange(index, 'name', e.target.value)}
                placeholder="e.g., JavaScript, Project Management"
                className="mt-1 w-full"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" className="text-primary w-full sm:w-auto" onClick={AddNewSkill} type="button">
            + Add More Skills
          </Button>
          <Button
            variant="outline"
            className="text-primary w-full sm:w-auto"
            onClick={RemoveSkill}
            disabled={skillsList.length <= 1}
            type="button"
          >
            - Remove
          </Button>
        </div>
        <div className="w-full sm:w-auto">
          <Button type="button" disabled={loading} onClick={onSave} className="w-full sm:w-auto">
            {loading ? (
              <>
                <LoaderCircle className="animate-spin w-4 h-4 mr-2" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Skills;
