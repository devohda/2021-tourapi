import React from 'react';
import SignedInContextProvider from "./SignedInContextProvider";
import UserDataContextProvider from './UserDataContextProvider';
import SearchKeywordContextProvider from './SearchkeywordContextProvider';

const AppContextProviders = props => {
    return (
        <>
            <SignedInContextProvider>
                <UserDataContextProvider>
                    <SearchKeywordContextProvider>
                        {props.children}
                    </SearchKeywordContextProvider>
                </UserDataContextProvider>
            </SignedInContextProvider>
        </>
    )
}

export default AppContextProviders;