import { Download, Eye, LoaderCircle, MoreVerticalIcon, Notebook, Pen, Trash } from "lucide-react";
import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom"; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import GlobalApi from "../../../services/GlobalApi";
import { toast } from "sonner";
import { ResumeInfoContext } from "../../context/ResumeInfoContext";



function ResumeCardItem({ resume , refreshData }) {

const {resumeInfo,setResumeInfo}=useState([]);


  const navigation=useNavigate();
 
  const [openAlert,setOpenAlert]=useState(false);

   const onDelete=()=>{
    setLoading(true)
   GlobalApi.DeleteResumeById(resume.documentId).then(resp=>{
    console.log(resp);
    toast('Resume Deleted !')
    refreshData();
    setLoading(false);
    setOpenAlert(false);
   },(error)=>{
    setLoading(false)
   })
   }

   const [loading,setLoading]=useState(false)

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
  <div className="pt-1 border border-primary rounded-lg
      hover:scale-105 transition-all hover:shadow-md shadow-primary" 
       style={{
       background: resume?.themeColor ? resume.themeColor : "#23242a",
         borderColor:resume?.themeColor ? resume.borderColor:"#23242a",
       }}
      >
  <Link to={`/dashboard/resume/${resume.documentId}/edit`}>

      <div className="p-14 bg-gradient-to-r from-indigo-200 via-purple-300 to-pink-300 flex items-center 
      justify-center h-[280px] border border-primary rounded-t" 
      style={{
        borderColor:resume?.themeColor
  }}>
       <img src="public\cv.png" alt="cv image" width={100} height={100} />
      </div>
     
    </Link>
     <div className="border-none rounded-b-xl p-3 flex justify-between text-white"
       style={{
        background:resume?.themeColor
       }}
      >
 <h2 className="text-center my-1">{resume?.title || "Untitled Resume"}</h2>
     <DropdownMenu>
  <DropdownMenuTrigger> <MoreVerticalIcon className="h-4 w-4 cursor-pointer" /></DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={()=>navigation(`/dashboard/resume/${resume.documentId}/edit`)}> <Pen/> Edit</DropdownMenuItem>
    <DropdownMenuItem onClick={()=>navigation(`/my-resume/${resume.documentId}/view`)}> <Eye/> View</DropdownMenuItem>
    <DropdownMenuItem onClick={()=>navigation(`/my-resume/${resume.documentId}/view`)}> <Download/> Download</DropdownMenuItem>
    <DropdownMenuItem onClick={()=>setOpenAlert(true)}> <Trash/> Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
     

     <AlertDialog open={openAlert}>

  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your resume
        and remove your resume data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel onClick={()=>setOpenAlert(false)}>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={onDelete}
      disabled={loading}
      >
        {loading? <LoaderCircle className="animate-spin" />:'Continue'}
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
     
      </div>
    </div>
</ResumeInfoContext.Provider>
    
  );
}

export default ResumeCardItem;
