import React from 'react'
import { Navigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import Swal from 'sweetalert2'
function ProtectedRoute({ children, adminOnly = false }) {

    const token = localStorage.getItem('token')

    if (token) {
        try {
            const decodedToken = jwtDecode(token)
            const currentTime = Date.now() / 1000

            if (decodedToken.exp > currentTime) {
                if (adminOnly && (!decodedToken.isAdmin || decodedToken.isAdmin === false)) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Unauthorized Access',
                        text: 'คุณไม่มีสิทธิ์ผู้ดูแลระบบในการเข้าถึงหน้านี้',
                        confirmButtonText: 'Confirm'
                    })
                    return <Navigate to="/" replace />
                }
                return children
            } else {
                localStorage.removeItem('token')
            }

        }
        catch (error) {
            console.error('Invalid token: ', error)
        }
    }
    else {
        
        Swal.fire({
            icon: 'info',
            title: 'Login Required',
            text: 'You need to be logged in to view this page.',
            confirmButtonText: 'OK'
        }).then(() => {
            // SweetAlert2 handles the asynchronous nature, no need to navigate here
            // The Navigate component below will handle the redirect
        });
    }


    return (
        <Navigate to='/login' replace/>
    )
}

export default ProtectedRoute
