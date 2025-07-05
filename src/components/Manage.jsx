import React, { useState, useEffect, useMemo } from 'react'
import api from '../services/api.js'
//Component
import AddCategory from './AddCategory'
function Manage({ onProductUpdate }) {

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('categories');

    //Edit Category
    const [editingCategory, setEditingCategory] = useState(null);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryIcon, setNewCategoryIcon] = useState('');

    //Edit SubCategory
    const [editingSubCategory, setEditingSubCategory] = useState(null);
    const [newSubCategoryName, setNewSubCategoryName] = useState('');
    const [newSubCategoryIcon, setNewSubCategoryIcon] = useState('');
    const [parentCategoryId, setParentCategoryId] = useState(null)

    //Edit product
    const [editingProduct, setEditingProduct] = useState(null)
    const [newProductName, setNewProductName] = useState('')
    const [newProductPrice, setNewProductPrice] = useState('')
    const [newProductCategory, setNewProductCategory] = useState('')
    const [newProductSubCategory, setNewProductSubCategory] = useState('')
    const [availableSubCategory, setAvailableSubCategory] = useState([])

    //Search Category
    const [searchCategoryFilter, setSearchCategoryFilter] = useState('');
    const [searchSubCategoryFilter, setSearchSubCategoryFilter] = useState('');
    const [categorySearchTerm, setCategorySearchTerm] = useState('');

    //Search Product & Sort 
    const [productSearchTerm, setProductSearchTerm] = useState('');
    const [productCategoryFilter, setProductCategoryFilter] = useState('');
    const [productSubCategoryFilter, setProductSubCategoryFilter] = useState('');
    const [productSortBy, setProductSortBy] = useState(''); // 'name', 'price', 'category', 'subCategory'
    const [productSortOrder, setProductSortOrder] = useState('asc'); // 'asc' or 'desc'

    useEffect(() => {
        fetchData()

    }, [])


    const fetchData = async () => {
        try {
            const [categoriesRes, productsRes] = await Promise.all([
                api.get('/api/category'),
                api.get('/api/product')
            ])
            setCategories(categoriesRes.data);
            setProducts(productsRes.data);
            setError(null);

        }
        catch (err) {
            console.error('Failed to fetch data:', err);
            setError('Failed to fetch data: ' + (err.response?.data?.message || err.message));
        }
        finally {
            setLoading(false);
        }
    }
    const handleEditCategory = (category) => {
        setEditingCategory(category._id)
        setNewCategoryName(category.name);
        setNewCategoryIcon(category.icon || '');
    }

    const handleSaveCategory = async (categoryId) => {
        try {
            await api.put(`/api/category/${categoryId}`, { name: newCategoryName, icon: newCategoryIcon })
            alert('Category updated successfully')
            setEditingCategory(null);
            fetchData()
            if (onProductUpdate) {
                onProductUpdate();
            }
        }
        catch (err) {
            console.error('Failed to update category:', err);
            alert('Failed to update category: ' + (err.response?.data?.message || err.message));
        }
    }
    //////////////อันล่าง
    const handleDeleteCategory = async (categoryId, categoryName) => {
        if (window.confirm(`คุณแน่ใจหรือไม่ที่ต้องการDeleteหมวดหมู่ "${categoryName}" และ SubCategories ทั้งหมดของมัน?`)) {
            try {
                await api.delete(`/api/category/${categoryId}`);
                alert('Category deleted successfully!');
                fetchData();
                if (onProductUpdate) {
                    onProductUpdate();
                }
            } catch (err) {
                console.error('Failed to delete category:', err);
                alert('Failed to delete category: ' + (err.response?.data?.message || err.message));
            }
        }
    };

    const handleCancelEditCategory = () => {
        setEditingCategory(null)
        setNewCategoryName('');
        setNewCategoryIcon('');
    }
    const handleEditSubCategory = (subCategory, parentCatId) => {
        setEditingSubCategory(subCategory._id);
        setNewSubCategoryName(subCategory.name);
        setNewSubCategoryIcon(subCategory.icon || '');
        setParentCategoryId(parentCatId);
    };
    ///////////////////// ล่างจากนี้หมด
    const handleSaveSubCategory = async (subCategoryId) => {
        try {
            await api.put(`/api/category/${parentCategoryId}/subcategories/${subCategoryId}`, { name: newSubCategoryName, icon: newSubCategoryIcon });
            alert('SubCategory updated successfully!');
            setEditingSubCategory(null);
            setParentCategoryId(null);
            fetchData(); // ดึงข้อมูลใหม่
        } catch (err) {
            console.error('Failed to update subCategory:', err);
            alert('Failed to update subCategory: ' + (err.response?.data?.message || err.message));
        }
    };
    ////////////
    const handleDeleteSubCategory = async (subCategoryId, subCategoryName, parentCatId) => {
        if (window.confirm(`คุณแน่ใจหรือไม่ที่ต้องการDeleteหมวดหมู่ย่อย "${subCategoryName}"?`)) {
            try {
                // สมมติว่า API endpoint สำหรับDelete subcategory คือ DELETE /api/category/:categoryId/subcategories/:subCategoryId
                await api.delete(`/api/category/${parentCatId}/subcategories/${subCategoryId}`);
                alert('SubCategory deleted successfully!');
                fetchData();
                if (onProductUpdate) {
                    onProductUpdate();
                }
            } catch (err) {
                console.error('Failed to delete subCategory:', err);
                alert('Failed to delete subCategory: ' + (err.response?.data?.message || err.message));
            }
        }
    };

    const handleCancelEditSubCategory = () => {
        setEditingSubCategory(null);
        setNewSubCategoryName('');
        setNewSubCategoryIcon('');
        setParentCategoryId(null);
    };


    // --- Product Management ---

    const handleEditProduct = (product) => {
        setEditingProduct(product._id);
        setNewProductName(product.name);
        setNewProductPrice(product.price);
        setNewProductCategory(product.category);
        setNewProductSubCategory(product.subCategory || '');

        // โหลด subCategories ที่เกี่ยวข้องกับ category ที่เลือกไว้สำหรับ product นี้
        const selectedCat = categories.find(cat => cat.name === product.category);
        if (selectedCat && selectedCat.subCategories) {
            setAvailableSubCategory(selectedCat.subCategories);
        } else {
            setAvailableSubCategory([]);
        }
    };

    const handleProductCategoryChange = (e) => {
        const selectedCatName = e.target.value;
        setNewProductCategory(selectedCatName);
        setNewProductSubCategory(''); // Reset subCategory เมื่อเปลี่ยน category

        const selectedCat = categories.find(cat => cat.name === selectedCatName);
        if (selectedCat && selectedCat.subCategories) {
            setAvailableSubCategory(selectedCat.subCategories);
        } else {
            setAvailableSubCategory([]);
        }
    };

    const handleSaveProduct = async (productId) => {
        try {
            const productData = {
                name: newProductName,
                price: newProductPrice,
                category: newProductCategory,
                subCategory: newProductSubCategory
            };
            await api.put(`/api/product/${productId}`, productData);
            alert('Product updated successfully!');
            setEditingProduct(null);
            fetchData(); // ดึงข้อมูลใหม่
            if (onProductUpdate) {
                onProductUpdate()
            }
        } catch (err) {
            console.error('Failed to update product:', err);
            alert('Failed to update product: ' + (err.response?.data?.message || err.message));
        }
    };
    const handleDeleteProduct = async (productId, productName) => {
        if (window.confirm(`คุณแน่ใจหรือไม่ที่ต้องการDeleteสินค้า "${productName}"?`)) {
            try {
                await api.delete(`/api/product/${productId}`);
                alert('Product deleted successfully!');
                fetchData();
                if (onProductUpdate) {
                    onProductUpdate();
                }
            } catch (err) {
                console.error('Failed to delete product:', err);
                alert('Failed to delete product: ' + (err.response?.data?.message || err.message));
            }
        }
    };

    const handleCancelEditProduct = () => {
        setEditingProduct(null);
        setNewProductName('');
        setNewProductPrice('');
        setNewProductCategory('');
        setNewProductSubCategory('');
        setAvailableSubCategory([]);
    };

    // Category Filtering and Search
    const filteredCategories = useMemo(() => {
        let currentCategories = [...categories];

        if (searchCategoryFilter) {
            currentCategories = currentCategories.filter(cat => cat.name === searchCategoryFilter);
        }

        if (searchSubCategoryFilter) {
            currentCategories = currentCategories.map(cat => ({
                ...cat,
                subCategories: cat.subCategories.filter(sub => sub.name === searchSubCategoryFilter)
            })).filter(cat => cat.subCategories.length > 0);
        }

        if (categorySearchTerm) {
            const lowerCaseSearchTerm = categorySearchTerm.toLowerCase();
            currentCategories = currentCategories.filter(cat =>
                cat.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                (cat.subCategories && cat.subCategories.some(sub =>
                    sub.name.toLowerCase().includes(lowerCaseSearchTerm)
                ))
            );
        }

        return currentCategories;
    }, [categories, searchCategoryFilter, searchSubCategoryFilter, categorySearchTerm]);


    // --- Product Filtering, Search, and Sort Logic ---
    const filteredAndSortedProducts = useMemo(() => {
        let currentProducts = [...products];

        // 1. Filter by Category
        if (productCategoryFilter) {
            currentProducts = currentProducts.filter(product => product.category === productCategoryFilter);
        }

        // 2. Filter by SubCategory
        if (productSubCategoryFilter) {
            currentProducts = currentProducts.filter(product => product.subCategory === productSubCategoryFilter);
        }

        // 3. Search by Name/Category/SubCategory
        if (productSearchTerm) {
            const lowerCaseSearchTerm = productSearchTerm.toLowerCase();
            currentProducts = currentProducts.filter(product =>
                product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                product.category.toLowerCase().includes(lowerCaseSearchTerm) ||
                (product.subCategory && product.subCategory.toLowerCase().includes(lowerCaseSearchTerm))
            );
        }

        // 4. Sort
        if (productSortBy) {
            currentProducts.sort((a, b) => {
                let valA, valB;
                if (productSortBy === 'name' || productSortBy === 'category' || productSortBy === 'subCategory') {
                    valA = (a[productSortBy] || '').toLowerCase();
                    valB = (b[productSortBy] || '').toLowerCase();
                } else if (productSortBy === 'price') {
                    valA = parseFloat(a.price);
                    valB = parseFloat(b.price);
                }

                if (valA < valB) return productSortOrder === 'asc' ? -1 : 1;
                if (valA > valB) return productSortOrder === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return currentProducts;
    }, [products, productCategoryFilter, productSubCategoryFilter, productSearchTerm, productSortBy, productSortOrder]);


    // Helper to get subcategories for product search filter dropdown
    const getProductSubCategoryForFilter = useMemo(() => { // เปลี่ยนชื่อ function ตรงนี้
        if (!productCategoryFilter) {
            return [];
        }
        const selectedCat = categories.find(cat => cat.name === productCategoryFilter);
        return selectedCat ? selectedCat.subCategories : [];
    }, [productCategoryFilter, categories]);

    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    if (error) {
        return <div className="alert alert-danger mt-5" role="alert">{error}</div>;
    }


    return (
        <div className="container-fluid py-5 mt-5">
            <h1 className="mb-4 fw-bold text-center">Manage</h1>
            <div className="row">
                {/* Navbar ด้านซ้าย */}
                <div className="col-md-2">
                    <div className="d-flex flex-column p-3 bg-light border rounded shadow-sm sticky-top" style={{ top: '80px' }}>
                        <button
                            className={`btn btn-lg mb-3 ${activeTab === 'categories' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => {
                                setActiveTab('categories');
                                // Reset category search filters when switching tabs
                                setSearchCategoryFilter('');
                                setSearchSubCategoryFilter('');
                                setCategorySearchTerm('');
                            }}
                        >
                            <i className="bi bi-folder me-2"></i> Categories
                        </button>
                        <button
                            className={`btn btn-lg mb-3 ${activeTab === 'products' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => {
                                setActiveTab('products');
                                // Reset product search/sort filters when switching tabs
                                setProductSearchTerm('');
                                setProductCategoryFilter('');
                                setProductSubCategoryFilter('');
                                setProductSortBy('');
                                setProductSortOrder('asc');
                            }}
                        >
                            <i className="bi bi-box-seam me-2"></i> Products
                        </button>
                        <button
                            className={`btn btn-lg ${activeTab === 'category' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => {
                                setActiveTab('category');
                                // Reset product search/sort filters when switching tabs

                            }}
                        >Add Category</button>
                    </div>
                </div>

                {/* เนื้อหาหลัก */}
                <div className="col-md-10">
                    {activeTab === 'categories' && (
                        <>
                            <h2 className="mb-3 fw-bold mt-3">Category Manage</h2>
                            {/* Category Search Section */}
                            <div className="mb-4 p-3 bg-light rounded shadow-sm">
                                <h5 className="mb-3">Category Search</h5>
                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <label htmlFor="selectCategoryFilter" className="form-label visually-hidden">เลือก Category</label>
                                        <select
                                            id="selectCategoryFilter"
                                            className="form-select"
                                            value={searchCategoryFilter}
                                            onChange={(e) => {
                                                setSearchCategoryFilter(e.target.value);
                                                setSearchSubCategoryFilter(''); // Reset sub-category filter
                                            }}
                                        >
                                            <option value="">All Category</option>
                                            {categories.map((cat) => (
                                                <option key={cat._id} value={cat.name}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="selectSubCategoryFilter" className="form-label visually-hidden">เลือก SubCategory</label>
                                        <select
                                            id="selectSubCategoryFilter"
                                            className="form-select"
                                            value={searchSubCategoryFilter}
                                            onChange={(e) => setSearchSubCategoryFilter(e.target.value)}
                                            disabled={!searchCategoryFilter || !categories.find(cat => cat.name === searchCategoryFilter)?.subCategories?.length}
                                        >
                                            <option value="">All SubCategory</option>
                                            {searchCategoryFilter && categories.find(cat => cat.name === searchCategoryFilter)?.subCategories.map((sub, index) => (
                                                <option key={index} value={sub.name}>{sub.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="categorySearchTerm" className="form-label visually-hidden">ค้นหาข้อความ</label>
                                        <input
                                            type="text"
                                            id="categorySearchTerm"
                                            className="form-control"
                                            placeholder="Search Category or SubCategory"
                                            value={categorySearchTerm}
                                            onChange={(e) => setCategorySearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* End Category Search Section */}

                            <div className="table-responsive mb-5">
                                <table className="table table-striped table-bordered">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Category</th>
                                            <th>Icon</th>
                                            <th>Sub Category</th>
                                            <th>Manage</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredCategories.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="text-center text-muted">ไม่พบข้อมูลหมวดหมู่</td>
                                            </tr>
                                        ) : (
                                            filteredCategories.map((category) => (
                                                <React.Fragment key={category._id}>
                                                    <tr>
                                                        <td>
                                                            {editingCategory === category._id ? (
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={newCategoryName}
                                                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                                                />
                                                            ) : (
                                                                category.name
                                                            )}
                                                        </td>
                                                        <td>
                                                            {editingCategory === category._id ? (
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={newCategoryIcon}
                                                                    onChange={(e) => setNewCategoryIcon(e.target.value)}
                                                                    placeholder="เช่น bi-x-circle"
                                                                />
                                                            ) : (
                                                                category.icon && <i className={`${category.icon}`}></i>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <ul className="list-unstyled mb-0">
                                                                {category.subCategories && category.subCategories.map((sub) => (
                                                                    <li key={sub._id} className='d-flex align-items-center'>
                                                                        {editingSubCategory === sub._id && parentCategoryId === category._id ? (
                                                                            <>
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control form-control-sm d-inline-block w-auto me-2"
                                                                                    value={newSubCategoryName}
                                                                                    onChange={(e) => setNewSubCategoryName(e.target.value)}
                                                                                />
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control form-control-sm d-inline-block w-auto me-2"
                                                                                    value={newSubCategoryIcon}
                                                                                    onChange={(e) => setNewSubCategoryIcon(e.target.value)}
                                                                                    placeholder="icon"
                                                                                />

                                                                                <button className="btn btn-sm btn-success me-1" onClick={() => handleSaveSubCategory(sub._id)}>บันทึก</button>
                                                                                <button className="btn btn-sm btn-secondary" onClick={handleCancelEditSubCategory}>ยกเลิก</button>

                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                {sub.name} {sub.icon && <i className={`${sub.icon} ms-2`}></i>}
                                                                                <div 
                                                                                className='mb-2 '
                                                                                    // className='text-end'
                                                                                >
                                                                                    <button className="btn btn-sm btn-warning ms-2" onClick={() => handleEditSubCategory(sub, category._id)}>Edit</button>
                                                                                    <button className="btn btn-sm btn-danger ms-1" onClick={() => handleDeleteSubCategory(sub._id, sub.name, category._id)}>Delete</button>
                                                                                </div>
                                                                            </>
                                                                        )}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </td>
                                                        <td>
                                                            {editingCategory === category._id ? (
                                                                <>
                                                                    <button className="btn btn-success me-2" onClick={() => handleSaveCategory(category._id)}>บันทึก</button>
                                                                    <button className="btn btn-secondary" onClick={handleCancelEditCategory}>ยกเลิก</button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <button className="btn btn-warning me-2" onClick={() => handleEditCategory(category)}>Edit</button>
                                                                    <button className="btn btn-danger" onClick={() => handleDeleteCategory(category._id, category.name)}>Delete</button>
                                                                </>
                                                            )}
                                                        </td>
                                                    </tr>
                                                </React.Fragment>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {activeTab === 'products' && (
                        <>
                            <h2 className="mb-3 fw-bold mt-3">Products Manage</h2>
                            {/* Product Search & Sort Section */}
                            <div className="mb-4 p-3 bg-light rounded shadow-sm">
                                <h5 className="mb-3">Search And Sort</h5>
                                <div className="row g-3 mb-3">
                                    <div className="col-md-4">
                                        <label htmlFor="productCategoryFilter" className="form-label visually-hidden">เลือก Category</label>
                                        <select
                                            id="productCategoryFilter"
                                            className="form-select"
                                            value={productCategoryFilter}
                                            onChange={(e) => {
                                                setProductCategoryFilter(e.target.value);
                                                setProductSubCategoryFilter(''); // Reset sub-category filter
                                            }}
                                        >
                                            <option value="">All Category</option>
                                            {categories.map((cat) => (
                                                <option key={cat._id} value={cat.name}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="productSubCategoryFilter" className="form-label visually-hidden">เลือก SubCategory</label>
                                        <select
                                            id="productSubCategoryFilter"
                                            className="form-select"
                                            value={productSubCategoryFilter}
                                            onChange={(e) => setProductSubCategoryFilter(e.target.value)}
                                            disabled={!productCategoryFilter || getProductSubCategoryForFilter.length === 0} // เปลี่ยนชื่อ function ตรงนี้
                                        >
                                            <option value="">All SubCategory</option>
                                            {getProductSubCategoryForFilter.map((sub, index) => ( // เปลี่ยนชื่อ function ตรงนี้
                                                <option key={index} value={sub.name}>{sub.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="productSearchTerm" className="form-label visually-hidden">ค้นหาข้อความ</label>
                                        <input
                                            type="text"
                                            id="productSearchTerm"
                                            className="form-control"
                                            placeholder="Search products from Name, Category, SubCategory"
                                            value={productSearchTerm}
                                            onChange={(e) => setProductSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label htmlFor="productSortBy" className="form-label visually-hidden">Sort by</label>
                                        <select
                                            id="productSortBy"
                                            className="form-select"
                                            value={productSortBy}
                                            onChange={(e) => setProductSortBy(e.target.value)}
                                        >
                                            <option value="">Sort by...</option>
                                            <option value="name">Name</option>
                                            <option value="price">Price</option>
                                            <option value="category">Category</option>
                                            <option value="subCategory">SubCategory</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="productSortOrder" className="form-label visually-hidden">ลำดับ</label>
                                        <select
                                            id="productSortOrder"
                                            className="form-select"
                                            value={productSortOrder}
                                            onChange={(e) => setProductSortOrder(e.target.value)}
                                            disabled={!productSortBy}
                                        >
                                            <option value="asc">LOW TO HIGH (A-Z, LOW-HIGH)</option>
                                            <option value="desc">HIGH TO LOW (Z-A, HIGH-LOW)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            {/* End Product Search & Sort Section */}

                            <div className="table-responsive">
                                <table className="table table-striped table-bordered">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Picture</th>
                                            <th>Products Name</th>
                                            <th>Price</th>
                                            <th>Category</th>
                                            <th>SubCategory</th>
                                            <th>Manage</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredAndSortedProducts.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="text-center text-muted">ไม่พบข้อมูลสินค้า</td>
                                            </tr>
                                        ) : (
                                            filteredAndSortedProducts.map((product) => (
                                                <tr key={product._id}>
                                                    <td>
                                                        {editingProduct === product._id ? (
                                                            <img src={product.imageUrl}                                           
                                                                className="form-control"
                                                   
                                                            />
                                                        ) : (
                                                            <img src={product.imageUrl}></img>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {editingProduct === product._id ? (
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={newProductName}
                                                                onChange={(e) => setNewProductName(e.target.value)}
                                                            />
                                                        ) : (
                                                            product.name
                                                        )}
                                                    </td>
                                                    <td>
                                                        {editingProduct === product._id ? (
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                value={newProductPrice}
                                                                onChange={(e) => setNewProductPrice(e.target.value)}
                                                            />
                                                        ) : (
                                                            product.price
                                                        )}
                                                    </td>
                                                    <td>
                                                        {editingProduct === product._id ? (
                                                            <select
                                                                className="form-select"
                                                                value={newProductCategory}
                                                                onChange={handleProductCategoryChange}
                                                            >
                                                                <option value="">- เลือกหมวดหมู่ -</option>
                                                                {categories.map((cat) => (
                                                                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                                                                ))}
                                                            </select>
                                                        ) : (
                                                            product.category
                                                        )}
                                                    </td>
                                                    <td>
                                                        {editingProduct === product._id ? (
                                                            <select
                                                                className="form-select"
                                                                value={newProductSubCategory}
                                                                onChange={(e) => setNewProductSubCategory(e.target.value)}
                                                                disabled={availableSubCategory.length === 0} // เปลี่ยนชื่อ state ตรงนี้
                                                            >
                                                                <option value="">- เลือกหมวดหมู่ย่อย -</option>
                                                                {availableSubCategory.map((sub, index) => ( // เปลี่ยนชื่อ state ตรงนี้
                                                                    <option key={index} value={sub.name}>{sub.name}</option>
                                                                ))}
                                                            </select>
                                                        ) : (
                                                            product.subCategory || '-'
                                                        )}
                                                    </td>
                                                    <td>
                                                        {editingProduct === product._id ? (
                                                            <>
                                                                {/* <div className="d-flex justify-content-end"> */}
                                                                <button className="btn btn-success me-2" onClick={() => handleSaveProduct(product._id)}>บันทึก</button>
                                                                <button className="btn btn-secondary" onClick={handleCancelEditProduct}>ยกเลิก</button>
                                                                {/* </div> */}

                                                            </>
                                                        ) : (
                                                            <>
                                                                <button className="btn btn-warning me-2" onClick={() => handleEditProduct(product)}>Edit</button>
                                                                <button className="btn btn-danger" onClick={() => handleDeleteProduct(product._id, product.name)}>Delete</button>
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                    {activeTab === 'category' && (
                        < AddCategory />
                    )}
                </div>
            </div>
        </div>

    )
}

export default Manage
