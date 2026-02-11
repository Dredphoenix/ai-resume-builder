import React from 'react'

function SkillPreview({resumeInfo}) {
  return (
    <div style={{ marginBottom: "0" }}>
      {Array.isArray(resumeInfo?.Skills) && resumeInfo?.Skills.length > 0 ? (
        <>
          <p style={{ fontSize: "11pt", fontWeight: "bold", margin: "0 0 6pt 0", lineHeight: "1.2", textTransform: "uppercase", letterSpacing: "0.5px" }}>SKILLS</p>
          <hr style={{ margin: "0 0 8pt 0", padding: 0, border: "none", height: "0.5px", backgroundColor: "#ddd" }} />
          <p style={{ fontSize: "10pt", lineHeight: "1.6", margin: "0", color: "#333" }}>
            {resumeInfo?.Skills?.map((skill) => skill?.name).filter(Boolean).join(" | ")}
          </p>
        </>
      ) : null}
    </div>
  )
}

export default SkillPreview