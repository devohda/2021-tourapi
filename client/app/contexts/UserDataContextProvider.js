import React, { useState, useContext } from 'react';

const UserDataContext = React.createContext(null);

const UserDataContextProvider = ({children}) => {
    return(
        <UserDataContext.Provider value={useState(false)}>
            {children}
        </UserDataContext.Provider>
    )
}

export const useIsUserData = () => useContext(UserDataContext)
export default UserDataContextProvider;