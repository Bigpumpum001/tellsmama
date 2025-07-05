import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import styles from '../styles/RegisterForm.module.css'
import tellsmamaLogo from '../assets/tellsmama_crop_icon.png'; 


function RegisterForm() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
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
            await api.post('/api/auth/register', formData)
            alert('User register successfully')
            navigate('/login')
        }
        catch (error) {
            console.error(error)
            setError(error)
        }
    }

    return (
        <div className='container mt-5 pt-5'>
            <div className="row justify-content-center">
                <div className="col-12 col-md-10 col-lg-7">
                    <div className="card mt-3" style={{
                        borderRadius: '2rem'
                        // ,border:'2px solid #FFB5A7'
                    }}>
                        {/* {`${styles['modal-dialog']} modal-dialog `} */}
                        {/* <div className={`${styles['card-header']} card-header text-center`}>
                            <h3>Sign Up</h3>
                        </div> */}
                                       <div className="d-flex justify-content-center pt-5">
                                             <img src={tellsmamaLogo} alt="" className='card-img-top  ' 
                                                    style={{width:'100px', height:'100px'}}
                                                    />
                                         </div>
                        <div className="card-body " >
                            {error && <div className='alert alert-danger'>{error}</div>}
                            <form onSubmit={handleSubmit} className='' >
                                <div className="ps-3 pe-3">
                                    <div className={`${styles['']} mb-3  `}>
                                        <p className={`${styles['header-reg']} fs-1 d-flex justify-content-center fw-bold`}>Sign Up</p>

                                    </div>
                                    <p className='d-flex justify-content-center'>Create your account to get started</p>
                                
                                    <div className="form-group mb-3 ">
                                        <label className={`${styles['pt_serif']} fs-5 fw-bold `} htmlFor="username">Username <span className='text-danger'>*</span></label>
                                        <div className="input-group " >
                                            <span className='input-group-text bg-white border-end-0 ps-3 pe-3'>
                                                <i className="bi bi-person-circle fs-4" style={{ color: '#FFB5A7' }}></i>
                                            </span>
                                            <input type="text" className='form-control border-start-0' name='username' value={formData.username} onChange={handleChange} placeholder='Username' required />
                                        </div>
                                        {/* <div className="input-group shadow-sm rounded-pill" >
                                            <span className='input-group-text bg-white border-0 ps-4 pe-4  rounded-start-pill'>
                                                <i class="bi bi-person-circle fs-4" style={{ color: '#FFB5A7' }}></i>
                                            </span>
                                            <input type="text" className='form-control border-0' name='username' value={formData.username} onChange={handleChange} placeholder='Username ...' required />
                                        </div> */}
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className={`${styles['pt_serif']} fs-5 fw-bold `} htmlFor="email">Email <span className='text-danger'>*</span></label>
                                        <div className="input-group" >
                                            <span className='input-group-text bg-white border-end-0 ps-3 pe-3  '>
                                                <i className="bi bi-envelope-at-fill fs-4" style={{ color: '#FFB5A7' }}></i>
                                            </span>
                                            <input type="email" className='form-control border-start-0' name='email' value={formData.email} onChange={handleChange} placeholder='abc@email.com' required />
                                        </div>
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className={`${styles['pt_serif']} fs-5 fw-bold `} htmlFor="password">Password <span className='text-danger'>*</span></label>
                                        <div className="input-group  " >
                                            <span className='input-group-text bg-white border-end-0 ps-3 pe-3  '>
                                                <i className="bi bi-lock-fill fs-5" style={{ color: '#FFB5A7' }}></i>
                                            </span>
                                            <input type="password" className='form-control border-start-0' name='password' value={formData.password} onChange={handleChange} placeholder='******' required />
                                        </div>

                                    </div>
                                    <button type='submit' className={`${styles['btn-pink']} btn  w-100 fw-bold fs-5 mt-2`}>
                                    Register
                                </button>
                                </div>

                                
                                <p className='d-flex justify-content-center mt-4'>Already have an account?
                                    <Link className='ms-1' to='/login'>
                                        Login here
                                    </Link>

                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterForm
