import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import styles from '../styles/RegisterForm.module.css'
import tellsmamaLogo from '../assets/tellsmama_crop_icon.png'; // ตรวจสอบ path นี้ให้ถูกต้อง!

function LoginForm({ setAuth }) {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const res = await api.post("/api/auth/login", formData)
            localStorage.setItem('token', res.data.token)
            setAuth(true);
            setFormData({ username: '', password: '' }) 

            navigate('/dashboard')
        }
        catch (error) {
            setError('invalid username or password')
            console.error(error)
        }
    }


    return (
        <div className='container mt-5 pt-5'>
            <div className="row justify-content-center">
                <div className="col-12 col-md-10 col-lg-7">
                    <div className="card mt-3" style={{
                        borderRadius: '2rem'
                        // ,border:'2px solid #FFB5A7'
                    }}
                    >
                        {/* <div className="card-header text-center">
                            <h3>Login Form</h3>
                        </div> */}
                        
                 <div className="d-flex justify-content-center pt-5">
                     <img src={tellsmamaLogo} alt="" className='card-img-top  ' 
                            style={{width:'100px', height:'100px'}}
                            />
                 </div>
                           


                        

                        <div className="card-body">
                            {error && <div className='alert alert-danger'>{error}</div>}
                            <form onSubmit={handleSubmit} className='ps-3 pe-3'>
                                <div className={` mb-3  `}>
                                    <p className={`${styles['header-reg']} fs-1 d-flex justify-content-center `}>Sign In</p>
                                    <p className='d-flex justify-content-center'>Welcome back! Please login to your account</p>

                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="username" className={`${styles['pt_serif']} fs-5 fw-bold `}>Username <span className='text-danger'>*</span></label>

                                    <div className="input-group " >
                                        <span className='input-group-text bg-white border-end-0 ps-3 pe-3'>
                                            <i className="bi bi-person-circle fs-4" style={{ color: '#FFB5A7' }}></i>
                                        </span>
                                        <input type="text" className='form-control border-start-0' name='username' value={formData.username} onChange={handleChange} placeholder='Username' required />                                        </div>
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="password" className={`${styles['pt_serif']} fs-5 fw-bold `}>Password <span className='text-danger'>*</span></label>

                                    <div className="input-group  " >
                                        <span className='input-group-text bg-white border-end-0 ps-3 pe-3  '>
                                            <i className="bi bi-lock-fill fs-5" style={{ color: '#FFB5A7' }}></i>
                                        </span>
                                        <input type="password" className='form-control border-start-0' name='password' value={formData.password} onChange={handleChange} placeholder='********' required />                                        </div>
                                </div>
                                <button type='submit' className={`${styles['btn-pink']} btn  w-100 fw-bold fs-5 mt-2`}>Login</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default LoginForm
