import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import axios from 'axios'
import { IoCloseOutline } from "react-icons/io5";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

const Signup = () => {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    // firstname: '',
    // lastname: '',
    email: '',
    // grade: '',
    // mobile_no: '',
    // address: '',
    username: '',
    password: '',
  })

  const [errors, setErrors] = useState({
    email: '',
    username: '',
    password: '',
    general: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({
      email: '',
      username: '',
      password: '',
      general: '',
    })

    try {
      console.log('Form Data:', formData);
      const response = await axios.post(`${apiBaseUrl}/api/register/`, formData)
      console.log('Response:', response.data);
      localStorage.setItem('access', response.data.access)
      // localStorage.setItem('user', JSON.stringify(response.data.user))
      navigate('/signin')
    } catch (error) {
      console.error('There was an error registering the user!', error.response.data)
      const errorData = error.response.data
      if (errorData) {
        setErrors({
          email: errorData.email ? errorData.email[0] : '',
          username: errorData.username ? errorData.username[0] : '',
          password: errorData.password ? errorData.password[0] : '',
          general: errorData.detail || 'There was an error regestering the user!'
        })
      }
      else {
        setErrors({ ...errors, general: 'There was an error registering the user!' })
      }
    }
  }

  const handleSignin = (e) => {
    e.preventDefault()
    navigate('/signin')
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleClose = (e) => {
    e.preventDefault()
    navigate('/land')
  }

  return (
    <div className='min-h-screen flex items-center justify-center'>
        <div className='relative rounded-2xl shadow-lg max-w-3xl p-5 px-16 py-6'>
          <button onClick={handleClose} className='absolute top-4 right-4 p-1 text-gray-500 hover:rounded-full hover:bg-[#b4ebe9] duration-300'>
            <IoCloseOutline size={24} />
          </button>
          <div className='mb-4 p-3 text-center'>
            <p className='text-md text-[#04aaa2] text-'>Sign up today to master your subjects <br/> with EduBot's AI-powered learning! 🚀🤖</p>
          </div>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
              {/* <div className='grid grid-cols-2 items-center gap-4'>
              <input
                type='text'
                name='firstname'
                placeholder='First Name'
                className='mt-8 p-2 rounded-xl w-full border'
                value={formData.firstname}
                onChange={handleChange}
              />
              <input
                type='text'
                name='lastname'
                placeholder='Last Name'
                className='mt-8 p-2 rounded-xl w-full border'
                value={formData.lastname}
                onChange={handleChange}
              />
              </div> */}

              {/* <input
                type='text'
                name='firstname'
                placeholder='Name'
                className='mt-8 p-2 rounded-xl w-full border'
                value={formData.firstname}
                onChange={handleChange}
              /> */}

              <input
                type='text'
                name='email'
                placeholder='Email'
                className='p-2 rounded-xl w-full border'
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className='text-xs text-red-500'>{errors.email}</span>}
              {/* <div className='grid grid-cols-2 items-center gap-4'> */}
              <input
                type='text'
                name='grade'
                placeholder='Grade'
                className='p-2 rounded-xl w-full border'
                value={formData.grade}
                onChange={handleChange}
              />
              {/*
              <input
                type='text'
                name='mobile_no'
                placeholder='Mobile Number'
                className='p-2 rounded-xl w-full border'
                value={formData.mobile_no}
                onChange={handleChange}
              />
              </div>
              <input
                type='text'
                name='address'
                placeholder='Address'
                className='p-2 rounded-xl w-full border'
                value={formData.address}
                onChange={handleChange}
              /> */}
              {/* <input
                type='text'
                name='grade'
                placeholder='Grade'
                className='p-2 rounded-xl w-full border'
                value={formData.grade}
                onChange={handleChange}
              /> */}
              <input
                type='text'
                name='username'
                placeholder='Username'
                className='p-2 rounded-xl w-full border'
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && <span className='text-xs text-red-500'>{errors.username}</span>}
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  placeholder='Password'
                  className='p-2 rounded-xl w-full border'
                  value={formData.password}
                  onChange={handleChange}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                  {showPassword ? (
                      <IoEyeOutline size={16} className="text-gray-400" onClick={togglePasswordVisibility} />
                    ) : (
                      <IoEyeOffOutline size={16} className="text-gray-400" onClick={togglePasswordVisibility} />
                    )
                  }
                </div>
              </div>
              {errors.password && <span className='text-xs text-red-500'>{errors.password}</span>}
              <button type='submit' className='bg-[#04aaa2] rounded-xl text-white py-2 mt-4 mb-4 hover:scale-105 duration-300'>Sign Up</button>

              {errors.general && <span className='text-xs text-red-500'>{errors.general}</span>}

            </form>
            <div className='mt-3 text-[#04aaa2] text-xs flex justify-between border-t pt-2 items-center gap-2'>
              <p>Already have an account?</p>
              <button onClick={handleSignin} className='py-2 px-3 bg-white border border-[#04aaa2] rounded-xl hover:bg-[#b4ebe9] duration-300'>Sign In</button>
            </div>
        </div>
    </div>
  )
}

export default Signup