import React, { useEffect, useRef, useState } from 'react';
import Bot from './chat/bot.png';
import ToggleBot from './ToggleBot';
import * as pdfjsLib from 'pdfjs-dist';

// Dynamically import the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.mjs',
    import.meta.url
  ).toString();
const Paper = ({ pdfUrl, isChatOpen, toggleChat, selected_year, handleClose }) => {
    const canvasRef = useRef(null);
    const [pdfDocument, setPdfDocument] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const renderTaskRef = useRef(null);

    useEffect(() => {
        const loadPDF = async () => {
            try {
                const loadingTask = pdfjsLib.getDocument(pdfUrl);
                const pdf = await loadingTask.promise;
                setPdfDocument(pdf);
                setTotalPages(pdf.numPages);
            } catch (error) {
                console.error('Error loading PDF:', error);
            }
        };

        if (pdfUrl) {
            loadPDF();
        }

        return () => {
            if (renderTaskRef.current) {
                renderTaskRef.current.cancel();
            }
        };
    }, [pdfUrl]);

    useEffect(() => {
        const renderPage = async () => {
            if (pdfDocument && canvasRef.current) {
                try {
                    const page = await pdfDocument.getPage(currentPage);
                    const viewport = page.getViewport({ scale: 1 });
                    const canvas = canvasRef.current;
                    const context = canvas.getContext('2d');

                    // Calculate scale to fit the canvas width
                    const scale = canvas.clientWidth / viewport.width;
                    const scaledViewport = page.getViewport({ scale });

                    canvas.height = scaledViewport.height;
                    canvas.width = scaledViewport.width;

                    const renderContext = {
                        canvasContext: context,
                        viewport: scaledViewport
                    };

                    if (renderTaskRef.current) {
                        renderTaskRef.current.cancel();
                    }
                    renderTaskRef.current = page.render(renderContext);
                    try {
                        await renderTaskRef.current.promise;
                    } catch (error) {
                        if (error.name !== 'RenderingCancelledException') {
                            console.error('Error rendering PDF:', error);
                        }
                    }
                } catch (error) {
                    console.error('Error getting PDF page:', error);
                }
            }
        };

        renderPage();
    }, [pdfDocument, currentPage]);

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    if (!pdfUrl) return null;

    return (
        <>
            <div className='relative max-w-4xl mx-auto p-4 mt-16 sm:mt-0'>
                <canvas ref={canvasRef} className='w-full' />
                <div className='mt-4 flex justify-center items-center'>
                    <button 
                        onClick={goToPreviousPage} 
                        disabled={currentPage === 1}
                        className='px-4 py-2 bg-blue-500 text-white rounded mr-2 disabled:bg-gray-300'
                    >
                        Previous
                    </button>
                    <span>{currentPage} / {totalPages}</span>
                    <button 
                        onClick={goToNextPage} 
                        disabled={currentPage === totalPages}
                        className='px-4 py-2 bg-blue-500 text-white rounded ml-2 disabled:bg-gray-300'
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Chat Button */}
            <div className='flex-shrink-0'>
                {/* Chatbot Container - Always rendered */}
                <div
                    className={`absolute bottom-4 right-12 ml-16 sm:ml-0 mb-10 mr-4 bg-[#04aaa2] rounded-md shadow-lg pt-2 transition-all duration-300 transform ${
                        isChatOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                    } ${
                        isChatOpen ? 'visible' : 'invisible'
                    } w-full h-full md:w-custom-lg md:h-custom-lg md:bottom-4 md:right-12`}
                >
                    <ToggleBot selected_year={selected_year} handleClose={handleClose} />
                </div>

                {/* Toggle Button */}
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
