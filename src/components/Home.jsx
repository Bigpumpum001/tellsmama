import React from 'react'
import SearchBar from './SearchBar'
import Categories from './Categories'
import Product from './Product'
function Home({ // allProducts,
    searchText,
    setSearchText,
    filteredProducts,
    selectedCategory,
    setSelectedCategory,
    selectedSubCategory,
    setSelectedSubCategory,
    onAddToCart }) {
    return (
        <div>
            <div
                className="container-fluid justify-content-center d-flex"
            >
                <div
                    // className="container"
                    className="col-12 "
                >
                    <div className="row p-3  d-flex justify-content-center mt-5 pt-5">
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                            <SearchBar searchText={searchText} setSearchText={setSearchText} />
                        </div>
                    </div>
                    <div className="row p-3  d-flex justify-content-center">
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                            <Categories
                                selectedCategory={selectedCategory}
                                setSelectedCategory={setSelectedCategory}
                                selectedSubCategory={selectedSubCategory}
                                setSelectedSubCategory={setSelectedSubCategory}
                            />
                        </div>
                    </div>
                    <div className="row p-3 d-flex justify-content-center">
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                            <Product
                                searchText={searchText}
                                products={filteredProducts} onAddToCart={onAddToCart}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
