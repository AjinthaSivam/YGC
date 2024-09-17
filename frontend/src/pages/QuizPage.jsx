import React, { useState } from 'react';
import axios from 'axios';
import Footer from '../components/quiz/Footer/Footer';
import Header from '../components/quiz/Header/Header';
import Home from './quiz/Home/Home';
import Quiz from './quiz/Quiz/Quiz';
import Result from './quiz/Result/Result';

function QuizPage() {
  const [questions, setQuestions] = useState(null);
  const [name, setName] = useState('');
  const [score, setScore] = useState(0);

  const fetchQuestions = async (category = '', difficulty = '') => {
    try {
      const response = await axios.post(
        'http://127.0.0.1:8001/quiz/generate_questions/',
        {
          category: category,
          difficulty: difficulty
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const generatedQuestions = response.data.questions;
      setQuestions(generatedQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  return (
    <div className="app" style={{ backgroundImage: 'url("/ques1.png")' }}>
      <Header />
      <Home name={name} setName={setName} fetchQuestions={fetchQuestions} />
      <Quiz
        name={name}
        questions={questions}
        score={score}
        setScore={setScore}
        setQuestions={setQuestions}
      />
      <Result name={name} score={score} />
      <Footer />
    </div>
  );
}

export default QuizPage;
