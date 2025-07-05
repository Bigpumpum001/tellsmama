import React, { useState, useEffect } from 'react'
import axios from 'axios'
import api from '../services/api'
import Categories from './Categories'
import Swal from 'sweetalert2'
function AddProduct() {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
        subCategory: '',
        // imageUrl: ''
        imageFile: null,
        icon: '',
        subIcon: '',
        created_by: ''
    })
    //api get 
    const [categories, setCategories] = useState([])
    const [error, setError] = useState(null)
    useEffect(() => {
        api.get('/api/category')
            .then((res) => {
                setCategories(res.data)
                console.log('Categories data:', res.data)
            })
            .catch((error) => {
                setError(error)
                console.error('Failed to fetch categories:', error)
            })
        // setLoading(false)

        const userId = localStorage.getItem('userId')
        if (userId) {
            setFormData(prevFormData => ({
                ...prevFormData,
                created_by: userId
            }))
        }
        else {
            console.warn('User ID not found in localStorage. Please log in.');
            Swal.fire('Warning', 'กรุณาเข้าสู่ระบบเพื่อเพิ่มสินค้า', 'warning');
        }
    }, [])




    const [subCategories, setSubCategories] = useState([])

    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value
        if (selectedCategory === 'etc' || selectedCategory === '') {
            setFormData({
                ...formData,
                category: selectedCategory === 'etc' ? 'etc' : '',
                subCategory: '',
                icon: ''
            })
            setSubCategories([])
        }
        else {
            const found = categories.find(cat => cat.name === selectedCategory)
            setFormData({
                ...formData,
                category: selectedCategory,
                subCategory: '',
                icon: found?.icon || ''
            })


            if (found && found.subCategories && found.subCategories.length > 0) {
                setSubCategories(found.subCategories)
            }
            else {
                setSubCategories([])
            }
        }
    }
    const handleSubCategoryChange = (e) => {
        const selectSub = e.target.value
        if (selectSub === 'etc' || selectSub === '') {
            setFormData({
                ...formData,
                subCategory: selectSub === 'etc' ? 'etc' : '',
                subIcon: ''
            })
        }
        else {
            const foundSub = subCategories.find((sub) => sub.name === selectSub)
            setFormData({
                ...formData,
                subCategory: selectSub,
                subIcon: foundSub.icon || ''
            })
        }

    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (!formData.name || !formData.price || !formData.imageFile) {
                Swal.fire('Error', 'Please fill in all required information. (Name, Price, Image)', 'error');
                return;
            }


            const imageData = new FormData()
            console.log('1', formData.imageFile)
            imageData.append('image', formData.imageFile)
            console.log('2', formData.imageFile)

            const imageRes = await api.post('/api/upload', imageData)
            const imageUrl = imageRes.data.imageUrl

            const productData = {
                name: formData.name,
                price: formData.price,
                category: formData.category,
                subCategory: formData.subCategory,
                imageUrl: imageUrl,
                created_by: formData.created_by
            }
            console.log('cate', formData.category)
            const res = await api.post("/api/product", productData)
            alert('Product added :' + res.data.product.name)
            setFormData({
                name: '',
                price: '',
                category: '',
                subCategory: '',
                imageFile: null,
                created_by: formData.created_by
            });
        }
        catch (error) {
            console.error('Upload failed:', error.response?.data || error.message)
            alert('Failed to add product: ' + error.response?.data?.message || error.message)
        }
    }
    return (
        <div className=''>
            <div className="container">
                <div className="row pt-5 mt-5 pb-3  d-flex justify-content-center">
                    <div className="col-10">
                        <h2 className='fw-bold'>New Product</h2>
                        <form action="" className='mt-3' onSubmit={handleSubmit}
                        // encType='multipart/form-data'
                        >
                            <div className="mb-3">
                                <label htmlFor="" className='mb-1'>Product Name:</label>
                                <input
                                    type='text'
                                    value={formData.name}
                                    className='form-control '
                                    placeholder='Product Name'
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="" className='mb-1' >Price:</label>
                                <input
                                    type='number'
                                    value={formData.price}
                                    className='form-control '
                                    placeholder='Price (฿)'
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="" className='form-label mb-1 d-flex' >Category:
                                    {formData.icon && (
                                        <div className="ms-2">
                                            <i className={`bi ${formData.icon}`}></i>

                                        </div>
                                    )} </label>

                                <select className=' form-select' value={formData.category} onChange={handleCategoryChange} >
                                    <option value=''>- Choose Category -</option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                                    ))}
                                    <option value='etc'>etc</option>
                                </select>

                                {error && <div className="mt-3 text-danger invalid-feedback">{error}</div>}
                                {subCategories.length > 0 && (
                                    <div className='mt-3'>
                                        <label htmlFor="" className='mb-1 form-label d-flex' >subCategory:
                                            {formData.subIcon && (
                                                <div className="ms-2">
                                                    <i className={`${formData.subIcon}`}></i>

                                                </div>
                                            )}
                                        </label>
                                        <select className=' form-select'
                                            value={formData.subCategory}
                                            onChange={
                                                // e => setFormData({ ...formData, subCategory: e.target.value })
                                                handleSubCategoryChange
                                            } >
                                            <option value=''>- Select subCategory -</option>

                                            {subCategories.map((sub, index) => (

                                                <option value={sub.name} key={index}>{sub.name}</option>

                                            ))}
                                            <option value='etc'>etc</option>
                                        </select>
                                    </div>

                                )}
                            </div>

                            <div className="mb-3">
                                <label className='formFile mb-1' name='name'>Upload Picture</label>
                                <input className='form-control'
                                    type="file"
                                    accept='image/*'
                                    onChange={e => setFormData({ ...formData, imageFile: e.target.files[0] })}
                                />

                            </div>

                            <button type='submit' className='btn btn-success'>Add Product</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddProduct
