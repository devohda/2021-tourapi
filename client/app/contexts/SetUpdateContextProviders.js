import React, { useState, useContext } from 'react';

const SetUpdatedContext = React.createContext(null);

const SetUpdatedContextProvider = ({children}) => {
    return(
        <SetUpdatedContext.Provider value={useState(false)}>
            {children}
        </SetUpdatedContext.Provider>
    )
}

export const setUpdated = () => useContext(SetUpdatedContext)
export default SetUpdatedContextProvider;