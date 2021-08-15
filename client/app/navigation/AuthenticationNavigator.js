import React from 'react';
import 'react-native-gesture-handler';
import {createStackNavigator} from '@react-navigation/stack';

import SignInEmailScreen from '../screens/auth/SignInEmailScreen';
import FindPasswordScreen from '../screens/auth/FindPasswordScreen'
import SignUpSocialScreen from "../screens/auth/SignUpSocialScreen";
import SignUpEmailScreen from "../screens/auth/SignUpEmailScreen";

const Stack = createStackNavigator()

export default function AuthenticationNavigator({navigation, setIsSignedIn}) {
    return (
        <Stack.Navigator initialRouteName="SignUpSocial" screenOptions={{headerShown: false}}>
            <Stack.Screen name="SignUpSocial" component={SignUpSocialScreen} options={{headerShown: false}}/>
            <Stack.Screen name="SignInEmail" component={SignInEmailScreen}/>
            <Stack.Screen name="SignUpEmail" component={SignUpEmailScreen}/>
            <Stack.Screen name="FindPassword" component={FindPasswordScreen}/>
        </Stack.Navigator>
    );
}
