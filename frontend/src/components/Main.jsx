import React from 'react';
import SideBar from './SideBar';
import Chat from './chat/Chat';
import MCQGenerator from './quiz/Quiz';
import QuizIntro from './quiz/QuizIntro';
import PastPaper from './PastPaper';
import Historical from './historical/Historical'; // Import Historical component
import { useChat } from './chat/ChatContext';

const Main = () => {
    const { setChatId } = useChat();
    const [selectedComponent, setSelectedComponent] = React.useState('chatbot');
    const [selectedQuizDifficulty, setSelectedQuizDifficulty] = React.useState('');

    const handleStartQuiz = () => {
        setSelectedComponent('quiz');
    };

    React.useEffect(() => {
        if (selectedComponent === 'chatbot') {
            setChatId(null); // Optionally reset chat ID if needed
        }
    }, [selectedComponent, setChatId]);

    const renderComponent = () => {
        switch (selectedComponent) {
            case 'chatbot':
                return <Chat />;
            case 'quizIntro':
                return <QuizIntro difficulty={selectedQuizDifficulty} onStartQuiz={handleStartQuiz} />;
            case 'quiz':
                return <MCQGenerator difficulty={selectedQuizDifficulty} setSelectedComponent={setSelectedComponent} />;
            case 'pastpapers':
                return <PastPaper />;
            case 'historicalCharacter':
                return <Historical />;
            default:
                return <Chat />;
        }
    };

    return (
        <div>
            <section className='h-screen flex pt-16'>
                <SideBar setSelectedComponent={setSelectedComponent} setSelectedQuizDifficulty={setSelectedQuizDifficulty} />
                {renderComponent()}
            </section>
        </div>
    );
};

export default Main;
