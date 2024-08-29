import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ConformationModal from './ConformationModal';
import QuizResult from './QuizResult';

const MCQGenerator = ({ difficulty, category, setSelectedComponent }) => {
    const [questions, setQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [score, setScore] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(false); // Loading state for fetching quiz


    useEffect(() => {
        const storedQuestions = localStorage.getItem('questions');
        const storedUserAnswers = localStorage.getItem('userAnswers');
        const storedScore = localStorage.getItem('score');

        if (storedQuestions) {
            setQuestions(JSON.parse(storedQuestions));
        } else {
            getQuiz();
        }

        if (storedUserAnswers) {
            setUserAnswers(JSON.parse(storedUserAnswers));
        }

        if (storedScore) {
            setScore(JSON.parse(storedScore));
        }
    }, [difficulty]);

    useEffect(() => {
        localStorage.setItem('userAnswers', JSON.stringify(userAnswers));
    }, [userAnswers]);

    const getQuiz = async () => {
        setLoading(true); // Set loading state while fetching quiz
        // data_load = {
        //     difficulty: difficulty,
        //     category: category
        // }

        // console.log(data_load)
        try {
            const response = await axios.post('http://127.0.0.1:8000/quiz/generate_questions/', {
                category,
                difficulty
            });
            setQuestions(response.data.questions);
            setScore(null);  // Reset score on new fetch
            setShowResults(false);  // Reset showResults on new fetch
            localStorage.setItem('questions', JSON.stringify(response.data.questions));
            localStorage.removeItem('userAnswers');  // Clear previous user answers
        } catch (error) {
            console.error('Error getting quiz:', error);
            // Handle error state or retry logic if necessary
        } finally {
            setLoading(false); // Clear loading state after fetch completes
        }
    };

    const handleAnswerChange = (questionIndex, answer) => {
        setUserAnswers({
            ...userAnswers,
            [questionIndex]: answer
        });
    };

    const calculateScore = () => {
        let correctAnswers = 0;
        questions.forEach((question, index) => {
            const correctAnswer = question.answer.trim();
            if (userAnswers[index] === correctAnswer) {
                correctAnswers++;
            }
        });
        const calculatedScore = ((correctAnswers / questions.length) * 100);
        setScore(calculatedScore);

        localStorage.setItem('score', JSON.stringify(calculatedScore));
    };

    const handleFinishQuiz = () => {
        calculateScore();
        setShowModal(true);
    };

    const handleConfirmFinish = () => {
        setShowModal(false);
        setShowResults(true);
        localStorage.removeItem('questions');
        localStorage.removeItem('userAnswers');
        localStorage.removeItem('score');
    };

    const handleCancelFinish = () => {
        setShowModal(false);
    };

    return (
        <div className='flex mt-6 p-4 h-full w-full max-w-5xl mx-auto flex-grow overflow-auto'>
            <div className='flex-col flex-grow overflow-auto mb-4 overflow-y-scroll scrollbar-hidden'>
                <div className='pb-2 border-b border-[#04aaa2] max-w-xl mb-8'>
                    <h1 className='text-2xl text-[#393E46] font-bold mb-4'>
                        {category} - {difficulty} Level
                    </h1>
                </div>
                
                {loading && <p>Loading quiz...</p>}
                {showResults ? (
                    <QuizResult questions={questions} userAnswers={userAnswers} score={score} setSelectedComponent={setSelectedComponent} />
                ) : (
                    <>
                        {questions.length > 0 && (
                            <div>
                                {questions.map((question, index) => (
                                    <div key={index} className='mb-6 mt-6'>
                                        <p>{index + 1}. {question.question}</p>
                                        <div className='ml-4 mt-2'>
                                            {Object.keys(question.options).map((key, idx) => (
                                                <label key={idx} className='block mb-3 ml-5'>
                                                    <input
                                                        type='radio'
                                                        name={`question-${index}`}
                                                        value={question.options[key]}
                                                        onChange={() => handleAnswerChange(index, question.options[key])}
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
                                        className='px-4 py-2 mb-6 bg-[#04aaa2] text-white rounded-full justify-center'
                                    >
                                        Finish Quiz
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
                <ConformationModal show={showModal} onConfirm={handleConfirmFinish} onCancel={handleCancelFinish} />
            </div>
        </div>
    );
};

export default MCQGenerator;
