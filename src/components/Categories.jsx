import React, { useRef, useState } from 'react'
import styles from '../styles/Categories.module.css'
import '../styles/Categories.module.css'
import { useEffect } from 'react'
import axios from 'axios'
import api from '../services/api'

function Categories({
    selectedCategory,
    setSelectedCategory,
    selectedSubCategory,
    setSelectedSubCategory
}) {
    const scrollRef = useRef(null)
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0)
    // const [selectedCategory, setSelectedCategory] = useState(null)
    // const [selectedSubCategory, setSelectedSubCategory] = useState(null)

    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        api.get('/api/category')
            .then((response) => {
                setCategories(response.data)
                console.log('Categories data:', response.data)

            })
            .catch(error => {
                setError(error)
                console.error('Failed to fetch categories:', error)
            })
        setLoading(false)
    }, [])

    // const categories = [
    //     {
    //         name: 'General Household',
    //         icon: 'bi-house',
    //         subCategories: [
    //             { name: 'Kitchen', icon: 'bi-cup-straw' },
    //             { name: 'Bathroom', icon: 'bi-droplet' },
    //             { name: 'Bedroom', icon: 'bi-lamp' }
    //         ]
    //     },
    //     {
    //         name: 'Home Electronics',
    //         icon: 'bi-plug',
    //         subCategories: [
    //             { name: 'Fan', icon: 'bi-wind' },
    //             { name: 'Iron', icon: 'bi-fire' },
    //             { name: 'Vacuum Cleaner', icon: 'bi-lightning-charge' }
    //         ]
    //     },
    //     {
    //         name: 'Cleaning Supplies',
    //         icon: 'bi-bucket',
    //         subCategories: [
    //             { name: 'Liquid Cleaner', icon: 'bi-beaker' },
    //             { name: 'Broom', icon: 'bi-stickies' },
    //             { name: 'Trash Bin', icon: 'bi-trash' }
    //         ]
    //     },
    //     {
    //         name: 'Mom & Baby',
    //         icon: 'bi-heart-pulse',
    //         subCategories: [
    //             { name: 'Diaper', icon: 'bi-bandaid' },
    //             { name: 'Baby Items', icon: 'bi-baby' },
    //             { name: 'Wipes', icon: 'bi-moisture' }
    //         ]
    //     }
    // ]

    // const category = [
    //     'Electonics',
    //     'Books',
    //     'Clothing',
    //     'Home & Garden',
    //     'Sports',
    //     'Automotive',
    //     'Health & Beauty',
    //     'Toys & Games',
    //     'Food & Drink',
    //     'Art & Crafts',
    //     'Music',
    //     'Movies',
    //     'Pet Supplies',
    //     'Office Products',
    //     'Baby Products',

    // ]

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
        scrollRef.current.style.cursor = 'grabbing';
    }
    const handleMouseLeave = () => {
        setIsDragging(false)
        scrollRef.current.style = 'grab'
    }
    const handleMouseUp = () => {
        setIsDragging(false)
        scrollRef.current.style = 'grab'
    }
    const handleMouseMove = (e) => {
        if (!isDragging) return
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2; // ความเร็วในการเลื่อน
        scrollRef.current.scrollLeft = scrollLeft - walk;

    }

    if (loading) {
        return <div className="text-center mt-3">Loading categories</div>
    }
    if (error) {
        return <div className="text-danger text-center mt-3">Error: {error.message}</div>
    }
    return (
        <div
        //  className='container'
        >
            <div className="row">
                <h2 className={`fw-bold`} >Categories</h2>

                <div
                    ref={scrollRef}
                    className={`${styles['categories-scroll-wrapper']}  mt-3 d-flex flex-row overflow-x-auto`}
                    style={{
                        cursor: 'grab',
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                        WebkitOverflowScrolling: "touch"
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                >
                    <button className={`btn ${!selectedCategory ? styles['bg--color-pink'] : styles['bg--color-peach']}  me-2  rounded-pill text-nowrap	`}
                        onClick={() => {
                            setSelectedCategory(null)
                            setSelectedSubCategory(null)
                        }}
                    ><i className="bi bi-globe "></i> All</button>

                    {categories.map((cat
                        // , index
                    ) => (

                        <button key={
                            // index
                            cat._id
                        } className={`${selectedCategory === cat.name
                            ? styles['bg--color-pink']
                            : styles['bg--color-peach']} 
                             btn  btn  p-2 me-2  rounded text-wrap flex-shrink-0 rounded-pill	`}
                            onClick={() => {

                                if (!isDragging) {
                                    // setSelectedCategory(cat.name)
                                    // setSelectedSubCategory(null)
                                    if (selectedCategory === cat.name) {
                                        setSelectedCategory(null) // ปิด
                                    } else {
                                        setSelectedCategory(cat.name) // เปิดอันใหม่
                                    }
                                    setSelectedSubCategory(null)
                                }
                            }}
                            style={{
                                minWidth: "fit-content",
                                userSelect: "none",
                                // pointerEvents: isDragging ? 'none' : 'auto'
                                pointerEvents: 'auto'
                            }}
                        >
                            <i className={`bi ${cat.icon || 'bi-box'}`}></i> {cat.name}
                        </button>



                    ))}



                </div>

            </div>
             <div className="row">
                {
                    selectedCategory &&
                    (
                        <div className="d-flex gap-2 flex-wrap col-12 mt-2">
                            {categories.find(c => c.name === selectedCategory)
                                .subCategories.map((sub, i) => (
                                    <button key={i}
                                        className={`btn ${selectedSubCategory === sub.name ? styles['bg--color-pink'] : styles['bg--color-sand']} rounded-pill	`}
                                        onClick={() => setSelectedSubCategory(sub.name)}
                                    >
                                        <i className={` bi ${sub.icon || 'bi-box'}`}></i> {sub.name}
                                    </button>
                                ))
                            }
                        </div>
                    )
                }
            </div> 


        </div>
    )
}

export default Categories
