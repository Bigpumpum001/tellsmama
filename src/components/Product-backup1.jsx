import React, { useState } from 'react'
import Cart from './Cart';
// import ProductCard from './ProductCard';
function Product({ onAddToCart }) {



    const url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbXuD6uM0dMlaQkFm97QtW4wtIebQhm_iCEA&s'
    const products = [
        { id: 1, name: 'Product A', price: 100, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbXuD6uM0dMlaQkFm97QtW4wtIebQhm_iCEA&s' },
        { id: 2, name: 'Product B', price: 150, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbXuD6uM0dMlaQkFm97QtW4wtIebQhm_iCEA&s' },
        { id: 3, name: 'Product C', price: 200, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbXuD6uM0dMlaQkFm97QtW4wtIebQhm_iCEA&s' },
        { id: 4, name: 'Product D', price: 250, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbXuD6uM0dMlaQkFm97QtW4wtIebQhm_iCEA&s' },
        { id: 5, name: 'Product E', price: 300, imageUrl: url },
        { id: 6, name: 'Product F', price: 120, imageUrl: url },
        { id: 7, name: 'Product G', price: 180, imageUrl: url },
        { id: 8, name: 'Product H', price: 220, imageUrl: url },
        { id: 9, name: 'Product I', price: 280, imageUrl: url },
        { id: 10, name: 'Product J', price: 350, imageUrl: url },
        { id: 11, name: 'Product K', price: 110, imageUrl: url },
        { id: 12, name: 'Product L', price: 160, imageUrl: url },
        { id: 13, name: 'Product M', price: 210, imageUrl: url },
        { id: 14, name: 'Product N', price: 260, imageUrl: url },
        { id: 15, name: 'Product O', price: 310, imageUrl: url },
        { id: 16, name: 'Product P', price: 130, imageUrl: url },
        { id: 17, name: 'Product Q', price: 190, imageUrl: url },
        { id: 18, name: 'Product R', price: 230, imageUrl: url },
        { id: 19, name: 'Product S', price: 290, imageUrl: url },
        { id: 20, name: 'Product T', price: 340, imageUrl: url },
    ];

    return (
        <div className='container'>
            <h2 className='fw-bold'>Products</h2>
            <div className=""
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
                    gap: "20px",
                    padding: "20px"
                }}>
                {products.map((products) => (
                    // <ProductCard key={products.id} products={products} onAddToCart={onAddToCart} />
                    <div key={products.id} className="card" style={{}}>
                        <img src={products.imageUrl} alt={products.name} className=''
                            style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px', marginBottom: '10px' }} />
                      <div className="card-body">
                        <p className='card-title fw-bold fs-4'>{products.name}</p>
                        <p className='card-text fs-5 '>Price : {products.price} ฿</p>
                        <div className="d-flex gap-1 justify-content-center ps-1 pe-1" style={{ }}>
                            {/* <button className='btn  btn-primary  text-nowrap d-flex justify-content-center fw-bold'>View Details</button> */}
                            <button className='btn w-100 btn-success text-nowrap fw-bold'onClick={() => onAddToCart(products)} style={{}}>Add to cart</button>
                        </div>
                      </div>
                        
                    </div>
                ))}
            </div>
            {/* <Cart
            show={showCart}
            onClose={() => setshowCart(false)}
            cartItems={cartItems}
            /> */}
        </div>
    )
}

export default Product
