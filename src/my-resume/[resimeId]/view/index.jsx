import React, { useEffect, useState } from 'react'
import Header from '../../../components/custom/Header'
import { Button } from '../../../components/ui/button'
import ResumePreview from '../../../dashboard/resume/components/ResumePreview'
import { ResumeInfoContext } from '../../../context/ResumeInfoContext'
import { useParams } from 'react-router-dom'
import GlobalApi from '../../../../services/GlobalApi'
import { RWebShare } from 'react-web-share'
import AnalysisModal from '../../../dashboard/resume/components/analysis/AnalysisModal'

function ViewResume() {
    const [resumeInfo,setResumeInfo]=useState();
    const {resumeId}=useParams();
   
    useEffect(()=>{
        GetResumeInfo();
    },[])

    const GetResumeInfo=()=>{
        GlobalApi.GetResumeById(resumeId).then(resp=>{
            console.log(resp)
            setResumeInfo(resp.data.data)
        })
    }
    
    const HandleDownload=()=>{
        // Add print styles dynamically
        const printStyles = `
            @page {
                size: A4;
                margin: 0;
                padding: 0;
            }
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                margin: 0;
                padding: 0;
                background: white;
            }
            
            #no-print {
                display: none;
            }
            
            #print-area {
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
                background: white;
            }
            
            #print-area div {
                margin: 0;
                padding: 0;
            }
            
            .shadow-lg {
                box-shadow: none !important;
                border: none !important;
                margin: 0 !important;
                padding: 10mm !important;
                width: 100%;
                background: white;
            }
            
            html, body {
                width: 100%;
                height: 100%;
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = printStyles;
        document.head.appendChild(style);
        
        setTimeout(() => {
            window.print();
            document.head.removeChild(style);
        }, 100);
    }

  return (
    <ResumeInfoContext.Provider value={{resumeInfo,setResumeInfo}}>
        <div id="no-print">
        <Header/>
       <div className='my-10 mx-10 md:mx-20 lg:mx-36'>
        <h2 className='text-center text-2xl font-medium'>Congrats! Your Ultimate AI generated Resume is Ready!</h2>
        <p className='text-center text-gray-400'>Now you are ready to download your resume and you can share your resume url with anyone</p>
        <div className='flex justify-between px-44 my-10'>
            <Button onClick={HandleDownload}>Download</Button>
<div className="flex justify-end">
        <AnalysisModal />
      </div>
            <RWebShare
        data={{
          text: "Hi everyone ,This is my resume please click the url to see it.",
          url:import.meta.env.VITE_BASE_URL+"my-resume/"+resumeId+"/view",
          title: resumeInfo?.firstName+" "+resumeInfo?.lastName+" resume" ,
        }}
        onClick={() => console.log("shared successfully!")}
      >
            <Button>Share</Button>
            </RWebShare>
        </div>
        </div>
       </div>
       <div style={{ margin: 0, padding: 0 }}>
        <div id="print-area" style={{ margin: 0, padding: 0, width: "100%", minHeight: "100vh", background: "white" }}>
            <ResumePreview/>
        </div>
       </div>
     
    </ResumeInfoContext.Provider>
  )
}

export default ViewResume