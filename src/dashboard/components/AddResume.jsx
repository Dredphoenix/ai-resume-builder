import React, { useState } from "react";
import { Loader2, PlusSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../../components/ui/button";
import { v4 as uuidv4 } from "uuid";
import GlobalApi from "./../../../services/GlobalApi";
import { useUser } from "@clerk/clerk-react"; 
import { useNavigate } from "react-router-dom";
// if you're using Clerk

function AddResume() {
  const [openDialog, SetOpenDialog] = useState(false);
  const [resumeTitle, SetResumeTitle] = useState("");
  const { user } = useUser();
  const [loading, SetLoading] = useState(false);
  const navigation= useNavigate();

  const onCreate=async()=>{
    SetLoading(true)
    const uuid = uuidv4();
    const data={
      data:{
        title:resumeTitle,
        resumeId:uuid,
        userEmail:user?.primaryEmailAddress?.emailAddress,
        userName:user?.fullName
      }
    }
     GlobalApi.CreateNewResume(data).then(resp=>{
         console.log(resp.data.data.documentId);
         if(resp){
          SetLoading(false)
          navigation(`/dashboard/resume/${resp.data.data.documentId}/edit`);
         }
     },(error)=>{

      SetLoading(false)
     })
  }
 

  return (
    <div>
      <div
        onClick={() => {
          SetOpenDialog(true);
        }}
        className="p-14 py-24 border flex justify-center bg-secondary rounded-lg  h-[280px] hover:scale-105 transition-all hover:shadow-md cursor-pointer"
      >
        <PlusSquare />
      </div>
      
      <Dialog open={openDialog} onOpenChange={SetOpenDialog}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create New Resume</DialogTitle>
      <DialogDescription>
        <p>Add a title for your new resume</p>
        <input
          className="mt-2 p-3 w-full border-2 focus:border-black"
          placeholder="Ex.Full Stack resume"
          type="text"
          value={resumeTitle}
          onChange={(e) => SetResumeTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && resumeTitle !== "") {
              onCreate();
            }
          }}
        />
      </DialogDescription>
      <div className="flex justify-end gap-5 mt-2">
        <Button onClick={() => SetOpenDialog(false)} variant="ghost">
          Cancel
        </Button>
        <Button
          disabled={resumeTitle === "" || loading}
          onClick={() => onCreate()}
        >
          {loading ? <Loader2 className="animate-spin" /> : "Create"}
        </Button>
      </div>
    </DialogHeader>
  </DialogContent>
</Dialog>
    </div>
  );
}

export default AddResume;
