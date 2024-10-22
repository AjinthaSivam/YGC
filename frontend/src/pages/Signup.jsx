import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import axios from 'axios';
import { IoCloseOutline } from "react-icons/io5";
import ErrorMessage from '../components/messages/ErrorMessage';
import SuccessMessage from '../components/messages/SuccessMessage';
import SubmitButton from '../components/buttons/SubmitButton';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    grade: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    username: '',
    password: '',
    grade: '',
    general: '',
  });
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ email: '', username: '', password: '', grade: '', general: '' });

    try {
      setIsLoading(true);
      console.log('Form Data:', formData);
      const response = await axios.post(`${apiBaseUrl}/api/register/`, formData);
      console.log('Response:', response.data);
      localStorage.setItem('access', response.data.access);
      setSuccess('User registered successfully');
      setTimeout(() => {
        navigate('/signin');
      }, 1500);
    } catch (error) {
      console.error('There was an error registering the user!', error.response.data);
      const errorData = error.response.data;
      if (errorData) {
        setErrors({
          email: errorData.email ? errorData.email[0] : '',
          username: errorData.username ? errorData.username[0] : '',
          password: errorData.password ? errorData.password[0] : '',
          grade: errorData.grade ? errorData.grade[0] : '',
          general: errorData.detail || 'There was an error registering the user!',
        });
      } else {
        setErrors({ ...errors, general: 'There was an error registering the user!' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignin = (e) => {
    e.preventDefault();
    navigate('/signin');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
      <div className='relative bg-white shadow-xl rounded-xl max-w-md w-full p-8 mx-4 sm:mx-0' style={{ zIndex: 10 }}>
        <button onClick={handleClose} className='absolute top-4 right-4 text-gray-500 hover:text-primary'>
          <IoCloseOutline size={24} />
        </button>
        <div className='text-center mb-6'>
          <h2 className='text-2xl font-semibold text-gray-700'>Create your Account</h2>
          <p className='text-sm text-gray-500 mt-5'>Sign up today to master your subjects</p>
          <p className='text-sm text-gray-500 mt-1'>with AI-powered learning! 🚀</p>
        </div>
        <div className="mb-4 flex items-center justify-center">
          {errors.general && <ErrorMessage message={errors.general} />}
          {success && <SuccessMessage message={success} />}
        </div>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <div>
            <input
              type='text'
              name='email'
              placeholder='Email'
              className='w-full p-3 rounded-lg border focus:outline-none focus:border-primary transition'
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className='text-sm text-red-500'>{errors.email}</span>}
          </div>
          <div>
            <input
              type='text'
              name='username'
              placeholder='Username'
              className='w-full p-3 rounded-lg border focus:outline-none focus:border-primary transition'
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <span className='text-sm text-red-500'>{errors.username}</span>}
          </div>
          <div>
            <input
              type='int'
              name='grade'
              placeholder='Grade'
              className='w-full p-3 rounded-lg border focus:outline-none focus:border-primary transition'
              value={formData.grade}
              onChange={handleChange}
            />
            {errors.grade && <span className='text-sm text-red-500'>{errors.grade}</span>}
          </div>
          <div className='relative'>
            <input
              type={showPassword ? 'text' : 'password'}
              name='password'
              placeholder='Password'
              className='w-full p-3 rounded-lg border focus:outline-none focus:border-primary transition'
              value={formData.password}
              onChange={handleChange}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
              {showPassword ? (
                <IoEyeOutline size={20} className="text-gray-400" onClick={togglePasswordVisibility} />
              ) : (
                <IoEyeOffOutline size={20} className="text-gray-400" onClick={togglePasswordVisibility} />
              )}
            </div>
            {errors.password && <span className='text-sm text-red-500'>{errors.password}</span>}
          </div>
          <SubmitButton text={isLoading ? 'Signing Up...' : 'Sign Up'} />
        </form>
        <div className='text-center mt-4'>
          <p className='text-sm text-gray-500'>Already have an account?
            <button onClick={handleSignin} className='ml-2 text-primary hover:underline'>Sign In</button>
          </p>
        </div>
      </div>
      {/* Full screen overlay for mobile */}
      <style jsx>{`
        @media (max-width: 640px) {
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

export default Signup;
