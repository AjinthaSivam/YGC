import React from 'react';

const QuizIntro = ({ difficulty, onStartQuiz }) => {
  return (
    <div className="flex mx-auto items-center justify-center">
    <div className="max-w-xl mx-auto p-10">
      <h2 className="text-xl font-semibold mb-8 text-center border-b p-4">Welcome to the EduTech Quiz! 📘📝</h2>
      <p className="text-md text-center mb-6">
      This test will check your English grammar knowledge with five questions of varying difficulty. 
      Test your skills and find out where you might need improvement. 
      Good luck! 🍀
      </p>
      <div className="flex justify-center">
        <button
          onClick={onStartQuiz}
          className="px-4 py-2 bg-[#04aaa2] text-white rounded-full hover:bg-[#04aaa2] transition duration-300"
        >
          Let's Start
        </button>
      </div>
    </div>
    </div>
  );
};

export default QuizIntro;
