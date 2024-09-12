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
import LandHome from './components/landing page/Home'
import Services from './components/landing page/Services';
import Downloads from './components/landing page/Downloads';
import About from './components/landing page/About';
import ELibrary from './components/landing page/ELibrary';
import Navbar from './components/landing page/Navbar';
import Dashboard from './components/admin/Dashboard';
import Teachers from './components/admin/Teachers';
import Courses from './components/admin/Courses';
import Students from './components/admin/Students';
import Profile from './components/admin/Profile';
import Settings from './components/admin/Settings';
import Books from './components/admin/Books';
import Login from './components/admin/Login';
import AdminPanel from './components/admin/AdminPanel';

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

                {/* landing page */}
                <Route path="/land" element={<LandHome />} />
                <Route path="/services" element={<Services />} />
                <Route path="/downloads" element={<Downloads />} />
                <Route path="/about" element={<About />} />
                <Route path="/eLibrary" element={<ELibrary />} />
                <Route path="/navbar" element={<Navbar />} />

                <Route path="/admin" element={<AdminPanel/>}/> 
                <Route path="/admin/login" element={<Login />} />
                <Route path="/admin/dashboard" element={<Dashboard/>}/>
                <Route path="/admin/courses" element={<Courses/>}/>
                <Route path="/admin/teachers" element={<Teachers/>}/>
                <Route path="/admin/students" element={<Students/>}/>
                <Route path="/admin/settings" element={<Settings/>}/>
                <Route path="/admin/profile" element={<Profile/>}/>
                <Route path="/admin/books" element={<Books/>}/>
            </Routes>
        
    );
}

export default App;
