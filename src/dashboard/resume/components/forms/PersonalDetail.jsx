import React, { useContext, useEffect, useState } from "react";
import { ResumeInfoContext } from "../../../../context/ResumeInfoContext";
import {Input} from '@/components/ui/input'
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import GlobalApi from "../../../../../services/GlobalApi";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

function PersonalDetail({enabledNext}) {
  const params=useParams();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
   const [formData,setFormData]=useState();
   const[loading,setLoading]=useState(false);

 useEffect(()=>{
  console.log(params)
 },[])
console.log("Form data",formData);
  const handldeInputChange=(e)=>{
   enabledNext(false)
   const {name,value}=e.target;

   setFormData({
    ...formData,
    [name]:value
   })

   setResumeInfo({
    ...resumeInfo,
    [name]:value
   })

   }

   const onSave=(e)=>{
    e.preventDefault();
    setLoading(true);
    const data={
      data:formData
    }
    GlobalApi.UpdateResumeDetail(params?.resumeId,data).then(resp=>{
   console.log(resp);
    enabledNext(true);
    setLoading(false);
    toast("Details updated!");
    },(error)=>{
      setLoading(false);
    })

   } 
   useEffect(() => {
  const isNextEnabled = localStorage.getItem("nextEnabled");
  if (isNextEnabled === "true") {
    enabledNext(true);
  } else {
      enabledNext(true)
     
  }
}, []);

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-4">
      <h2 className="font-bold text-lg">Personal Detail</h2>
      <p>Get Started with the basic information</p>
      <form onSubmit={onSave}>
        <div className="grid grid-cols-2 mt-5 gap-3">
          <div>
            <label className="text-sm">First Name</label>
            <Input name="firstName" defaultValue={resumeInfo?.firstName} required onChange={handldeInputChange}/>
          </div>
            <div>
            <label className="text-sm">Last Name</label>
            <Input name="lastName" defaultValue={resumeInfo?.lastName} required onChange={handldeInputChange}/>
          </div>
            <div className="col-span-2">
            <label className="text-sm">Job Title</label>
            <Input name="jobTitle" defaultValue={resumeInfo?.jobTitle} required onChange={handldeInputChange}/>
          </div>
            <div className="col-span-2">
            <label className="text-sm">Address</label>
            <Input name="address" defaultValue={resumeInfo?.address} required onChange={handldeInputChange}/>
          </div>
            <div>
            <label className="text-sm">Phone</label>
            <Input name="phone" defaultValue={resumeInfo?.phone} className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]" type="number" required onChange={handldeInputChange}/>
          </div>
            <div>
            <label className="text-sm">Email</label>
            <Input name="email" type="email" defaultValue={resumeInfo?.email} required onChange={handldeInputChange}/>
          </div>
        </div>
        <div className="mt-3 flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading?<LoaderCircle className="animate-spin"/>:'Save'}
              </Button>
          </div>
      </form>
    </div>
  );
}

export default PersonalDetail;
 