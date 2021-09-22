import React, { useState, useContext } from 'react';

const TipsListContext = React.createContext(null);

const TipsListContextProvider = ({children}) => {
    return(
        <TipsListContext.Provider value={useState([])}>
            {children}
        </TipsListContext.Provider>
    )
}

export const tipsList = () => useContext(TipsListContext)
export default TipsListContextProvider;