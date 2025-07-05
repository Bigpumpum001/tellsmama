import React from 'react'

function SearchBar({
    searchText,
    setSearchText
}) {
    return (
        <div >
                <div className="input-group input-group-lg shadow-sm rounded-pill">
                    <span className='input-group-text bg-white border-0 ps-4 rounded-start-pill'><i className="bi bi-search "></i></span>
                    <input type="text"
                        className='form-control border-0'
                        placeholder='Search'
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        />
                </div>
        </div>
    )
}

export default SearchBar
