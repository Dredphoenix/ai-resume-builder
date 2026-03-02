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

  const handleRefreshData = () => {
    if (user && user.primaryEmailAddress) {
      GetResumeList(user.primaryEmailAddress.emailAddress);
    }
  };

  return (
    <div>
      <div className='p-6 sm:p-10 md:px-20 lg:px-32'>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className='font-bold text-2xl sm:text-3xl'>My Resume</h2>
            <p className='text-sm text-gray-600'>Start creating AI resume for your next job role.</p>
          </div>

          <div className="flex-shrink-0">
            <Link to="/home">
              <Button className="text-sm rounded-lg shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
            </Link>
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mt-6 gap-4'>
          <AddResume />
          {resumeList.length > 0 &&
            resumeList.map((resume, index) => (
              <ResumeCardItem resume={resume} key={index} refreshData={handleRefreshData} />
            ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
