import React from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';
import '@react-pdf-viewer/zoom/lib/styles/index.css';
import Bot from './chat/bot.png';
import ToggleBot from './ToggleBot';
import './PdfViewer.css';

const Paper = ({ pdfUrl, isChatOpen, toggleChat, selected_year, handleClose }) => {
    const toolbarPluginInstance = toolbarPlugin();
    const { Toolbar } = toolbarPluginInstance;

    const zoomPluginInstance = zoomPlugin();
    const { ZoomIn, ZoomOut } = zoomPluginInstance;

    return (
        <>
            <div className='relative max-w-4xl mx-auto p-4 mt-16 sm:mt-16'>
                <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                    <div className="rpv-core__viewer">
                        <div className="rpv-core__toolbar">
                            <Toolbar>
                                {(slots) => {
                                    return (
                                        <div className="rpv-toolbar">
                                            <div className="rpv-toolbar__left">
                                                <div className="rpv-toolbar__item">
                                                    <ZoomOut />
                                                </div>
                                                <div className="rpv-toolbar__item">
                                                    <ZoomIn />
                                                </div>
                                            </div>
                                            <div className="rpv-toolbar__center">
                                                {slots.CurrentPageInput}
                                                {slots.NumberOfPages}
                                            </div>
                                            <div className="rpv-toolbar__right">
                                                {slots.FullScreen}
                                            </div>
                                        </div>
                                    );
                                }}
                            </Toolbar>
                        </div>
                        <div className="rpv-core__viewer-body">
                            <Viewer
                                fileUrl={pdfUrl}
                                plugins={[toolbarPluginInstance, zoomPluginInstance]}
                            />
                        </div>
                    </div>
                </Worker>
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
