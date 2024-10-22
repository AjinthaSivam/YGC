import React, { useState } from 'react';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { IoCloseOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { useChat } from '../components/chat/ChatContext';
import ErrorMessage from '../components/messages/ErrorMessage';
import SuccessMessage from '../components/messages/SuccessMessage';
import SubmitButton from '../components/buttons/SubmitButton';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const Signin = () => {
    const { setMessages, setChatId } = useChat();
    const navigate = useNavigate();
    const { login } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post(`${apiBaseUrl}/api/login/`, {
                username_or_email: formData.username,
                password: formData.password
            });
            login(response.data, response.data.user.username);
            setMessages([]);
            setChatId(null);

            setSuccess('Successfully signed in');
            setTimeout(() => {
                navigate('/generalchat');
            }, 1500);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError('Incorrect username or password');
            } else {
                setError('Error signing in. Please try again later.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSignup = (e) => {
        e.preventDefault();
        navigate('/signup');
    };

    const handleClose = (e) => {
        e.preventDefault();
        navigate('/land');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-primary-50 relative"
      style={{
        backgroundImage: `url('https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExczQ5ZWtxNGo2cWlscGNnamloajlxOWNqMXhvaTZtbTRvcmJxemwzcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BHWoX8f4EqKcPTALTK/giphy.webp')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
         <div className='relative bg-white shadow-xl rounded-xl max-w-md w-full p-8 mx-4 sm:mx-0' style={{ zIndex: 10 }}> {/* Full height on mobile, auto height on larger screens */}
                <button onClick={handleClose} className="absolute top-4 right-4 text-gray-500 hover:text-primary ">
                    <IoCloseOutline size={24} />
                </button>
                <div className="text-center mb-6">
                    <img src="src/images/bot.png" alt="EDUTECH Logo" className="mx-auto mb-2" style={{ width: '120px' }} />
                    <h1 className="text-3xl font-bold text-primary mb-2">EDUTECH</h1>
                    {/* <p className="text-sm text-gray-500 mt-4">If you're already a member,</p>
                    <p className="text-sm text-gray-500 mt-1"> sign in to continue your studies!🎓</p> */}
                </div>

                <div className="mb-4 flex items-center justify-center">
                    {error && <ErrorMessage message={error} isPersistent={false} />}
                    {success && <SuccessMessage message={success} />}
                </div>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username / Email"
                        className="p-3 rounded-full w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Password"
                            className="p-3 rounded-full w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <div className="absolute inset-y-0 right-4 flex items-center cursor-pointer" onClick={togglePasswordVisibility}>
                            {showPassword ? (
                                <IoEyeOutline size={20} className="text-gray-400" />
                            ) : (
                                <IoEyeOffOutline size={20} className="text-gray-400" />
                            )}
                        </div>
                    </div>

                    <SubmitButton text={isLoading ? 'Signing In...' : 'Sign In'} onClick={handleSubmit} />

                    </form>
                    <div className="flex justify-center items-center mt-4">
                        < p className="text-sm text-gray-500">Don't have an account?
                        <button
                            onClick={handleSignup}
                            className="text-primary text-sm ml-2 hover:underline"
                        >
                            Sign Up
                        </button></p>
                    </div>
            </div>
            {/* Full screen overlay for mobile */}
      <style jsx>{`
        @media (max-width: 768px) {
          .min-h-screen {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 9;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .bg-white {
            height: 100vh;
            margin: 0;
            border-radius: 0;
            overflow-y: auto; /* Enable scrolling for long forms */
            display: flex;
            flex-direction: column;
            justify-content: center; /* Center content vertically */
          }
        }
      `}</style>
        </div>
    );
};

export default Signin;
