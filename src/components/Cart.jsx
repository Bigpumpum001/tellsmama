import React from 'react'
import styles from '../styles/Cart.module.css'
import '../styles/Cart.module.css'
import Swal from 'sweetalert2'
function Cart({ show, onClose, cartItems, onAddToCart, onDecreaseQuantity, onRemoveFromCart, onCheckout }) {


    if (!show) {
        return null
    }
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    return (
        <div className={`${styles['modal-right']}   modal fade  show d-block flex-shrink-0 `} // ไม่ต้องใช้ show d-block แล้ว Bootstrap JS จะจัดการเอง
            // tabIndex='-1'
            role='dialog'
            aria-labelledby='cartModalLabel'
            aria-hidden='true'
        // style={{ display:show ?'block' : 'none' , backgroundColor: 'rgba(0,0,0,0.5)' }}
        // ref={modalRef}
        >
            {/* modal-dialog-centered */}
            <div className={`${styles['modal-dialog']} modal-dialog `}
                role='document'>
                <div className={`${styles['']} modal-content  rounded-lg shadow-lg flex-shrink-0`}>
                    <div className="modal-header">
                        <h5 className="modal-title fw-bold " id='cartModalLabel'>My Order</h5>
                        <button
                            type='button'
                            className='btn-close text-xl'
                            aria-label='Close'
                            data-bs-dismiss="modal"
                            onClick={onClose}
                        ></button>
                    </div>
                    <div className={`${styles['modal-body']} modal-body p-4 overflow-auto flex-grow-1`}>
                        {cartItems.length === 0 ? (
                            <p>Your cart is Empty. Start adding some products!</p>
                        ) : (
                            <ul className='list-group'>
                                {cartItems.map((item) => (
                                    <li key={item.id}
                                        className={` d-flex justify-content-between align-items-center ${1 + 1 ? ' ' : 'list-group-item'}`}>
                                        <div className="flex-grow">
                                            <div className="">{item.name}</div>
                                            <div className=""><img src={item.imageUrl} alt="" style={{ width: '150px', height: '150px', objectFit: 'cover', borderTopLeftRadius: 'calc(.25rem - 1px)', borderTopRightRadius: 'calc(.25rem - 1px)' }} /></div>
                                            {/* {item.name} x {item.quantity} */}
                                            <div className="d-flex align-items-center gap-2 mt-1">
                                                <button
                                                    className='btn btn-sm btm-outline-secondary round-full w-8 h-8 d-flex item-center justify-content-center'
                                                    onClick={() => onDecreaseQuantity(item._id)}
                                                >
                                                    <i className="bi bi-dash"></i>
                                                </button>
                                                <span className='font-medium text-lg'>{item.quantity}</span>
                                                <button
                                                    className='btn btn-sm btm-outline-secondary round-full w-8 h-8 d-flex item-center justify-content-center'
                                                    onClick={() => onAddToCart(item)}
                                                    aria-label={`Increase quantity of ${item.name}`}
                                                >
                                                    <i className="bi bi-plus"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center gap-3">
                                            <span className='p-2'>฿ {(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                        <button
                                            className=' btn btn-sm btn-danger rounded-full w-8 h-8 d-flex items-center justify-center'
                                            data-bs-dismiss="modal"
                                            onClick={() => onRemoveFromCart(item._id)}
                                            aria-label={`Remove ${item.name} from cart`}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="modal-footer d-flex justify-content-between">
                        <strong>Total:</strong>
                        <strong>฿ {totalPrice.toFixed(2)}</strong>
                        <button type='button' className='btn btn-danger' onClick={onClose}>Close</button>
                        <button type='button' className='btn btn-success'
                            onClick={() => {
                                const token = localStorage.getItem('token')
                                if (!token) {
                                    return Swal.fire({
                                        icon: 'warning',
                                        title: 'Please Login',
                                        text: 'Please Login Before Checkout',
                                    })
                                }
                                onCheckout()
                            }}
                        disabled={cartItems.length === 0}
                        >
                        Check Out</button>
                </div>
            </div>
        </div>
        </div >
    )
}

export default Cart
