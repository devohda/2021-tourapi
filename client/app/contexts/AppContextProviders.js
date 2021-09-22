import React from 'react';
import SignedInContextProvider from './SignedInContextProvider';
import TokenContextProvider from './TokenContextProvider';
import SearchKeywordContextProvider from './SearchkeywordContextProvider';
import TipsListContextProvider from './TipsListContextProvider';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import { default as theme } from './customization/theme.json';
import UpdatedListContextProvider from './UpdatedListContextProvider';
import SetUpdatedContextProvider from './SetUpdateContextProviders';

const AppContextProviders = props => {
    return (
        <>
            <SignedInContextProvider>
                <TokenContextProvider>
                    <SearchKeywordContextProvider>
                        <TipsListContextProvider>
                            <UpdatedListContextProvider>
                                <SetUpdatedContextProvider>
                                    <ApplicationProvider {...eva} theme={{...theme}}>
                                        {props.children}
                                    </ApplicationProvider>
                                </SetUpdatedContextProvider>
                            </UpdatedListContextProvider>
                        </TipsListContextProvider>
                    </SearchKeywordContextProvider>
                </TokenContextProvider>
            </SignedInContextProvider>
        </>
    );
};

export default AppContextProviders;