import React, { useState } from 'react';
import { FaAngleDown } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import ConfimationModal from '../ConfimationModal';

const QuizIntro = ({ onStartQuiz }) => {
  const [quizDifficulty, setQuizDifficulty] = useState('Difficulty');
  const [quizCategory, setQuizCategory] = useState('Category');
  const [isDiffDropdownOpen, setIsDiffDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const navigate = useNavigate()

  const handleDiffDropdown = () => {
    setIsDiffDropdownOpen(!isDiffDropdownOpen);
  };

  const handleCategoryDropdown = () => {
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
  };

  const handleSelectQuizDifficulty = (difficulty) => {
    setQuizDifficulty(difficulty);
    setIsDiffDropdownOpen(false);
  };

  const handleSelectQuizCategory = (category) => {
    setQuizCategory(category);
    setIsCategoryDropdownOpen(false);
  };

  const difficulties = ["Easy", "Medium", "Hard"];
  const categories = [
    "Tenses", "Prepositions", "Adjectives", "Adverbs", 
    "Pronouns", "Conjunctions", "Conditionals", 
    "Passive Voice", "Reported Speech", "Articles"
  ];

  const handleStartQuiz = () => {
    // Validation checks with error messages
    if (quizDifficulty === 'Difficulty' && quizCategory === 'Category') {
      setErrorMessage("Please select a difficulty level and category.");
    } else if (quizDifficulty === 'Difficulty') {
      setErrorMessage("Please select a difficulty level.");
    } else if (quizCategory === 'Category') {
      setErrorMessage("Please select a category.");
    } else {
      setErrorMessage(""); // Clear error message if selections are valid
      // onStartQuiz(quizDifficulty, quizCategory);
      setIsConfirmModalOpen(true);
      // navigate('/quiz', { state: { difficulty: quizDifficulty, category: quizCategory } });
    } 
  };

  const handleConfirm = () => {
    setIsConfirmModalOpen(false);
    onStartQuiz(quizDifficulty, quizCategory);
    navigate('/quiz', { state: { difficulty: quizDifficulty, category: quizCategory } });
  };

  const handleCancel = () => {
    setIsConfirmModalOpen(false);
  };

  return (
    <div className="flex flex-col justify-between justify-center mx-auto">
      <div className="text-center mt-16 p-6">
        <h2 className="text-2xl font-semibold mb-4">
          Welcome to the EduTech Quiz! 📘📝
        </h2>
      </div>

      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-2xl p-8">
          <div className="flex flex-col items-center justify-center space-y-4 mb-8">
            {/* Difficulty Dropdown */}
            <div className="relative">
              <button
                onClick={handleDiffDropdown}
                className="flex items-center justify-between w-52 h-12 px-4 py-2 text-primary font-semibold border border-primary rounded-lg hover:bg-secondary transition duration-300"
              >
                {quizDifficulty}
                <FaAngleDown className="justify-end" />
              </button>
              {isDiffDropdownOpen && (
                <div className="absolute left-0 mt-2 flex flex-col bg-white text-white border rounded-lg w-full z-10">
                  {difficulties.map((difficulty, index) => (
                    <p
                      className="bg-white text-primary py-3 w-full cursor-pointer border-t text-center"
                      key={index}
                      onClick={() => handleSelectQuizDifficulty(difficulty)}
                    >
                      {difficulty}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Category Dropdown */}
            <div className="relative">
              <button
                onClick={handleCategoryDropdown}
                className="flex items-center justify-between w-52 h-12 px-4 py-2 text-primary font-semibold border border-primary rounded-lg hover:bg-secondary transition duration-300"
              >
                {quizCategory}
                <FaAngleDown className="justify-end" />
              </button>
              {isCategoryDropdownOpen && (
                <div className="absolute left-0 mt-2 max-h-48 overflow-y-scroll flex flex-col bg-white text-white border rounded-lg w-full z-10">
                  {categories.map((category, index) => (
                    <p
                      className="bg-white text-primary py-3 w-full cursor-pointer border-t text-center"
                      key={index}
                      onClick={() => handleSelectQuizCategory(category)}
                    >
                      {category}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <p className="text-red-500 text-center mb-4">
              {errorMessage}
            </p>
          )}

          {/* Start Button */}
          <div className="flex justify-center">
            <button
              onClick={handleStartQuiz}
              className="px-6 py-2 bg-primary h-12 text-light_gray rounded-lg hover:bg-strong_cyan transition duration-300"
            >
              Let's Start
            </button>
          </div>
        </div>
      </div>
      {isConfirmModalOpen && (
        <ConfimationModal
          isOpen={isConfirmModalOpen}
          onClose={handleCancel}
          onConfirm={handleConfirm}
          message="Are you sure want to start the quiz?"
          confirmText="Yes"
          cancelText="No"
        />
      )}
    </div>
    
  );
};

export default QuizIntro;
