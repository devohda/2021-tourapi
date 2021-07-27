import React from 'react';
import {DefaultTheme, NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from '@react-navigation/stack';
import LoginNavigator from "./navigation/LoginNavigator";
import MainNavigator from "./navigation/MainNavigator";
import AppLoading from 'expo-app-loading';
import MakeDirectory from './screens/MakeDirectoy';

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
        // <NavigationContainer theme={NavigationTheme}>
        //     <MainStack.Navigator screenOptions={{
        //         headerShown: false
        //     }}>
        //         <MainStack.Screen name="Login" component={LoginNavigator}/>
        //         <MainStack.Screen name="App" component={MainNavigator}/>
        //     </MainStack.Navigator>
        // </NavigationContainer>
        <MakeDirectory />
    );
}
