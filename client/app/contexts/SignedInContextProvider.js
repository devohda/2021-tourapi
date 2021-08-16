import React, { useState, useContext } from 'react';

const SignedInContext = React.createContext(null);

const SignedInContextProvider = ({children}) => {
    return(
        <SignedInContext.Provider value={useState(false)}>
            {children}
        </SignedInContext.Provider>
    )
}

export const useIsSignedIn = () => useContext(SignedInContext)
export default SignedInContextProvider;