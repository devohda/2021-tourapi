import React, { useState, useContext } from 'react';

const UpdatedListContext = React.createContext(null);

const UpdatedListContextProvider = ({children}) => {
    return(
        <UpdatedListContext.Provider value={useState([])}>
            {children}
        </UpdatedListContext.Provider>
    )
}

export const updatedList = () => useContext(UpdatedListContext)
export default UpdatedListContextProvider;