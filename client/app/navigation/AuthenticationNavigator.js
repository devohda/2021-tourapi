import React from 'react';
import 'react-native-gesture-handler';
import {Button, StyleSheet, Text, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

import SignInScreen from '../screens/auth/SignInScreen';
import SignUpEmailScreen from '../screens/auth/SignUpEmailScreen';
import FindPasswordScreen from '../screens/auth/FindPasswordScreen'
import SignUpSocialScreen from "../screens/auth/SignUpSocialScreen";

const Stack = createStackNavigator()

export default function AuthenticationNavigator({navigation, setIsSignedIn}) {
    return (
        <Stack.Navigator initialRouteName="SocialLogin">
            <Stack.Screen name="SocialLogin" component={SignUpSocialScreen} options={{headerShown: false}}/>
            <Stack.Screen name="SignIn"
                          component={SignInScreen}
                          options={{headerShown: false}}
                          appNavigation={navigation}
            />
            <Stack.Screen name="SignUp" component={SignUpEmailScreen}
                          options={{
                              title: '회원가입',
                              headerStyle: {elevation: 0},
                              headerTitleStyle: {fontSize: 18}
                          }}
            />
            <Stack.Screen name="FindPassword" component={FindPasswordScreen}/>
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});
