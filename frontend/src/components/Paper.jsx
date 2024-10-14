import React, { useState, useEffect } from 'react';
import Bot from './chat/bot.png';
import ToggleBot from './ToggleBot';
import './PdfViewer.css';

const Paper = ({ isChatOpen, toggleChat, selected_year, handleClose }) => {
    const [selectedTest, setSelectedTest] = useState(1);  // State for selected test
    const [testContent, setTestContent] = useState('');   // State for loaded text content
    const tests = Array.from({ length: 16 }, (_, i) => `Test ${i + 1}`);  // Test list

    // Fetch the content of the selected test
    useEffect(() => {
        const fetchTestContent = async () => {
            try {
                // Adjust the path according to the public folder structure
                const response = await fetch(`/pastpapers/${selected_year}/Test ${selectedTest}.txt`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const text = await response.text();
                setTestContent(text);  // Set the content to state
            } catch (error) {
                console.error('Error fetching the test content:', error);
                setTestContent('Error loading test content.');
            }
        };

        fetchTestContent();
    }, [selectedTest, selected_year]);  // Re-fetch when the selected test or year changes

    return (
        <>
            <div className='flex h-screen'>
                {/* Sidebar for Test Selection */}
                <nav className='w-48 bg-green-100 p-4 overflow-y-auto' style={{ marginLeft: '38px' }}>
                    <h2 className="font-bold mb-4">Tests</h2>
                    <ul>
                        {tests.map((test, index) => (
                            <li
                                key={index}
                                className={`cursor-pointer mb-2 p-2 rounded ${
                                    selectedTest === index + 1 ? 'bg-green-700 text-white' : 'bg-white'
                                } hover:bg-blue-300`}
                                onClick={() => setSelectedTest(index + 1)}  // Update selected test
                            >
                                {test}
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Text Viewer */}
                <div className='flex-1 p-4 overflow-y-auto'>
                    <h2 className="font-bold mb-4">Test {selectedTest} Content</h2>
                    <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">
                        {testContent}  {/* Display the fetched test content */}
                    </pre>
                </div>
            </div>

            {/* Chat Button */}
            <div className='flex-shrink-0'>
                <div
                    className={`absolute bottom-4 right-12 ml-16 sm:ml-0 mb-10 mr-4 bg-[#04aaa2] rounded-md shadow-lg pt-2 transition-all duration-300 transform ${
                        isChatOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                    } ${isChatOpen ? 'visible' : 'invisible'} w-full h-full md:w-custom-lg md:h-custom-lg md:bottom-4 md:right-12`}
                >
                    <ToggleBot selected_year={selected_year} handleClose={handleClose} />
                </div>
                <button
                    className='absolute bottom-4 mt-2 right-8 p-3 cursor-pointer'
                    onClick={toggleChat}
                >
                    <img src={Bot} alt="Bot" className="h-12 w-12" />
                </button>
            </div>
        </>
    );
};

export default Paper;
