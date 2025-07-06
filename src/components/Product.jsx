import React, { useState, useEffect } from 'react'
// import axios from 'axios';
// import api from '../services/api'
import Cart from './Cart';
import '../styles/global.css'
import styles from '../styles/Product.module.css'
// import ProductCard from './ProductCard';
function Product({
    products,
    onAddToCart }) {
    // const [error,setError] =useState(null)
    // const [ products , setProducts]=useState([])
    //  useEffect(() => {
    //     api.get('/api/product')
    //         .then((response) => {
    //             setProducts(response.data)
    //             console.log('Categories data:', response.data)

    //         })
    //         .catch(error => {
    //             setError(error)
    //             console.error('Failed to fetch categories:', error)
    //         })
    //     // setLoading(false)
    // }, [])

    // const url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbXuD6uM0dMlaQkFm97QtW4wtIebQhm_iCEA&s'
    // const products = [
    //     { id: 1, name: 'Product A', price: 100, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbXuD6uM0dMlaQkFm97QtW4wtIebQhm_iCEA&s' },
    //     { id: 2, name: 'Product B', price: 150, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbXuD6uM0dMlaQkFm97QtW4wtIebQhm_iCEA&s' },
    //     { id: 3, name: 'Product C', price: 200, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbXuD6uM0dMlaQkFm97QtW4wtIebQhm_iCEA&s' },
    //     { id: 4, name: 'Product D', price: 250, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbXuD6uM0dMlaQkFm97QtW4wtIebQhm_iCEA&s' },
    //     { id: 5, name: 'Product E', price: 300, imageUrl: url },
    //     { id: 6, name: 'Product F', price: 120, imageUrl: url },
    //     { id: 7, name: 'Product G', price: 180, imageUrl: url },
    //     { id: 8, name: 'Product H', price: 220, imageUrl: url },
    //     { id: 9, name: 'Product I', price: 280, imageUrl: url },
    //     { id: 10, name: 'Product J', price: 350, imageUrl: url },
    //     { id: 11, name: 'Product K', price: 110, imageUrl: url },
    //     { id: 12, name: 'Product L', price: 160, imageUrl: url },
    //     { id: 13, name: 'Product M', price: 210, imageUrl: url },
    //     { id: 14, name: 'Product N', price: 260, imageUrl: url },
    //     { id: 15, name: 'Product O', price: 310, imageUrl: url },
    //     { id: 16, name: 'Product P', price: 130, imageUrl: url },
    //     { id: 17, name: 'Product Q', price: 190, imageUrl: url },
    //     { id: 18, name: 'Product R', price: 230, imageUrl: url },
    //     { id: 19, name: 'Product S', price: 290, imageUrl: url },
    //     { id: 20, name: 'Product T', price: 340, imageUrl: url },
    // ];

    return (
        <div

        // className='container'
        >
            <h2 className='fw-bold'>Products</h2>
            {products.length === 0 ? (
                <div className="text-center text-muted fs-5 mt-4">
                    🛒
                    No products found. Try a different keyword or choose another category.
                    <p><br/> {'❗ No items found at this time. It seems the server might be sleeping due to inactivity. Please try reloading this page in a moment, or contact the administrator if the problem persists (Free Render servers will sleep after 15 minutes of inactivity and may take up to 10-30 seconds to wake up).'}</p>
                </div>
            ) : (

                <div className=""
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
                        gap: "20px",
                        padding: "20px"
                    }}>
                    {/* {error && <div className="mt-3 text-danger">{error}</div>} */}
                    {products.map((products) => (
                        // <ProductCard key={products.id} products={products} onAddToCart={onAddToCart} />
                        <div key={products._id} className="card  shadow-sm" style={{}}>
                            <div className="">
                                <div className="positive-relative">
                                    <img src={products.imageUrl} alt={products.name} className='card-img-top img-fluid'
                                        style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px', marginBottom: '10px' }}
                                    />
                                    {/* <span class="badge bg-danger position-absolute start-0 translate-middle-y" style={{top: "95%"}}>ใหม่</span> */}
                                    {products.category && products.category.length > 0 && (
                                        <span className={`${styles['tag']} w-100 badge  position-absolute translate-middle-y`} style={{ top: '52%', left: '5%', maxWidth: '130px' , whiteSpace: 'nowrap', fontSize: '0.75rem'}}>{products.category}</span>
                                    )}

                                </div>
                                <div
                                    className={`${styles["card-body"]}`}
                                >
                                    <p className='card-title fw-bold fs-6 d-flex align-items-center justify-content-center text-center' style={{ height: '30px' }}>{products.name}</p>
                                    <p className='card-text fs-6 text-center'>Price : {products.price} ฿</p>
                                    <div className="d-flex gap-1 justify-content-center ps-3 pe-3 mt-auto " style={{}}>
                                        {/* <button className='btn  btn-primary  text-nowrap d-flex justify-content-center fw-bold'>View Details</button> */}
                                        <button className={`${styles["onAddToCartBtn"]} btn w-100  text-nowrap fw-bold `}
                                            // style={{backgroundColor:'var(--color-pink)'}}
                                            onClick={() => onAddToCart(products)} >Add to cart</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )
            }
        </div>

    )
}

export default Product
