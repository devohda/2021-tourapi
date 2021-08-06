import React, {useState} from 'react';
import {DefaultTheme, NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from '@react-navigation/stack';
import SignedInContextProvider from "./components/SignedInContextProvider";
import AppNavigator from "./navigation/AppNavigator";


const NavigationTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: 'transparent'
    },
};

export default function App() {
    return (
        <SignedInContextProvider>
            <NavigationContainer theme={NavigationTheme}>
                <AppNavigator/>
            </NavigationContainer>
        </SignedInContextProvider>
    );
}
