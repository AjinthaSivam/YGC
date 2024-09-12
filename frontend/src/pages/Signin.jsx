import React, { useState } from 'react';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext';

const Signin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login/', {
                username_or_email: formData.username,
                password: formData.password
            });
            login(response.data, response.data.user.username);
            navigate('/generalchat');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError('Incorrect username or password');
            } else {
                setError('Error signing in. Please try again later.');
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSignup = (e) => {
        e.preventDefault();
        navigate('/signup');
    };

    return (
        <div>
            <section className="min-h-screen flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-lg max-w-3xl p-5 px-16">
                    <p className="text-sm text-[#04aaa2] mt-4">If you're already a member, easily sign in</p>

                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username/Email"
                            className="mt-8 p-2 rounded-xl w-full border"
                            value={formData.username}
                            onChange={handleChange}
                        />
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Password"
                                className="p-2 rounded-xl w-full border"
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
                        {error && <span className="text-xs text-red-500">{error}</span>}
                        <button type="submit" className="bg-[#04aaa2] rounded-xl text-white py-2 hover:scale-105 duration-300">
                            Sign In
                        </button>
                    </form>

                    <div className="mt-10 grid grid-cols-3 items-center text-gray-400">
                        <hr className="border-gray-400" />
                        <p className="text-center">OR</p>
                        <hr className="border-gray-400" />
                    </div>

                    <button className="bg-white text-sm text-[#04bdb4] border border-[#04aaa2] py-2 w-full rounded-xl mt-5 flex gap-3 items-center justify-center hover:bg-[#b4ebe9] duration-300">
                        <FaGoogle className="text-[#04aaa2]" size={24} />
                        <p>Continue with Google</p>
                    </button>

                    <p className="mt-5 text-[#04bdb4] text-xs border-b py-4">Forgot password?</p>

                    <div className="mt-3 text-[#04bdb4] text-xs flex justify-between items-center">
                        <p>Don't have an account?</p>
                        <button onClick={handleSignup} className="py-2 px-5 bg-white border border-[#04aaa2] rounded-xl hover:bg-[#b4ebe9] duration-300">
                            Sign Up
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Signin;
