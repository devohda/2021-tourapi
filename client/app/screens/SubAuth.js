import React from 'react';
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import EmailAuth from './forSubAuth/EmailAuth';
import PasswordAuth from './forSubAuth/PasswordAuth';
import NickNameAuth from './forSubAuth/NicknameAuth';

const Stack = createStackNavigator()
const NavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent'
  },
};


export default function SubAuth() {

        return (
            <NavigationContainer theme={NavigationTheme}>
            <Stack.Navigator initialRouteName="EmailAuth">
                <Stack.Screen name="EmailAuth" component={EmailAuth} options={{title: '회원가입', headerStyle: {elevation: 0}, headerTitleStyle: {fontSize: 18, marginStart: 100}}}/>
                <Stack.Screen name="PasswordAuth" component={PasswordAuth} options={{title: '회원가입', headerStyle: {elevation: 0}, headerTitleStyle: {fontSize: 18, marginStart: 100}}}/>
                <Stack.Screen name="NickNameAuth" component={NickNameAuth} options={{title: '회원가입', headerStyle: {elevation: 0}, headerTitleStyle: {fontSize: 18, marginStart: 100}}}/>
            </Stack.Navigator>
            </NavigationContainer>   
          );
}

const styles = StyleSheet.create({
    // mainpage : {
    //     // position: 'absolute'

    // },
    button : {
        left: 312,
        width: 67,
        height: 24,
        fontWeight: 'normal',
        backgroundColor: '#fff',
        borderColor: '#fff',
        top: 44,
    },
    container: {
        margin: 10,
        fontSize: 28,
        fontWeight: "400",
        top: 36,
        left: 16,
        width: 343,
    },
  });