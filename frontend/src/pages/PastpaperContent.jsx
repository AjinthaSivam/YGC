import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Paper from '../components/Paper';
import { useNavigate, useParams } from 'react-router-dom';
import { PremiumProvider } from '../components/contexts/PremiumContext'

const PastpaperContent = () => {
  const { year } = useParams();  // Get the year parameter from the URL
  const [pdfUrl, setPdfUrl] = useState(null);  // State for the past paper URL
  const [isChatOpen, setIsChatOpen] = useState(false);  // State for chatbot visibility
  const navigate = useNavigate();

  const handleClose = (e) => {
    e.preventDefault()
    setIsChatOpen(false)
  }

  // Function to toggle the chatbot
  const toggleChat = () => {
    if (window.innerWidth <= 768) {  // Small screen (mobile)
      setIsChatOpen(false)
      navigate('/togglebot', { state: year });  // Navigate to the chatbot page on mobile
    } else {
        setIsChatOpen(!isChatOpen);  // Toggle chatbot visibility on larger screens
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

  // Ensure PDF URL is set before rendering the Paper component
  if (!pdfUrl) {
    return <div>Loading past paper...</div>;  // Show a loading message while fetching the PDF
  }

  return (
    <PremiumProvider>
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
            handleClose={handleClose}
          />
        </div>
      </div>
    </div>
    </PremiumProvider>
  );
};

export default PastpaperContent;
