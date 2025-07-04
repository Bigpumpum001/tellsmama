import React, { useState } from 'react'

function ProductCard({ products, onAddToCart }) {
    const [isHovered, setIsHovered] = useState(false)
    const [isButtonHovered, setIsButtonHovered] = useState(false)

    const handleMouseEnter = () => {
        setIsHovered(true)
    }

    const handleMouseLeave = () => {
        setIsHovered(false)
    }
    const handleButtonMouseEnter = () => {
        setIsButtonHovered(true)
    }
    const handleButtonMouseLeave = () => {
        setIsButtonHovered(false)
    }


    return (
        <div>
            <div key={products.id}
                className=""
                style={{
                    position: 'relative',
                    overflow: 'hidden'
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* Overlay Element */}
                <div className="hover-white-overlay"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        opacity: isHovered ? 1 : 0,
                        transition: 'opacity 0.3s ease-in-out',
                        pointerEvents: 'none',
                        zIndex: 1,
                    }}
                >

                </div>
                <img src={products.imageUrl} alt={products.name}
                    style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px', marginBottom: '10px' }} />
                <p className='fw-bold fs-4'>{products.name}</p>
                <p className=' fs-5'>Price : {products.price} ฿</p>
                <div className="d-flex gap-1 justify-content-center"
                    style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '0',
                        right: '0',
                        opacity: isHovered ? 1 : 0, // Fade in out Effect
                        transform: isHovered ? 'translateY(0)' : 'translateY(100%)',
                        transition: 'opacity 0.3s ease-in-out,transform 0.3s ease-in-out',
                        pointerEvents: isHovered ? 'auto' : 'none',
                        zIndex: 3
                    }}
                >
                    {/* <button className='btn w-50 btn-primary  text-nowrap d-flex justify-content-center'>View Details</button> */}
                    <button className='btn btn-lg w-100   text-nowrap fw-bold'
                        onClick={() => onAddToCart(products)}
                        style={{
                            borderRadius: '2rem',
                            color: 'white',
                            backgroundColor: isButtonHovered ? 'rgb(40, 167, 69)' : 'rgb(30, 121, 52)',
                            // transition: 'background-color 0.3s ease-in-out, border-color 0.3s ease-in-out', // เพิ่ม transition เพื่อความ smooth

                        }}
                        onMouseEnter={handleButtonMouseEnter}
                        onMouseLeave={handleButtonMouseLeave}
                    >Add to cart {products.price} ฿</button>
                </div>
            </div>
        </div>
    )
}

export default ProductCard
