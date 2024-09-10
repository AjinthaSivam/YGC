import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
// import Quiz from './pages/QuizPage'
import ProtectedRoute from './components/ProtectedRoute';
import Quiz from './components/quiz/Quiz'
import Historical from './components/historical/Historical';
import LandHome from './components/landing page/Home'
import Services from './components/landing page/Services';
import Downloads from './components/landing page/Downloads';
import About from './components/landing page/About';
import ELibrary from './components/landing page/ELibrary';
import Navbar from './components/landing page/Navbar';
import GeneralChat from './pages/GeneralChat';
import PastpaperCard from './pages/PastpaperCard';
import PastpaperContent from './pages/PastpaperContent';
import QuizStart from './pages/QuizStart';
import QuizContent from './pages/QuizContent';
import Legend from './pages/Legend';
import PastpaperChat from './pages/PastpaperChat';

function App() {
    return (
        
            <Routes>
                <Route path='/home/quiz' element= {<Quiz />} />
                <Route path='/generalchat' element= {<GeneralChat />} />
                <Route path='/pastpapercard' element= {<PastpaperCard />} />
                <Route path="/pastpaper/:year" element={<PastpaperContent />} />
                <Route path='/togglebot' element= {<PastpaperChat />} />
                <Route path='/quizstart' element= {<QuizStart />} />
                <Route path='/quiz' element= {<QuizContent />} />
                <Route path='/legend' element= {<Legend />} />
                <Route path="/home/historical" element={<Historical />} />
                <Route path="/home" element={<ProtectedRoute />}>
                    <Route index element={<Home />} />
                    {/* Add other protected routes here */}
                </Route>
                <Route path="/signin" element={<Signin />} />
                <Route path="/signup" element={<Signup />} />

                {/* landing page */}
                <Route path="/land" element={<LandHome />} />
                <Route path="/services" element={<Services />} />
                <Route path="/downloads" element={<Downloads />} />
                <Route path="/about" element={<About />} />
                <Route path="/eLibrary" element={<ELibrary />} />
                <Route path="/navbar" element={<Navbar />} />

                <Route path="/admin" element={<Admin />} />
            </Routes>
        
    );
}

export default App;
