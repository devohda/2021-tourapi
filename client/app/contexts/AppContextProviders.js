import React from 'react';
import SignedInContextProvider from './SignedInContextProvider';
import TokenContextProvider from './TokenContextProvider';
import SearchKeywordContextProvider from './SearchkeywordContextProvider';
import TipsListContextProvider from './TipsListContextProvider';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import { default as theme } from './theme.json';
import { default as mapping } from './mapping.json';

const AppContextProviders = props => {
    return (
        <>
            <SignedInContextProvider>
                <TokenContextProvider>
                    <SearchKeywordContextProvider>
                        <TipsListContextProvider>
                            <ApplicationProvider {...eva} theme={{...theme}} customMapping={mapping}>
                                {props.children}
                            </ApplicationProvider>
                        </TipsListContextProvider>
                    </SearchKeywordContextProvider>
                </TokenContextProvider>
            </SignedInContextProvider>
        </>
    );
};

export default AppContextProviders;