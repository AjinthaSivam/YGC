import React, { useRef, useState, useEffect } from 'react'
import ErrorMessage from './messages/ErrorMessage'

const InputBox = ({input, setInput, handleSend, disabled}) => {
    const textareaRef = useRef(null)
    const [error, setError] = useState('')

    const max_input_length = 2100
    const max_height = 200

    // Handle textarea resize
    const handleInputChange = (e) => {
        const { value } = e.target;
        setInput(value);

        // Check if the input length exceeds maximum limit
        if (value.length > max_input_length) {
             setError("Please limit your message to 300 words.")
             console.log(error)
         } else {
             setError("")
         }
        const textarea = textareaRef.current;
        textarea.style.height = 'auto'; // Reset height
        textarea.style.height = `${Math.min(textarea.scrollHeight, max_height)}px`; // Set new height with max limit
    };

    useEffect(() => {
        const textarea = textareaRef.current;
        if (input === '') {
            textareaRef.current.style.height = 'auto';
        } else {
            textareaRef.current.style.height = `${Math.min(textarea.scrollHeight, max_height)}px`;
        }
    }, [input]);

    return (
        <div className='w-full'>
            <div className='left-0 right-0 mb-1'>
                {error && (
                    <ErrorMessage message={error} isPersistent={true} />
                )}
            </div>
            <div>
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    className={`flex-grow w-full p-2 pl-3 sm:pl-4 text-sm border ${input ? 'rounded-lg' : 'rounded-full'} focus:outline-none resize-none`}
                    placeholder='Type your message...'
                    rows={1}
                    disabled={disabled}
                />
            </div>
        </div>
    )
}

export default InputBox