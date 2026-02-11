import React from 'react'

function SummaryPreview({resumeInfo}) {
  return (
    <div style={{ marginBottom: "12pt" }}>
      {resumeInfo?.summary && (
        <>
          <p style={{ fontSize: "11pt", fontWeight: "bold", margin: "0 0 6pt 0", lineHeight: "1.2", textTransform: "uppercase", letterSpacing: "0.5px" }}>PROFESSIONAL SUMMARY</p>
          <hr style={{ margin: "0 0 6pt 0", padding: 0, border: "none", height: "0.5px", backgroundColor: "#ddd" }} />
          <p style={{ fontSize: "10pt", lineHeight: "1.5", margin: "0", whiteSpace: "pre-wrap", color: "#333" }}>
            {resumeInfo?.summary}
          </p>
        </>
      )}
    </div>
  )
}

export default SummaryPreview