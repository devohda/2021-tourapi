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

export default function App() {
    return (
        <AppContextProviders>
            <NavigationContainer theme={NavigationTheme}>
                <AppNavigator/>
            </NavigationContainer>
        </AppContextProviders>
    );
}
