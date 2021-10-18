import React from 'react';
import SignedInContextProvider from './SignedInContextProvider';
import TokenContextProvider from './TokenContextProvider';
import SearchKeywordContextProvider from './SearchkeywordContextProvider';
import LocationContextProvider from './LocationContextProvider';

import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import { default as theme } from './customization/theme.json';

const AppContextProviders = props => {
    return (
        <>
            <SignedInContextProvider>
                <TokenContextProvider>
                    <LocationContextProvider>
                        <SearchKeywordContextProvider>
                            <ApplicationProvider {...eva} theme={{...theme}}>
                                {props.children}
                            </ApplicationProvider>
                        </SearchKeywordContextProvider>
                    </LocationContextProvider>
                </TokenContextProvider>
            </SignedInContextProvider>
        </>
    );
};

export default AppContextProviders;