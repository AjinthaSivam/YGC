import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Paper from '../components/Paper';
import { useNavigate, useParams } from 'react-router-dom';

const PastpaperContent = () => {
  const { year } = useParams();  // Get the year parameter from the URL
  const [pdfUrl, setPdfUrl] = useState(null);  // State for the past paper URL
  const [isChatOpen, setIsChatOpen] = useState(false);  // State for chatbot visibility
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);  // Detect if the device is mobile
  const navigate = useNavigate();

  // Function to toggle the chatbot
  const toggleChat = () => {
    if (isMobile) {
      // Navigate to the chatbot page on mobile
      navigate('/togglebot', { state: year });
      setIsChatOpen(false);
    } else {
      // Toggle chatbot visibility on larger screens
      setIsChatOpen(!isChatOpen);
    }
  };

  // Fetch the PDF URL when the year changes
  useEffect(() => {
    const fetchPdfUrl = async () => {
      const url = `/pastpapers/${year}.pdf`;  // Construct the PDF URL
      setPdfUrl(url);  // Set the URL to state
    };

    fetchPdfUrl();
  }, [year]);

  // Handle screen resizing to detect mobile view dynamically
  useEffect(() => {
    const handleResize = () => {
      const isCurrentlyMobile = window.innerWidth <= 768;
      if (isMobile !== isCurrentlyMobile) {
        setIsMobile(isCurrentlyMobile);  // Update `isMobile` state when screen size changes
        if (isCurrentlyMobile && isChatOpen) {
          setIsChatOpen(false);  // Close the chatbot if switching to mobile and chat is open
        }
      }
    };

    // Attach the event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener when the component unmounts
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile, isChatOpen]);

  // Ensure PDF URL is set before rendering the Paper component
  if (!pdfUrl) {
    return <div>Loading past paper...</div>;  // Show a loading message while fetching the PDF
  }

  return (
    <div className='bg-white'>
      <NavBar />
      <div className='h-screen flex pt-16'>
        <SideBar />
        <div className='w-full p-4'>
          {/* Render the Paper component only when pdfUrl is available */}
          <Paper
            pdfUrl={pdfUrl}
            isChatOpen={isChatOpen}
            toggleChat={toggleChat}
            selected_year={year}
            isMobile={isMobile}
          />
        </div>
      </div>
    </div>
  );
};

export default PastpaperContent;
