import React, { useEffect, useState } from 'react';
import SideBar from './SideBar';
import Chat from './chat/Chat';
import MCQGenerator from './quiz/Quiz';
import QuizIntro from './quiz/QuizIntro';
import PastPaper from './PastPaper';
import Historical from './historical/Historical'; // Import Historical component
import { useChat } from './chat/ChatContext';
import Paper from './Paper';
import ToggleBot from './ToggleBot';

const Main = () => {
    const { setChatId } = useChat();
    const [selectedComponent, setSelectedComponent] = React.useState('chatbot');
    const [selectedQuizDifficulty, setSelectedQuizDifficulty] = React.useState('');
    const [selectedPaper, setSelectedPaper] = React.useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
    const [selectedyear, setSelectedyear] = useState('')

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768)
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const handleStartQuiz = () => {
        setSelectedComponent('quiz');
    };

    const handleSelectPaper = (paperUrl) => {
        setSelectedPaper(paperUrl);
        setSelectedComponent('paper');
    };

    const handleSelectYear = (year) => {
        setSelectedyear(year)
    }

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
                return <PastPaper onSelectPaper={handleSelectPaper} onSelectYear={handleSelectYear} selected_year={selectedyear} />;
            case 'paper':
                // if mobile and togglebot is open render the toggle bot instead of paper
                if (isMobile && isChatOpen) {
                    return <ToggleBot selected_year={selectedyear} />
                }
                return <Paper pdfUrl={selectedPaper} isChatOpen={isChatOpen} toggleChat = {() => setIsChatOpen(!isChatOpen)} isMobile={isMobile} selected_year={selectedyear}  />
            case 'historicalCharacter':
                return <Historical />;
            case 'togglebot':
                return <ToggleBot selected_year={selectedyear} />
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
