import React, { useState } from 'react';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { IoCloseOutline } from "react-icons/io5";
import { useChat } from '../components/chat/ChatContext';
import ErrorMessage from '../components/messages/ErrorMessage';
import SuccessMessage from '../components/messages/SuccessMessage';

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

    const SubmitButton = ({ text, onClick, className = '' }) => {
        return (
            <button
                type="submit"
                onClick={onClick}
                className={`py-2 px-5 text-white bg-primary/50 backdrop-blur-md rounded-full hover:bg-primary/90 duration-300 ${className}`}
            >
                {text}
            </button>
        );
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
        <>
            <div className="relative z-10 min-h-screen flex items-end justify-center bg-cover bg-center" style={{ backgroundImage: "url('src/assets/images/bg2.png')" }} aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="bg-white/30 backdrop-blur-md p-4 rounded-xl shadow-lg max-w-xs w-full space-y-2 glassmorphic-card mb-6 px-8 py-6 border-2 border-gray-200">
                    <button onClick={handleClose} className='absolute top-4 right-4 text-gray-500 hover:rounded-full hover:bg-soft_cyan duration-300'>
                        <IoCloseOutline size={24} />
                    </button>
                    
                    <h2 className="text-2xl font-bold text-center text-black">Sign In</h2> {/* Make Sign In text bolder */}

                    <div className="flex justify-center items-center">
                        {error && <ErrorMessage message={error} isPersistent={false} />}
                        {success && <SuccessMessage message={success} />}
                    </div>

                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username/Email"
                            className="p-2 rounded-full w-full border-none bg-white/40 backdrop-blur-md text-black placeholder-black"
                            value={formData.username}
                            onChange={handleChange}
                        />
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Password"
                                className="p-2 rounded-full w-full border-none bg-white/40 backdrop-blur-md text-black placeholder-black"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-black">
                                {showPassword ? (
                                    <IoEyeOutline size={20} onClick={togglePasswordVisibility} />
                                ) : (
                                    <IoEyeOffOutline size={20} onClick={togglePasswordVisibility} />
                                )}
                            </div>
                        </div>
                        <SubmitButton text={isLoading ? 'Signing In...' : 'Sign In'} onClick={handleSubmit} />

                    </form>

                    <div className="mt-6 text-black text-sm flex justify-between items-center">
                        <p className="p-0.5S text-black"> {/* Adjust size and styling to match input */}
                            Don't have an account?
                        </p>
                        <button onClick={handleSignup} className="py-2 px-3 p-1 bg-white/30 backdrop-blur-md border border-white rounded-full hover:bg-white/50 duration-300 ">
                            Sign Up {/* Bold Sign Up button text */}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Signin;
