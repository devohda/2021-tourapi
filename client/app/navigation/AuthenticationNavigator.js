import React from 'react';
import 'react-native-gesture-handler';
import {Button, StyleSheet, Text, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';

const Stack = createStackNavigator()

export default function AuthenticationNavigator({navigation, setIsSignedIn}) {
    return (
        <Stack.Navigator initialRouteName="SignIn">
            <Stack.Screen name="SignIn"
                          component={SignInScreen}
                          options={{headerShown: false}}
                          appNavigation={navigation}
            />
            <Stack.Screen name="SignUp" component={SignUpScreen}
                          options={{
                              title: '회원가입',
                              headerStyle: {elevation: 0},
                              headerTitleStyle: {fontSize: 18}
                          }}
            />
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
