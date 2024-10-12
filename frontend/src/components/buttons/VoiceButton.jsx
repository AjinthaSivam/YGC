import React, { useState, useEffect } from 'react'
import { MdKeyboardVoice, MdOutlineKeyboardVoice } from 'react-icons/md'

const VoiceButton = ({ onTranscript, disabled }) => {
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setListening(true);
      recognition.onend = () => setListening(false);
      recognition.onerror = (event) => console.error(event.error);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
      };

      setRecognition(recognition);
    } else {
      console.warn('Webkit Speech Recognition is not supported in this browser.');
    }
  }, [onTranscript]);

  const toggleVoiceRecognition = () => {
    if (recognition) {
      if (listening) {
        recognition.stop();
      } else {
        recognition.start();
      }
    }
  };

  return (
    <button 
      onClick={toggleVoiceRecognition} 
      className='flex items-center justify-center px-0 sm:p-2 text-primary rounded-full sm:mr-2 hover:bg-secondary w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0'
      disabled={disabled}
    >
      {listening ? <MdKeyboardVoice size={20} className='sm:w-6 sm:h-6' /> : <MdOutlineKeyboardVoice size={20} className='sm:w-6 sm:h-6' />}
    </button>
  )
}

export default VoiceButton