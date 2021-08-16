import React from "react";
import {createStackNavigator} from '@react-navigation/stack';

import GetEmailTab from "../screens/auth/signUpEmail/GetEmailTab";
import GetPasswordTab from "../screens/auth/signUpEmail/GetPasswordTab";
import GetNicknameTab from "../screens/auth/signUpEmail/GetNicknameTab";

const Stack = createStackNavigator();

const SignUpEmailNavigator = ({navigation: authNavigation}) => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false, animationEnabled: false}}>
            <Stack.Screen name="emailTab" component={GetEmailTab}/>
            <Stack.Screen name="passwordTab" component={GetPasswordTab}/>
            <Stack.Screen name="nicknameTab"
                          children={
                              ({route}) =>
                                  <GetNicknameTab route={route} authNavigation={authNavigation}/>
                          }
            />
        </Stack.Navigator>
    );
}

export default SignUpEmailNavigator;