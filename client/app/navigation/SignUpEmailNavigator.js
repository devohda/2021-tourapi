import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import GetEmailTab from "../screens/auth/signUpEmail/GetEmailTab";


const Stack = createStackNavigator();

const SignUpEmailNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="emailTab" component={GetEmailTab}/>
        </Stack.Navigator>
    );
}

export default SignUpEmailNavigator;