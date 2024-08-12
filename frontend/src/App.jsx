import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
// import Quiz from './pages/QuizPage'
import ProtectedRoute from './components/ProtectedRoute';
import Quiz from './components/quiz/Quiz'
import Chat from './components/chat/Chat';
import Historical from './components/historical/Historical';
import LandingPage from './pages/LandingPage';

function App() {
    return (
        
            <Routes>
                <Route path='/quiz' element= {<Quiz />} />
                <Route path='/chatbot' element= {<Chat />} />
                <Route path="/historical" element={<Historical />} />
                <Route path="/" element={<ProtectedRoute />}>
                    <Route path="/home" element={<Home />} />
                    {/* Add other protected routes here */}
                </Route>
                <Route path="/signin" element={<Signin />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/land" element={<LandingPage />} />
            </Routes>
        
    );
}

export default App;
