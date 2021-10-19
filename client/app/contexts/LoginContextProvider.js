import React, { useState, useContext } from 'react';

const AlertDuplicatedContext = React.createContext(false);

const AlertDuplicatedContextProvider = ({children}) => {
    return(
        <AlertDuplicatedContext.Provider value={useState(null)}>
            {children}
        </AlertDuplicatedContext.Provider>
    );
};

export const useAlertDuplicated = () => useContext(AlertDuplicatedContext);
export default AlertDuplicatedContextProvider;