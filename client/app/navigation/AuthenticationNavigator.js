import React from 'react';
import 'react-native-gesture-handler';
import {Button, StyleSheet, Text, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

import SignInEmailScreen from '../screens/auth/SignInEmailScreen';
import FindPasswordScreen from '../screens/auth/FindPasswordScreen'
import SignUpSocialScreen from "../screens/auth/SignUpSocialScreen";
import SignUpEmailNavigator from "./SignUpEmailNavigator";

const Stack = createStackNavigator()

export default function AuthenticationNavigator({navigation, setIsSignedIn}) {
    return (
        <Stack.Navigator initialRouteName="SignUpSocial"
                         screenOptions={{
                             headerStyle: {
                                 backgroundColor: '#FCF6F5',
                                 elevation: 0, // remove shadow on Android
                                 shadowOpacity: 0, // remove shadow on iOS
                             },
                             headerTintColor: '#40516E',
                             headerTitleStyle: {
                                 fontWeight: 'bold',
                             },
                         }}>
            <Stack.Screen name="SignUpSocial" component={SignUpSocialScreen} options={{headerShown: false}}/>
            <Stack.Screen name="SignInEmail"
                          component={SignInEmailScreen}
                          options={{headerShown: false}}
                          appNavigation={navigation}
            />
            <Stack.Screen name="SignUpEmail" component={SignUpEmailNavigator}
                          options={{
                              title: '회원가입',
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
