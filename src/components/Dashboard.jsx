import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import api from '../services/api'
import Swal from 'sweetalert2'
import UserProduct from './UserProduct'
import ProtectedRoute from './ProtectedRoute'
function Dashboard({ setAuth }) {
    const [data, setData] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token')

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem('userId')
        setAuth(false)
        setData(null)
        navigate('/login')
    }

    useEffect(() => {
        if (!token) {
            setData(null)
            localStorage.removeItem('userId')
            return
        }
        api.get('/api/protected', {
            headers: {
                'x-auth-token': token
            }
        })
            .then((response) => {
                setData(response.data)
                if (response.data.user && response.data.user.id) {
                    localStorage.setItem('userId', response.data.user.id)
                }

                // console.log('Protected data:', response.data)
            })
            .catch(error => {
                console.log('Error: ', error.response?.data || error.message)
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    localStorage.removeItem("token");
                    setAuth(false);
                    setData(null);
                    navigate('/login');
                    Swal.fire({
                        icon: 'error',
                        title: 'Authentication Error',
                        text: 'Your session is invalid. Please log in again.',
                        confirmButtonText: 'OK'
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Server Error',
                        text: 'Failed to load dashboard data.',
                        confirmButtonText: 'OK'
                    });
                }
            })
    }, [token, setAuth, navigate])
    if (!data) {
        return (
            <div className='container mt-5 pt-5 text-center'>
                <p>Loading Dashboard...</p>
            </div>
        );
    }
    return (
        <div className='container mt-5 pt-5'>
            <div className="row justify-content-center">
                <div className="col-12 col-md-8">
                    <div className="card p-3" style={{ borderRadius: '2rem' }}>
                        {/* <div className="card-header text-center">
                            <h3>Dashboard</h3>
                        </div> */}
                        <div className="card-body">
                            <div className="text-center">
                                <p className='fs-1 fw-bold'>Dashboard</p>
                            </div>                  
                            <ul>
                                <li className='fs-5 list-unstyled'><span className='fw-bold'>Email:</span>  {data.user?.email}</li>
                                <li className='fs-5 list-unstyled'><span className='fw-bold'>Username:</span> {data.user?.username}</li>

                            </ul>
                            {data.user?.isAdmin && (
                                <div className='d-flex align-items-center justify-content-start mb-3'>

                                    <button className='btn btn-warning w-100 '>

                                        <Link to='/manage' className='nav-link fw-bold text-black text-nowrap'> Manage Page</Link>
                                    </button>
                                </div>
                            )}
                            <button onClick={handleLogout} className='btn btn-danger w-100 fw-bold'>Log out</button>
                        </div>
                    </div>
                </div>
            </div>

            <UserProduct />


        </div>
    )
}

export default Dashboard
