import React, { useState, useContext } from 'react';

const SearchKeywordContext = React.createContext(null);

const SearchKeywordContextProvider = ({children}) => {
    return(
        <SearchKeywordContext.Provider value={useState('')}>
            {children}
        </SearchKeywordContext.Provider>
    );
};

export const useSearchKeyword = () => useContext(SearchKeywordContext);
export default SearchKeywordContextProvider;