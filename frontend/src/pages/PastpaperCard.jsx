import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import PastPaper from '../components/pastpaper/PastPaper';
import { useNavigate } from 'react-router-dom';
import { PremiumProvider } from '../components/contexts/PremiumContext'

const PastpaperCard = () => {
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [selectedYear, setSelectedYear] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Detect if screen is mobile
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Function to handle selecting a paper
  const handleSelectPaper = (paperUrl) => {
    setSelectedPaper(paperUrl);

    if (isMobile) {
      // If on mobile, navigate to a new page showing the past paper
      navigate(`/pastpaper/${selectedYear}`); // Navigate to the past paper detail page
    }
  };

  // Function to handle selecting a year
  const handleSelectYear = (year) => {
    setSelectedYear(year);
  };

  // Detect if the screen size is mobile or not
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <PremiumProvider>
    <div className='bg-white h-screen flex flex-col'>
      <div className='z-50'>
      <NavBar />  
      </div>
      <div className='flex-1 flex overflow-hidden'>
        <SideBar open={sidebarOpen} setOpen={setSidebarOpen} />
        {/* Pass the handleSelectPaper and handleSelectYear functions to the PastPaper component */}
        <div className={`flex-1 overflow-auto z-30 ${sidebarOpen ? 'sm:ml-80' : 'ml-16'} duration-300`}>
        <PastPaper onSelectPaper={handleSelectPaper} onSelectYear={handleSelectYear} />
        {/* Show selected paper on large screens */}
        {!isMobile && selectedPaper && (
          <div className='w-full p-4'>
            {/* Render the selected paper or an embedded PDF viewer */}
            <iframe src={selectedPaper} className='w-full h-full' title='Past Paper' />
          </div>
        )}
        </div>
      </div>
    </div>
    </PremiumProvider>
  );
};

export default PastpaperCard;
