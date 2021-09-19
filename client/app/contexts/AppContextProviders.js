import React from 'react';
import SignedInContextProvider from './SignedInContextProvider';
import TokenContextProvider from './TokenContextProvider';
import SearchKeywordContextProvider from './SearchkeywordContextProvider';

const AppContextProviders = props => {
    return (
        <>
            <SignedInContextProvider>
                <TokenContextProvider>
                    <SearchKeywordContextProvider>
                        {props.children}
                    </SearchKeywordContextProvider>
                </TokenContextProvider>
            </SignedInContextProvider>
        </>
    );
};

export default AppContextProviders;