import React from "react";
import {createStackNavigator} from '@react-navigation/stack';

import GetEmailTab from "../screens/auth/signUpEmail/GetEmailTab";
import GetPasswordTab from "../screens/auth/signUpEmail/GetPasswordTab";
import GetNicknameTab from "../screens/auth/signUpEmail/GetNicknameTab";

import { useTheme } from "@react-navigation/native";

const Stack = createStackNavigator();

const SignUpEmailNavigator = ({navigation: authNavigation}) => {
    const { colors } = useTheme()

    return (
        <Stack.Navigator screenOptions={{headerShown: false, animationEnabled: false}}>
            <Stack.Screen name="emailTab" component={GetEmailTab} options={{cardStyle: {backgroundColor: colors.backgroundColor}}}/>
            <Stack.Screen name="passwordTab" component={GetPasswordTab} options={{cardStyle: {backgroundColor: colors.backgroundColor}}}/>
            <Stack.Screen name="nicknameTab"
                          children={
                              ({route}) =>
                                  <GetNicknameTab route={route} authNavigation={authNavigation}/>
                          }
                          options={{cardStyle: {backgroundColor: colors.backgroundColor}}}
            />
        </Stack.Navigator>
    );
}

export default SignUpEmailNavigator;