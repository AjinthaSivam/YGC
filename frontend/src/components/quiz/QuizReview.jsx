import React, { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Heading2 from '../Heading2'
import SubmitButton from '../buttons/SubmitButton'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

const QuizReview = () => {
    const { quizId } = useParams()
    const [quizData, setQuizData] = useState(null)
    const location = useLocation()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { score } = location.state || {}

    const navigate = useNavigate()

    useEffect (() => {
        getQuizData()
    }, [quizId])

    const getQuizData = async () => {
        setLoading(true)
        try{
            const response = await axios.get(`${apiBaseUrl}/quiz/get_quiz_questions/${quizId}/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access')}`
                }
            });
            if (response.data) {
                setQuizData(response.data)
            }
            else {
                console.log("Error fetching quiz data")
            }
        }
        catch (err) {
            setError('Failed to fetch quiz data')
            console.error(err)
        }
        finally {
            setLoading(false)
        }
    }

    const handleFinishReview = (e) => {
        e.preventDefault()
        navigate('/quiz/start')
    }

  return (
    <div className='max-w-4xl p-4 mx-auto bg-white'>
        <div className='mt-16 pt-2'>
            <Heading2 text="Quiz Review" />   
        </div>
        {score !== undefined && <p className='text-dark_gray mb-4'>Score : <span className='text-primary'>{score}</span></p>}
        {quizData && quizData.map((question, index) => (
            <div key={index} className={`flex flex-col gap-4 mb-4 p-4 rounded-lg ${question.user_answer !== question.correct_answer ? 'bg-light_red' : 'bg-white border border-primary'} text-xs sm:text-sm`}>
                <h3 className='text-dark_gray'>{question.question}</h3>
                <div className='list-inside pl-5'>
                    <ol className='list-decimal'>
                        {question.options.map((option, idx) => (
                            <li key={idx} className={`${option === question.user_answer ? 'text-bright_blue' : 'text-dark_gray'}`}>{option}</li>
                        ))}
                    </ol>
                </div>
                <p className='text-primary'>Correct Answer : <span className='font-semibold'>{question.correct_answer}</span></p>
                <p className='text-dark_gray italic'>Explanation: {question.explanation}</p>
            </div>
        ))}
        <div className='flex justify-center'>
            <SubmitButton text='Finish Review' onClick={handleFinishReview} />
        </div>    
    </div>
  )
}

export default QuizReview
