import React, { useState } from 'react';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { IoCloseOutline } from "react-icons/io5";
import { useChat } from '../components/chat/ChatContext';
import ErrorMessage from '../components/messages/ErrorMessage';
import SuccessMessage from '../components/messages/SuccessMessage';
import SubmitButton from '../components/buttons/SubmitButton';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

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
            }, 1500)
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
        e.preventDefault()
        navigate('/land')
    }

    return (
        <div>
            <div className='flex justify-center items-center mt-4'>
                {error && <ErrorMessage message={error} isPersistent={false} />}
                {success && <SuccessMessage message={success} />}
            </div>
            <section className="min-h-screen flex items-center justify-center">
                <div className="relative bg-white rounded-2xl shadow-lg max-w-3xl p-5 px-16">
                    <button onClick={handleClose} className='absolute top-4 right-4 p-1 text-gray-500 hover:rounded-full hover:bg-soft_cyan duration-300'>
                        <IoCloseOutline size={24} />
                    </button>
                    
                    <p className="text-sm text-primary mt-8">If you're already a member, easily sign in</p>
                    

                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username/Email"
                            className="mt-8 p-2 rounded-full w-full border"
                            value={formData.username}
                            onChange={handleChange}
                        />
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Password"
                                className="p-2 rounded-full w-full border"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                                {showPassword ? (
                                    <IoEyeOutline size={16} className="text-gray-400" onClick={togglePasswordVisibility} />
                                ) : (
                                    <IoEyeOffOutline size={16} className="text-gray-400" onClick={togglePasswordVisibility} />
                                )}
                            </div>
                        </div>
                        <SubmitButton text={isLoading ? 'Signing In...' : 'Sign In'}  onClick={handleSubmit} />
                    </form>

                    {/* <div className="mt-10 grid grid-cols-3 items-center text-gray-400">
                        <hr className="border-gray-400" />
                        <p className="text-center">OR</p>
                        <hr className="border-gray-400" />
                    </div> */}

                    {/* <button className="bg-white text-sm text-[#04bdb4] border border-[#04aaa2] py-2 w-full rounded-xl mt-5 flex gap-3 items-center justify-center hover:bg-[#b4ebe9] duration-300">
                        <FaGoogle className="text-[#04aaa2]" size={24} />
                        <p>Continue with Google</p>
                    </button> */}

                    {/* <p className="mt-5 text-[#04bdb4] text-xs border-b py-4">Forgot password?</p> */}

                    <div className="mt-6 text-primary text-xs flex justify-between items-center">
                        <p>Don't have an account?</p>
                        <button onClick={handleSignup} className="py-2 px-5 bg-white border border-primary rounded-full hover:bg-secondary duration-300">
                            Sign Up
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Signin;
