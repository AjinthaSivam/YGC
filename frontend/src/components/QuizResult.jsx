import React from 'react';

const QuizResult = ({ questions, userAnswers, score, setSelectedComponent }) => {
    const getFeedback = (score) => {
        if (score >= 0 && score <= 40) {
            return 'Keep practicing and you’ll get better. Try again! ✌️';
        } else if (score > 40 && score <= 60) {
            return '🙂 Good effort! Keep it up, you’re improving!';
        } else if (score > 60 && score < 80) {
            return '😀 Well done! You’re doing great, almost there!';
        } else if (score >= 80 && score < 100) {
            return '🎉 Excellent! Great job!';
        } else if (score === 100) {
            return '🎉 Excellent! Perfect score! You nailed it!';
        }
    };

    const handleFinishReview = () => {
        setSelectedComponent('chatbot');
    };

    return (
        <div className='flex-col h-full p-4 w-full max-w-5xl mx-auto flex-grow mb-4'>
            <div className='p-6 border-b'>
                <p className='text-md font-semibold text-[#04aaa2] mb-3'>Your Score is {score.toFixed(2)}%</p>
                <p className='text-md font-semibold text-[#5f1e5c]'>{getFeedback(score)}</p>
            </div>
            <div>
                {questions.map((question, index) => (
                    <div key={index} className='mb-6 mt-6'>
                        <p>{index + 1}. {question.question}</p>
                        <div className='ml-4 mt-2'>
                            {Object.keys(question.options).map((key, idx) => (
                                <p key={idx} className={`block mb-3 ml-5 ${question.options[key] === question.answer ? 'text-green-500' : ''}`}>
                                    {question.options[key]} {userAnswers[index] === question.options[key] && userAnswers[index] !== question.answer && <span className='text-red-500'>(Your Answer)</span>}
                                </p>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className='mt-4 flex justify-center'>
                <button
                    className='bg-[#04aaa2] text-white py-2 px-4 rounded-full'
                    onClick={handleFinishReview}
                >
                    Finish Review
                </button>
            </div>
        </div>
    );
};

export default QuizResult;
