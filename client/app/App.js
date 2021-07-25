import React from 'react';
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from '@react-navigation/stack';
import LoginNavigator from "./navigation/LoginNavigator";
import MainNavigator from "./navigation/MainNavigator";
import AppLoading from 'expo-app-loading';

const MainStack = createStackNavigator()

export default function App() {
    return (
        <NavigationContainer>
            <MainStack.Navigator screenOptions={{
                headerShown: false
            }}>
                {/*<MainStack.Screen name="Login" component={LoginNavigator}/>*/}
                <MainStack.Screen name="App" component={MainNavigator}/>
            </MainStack.Navigator>
        </NavigationContainer>
    );
}
