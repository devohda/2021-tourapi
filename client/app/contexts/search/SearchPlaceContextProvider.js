import React, { useState, useContext } from 'react';

const SearchPlaceContext = React.createContext(null);

const SearchPlaceContextProvider = ({children}) => {
    return(
        <SearchPlaceContext.Provider value={useState(0)}>
            {children}
        </SearchPlaceContext.Provider>
    )
}

export const searchPlaceResult = () => useContext(SearchPlaceContext)
export default SearchPlaceContextProvider;