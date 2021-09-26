import React, { useState, useContext } from 'react';

const SearchResultContext = React.createContext(null);

const SearchResultContextProvider = ({children}) => {
    return(
        <SearchResultContext.Provider value={useState([0,0,0])}>
            {children}
        </SearchResultContext.Provider>
    )
}

export const searchResult = () => useContext(SearchResultContext)
export default SearchResultContextProvider;