import React, { useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import AddSubCategory from './AddSubCategory'
import api from '../services/api'

function AddCategory() {
    const [formData, setFormData] = useState({ name: '', icon: '' })
    const [message, setMessage] = useState('')
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await api.post('/api/category', formData)
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: res.data.message || 'Category added sucessfully',
                confirmButtonText: 'Confirm'
            }).then(() => {
                setFormData({ name: '', icon: '' })
            })
            setMessage('Category added!')
        }
        catch (error) {
            setMessage('Error: ' + error.response?.data?.message || message)
            Swal.fire({
                icon: 'error',
                title: 'An error occurred.',
                text: error.response?.data?.message || `Can't add category`,
                confirmButtonText: 'Confirm'
            })
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })

    }
    return (
        <div>
            <div 
            className="container"
            // className='mt-5'
            >
                <div 
                // className="row pt-5 mt-5 pb-3  d-flex justify-content-center"
                >
                    <div className="col-10">
                        <h2 className='fw-bold mt-3'>Add Category</h2>
                        <form className='mt-3' onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label>Name:</label>
                                <input type='text' className='form-control mb-3' name='name' value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label>Bootstrap Icon (eg. `bi-plug`):</label>
                                <input type='text' className='form-control mb-3' name='icon' value={formData.icon} onChange={handleChange} required />
                            </div>
                            {formData.icon && (
                                <div className="mb-2">
                                    Preview Icon: <i className={`${formData.icon}`}></i>
                                </div>
                            )}
                            <small className='mt-2' style={{ display: 'block', color: '#666' }}>
                                    You can find icons from <a href="https://icons.getbootstrap.com/" target="_blank" rel="noopener noreferrer">Bootstrap Icons</a>. ,
                                    <a href="https://fontawesome.com/v4/icons/" target="_blank" rel="noopener noreferrer"> Fontawesome Icons.</a>
                                </small>
                            <button type='submit' className='btn btn-success mt-2'>Add Category</button>
                            {message && <p className='mt-3'>{message}</p>}
                        </form>
                    </div>
                </div>
            </div>
            <AddSubCategory/>
        </div>

    )
}

export default AddCategory
