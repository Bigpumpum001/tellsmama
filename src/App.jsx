import { useState, useEffect, useCallback } from 'react'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import './styles/global.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import Swal from 'sweetalert2'
import axios from 'axios';
import api from './services/api'

// Use for increase size for img to modal
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min';

//Components
import Navbar from './components/Navbar'
import Product from './components/Product';
import Home from './components/Home'
import Cart from './components/Cart';
import AddProduct from './components/AddProduct';
import AddCategory from './components/AddCategory';
import AddSubCategory from './components/AddSubCategory';
import Manage from './components/Manage';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import PublicRoute from './components/PublicRoute';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';
function App() {
  const [isAuthenticated, setAuth] = useState(!!localStorage.getItem('token'))

  const [showCart, setshowCart] = useState(false)
  const [cartItems, setCartItems] = useState([])
  //Categories
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState(null)
  //Search
  const [searchText, setSearchText] = useState('');
  const [allProducts, setAllProducts] = useState([])

  const [filteredProducts, setFilteredProducts] = useState([])
  // trigger
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const location = useLocation()

  const fetchProducts = useCallback(async () => {
    try {
      const response = await api.get('/api/product')
      setAllProducts(response.data)
      console.log('Categories data:', response.data)
    }
    catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }, [])


  useEffect(() => {
    // api.get('/api/product')
    //   .then((response) => {
    //     setAllProducts(response.data)
    //     console.log('Categories data:', response.data)

    //   })
    //   .catch(error => {
    //     // setError(error)
    //     console.error('Failed to fetch categories:', error)
    //   })
    fetchProducts()
    // setLoading(false)
  }, [location.pathname, refreshTrigger, fetchProducts])

  const handleRefreshProducts = () => {
    setRefreshTrigger(prev => prev + 1)
  }
  useEffect(() => {
    //Filterd product -> SearchBar + Categories
    const currentFilteredProducts = allProducts.filter(p => {
      const matchesCategory =
        !selectedCategory ||
        (selectedCategory && !selectedSubCategory && p.category === selectedCategory) ||
        (selectedCategory && selectedSubCategory &&
          p.category === selectedCategory &&
          p.subCategory === selectedSubCategory);

      const matchesSearch =
        !searchText || p.name.toLowerCase().includes(searchText.toLowerCase());

      return matchesCategory && matchesSearch;
    });
    setFilteredProducts(currentFilteredProducts)
  }, [allProducts, searchText, selectedCategory, selectedSubCategory])


  // const allProducts = [
  //   { id: 1, name: 'Fan - Hatari', price: 100, category: 'Home Electronics', subCategory: 'Fan', imageUrl: '../img/fans-hatari.jpg' },
  //   { id: 2, name: 'Iron - Philips', price: 150, category: 'Home Electronics', subCategory: 'Iron', imageUrl: '../img/irons.jpg' },
  //   { id: 3, name: 'Floor Cleaner', price: 200, category: 'Cleaning Supplies', subCategory: 'Liquid Cleaner', imageUrl: '../img/cleaner.jpg' },
  //   { id: 4, name: 'Ceramic Plate', price: 250, category: 'General Household', subCategory: 'Kitchen', imageUrl: '../img/plate.jpg' },
  //   { id: 5, name: 'Baby Diaper', price: 300, category: 'Mom & Baby', subCategory: 'Diaper', imageUrl: '../img/diaper.jpg' },
  // ]
  //  const filteredProducts = allProducts.filter(p => {
  //       if (!selectedCategory) return true
  //       if (selectedCategory && !selectedSubCategory) return p.category === selectedCategory
  //       if (selectedCategory && selectedSubCategory) return p.category === selectedCategory && p.subCategory === selectedSubCategory
  //   })



  //Cart
  const onAddToCart = (products) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === products._id)
      // console.log('ex',existingItem)
      if (existingItem) {
        return prevItems.map((item) => item._id === products._id ? { ...item, quantity: item.quantity + 1 } : item)
      }
      else {
        return [...prevItems, { ...products, quantity: 1 }]
      }
    })
  }

  const onRemoveFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter(item => item._id !== productId));
  }
  const onDecreaseQuantity = (productId) => {
    setCartItems((prevItems) =>
      prevItems.map(item =>
        item._id === productId ? { ...item, quantity: item.quantity - 1 } : item
      ).filter(item => item.quantity > 0)
    )
  }

  const handleCheckout = () => {
    setCartItems([])

    Swal.fire({
      icon: 'success',
      title: 'Transaction Successful!',
      text: 'Your order has been processed.',
      showConfirmButton: false, // ไม่แสดงปุ่ม OK
      timer: 2000 // ซ่อนอัตโนมัติใน 2 วินาที
    });
  }
  return (
    <>
      {/* <Router> */}
      <Navbar
        isAuthenticated={isAuthenticated}
        setAuth={setAuth}
        setshowCart={setshowCart}
        cartItemsCount={cartItems.length} />
      <div className="">
        <Routes>
          <Route path='/' element={

      
              <Home
                // allProducts={allProducts}
                searchText={searchText} setSearchText={setSearchText}
                filteredProducts={filteredProducts}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedSubCategory={selectedSubCategory}
                setSelectedSubCategory={setSelectedSubCategory}
                onAddToCart={onAddToCart}
              />
        
          }


          />
          <Route path='/addproduct' element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>

          } />
          {/* <Route path='/addcategory' element={
            <div>
              <ProtectedRoute>

                <AddCategory />
              </ProtectedRoute>
              
            
            </div>
          } /> */}

          <Route path='/manage' element={
            <ProtectedRoute adminOnly={true}>
              <Manage
                onProductUpdate={handleRefreshProducts}
              />
            </ProtectedRoute>
          } />
          <Route path='/dashboard' element={
            <ProtectedRoute>
              <Dashboard setAuth={setAuth} />
            </ProtectedRoute>
          } />
          <Route path='/login' element={
            <PublicRoute>
              <LoginForm setAuth={setAuth} />
            </PublicRoute>
          }
          />
          <Route path='/register' element={
            <PublicRoute>
              <RegisterForm />
            </PublicRoute>
          }
          />
        </Routes>


      </div>

      {/* </Router> */}
      <Cart
        show={showCart}
        onClose={() => setshowCart(false)}
        cartItems={cartItems}
        onRemoveFromCart={onRemoveFromCart}
        onDecreaseQuantity={onDecreaseQuantity}
        onAddToCart={onAddToCart}
        onCheckout={handleCheckout}
      />
    </>
  )
}

export default App
