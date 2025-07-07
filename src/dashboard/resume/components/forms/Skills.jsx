import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { Button } from "@/components/ui/button";
import { LoaderCircle } from 'lucide-react';
import { ResumeInfoContext } from '../../../../context/ResumeInfoContext';
import { useParams } from 'react-router-dom';
import GlobalApi from '../../../../../services/GlobalApi';
import { toast } from 'sonner';

function Skills() {
  const { resumeId } = useParams();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [skillsList, setSkillsList] = useState([{ name: '', rating: 0 }]);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    console.log('Initializing skills...');
    let loadedFromContext = false;

    // Check context first
    if (resumeInfo?.Skills && Array.isArray(resumeInfo.Skills) && resumeInfo.Skills.length > 0) {
      const validSkills = resumeInfo.Skills.filter(skill => skill && skill.name && skill.name.trim() !== '');
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
            const validSkills = data.Skills.filter(skill => skill && skill.name && skill.name.trim() !== '');
            setSkillsList(validSkills.length > 0 ? validSkills : [{ name: '', rating: 0 }]);
            setResumeInfo(prev => ({ ...prev, Skills: validSkills }));
          } else {
            setSkillsList([{ name: '', rating: 0 }]);
          }
          setDataLoaded(true);
        })
        .catch((err) => {
          console.error("Failed to load skills:", err);
          toast.error("Failed to load skills");
          setSkillsList([{ name: '', rating: 0 }]);
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
    setSkillsList(prev => [...prev, { name: '', rating: 0 }]);
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
    .filter(skill => skill && skill.name && skill.name.trim() !== '' && skill.rating > 0)
    .map(skill => ({
      name: skill.name.trim(),
      rating: Number(skill.rating)
    }));

  if (cleaned.length === 0) {
    toast.error("Please add at least one valid skill (name + rating > 0)");
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
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-4">
      <h2 className="font-bold text-lg">Skills</h2>
      <p>Add your professional key skills</p>

      <div className="mt-4">
        {skillsList.map((item, index) => (
          <div key={`skill-${index}`} className="mb-4">
            <div className="flex justify-between items-end border rounded-lg p-3 gap-4">
              <div className="flex-1">
                <label className="text-xs font-medium text-gray-600">Skill Name</label>
                <Input
                  value={item.name || ''}
                  onChange={(e) => handleChange(index, 'name', e.target.value)}
                  placeholder="e.g., JavaScript, Project Management"
                  className="mt-1"
                />
              </div>
              <div className="flex flex-col items-center">
                <label className="text-xs font-medium text-gray-600 mb-1">Rating</label>
                <Rating
                  style={{ maxWidth: 120 }}
                  value={item.rating || 0}
                  onChange={(v) => handleChange(index, 'rating', v)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6">
        <div className="flex gap-2">
          <Button variant="outline" className="text-primary" onClick={AddNewSkill} type="button">
            + Add More Skills
          </Button>
          <Button
            variant="outline"
            className="text-primary"
            onClick={RemoveSkill}
            disabled={skillsList.length <= 1}
            type="button"
          >
            - Remove
          </Button>
        </div>
        <Button type="button" disabled={loading} onClick={onSave} className="min-w-[100px]">
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
  );
}

export default Skills;
