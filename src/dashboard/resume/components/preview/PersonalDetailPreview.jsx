import React from "react";

function PersonalDetailPreview({ resumeInfo }) {
  return (
    <>
      <p style={{ fontSize: "18pt", fontWeight: "bold", margin: "0 0 6pt 0", lineHeight: "1.1", textAlign: "center", letterSpacing: "0.5px" }}>
        {resumeInfo?.firstName} {resumeInfo?.lastName}
      </p>
      
      <p style={{ fontSize: "9pt", margin: "0 0 8pt 0", lineHeight: "1.4", textAlign: "center" }}>
        {resumeInfo?.email && `${resumeInfo.email}`}
        {resumeInfo?.phone && ` • ${resumeInfo.phone}`}
        {resumeInfo?.address && ` • ${resumeInfo.address}`}
      </p>

      {resumeInfo?.jobTitle && (
        <p style={{ fontSize: "12pt", fontWeight: "bold", margin: "0 0 10pt 0", lineHeight: "1.3", textAlign: "center" }}>
          {resumeInfo?.jobTitle}
        </p>
      )}

      <hr style={{ margin: "8pt 0 10pt 0", padding: 0, border: "none", height: "1.5px", backgroundColor: "#333" }} />
    </>
  );
}

export default PersonalDetailPreview;
