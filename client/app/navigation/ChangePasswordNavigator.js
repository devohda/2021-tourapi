import React from "react";

import {createStackNavigator} from '@react-navigation/stack';

import ChangePasswordTab from "../screens/auth/changePassword/ChangePasswordTab";
import FindPasswordTab from "../screens/auth/changePassword/FindPasswordTab";
import {useTheme} from "@react-navigation/native";

const Stack = createStackNavigator();

const SignUpEmailNavigator = ({navigation: authNavigation}) => {
    const {colors} = useTheme();
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animationEnabled: false,
                cardStyle: { backgroundColor: colors.backgroundColor }
            }}>
            <Stack.Screen name="findTab" component={FindPasswordTab}/>
            <Stack.Screen name="changeTab"
                        children={
                              ({route}) =>
                                  <ChangePasswordTab route={route} authNavigation={authNavigation}/>
                          }
            />
        </Stack.Navigator>
    );
}

export default SignUpEmailNavigator;