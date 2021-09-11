import React from 'react';
import SignedInContextProvider from "./SignedInContextProvider";
import UserDataContextProvider from './UserDataContextProvider';
import SearchKeywordContextProvider from './SearchkeywordContextProvider';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import { default as theme } from './theme.json';

const AppContextProviders = props => {
    return (
        <>
            <SignedInContextProvider>
                <UserDataContextProvider>
                    <SearchKeywordContextProvider>
                        <ApplicationProvider {...eva} theme={{...theme}}>
                            {props.children}
                        </ApplicationProvider>
                    </SearchKeywordContextProvider>
                </UserDataContextProvider>
            </SignedInContextProvider>
        </>
    )
}

export default AppContextProviders;