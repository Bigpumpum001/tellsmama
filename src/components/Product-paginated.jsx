import React, { useState,useEffect } from 'react'
import Cart from './Cart';
// import ProductCard from './ProductCard';
function Product({searchText, products, onAddToCart }) {
    // ใช้ State นี้เก็บสินค้าที่ถูกกรอง 'ก่อน' ทำ pagination
    const [currentFilteredProducts, setCurrentFilteredProducts] = useState(products);

    // --- State สำหรับ Pagination ---
    const [currentPage, setCurrentPage] = useState(1); // หน้าปัจจุบัน เริ่มต้นที่หน้า 1
    const [itemsPerPage] = useState(8); // จำนวนสินค้าต่อหน้า (ปรับค่าได้ตามต้องการ)
    // useEffect เพื่อกรองสินค้าเมื่อ searchText หรือ products เปลี่ยนแปลง
    useEffect(() => {
        const results = products.filter(product =>
            product.name.toLowerCase().includes(searchText.toLowerCase())
        );
        setCurrentFilteredProducts(results);
        setCurrentPage(1); // รีเซ็ตกลับไปหน้าแรกเมื่อคำค้นหาเปลี่ยน
    }, [searchText, products]);
    // --- Logic สำหรับ Pagination ---
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = currentFilteredProducts.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(currentFilteredProducts.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // สร้างอาร์เรย์ของเลขหน้าเพื่อใช้ในการวนลูปสร้างปุ่ม Pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
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
        <div className='container'>
            <h2 className='fw-bold'>Products</h2>
            {currentFilteredProducts.length === 0 ? (
                <div className="text-center text-muted fs-5 mt-4">
                    🛒
                    No products found. Try a different keyword or choose another category.
                    {/* Oops! We couldn't find any products. Try searching with a different keyword or select another category. */}
                </div>
            ) : (
                <div className=""
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
                        gap: "20px",
                        padding: "20px"
                    }}>
                    {currentItems.map((products) => (
                        // <ProductCard key={products.id} products={products} onAddToCart={onAddToCart} />
                        <div key={products.id} className="card shadow-sm " style={{}}>
                            <img src={products.imageUrl} alt={products.name} className='card-img-top img-fluid'
                                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px', marginBottom: '10px' }}
                            />
                            <div className="card-body ">
                                <p className='card-title fw-bold fs-4'>{products.name}</p>
                                <p className='card-text fs-5 '>Price : {products.price} ฿</p>
                                <div className="d-flex gap-1 justify-content-center ps-1 pe-1 " style={{}}>
                                    {/* <button className='btn  btn-primary  text-nowrap d-flex justify-content-center fw-bold'>View Details</button> */}
                                    <button className='btn w-100 btn-success text-nowrap fw-bold' onClick={() => onAddToCart(products)} style={{}}>Add to cart</button>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )

            }

            {/* <Cart
            show={showCart}
            onClose={() => setshowCart(false)}
            cartItems={cartItems}
            /> */}
            {/* --- Pagination Controls --- */}
      {totalPages > 1 && ( // แสดง Pagination เมื่อมีมากกว่า 1 หน้า
        <nav aria-label="Product pagination" className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <a className="page-link" href="#!" onClick={prevPage}>Previous</a>
            </li>
            {pageNumbers.map(number => (
              <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                <a onClick={() => paginate(number)} href="#!" className="page-link">
                  {number}
                </a>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <a className="page-link" href="#!" onClick={nextPage}>Next</a>
            </li>
          </ul>
        </nav>
      )}
        </div>
        
    )
}

export default Product
