import React, { useContext, useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";
import {LayoutGrid, } from "lucide-react";
import { ResumeInfoContext } from '../../../context/ResumeInfoContext';
import { useParams } from 'react-router-dom';
import GlobalApi from '../../../../services/GlobalApi'
import { toast } from 'sonner';



function ThemeColor() {
    const colors = [
    "#1E3A8A", "#2563EB", "#059669", "#D97706",
    "#374151", "#6B7280", "#DC2626", "#EAB308",
    "#10B981", "#4B5563", "#3B82F6", "#7C3AED"
  ];

  const {resumeInfo,setResumeInfo}=useContext(ResumeInfoContext);
  const [selectedColor,setSelectedColor]=useState();
  const {resumeId}=useParams();

  const onColorSelect=(color)=>{
    setSelectedColor(color)
        setResumeInfo({
            ...resumeInfo,
            themeColor:color
        });

  const data={
    data:{
        themeColor:color
    }
  }

  GlobalApi.UpdateResumeDetail(resumeId,data).then(resp=>{
    console.log(resp);
    toast('Theme color updated !')
  })
  }
  
  return (
    <Popover>
  <PopoverTrigger asChild>
      <Button variant="outline" sime="sm" className="flex gap-2">
          <LayoutGrid /> Theme
        </Button>
 </PopoverTrigger>
  <PopoverContent>
    <h2 className='mb-2 text-sm font-bold '>Select the theme</h2>
    <div className='grid grid-cols-5 gap-3'>
    {colors.map((item,index)=>(
        <div 
        onClick={()=>onColorSelect(item)}
        className={`h-5 w-5 rounded-full border cursor-pointer hover:border-black
            ${selectedColor==item && 'border-2 border-black'}`}
        style={{
             background:item
        }}>

        </div>
    ))}
    </div>
  </PopoverContent>
</Popover>
  )
}

export default ThemeColor