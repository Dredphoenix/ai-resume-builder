import React from "react";

function formatDate(dateStr) {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${year}`;
  } catch (e) {
    return dateStr;
  }
}

function ExperiencePreview({ resumeInfo }) {
  return (
    <div style={{ marginBottom: "12pt" }}>
      <p style={{ fontSize: "11pt", fontWeight: "bold", margin: "0 0 6pt 0", lineHeight: "1.2", textTransform: "uppercase", letterSpacing: "0.5px" }}>PROFESSIONAL EXPERIENCE</p>
      <hr style={{ margin: "0 0 8pt 0", padding: 0, border: "none", height: "0.5px", backgroundColor: "#ddd" }} />
      
      {Array.isArray(resumeInfo?.experience) && resumeInfo?.experience.length > 0 ? (
        <div>
          {resumeInfo.experience.map((experience, index) => (
            <div key={index} style={{ marginBottom: "10pt", pageBreakInside: "avoid" }}>
              <p style={{ fontSize: "11pt", fontWeight: "bold", margin: "0 0 2pt 0", lineHeight: "1.2" }}>
                {experience?.title}
              </p>
              
              <p style={{ fontSize: "10pt", fontWeight: "bold", margin: "0 0 2pt 0", lineHeight: "1.3" }}>
                {experience?.companyName}
                {experience?.city && `, ${experience?.city}`}
                {experience?.state && `, ${experience?.state}`}
              </p>
              
              <p style={{ fontSize: "9pt", margin: "0 0 4pt 0", lineHeight: "1.2", color: "#555" }}>
                {formatDate(experience?.startDate)} {experience?.endDate ? `- ${formatDate(experience?.endDate)}` : (experience?.currentlyWorking ? "- Present" : "")}
              </p>
              
              {experience?.workSummary && (
                <p style={{ fontSize: "10pt", lineHeight: "1.5", margin: "0", whiteSpace: "pre-wrap", color: "#333" }}>
                  {experience?.workSummary.replace(/<[^>]*>/g, '').trim()}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default ExperiencePreview;
