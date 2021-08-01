import React from 'react';
import {DefaultTheme, NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from '@react-navigation/stack';
import HomeNavigator from "./navigation/HomeNavigator";
import LoginNavigator from "./navigation/LoginNavigator";

const MainStack = createStackNavigator()

const NavigationTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: 'transparent'
    },
};

export default function App() {
    return (
        <NavigationContainer theme={NavigationTheme}>
            <MainStack.Navigator screenOptions={{
                headerShown: false
            }}>
                <MainStack.Screen name="Login" component={LoginNavigator}/>
                <MainStack.Screen name="App" component={HomeNavigator}/>
            </MainStack.Navigator>
        </NavigationContainer>
    );
}
