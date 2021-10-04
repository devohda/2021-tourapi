import React from 'react';
import SignedInContextProvider from './SignedInContextProvider';
import TokenContextProvider from './TokenContextProvider';
import TipsListContextProvider from './TipsListContextProvider';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import { default as theme } from './customization/theme.json';
import UpdatedListContextProvider from './UpdatedListContextProvider';
import SetUpdatedContextProvider from './SetUpdateContextProviders';
import SearchContextProviders from './search/SearchContextProviders';

const AppContextProviders = props => {
    return (
        <>
            <SignedInContextProvider>
                <TokenContextProvider>
                    <TipsListContextProvider>
                        <UpdatedListContextProvider>
                            <SetUpdatedContextProvider>
                                <SearchContextProviders>
                                    <ApplicationProvider {...eva} theme={{...theme}}>
                                        {props.children}
                                    </ApplicationProvider>
                                </SearchContextProviders>
                            </SetUpdatedContextProvider>
                        </UpdatedListContextProvider>
                    </TipsListContextProvider>
                </TokenContextProvider>
            </SignedInContextProvider>
        </>
    );
};

export default AppContextProviders;