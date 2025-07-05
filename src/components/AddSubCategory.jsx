import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import api from '../services/api'
// import { options } from '../../../../backend/router/product'

function AddSubCategory() {
    // const [formData, setFormData] = useState({ name: '', icon: '' })
    const [categories, setCategories] = useState([])
    const [selectedCategoryId, setSelectedCategoryId] = useState('')
    const [selectedCategoryIcon, setSelectedCategoryIcon] = useState("")
    const [subCategoryName, setSubCategoryName] = useState("")
    const [subCategoryIcon, setSubCategoryIcon] = useState("")
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('')
    const [error, setError] = useState(null)

    useEffect(() => {
        // axios.get('http://localhost:5000/api/category')
        api.get('/api/category')
            .then((res) => {
                setCategories(res.data)
                // if (res.data.length > 0) {
                //     setCategories(res.data[0]._id)
                // }
                console.log('Categories data:', res.data)
                setLoading(false)
            })
            .catch((error) => {
                setError(error)
                console.error('Failed to fetch categories:', error)
                setLoading(false)
            })

    }, [])

    const handleCategorySelectedChange = (e) => {
        const categoriesId = e.target.value
        setSelectedCategoryId(categoriesId)
        //icon
        const selectedCat = categories.find(cat => cat._id === categoriesId)
        if (selectedCat) {
            setSelectedCategoryIcon(selectedCat.icon)
        }
        else {
            setSelectedCategoryIcon('')
        }
    }

    const handleSubCategoryNameChange = (e) => {
        setSubCategoryName(e.target.value)
    }

    const handleSubCategoryIconChange = (e) => {
        setSubCategoryIcon(e.target.value);
    };


    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage("")
        setError("")
        if (!selectedCategoryId) {
            setError('Please Select Category')
            return
        }
        if (!subCategoryName.trim()) {
            setError('Please Fill SubCategory');
            return
        }
        if (!subCategoryIcon.trim()) {
            setError('Please fill in SubCategory Icon fields.')
            return
        }
        const newSubCategory = {
            name: subCategoryName,
            icon: subCategoryIcon
        }
        try {
            setLoading(true)

            const res = await api.post(`/api/category/${selectedCategoryId}/subcategory`, newSubCategory)
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: res.data.message || 'Subcategory added successfully',
                confirmButtonText: 'Ok'
            }).then(() => {
                setMessage(res.data.message || "Subcategory added!");
                setSubCategoryName('');
                setSubCategoryIcon('');
                setError('')

                const updateCategories = categories.map(cat =>
                    cat._id === selectedCategoryId ? res.data.category : cat
                )
                setCategories(updateCategories)
            })
        }
        catch (error) {
            console.error('Error adding sub category:', error);
            setError('Error: ' + error.response?.data?.message || message)
            Swal.fire({
                icon: 'error',
                title: 'An error occurred.',
                text: error.response?.data?.message || `Can't add Subcategory`,
                confirmButtonText: 'Ok'
            })
        }
        setLoading(false)
    }

    return (
        <div>

            <div 
            className="container mt-5"
            // className='mt-5'
            >
                <div 
                // className="row pt-5 mt-5 pb-3  d-flex justify-content-center"
                >
                    <div className="col-10">
                        <h2 className='fw-bold'>Add SubCategory</h2>
                        <form className='mt-3' onSubmit={handleSubmit}>
                            <div className="mb-3">
                            
                                    <label htmlFor='categorySelect' className='form-label d-flex'>Choose Category : 
                                        {selectedCategoryIcon && (
                                            <div className="ms-2">
                                                {/* Selected Category Icon :  */}
                                                <i className={`${selectedCategoryIcon}`}></i>
                                            </div>
                                        )}
                                    </label>
                          

                                <select className='form-select mb-3'
                                    id="categorySelect"
                                    value={selectedCategoryId}
                                    onChange={handleCategorySelectedChange}
                                    required
                                    disabled={loading}
                                >
                                    <option value=''>- Choose Category -</option>
                                    {loading ? (
                                        <option value=''>Loading Category...</option>
                                    ) : categories.length === 0 ? (
                                        <option>No Category</option>
                                    ) : (

                                        categories.map((cat) => (
                                            <option key={cat._id} value={cat._id}>
                                                {cat.name}
                                            </option>
                                        ))
                                    )}
                                </select>
                                {/* {selectedCategoryIcon && (
                                    <div className="mt-2">
                                        Selected Category Icon : 
                                        <i className={`${selectedCategoryIcon}`}></i>
                                    </div>
                                )} */}
                            </div>
                            <div className="mb-3">
                                <label htmlFor='subCategoryName'>Subcategory:</label>
                                <input type='text'

                                    id='subCategoryName'
                                    className='form-control mb-3'
                                    value={subCategoryName}
                                    onChange={handleSubCategoryNameChange}
                                    placeholder='e.g., Kitchen,Diaper'
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor='subCategoryName'>Subcategory Icon (e.g., bi-cup-straw):</label>
                                <input type='text'
                                    id='subCategoryIcon'
                                    className='form-control mb-3'
                                    value={subCategoryIcon}
                                    onChange={handleSubCategoryIconChange}
                                    placeholder='e.g., Kitchen,Diaper'
                                    required
                                />
                                {subCategoryIcon && (
                                    <div className='mt-2'>
                                        Preview Icon: <i className={`${subCategoryIcon}`}></i>
                                    </div>
                                )}
                                <small className='mt-5' style={{ display: 'block', color: '#666' }}>
                                    You can find icons from <a href="https://icons.getbootstrap.com/" target="_blank" rel="noopener noreferrer">Bootstrap Icons.</a> ,
                                    <a href="https://fontawesome.com/v4/icons/" target="_blank" rel="noopener noreferrer"> Fontawesome Icons.</a>
                                </small>
                            </div>


                            <button type='submit' className='btn btn-success'
                            // disabled={loading || categories.length === 0 || !selectedCategoryId || !subCategoryName.trim()}
                            >
                                {/* {loading ? 'Saving' : "Add Sub Category"} */}
                                Add SubCategory
                            </button>
                            {message && <p className='mt-3 text-success'>{message}</p>}
                            {error && <div className="mt-3 text-danger">{error}</div>}
                        </form>
                        <hr style={{ margin: '30px 0' }} />

                        <h3>Existing Categories and Subcategories</h3>
                        <ul style={{ listStyleType: 'none', padding: '0' }}>
                            {categories.length > 0 ? (
                                categories.map((category) => (
                                    <li key={category._id} style={{ border: '1px solid #eee', borderRadius: '4px', marginBottom: '10px', padding: '10px' }}>
                                        <h4 style={{ margin: '0 0 10px 0' }}>
                                            <i className={category.icon}></i> {category.name}
                                        </h4>
                                        {category.subCategories && category.subCategories.length > 0 ? (
                                            <ul style={{ listStyleType: 'none', padding: '0 0 0 20px' }}>
                                                {category.subCategories.map((sub) => (
                                                    <li key={sub._id || sub.name} style={{ marginBottom: '5px' }}>
                                                        <i className={sub.icon}></i> {sub.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p style={{ color: '#888', fontStyle: 'italic', paddingLeft: '20px' }}>No subcategories yet.</p>
                                        )}
                                    </li>
                                ))
                            ) : (
                                <p>Loading categories...</p>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default AddSubCategory
