import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Cart from './Cart';
import logo from '../assets/tellsmama_crop-removebg-preview2.png'
import '../styles/global.css'
import styles from '../styles/Navbar.module.css'
function Navbar({
    // onShowCart,
    isAuthenticated,
    setAuth,
    setshowCart,
    cartItemsCount }) {

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token")
        setAuth(false)
        navigate('/')
    }
    // // สร้าง state สำหรับแสดง modal
    // const [showCartModal, setShowCartModal] = useState(false);

    // ฟังก์ชัน toggle แสดง/ซ่อน cart
    // const handleToggleCart = () => {
    //     setshowCart(prev => !prev);
    // };
    const handleCartClick = (e) => {
        e.preventDefault();

        //    setshowCart(true)

        // setshowCart(true);
        setshowCart(prev => !prev);


        // onShowCart();
    };

    // // ฟังก์ชันปิด modal
    // const handleCloseModal = () => setShowCartModal(false);

    // import CartModal จาก Cart.jsx (สมมติว่าคุณ export modal component จาก Cart.jsx)
    // ตัวอย่าง: import CartModal from './Cart';


    return (
        <div>
            <div 
            // className="navbar navbar-expand-lg navbar-light bg-light fixed-top mb-5"
             className="navbar navbar-expand-lg  fixed-top mb-5 bg-transparent"
            // style={{backgroundColor:'#F32349'}}
            //   style={{ background: 'linear-gradient(135deg, #FFE8E1, #FFF0ED)' }}
style={{ background: 'linear-gradient(135deg, #FFF5F3, #F8F9FA)'  }}
              // style={{backgroundColor:'#F9DCC4'}}
            >
                <div className="container-fluid" >
                    <Link className='navbar-brand fs-3 fw-bold' to='/'>
                        {/* TellsMama */}
                        <img src={logo} alt="TellsMama Logo"
                            style={{ height: '50px' }}
                        />
                    </Link>
                    <a className='nav-link fs-5 text-black me-2 fw-bold d-lg-none d-flex align-items-center' href='#' onClick={handleCartClick} style={{ position: 'absolute', right: '80px' }}>
                        <i className="bi bi-cart"></i>
                        {cartItemsCount > 0 && (
                            <span className='badge bg-danger rounded-pill absolute -top-1 -right-1 text-xs'>
                                {cartItemsCount}
                            </span>
                        )}
                    </a>
                    <button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarNav'
                        aria-controls='navbarNav' aria-expanded='false' aria-label='Toggle navigation'>
                        <span className='navbar-toggler-icon'></span>
                    </button>
                    <div className="collapse navbar-collapse" id='navbarNav' >
                        <ul className='navbar-nav ms-auto items-center' >
                            <li className='nav-item d-none d-lg-flex'  >
                                <a className='nav-link fs-5 text-black me-2 d-flex justify-content-end fw-bold' href='#' onClick={handleCartClick} >
                                    <i className="bi bi-cart "></i>
                                    {cartItemsCount > 0 && (
                                        <span className='badge bg-danger rounded-pill absolute -top-1 -right-1 text-xs'>
                                            {cartItemsCount}
                                        </span>
                                    )}
                                </a>
                            </li>
                            <li className='nav-item' >
                                <Link className={`${styles['']} text-black nav-link fs-5 me-2 d-flex justify-content-start fw-bold`} to='/' >Home</Link>
                            </li>
                            <li className='nav-item'>
                                <Link className={`${styles['']} text-black nav-link fs-5 me-2 d-flex justify-content-start fw-bold`} to='/addproduct' >Add Product</Link>
                            </li>


                            {!isAuthenticated ? (
                                <>
                                    <li className='nav-item'>
                                        <Link className='nav-link text-black fs-5 me-2 d-flex justify-content-start fw-bold' to='/login'>Login</Link>
                                    </li>
                                    <li className='nav-item'>
                                        <Link className='nav-link text-black fs-5 me-2 d-flex justify-content-start fw-bold' to='/register'>Register</Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    {/* <li className='nav-item'>
                                        <Link className={`${styles['']} text-black nav-link fs-5 me-2 d-flex justify-content-start fw-bold`} to='/addcategory' >Add Category</Link>
                                    </li> */}
                                    {/* <li className='nav-item'>
                                        <Link className={`${styles['']} text-black nav-link fs-5 me-2 d-flex justify-content-start fw-bold`} to='/manage' >Manage</Link>
                                    </li> */}
                                    <li className='nav-item'>
                                        <Link className={`${styles['']} text-black nav-link fs-5 me-2 d-flex justify-content-start fw-bold`} to='/dashboard' >Dashboard</Link>
                                    </li>
                                    <li className='nav-item'>
                                        <button className='btn btn-danger fs-5 me-2 d-flex justify-content-start fw-bold' onClick={handleLogout}>Log out</button>
                                    </li>
                                </>

                            )}

                            {/* <li className='nav-item d-flex justify-content-center align-items-center'>
                                <button className='btn btn-danger d-flex justify-content-end fw-bold' 
                                // onClick=''
                                >Log out</button>
                            </li> */}
                        </ul>
                    </div>
                </div>
            </div>

            {/* {showCartModal && (
                // สมมติว่าคุณมี CartModal component ที่รับ prop onClose
                <Cart onClose={handleCloseModal} />
            )} */}
        </div>
    )
}

export default Navbar
