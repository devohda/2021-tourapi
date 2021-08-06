import HomeNavigator from "./HomeNavigator";
import AuthenticationNavigator from "./AuthenticationNavigator";
import React, {useState} from "react";
import {useIsSignedIn} from "../components/SignedInContextProvider";
import {createStackNavigator} from "@react-navigation/stack";

const MainStack = createStackNavigator()

const AppNavigator = () => {
    const [isSignedIn, setIsSignedIn] = useIsSignedIn()
    return (
        <MainStack.Navigator screenOptions={{headerShown: false}}>
            {isSignedIn ?
                <MainStack.Screen name="App" component={HomeNavigator}/> :
                <MainStack.Screen name="Authentication" component={AuthenticationNavigator}/>
            }
        </MainStack.Navigator>
    )
}

export default AppNavigator;