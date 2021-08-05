import React, {useState} from 'react';
import {DefaultTheme, NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from '@react-navigation/stack';
import HomeNavigator from "./navigation/HomeNavigator";
import AuthenticationNavigator from "./navigation/AuthenticationNavigator";

const MainStack = createStackNavigator()

const NavigationTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: 'transparent'
    },
};

export default function App() {
    // 로그인이 되어 있거나 초기 페이지를 건너뛰기 한 경우에는 메인 화면을, 아니면 로그인(인증) 화면 보여주기
    const [isSignedIn, setIsSignedIn] = useState(false)
    return (
        <NavigationContainer theme={NavigationTheme}>
            <MainStack.Navigator
                screenOptions={{headerShown: false}}
                initialRouteName={isSignedIn ? 'App' : 'Authentication'}
            >
                <MainStack.Screen name="Authentication" component={AuthenticationNavigator}/>
                <MainStack.Screen name="App" component={HomeNavigator}/>
            </MainStack.Navigator>
        </NavigationContainer>
    );
}
