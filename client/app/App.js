import React from 'react';
import {DefaultTheme, NavigationContainer} from "@react-navigation/native";

import AppNavigator from "./navigation/AppNavigator";
import AppContextProviders from "./contexts/AppContextProviders";

const NavigationTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: 'transparent'
    },
};

const ColorTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        defaultColor : '#FFFFFF',
        mainColor : '#4C648D',
        backgroundColor : '#FCF6F5',
        notClicked : '#C9CFD9',
        emphasizedColor : '#F07A7A',
        subColor : '#BABFC8',
        hashTagColor: '#90969F',
        detailColor: '#F0E7E7',
        detailTextColor: '#818792',
        detailSubTextColor: '#AFB3BB',
        linkColor: '#7E97C2'
    }
};

export default function App() {
    return (
            <AppContextProviders>
                <NavigationContainer theme={NavigationTheme, ColorTheme}>
                    <AppNavigator />
                </NavigationContainer>
            </AppContextProviders>
    );
}
