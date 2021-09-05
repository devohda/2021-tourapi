import React, { useState, useContext } from 'react';

const SearchKeywordContext = React.createContext(null);

const SearchKeywordContextProvider = ({children}) => {
    return(
        <SearchKeywordContext.Provider value={useState(false)}>
            {children}
        </SearchKeywordContext.Provider>
    )
}

export const searchKeyword = () => useContext(SearchKeywordContext)
export default SearchKeywordContextProvider;