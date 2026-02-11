import React from "react";

function EducationalPreview({ resumeInfo }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${month}/${year}`;
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div style={{ marginBottom: "12pt" }}>
      <p style={{ fontSize: "11pt", fontWeight: "bold", margin: "0 0 6pt 0", lineHeight: "1.2", textTransform: "uppercase", letterSpacing: "0.5px" }}>EDUCATION</p>
      <hr style={{ margin: "0 0 8pt 0", padding: 0, border: "none", height: "0.5px", backgroundColor: "#ddd" }} />
      
      {Array.isArray(resumeInfo?.education) && resumeInfo?.education.length > 0 ? (
        <div>
          {resumeInfo.education.map((education, index) => (
            <div key={index} style={{ marginBottom: "8pt", pageBreakInside: "avoid" }}>
              {/* School Name */}
              <p style={{ fontSize: "11pt", fontWeight: "bold", margin: "0 0 2pt 0", lineHeight: "1.2" }}>
                {education?.universityName}
              </p>
              
              {/* Degree and Major */}
              <p style={{ fontSize: "10pt", fontWeight: "bold", margin: "0 0 2pt 0", lineHeight: "1.3" }}>
                {education?.degree}
                {education?.major && ` in ${education?.major}`}
              </p>
              
              {/* Dates */}
              <p style={{ fontSize: "9pt", margin: "0 0 4pt 0", lineHeight: "1.2", color: "#555" }}>
                {formatDate(education?.startDate)} {education?.endDate ? `- ${formatDate(education?.endDate)}` : ""}
              </p>
              
              {/* Description */}
              {education?.description && (
                <p style={{ fontSize: "10pt", lineHeight: "1.5", margin: "0", color: "#333" }}>
                  {education?.description}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default EducationalPreview;
