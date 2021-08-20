import React from 'react';
import {DefaultTheme, NavigationContainer} from "@react-navigation/native";

import AppNavigator from "./navigation/AppNavigator";
import AppContextProviders from "./contexts/AppContextProviders";

const ColorTheme = {
    ...DefaultTheme,
    colors: {
        background : '#FCF6F5',
        defaultColor : '#FFFFFF',
        mainTextColor : '#4C648D',
        textNotClicked : '#C9CFD9',
        emphasizedColor : '#F07A7A',
        subColor : '#BABFC8',
        hashTagColor: '#90969F'
    }
};

export default function App() {
    return (
            <AppContextProviders>
                <NavigationContainer theme={ColorTheme}>
                    <AppNavigator/>
                </NavigationContainer>
            </AppContextProviders>
    );
}
