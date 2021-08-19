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
    colors: {
        defaultColor : '#FFFFFF',
        mainColor : '#4C648D',
        backgroundColor : '#FCF6F5',
        textNotClicked : '#C9CFD9',
        emphasizedColor : '#F07A7A',
        subColor : '#BABFC8',
        hashTagColor: '#90969F'
    }
};

export default function App() {
    return (
            <AppContextProviders>
                <NavigationContainer theme={NavigationTheme, ColorTheme}>
                    <AppNavigator/>
                </NavigationContainer>
            </AppContextProviders>
    );
}
