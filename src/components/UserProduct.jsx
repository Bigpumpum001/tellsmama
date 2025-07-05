import React, { useEffect, useState } from 'react'
import api from '../services/api'
import Swal from 'sweetalert2'
function UserProduct() {
    const [myProducts, setMyProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const userId = localStorage.getItem('userId')

    const [showEditModal, setShowEditModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [editFormData, setEditFormData] = useState({
        name: '',
        price: '',
        category: '',
        subCategory: '',
        icon: '',
        subIcon: ''
    });

    const [categories, setCategories] = useState([]);
    const [subCategoriesEdit, setSubCategoriesEdit] = useState([]);

    useEffect(() => {
        api.get('/api/category')
            .then((res) => {
                setCategories(res.data);
            })
            .catch((error) => {
                console.error('Failed to fetch categories:', error);
                setError(`Can't fetch categories`);
            });


        if (!userId) {
            setError('User not logged in.');
            setLoading(false);
            return;
        }
        const fetchMyProducts = async () => {
            try {
                const response = await api.get(`/api/product/user/${userId}`)
                setMyProducts(response.data)
            }
            catch (err) {
                setError('Failed to fetch your products.');
                console.error(err);
            }
            finally {
                setLoading(false);
            }
        }
        fetchMyProducts()
    }, [userId])

    const handleEdit = (product) => {
        setCurrentProduct(product)
        setEditFormData({
            name: product.name,
            price: product.price,
            category: product.category,
            subCategory: product.subCategory,
            icon: '',
            subIcon: ''
        })
        const foundCategory = categories.find(cat => cat.name === product.category)
        if (foundCategory) {
            setSubCategoriesEdit(foundCategory.subCategories || [])
            setEditFormData(prev => ({
                ...prev,
                icon: foundCategory.icon || ''
            }))
            const foundSubCategory = (foundCategory.subCategories || []).find(sub => sub.name === product.subCategory);
            if (foundSubCategory) {
                setEditFormData(prev => ({
                    ...prev,
                    subIcon: foundSubCategory.icon || ''
                }));
            }
            else {
                setSubCategoriesEdit([]);
            }
            setShowEditModal(true)
        }
    }

    const handleEditFormChange = (e) => {
        const { name, value } = e.target
        setEditFormData(prev => ({ ...prev, [name]: value }));

    }
    const handleCategoryChangeEdit = (e) => {
        const selectedCategory = e.target.value;
        const found = categories.find(cat => cat.name === selectedCategory);
        setEditFormData(prev => ({
            ...prev,
            category: selectedCategory,
            subCategory: '', // Reset subCategory when category changes
            icon: found?.icon || '',
            subIcon: ''
        }));
        setSubCategoriesEdit(found && found.subCategories ? found.subCategories : []);
    };

    const handleSubCategoryChangeEdit = (e) => {
        const selectSub = e.target.value;
        const foundSub = (subCategoriesEdit || []).find(sub => sub.name === selectSub);
        setEditFormData(prev => ({
            ...prev,
            subCategory: selectSub,
            subIcon: foundSub?.icon || ''
        }));
    };
    const handleUpdateSubmit = async (e) => {
        e.preventDefault()
        if (!currentProduct) {
            console.error('currentProduct is null/undefined during update submit.');
            return
        }
        // console.log('editFormData on submit:', editFormData); 
        // console.log('currentProduct on submit:', currentProduct); 
        try {
            const productData = {
                name: editFormData.name,
                price: editFormData.price,
                category: editFormData.category,
                subCategory: editFormData.subCategory,

            }
            const res = await api.put(`/api/product/${currentProduct._id}`, productData);
            setMyProducts(prevProducts =>
                prevProducts.map(p =>
                    p._id === currentProduct._id ? {
                        ...p, ...productData,
                        //  imageUrl: currentProduct.imageUrl
                    } : p
                )
            );
            Swal.fire('สำเร็จ', `สินค้า "${res.data.name}" ได้รับการแก้ไขแล้ว!`, 'success')
            setShowEditModal(false)
            setCurrentProduct(null);
        }
        catch (error) {
            console.error('Update failed:', error.response?.data || error.message);
            Swal.fire('Error', 'ไม่สามารถแก้ไขสินค้าได้: ' + (error.response?.data?.message || error.message), 'error');
        }
    }
    const handleDelete = async (productId, productName) => {
        Swal.fire({
            title: 'ยืนยันการลบ?',
            text: `คุณแน่ใจหรือไม่ที่จะลบสินค้า "${productName}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'ใช่, ลบเลย!',
            cancelButtonText: 'ยกเลิก'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.delete(`/api/product/${productId}`);
                    setMyProducts(myProducts.filter(product => product._id !== productId));
                    Swal.fire(
                        'ลบแล้ว!',
                        `สินค้า "${productName}" ถูกลบเรียบร้อยแล้ว.`,
                        'success'
                    );
                } catch (err) {
                    console.error('Error deleting product:', err);
                    Swal.fire(
                        'เกิดข้อผิดพลาด!',
                        'ไม่สามารถลบสินค้าได้. โปรดลองอีกครั้ง.',
                        'error'
                    );
                }
            }
        });
    };

    if (loading) return <div className="">Loading Product...</div>
    if (error) return <div className="">An error occurred: {error}</div>
    return (
        <div>
            <div className="container mt-5">
                <h2 className='fw-bold mb-4'>My Products ({myProducts.length} items)</h2>
                {myProducts.length === 0 ?
                    (
                        <p>You haven't added any products yes</p>
                    ) : (
                        <div className="row">
                            {myProducts.map(product => (
                                <div key={product._id} className="col-md-4 mb-4">
                                    <div className="card h-100">
                                        <img src={product.imageUrl} className='card-img-top' alt={product.name} style={{ height: '200px', objectFit: 'cover' }} />
                                        <div className="card-body">
                                            <h5 className="card-title">{product.name}</h5>
                                            <p className="card-text">Price : {product.price} ฿</p>
                                            <p className="card-text">Category: {product.category} {product.subCategory && `(${product.subCategory})`}</p>
                                            <div className="d-flex justify-content-between">
                                                <button className="btn btn-warning btn-sm"
                                                    onClick={() => handleEdit(product)}
                                                ><i className="bi bi-pencil-fill me-1"></i> Edit</button>
                                                <button className="btn btn-danger btn-sm"
                                                    onClick={() => handleDelete(product._id, product.name)}
                                                ><i className="bi bi-trash-fill me-1"></i> Delelte</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
            </div>
            {showEditModal && currentProduct && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Product : {currentProduct.name}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleUpdateSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="editProductName" className="form-label">Product Name :</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="editProductName"
                                            name="name"
                                            value={editFormData.name}
                                            onChange={handleEditFormChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="editProductPrice" className="form-label">Price :</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="editProductPrice"
                                            name="price"
                                            value={editFormData.price}
                                            onChange={handleEditFormChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="editProductCategory" className="form-label d-flex">Category:
                                            {editFormData.icon && (<div className="ms-2"><i className={`bi ${editFormData.icon}`}></i></div>)}
                                        </label>
                                        <select
                                            className="form-select"
                                            id="editProductCategory"
                                            name="category"
                                            value={editFormData.category}
                                            onChange={handleCategoryChangeEdit}
                                        >
                                            <option value=''>- Choose Category -</option>
                                            {categories.map((cat) => (
                                                <option key={cat._id} value={cat.name}>{cat.name}</option>
                                            ))}
                                            <option value='etc'>etc</option>
                                        </select>
                                    </div>
                                    {subCategoriesEdit.length > 0 && (
                                        <div className="mb-3">
                                            <label htmlFor="editProductSubCategory" className="form-label d-flex">SubCategory:
                                                {editFormData.subIcon && (<div className="ms-2"><i className={`bi ${editFormData.subIcon}`}></i></div>)}
                                            </label>
                                            <select
                                                className="form-select"
                                                id="editProductSubCategory"
                                                name="subCategory"
                                                value={editFormData.subCategory}
                                                onChange={handleSubCategoryChangeEdit}
                                            >
                                                <option value=''>- Choose SubCategory -</option>
                                                {subCategoriesEdit.map((sub, index) => (
                                                    <option key={index} value={sub.name}>{sub.name}</option>
                                                ))}
                                                <option value='etc'>etc</option>
                                            </select>
                                        </div>
                                    )}

                                
                                    <div className="mb-3">
                                        <label className="form-label">Current Image :</label>
                                        <div>
                                            <img src={currentProduct.imageUrl} alt="Current Product" style={{ maxWidth: '150px', height: 'auto', border: '1px solid #ddd' }} />
                                        </div>
                                        <small className="form-text text-muted">Cannot edit image on this page.</small>
                                    </div>

                                    <div className="modal-footer d-flex justify-content-end">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                                        <button type="submit" className="btn btn-primary">Save changes</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserProduct
