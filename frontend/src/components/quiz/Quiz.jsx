import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import ConformationModal from './ConformationModal';
import QuizResult from './QuizResult';
import ThinkingMessage from '../messages/thinkingMessage/ThinkingMessage';
import ConfimationModal from '../ConfimationModal';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

const MCQGenerator = ({ difficulty, category }) => {
    const [questions, setQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [quizId, setQuizId] = useState(null)
    const [score, setScore] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Loading state for fetching quiz

    const isQuizFetched = useRef(false)


    useEffect(() => {
        getQuiz()
    }, [difficulty, category]);


    const getQuiz = async () => {
        if (isQuizFetched.current) return;
        isQuizFetched.current = true
        setIsLoading(true); 
        try {
            const response = await axios.post(`${apiBaseUrl}/quiz/generate_questions/`, {
                category,
                difficulty
            },
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access')}`
                }
            }
        );
            setQuestions(response.data.questions);
            const quiz_id = response.data.questions[0].quiz
            setQuizId(quiz_id)
            setScore(null);  // Reset score on new fetch
            setShowResults(false);  // Reset showResults on new fetch
            console.log(quiz_id)
        } catch (error) {
            console.error('Error getting quiz:', error);
            // Handle error state or retry logic if necessary
        } finally {
            setIsLoading(false); // Clear loading state after fetch completes
        }
    };

    const handleAnswerChange = (questionId, answer) => {
        setUserAnswers({
            ...userAnswers,
            [questionId]: answer
        });
    };

    const handleFinishQuiz = () => {
        setShowConfirmModal(true);
    };

    const handleConfirmFinish = async () => {
        const answers = Object.keys(userAnswers).map((questionId) => ({
            question_id: questionId,
            user_answer: userAnswers[questionId]
        }))

        console.log(answers)

        try {
            const response = await axios.post(`${apiBaseUrl}/quiz/submit_questions/${quizId}/`,
                {
                    answers: answers
                },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access')}`
                    }
                }
            )
            const score = response.data.quiz.score
            setScore(score)
            setShowConfirmModal(false);
            setShowResults(true);

            console.log(questions)
            console.log(userAnswers)
            console.log(score)

        }
        catch(error) {
            console.error("Error submitting quiz", error.response?.data)
        }
        
    };

    const handleCancelFinish = () => {
        setShowConfirmModal(false);
    };

    return (
        <div className='flex p-4 h-full w-full max-w-4xl sm:mx-auto flex-grow overflow-auto'>
            <div className='flex-col flex-grow overflow-auto mt-16 mb-4 overflow-y-scroll scrollbar-hidden'>
                <div className='pb-2 border-b border-primary max-w-xl mb-8'>
                    <h1 className='text-2xl text-dark_gray font-bold my-4'>
                        {category} - {difficulty} Level
                    </h1>
                </div>
                
                {isLoading && 
                    <div className='ml-4'>
                        <ThinkingMessage />
                    </div>
                }
                {showResults ? (
                    <QuizResult questions={questions} userAnswers={userAnswers} score={score} />
                ) : (
                    <>
                        {questions.length > 0 && (
                            <div>
                                {questions.map((question, index) => (
                                    <div key={index} className='mb-6 mt-6 text-xs sm:text-base'>
                                        <p>{index + 1}. {question.question}</p>
                                        <div className='ml-4 mt-2'>
                                            {Object.keys(question.options).map((key, idx) => (
                                                <label key={idx} className='block mb-3 ml-5'>
                                                    <input
                                                        type='radio'
                                                        name={`question-${index}`}
                                                        value={question.options[key]}
                                                        onChange={() => handleAnswerChange(question.id, question.options[key])}
                                                        className='mr-3'
                                                    />
                                                    {question.options[key]}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                <div className='flex justify-center'>
                                    <button
                                        onClick={handleFinishQuiz}
                                        className='px-4 py-2 mb-6 bg-primary text-light_gray rounded-full justify-center'
                                    >
                                        Finish Quiz
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
                {showConfirmModal && (
                    <ConfimationModal
                        isOpen={showConfirmModal}
                        onClose={handleCancelFinish}
                        onConfirm={handleConfirmFinish}
                        message="Are you sure you want to finish the quiz?"
                        confirmText="Yes"
                        cancelText="No"
                    />
                )}
            </div>
        </div>
    );
};

export default MCQGenerator;
