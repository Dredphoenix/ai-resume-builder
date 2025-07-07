import React, { useEffect, useState } from 'react'
import AddResume from './components/AddResume'
import { useUser } from '@clerk/clerk-react'
import GlobalApi from '../../services/GlobalApi';
import ResumeCardItem from './components/ResumeCardItem';
import { ArrowLeft } from 'lucide-react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

function Dashboard() {
  const { user } = useUser();
  const [resumeList, setResumeList] = useState([]);


  useEffect(() => {
    if (user && user.primaryEmailAddress) {
      GetResumeList(user.primaryEmailAddress.emailAddress);
    }
  }, [user]);

/* used to get user's resume list */

  const GetResumeList = (email) => {
    GlobalApi.GetUserResumes(email)
      .then((resp) => {
       console.log("Fetched resumes from API:", resp.data.data);
        setResumeList(resp.data.data);
      })
      .catch((err) => {
        console.error("Failed to fetch resumes:", err);
      });
  };

  return (
    <div>
      <Link to="/home">
        <Button className="text-sm rounded-lg shadow-lg hover:shadow-xl transition-shadow relative top-5 left-30"
        ><ArrowLeft className="ml-1 w-5 h-5" />  Back
        </Button>
      </Link>
    <div className='p-10 md:px-20 lg:px-32'>
      
      <h2 className='font-bold text-3xl'>My Resume</h2>
      <p>Start creating AI resume for your next job role.</p>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mt-10 gap-5'>
        <AddResume/>
       {resumeList.length > 0 &&
  resumeList.map((resume, index) => (
    <ResumeCardItem resume={resume} key={index} refreshData={GetResumeList} />
))}
</div>
      </div>
      </div>
  );
}

export default Dashboard;
