import React, { useState } from 'react';
import TryAgainConformation from './TryAgainConformation'
import { useNavigate } from 'react-router-dom';
import ConfimationModal from '../ConfimationModal';


const QuizResult = ({ questions, userAnswers, score }) => {
    const [showConfirmModal, setShowConfirmModal] = useState(false)

    const navigate = useNavigate()

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
        setShowConfirmModal(true)
    };

    const handleTryAgain = () => {
        setShowConfirmModal(false);
        navigate('/quizstart')
    };

    const handleGoToChat = () => {
        setShowConfirmModal(false);
        navigate('/generalchat')
    };

    return (
        <div className='flex-col h-full p-4 w-full max-w-4xl mx-auto flex-grow mb-4'>
            <div className='p-6 rounded-lg shadow-md max-w-xl'>
                <p className='sm:text-lg text-sm font-semibold text-primary mb-3'>Your Score is {score.toFixed(2)}%</p>
                <p className='sm:text-lg text-sm font-semibold text-dark_gray'>{getFeedback(score)}</p>
            </div>
            <div>
                {questions.map((question, index) => (
                    <div key={index} className='mb-6 mt-6 text-xs sm:text-sm'>
                        <p>{index + 1}. {question.question}</p>
                        <div className='ml-4 mt-2'>
                            {Object.keys(question.options).map((key, idx) => (
                                <p key={idx} className={`block mb-3 ml-5 ${question.options[key] === question.correct_answer ? 'text-primary' : ''}`}>
                                    {question.options[key]} 
                                    {userAnswers[question.id] === question.options[key] && userAnswers[question.id] !== question.correct_answer && <span className='text-red-500'>(Your Answer)</span>}
                                </p>
                            ))}
                        </div>
                        <p className='ml-4 mt-2 text-bright_blue italic'>{question.explanation}</p>
                    </div>
                ))}
            </div>
            <div className='mt-4 flex justify-center'>
                <button
                    className='bg-primary text-light_gray py-2 px-4 rounded-full'
                    onClick={handleFinishReview}
                >
                    Finish Review
                </button>
            </div>
            {showConfirmModal && (
                <ConfimationModal
                    isOpen={showConfirmModal}
                    onClose={handleGoToChat}
                    onConfirm={handleTryAgain}
                    message="Do you want to try again?"
                    confirmText="Yes"
                    cancelText="No"
                />
            )}
        </div>
    );
};

export default QuizResult;
