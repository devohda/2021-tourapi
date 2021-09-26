import React from 'react';
import SearchCollectionContextProvider from './SearchCollectionContextProvider';
import SearchPlaceContextProvider from './SearchPlaceContextProvider';
import SearchUserContextProvider from './SearchUserContextProvider';
import SearchKeywordContextProvider from './SearchkeywordContextProvider';

const SearchContextProviders = props => {
    return (
    <SearchKeywordContextProvider>
        <SearchPlaceContextProvider>
            <SearchCollectionContextProvider>
                <SearchUserContextProvider>
                    {props.children}
                </SearchUserContextProvider>
            </SearchCollectionContextProvider>
        </SearchPlaceContextProvider>
    </SearchKeywordContextProvider>
    );
};

export default SearchContextProviders;