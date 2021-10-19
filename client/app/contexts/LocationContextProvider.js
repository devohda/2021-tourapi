import React, { useState, useContext } from 'react';

const LocationContext = React.createContext(null);

const LocationContextProvider = ({children}) => {
    return(
        <LocationContext.Provider value={useState(null)}>
            {children}
        </LocationContext.Provider>
    );
};

export const myLocation = () => useContext(LocationContext);
export default LocationContextProvider;