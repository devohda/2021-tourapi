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
        mainColor : '#7B9ACC',
        backgroundColor : '#FCF6F5',
        textNotClicked : '#40516E',
        emphasizedColor : '#F07A7A',
        subColor : '#9DA2AB'
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
