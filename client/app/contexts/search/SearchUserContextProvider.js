import React, { useState, useContext } from 'react';

const SearchUserContext = React.createContext(null);

const SearchUserContextProvider = ({children}) => {
    return(
        <SearchUserContext.Provider value={useState(0)}>
            {children}
        </SearchUserContext.Provider>
    )
}

export const searchUserResult = () => useContext(SearchUserContext)
export default SearchUserContextProvider;