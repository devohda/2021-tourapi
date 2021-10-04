import React, { useState, useContext } from 'react';

const SearchCollectionContext = React.createContext(null);

const SearchCollectionContextProvider = ({children}) => {
    return(
        <SearchCollectionContext.Provider value={useState(0)}>
            {children}
        </SearchCollectionContext.Provider>
    )
}

export const searchCollectionResult = () => useContext(SearchCollectionContext)
export default SearchCollectionContextProvider;