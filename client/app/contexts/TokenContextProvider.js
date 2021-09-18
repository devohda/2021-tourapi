import React, {useState, useContext} from 'react';

const TokenContext = React.createContext(null);

const TokenContextProvider = ({children}) => {
    return (
        <TokenContext.Provider value={useState(false)}>
            {children}
        </TokenContext.Provider>
    );
};

export const useToken = () => useContext(TokenContext);
export default TokenContextProvider;