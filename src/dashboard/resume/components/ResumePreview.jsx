import React, { useContext } from "react";
import { ResumeInfoContext } from "../../../context/ResumeInfoContext";
import PersonalDetailPreview from "./preview/PersonalDetailPreview";
import SummaryPreview from "./preview/SummaryPreview";
import ExperiencePreview from "./preview/ExperiencePreview";
import EducationalPreview from "./preview/EducationalPreview";
import SkillPreview from "./preview/SkillPreview";
import AnalysisModal from "./analysis/AnalysisModal";

function ResumePreview() {
    
     const {resumeInfo}=useContext(ResumeInfoContext);
  return (
    
    <div 
      style={{
        background: "white",
        borderColor: resumeInfo?.themeColor,
        borderTop: "4px solid",
        padding: "12mm 14mm",
        margin: 0,
        width: "100%",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        fontSize: "11px",
        fontFamily: "'Segoe UI', 'Open Sans', Tahoma, sans-serif"
      }}
      className="@media print { box-shadow: none; padding: 10mm; margin: 0; }"
    >
      {/* Personal Details */}
      <PersonalDetailPreview resumeInfo={resumeInfo} />
      {/* Summary */}
      <SummaryPreview resumeInfo={resumeInfo}/>
      {/* Professional experience */}
      <ExperiencePreview resumeInfo={resumeInfo}/>

      {/* Education */}
    <EducationalPreview resumeInfo={resumeInfo}/>
       {/* Skills */}
    <SkillPreview resumeInfo={resumeInfo}/>
    </div>
  );
}

export default ResumePreview;
