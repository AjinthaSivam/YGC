import React from 'react'
import SideBar from './SideBar'
import Chat from './Chat'
import MCQGenerator from './Quiz'
import QuizIntro from './QuizIntro'
import PastPaper from './PastPaper'
import { useChat } from './ChatContext';

const Main = () => {
    const { setChatId } = useChat();
    const [selectedComponent, setSelectedComponent] = React.useState('chatbot');
    const [selectedQuizDifficulty, setSelectedQuizDifficulty] = React.useState('');

    const handleStartQuiz = () => {
        setSelectedComponent('quiz');
    }

    React.useEffect(() => {
        if (selectedComponent === 'chatbot') {
            setChatId(null); // Optionally reset chat ID if needed
        }
    }, [selectedComponent, setChatId]);

    const renderComponent = () => {
        switch (selectedComponent) {
            case 'chatbot':
                return <Chat />
            case 'quizIntro':
                return <QuizIntro difficulty={selectedQuizDifficulty} onStartQuiz={handleStartQuiz} />
            case 'quiz':
                return <MCQGenerator difficulty={selectedQuizDifficulty} setSelectedComponent={setSelectedComponent} />
            case 'pastpapers':
                return <PastPaper />
            default:
                return <Chat />
        }
    }

    return (
        <div>
            <section className='h-screen flex pt-16'>
                <SideBar setSelectedComponent={setSelectedComponent} setSelectedQuizDifficulty={setSelectedQuizDifficulty} />
                {renderComponent()}
            </section>
        </div>
    )
}

export default Main
