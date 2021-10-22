import React from "react";
import {createStackNavigator} from '@react-navigation/stack';

import ShowRulesTab from '../screens/auth/signUpEmail/ShowRulesTab';
import GetEmailTab from "../screens/auth/signUpEmail/GetEmailTab";
import GetPasswordTab from "../screens/auth/signUpEmail/GetPasswordTab";
import GetNicknameTab from "../screens/auth/signUpEmail/GetNicknameTab";
import GetKeywordTab from "../screens/auth/signUpEmail/GetKeywordTab";
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
            <Stack.Screen name="showRulesTab" component={ShowRulesTab}/>
            <Stack.Screen name="emailTab" component={GetEmailTab}/>
            <Stack.Screen name="passwordTab" component={GetPasswordTab}/>
            <Stack.Screen name="nicknameTab" component={GetNicknameTab}/>
            <Stack.Screen name="keywordTab"
                        children={
                              ({route}) =>
                                  <GetKeywordTab route={route} authNavigation={authNavigation}/>
                          }
            />
        </Stack.Navigator>
    );
}

export default SignUpEmailNavigator;