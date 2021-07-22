import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainAuth from './screens/MainAuth';
// import SubAuth from './screens/SubAuth';
import MainPage from './screens/MainPage';
import EmailAuth from './screens/forSubAuth/EmailAuth';
import PasswordAuth from './screens/forSubAuth/PasswordAuth';
import NickNameAuth from './screens/forSubAuth/NicknameAuth';

const Stack = createStackNavigator()
const NavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent'
  },
};


export default function App() {
  return (
    <NavigationContainer theme={NavigationTheme}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={MainAuth} options={{headerShown: false}}/>
        {/* 회원가입 back button 모양 수정 */}
        <Stack.Screen name="SubAuth" component={SubAuth} options={{title: '회원가입', headerStyle: {elevation: 0}, headerTitleStyle: {fontSize: 18, marginStart: 100}}}/>
        <Stack.Screen name="MainPage" component={MainPage} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
