import React from 'react';
import 'react-native-gesture-handler';
import {Button, StyleSheet, Text, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {Icon} from 'react-native-elements';

import MainAuth from '../screens/MainAuth';
import AuthenticationScreen from '../screens/AuthenticationScreen';
import MainPage from '../screens/MainPage';
import MainPageNavigator from './MainPageNavigator';
import HomeNavigator from './HomeNavigator';
import MakeFreeDirectory from '../screens/MakeFreeDirectory';
import MakeDirectoryBtn from '../screens/MakeDirectoryBtn';

const Stack = createStackNavigator()

export default function LoginNavigator({navigation}) {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={MainAuth} options={{headerShown: false}}/>
            {/* 회원가입 back button 모양 수정 */}
            <Stack.Screen name="SubAuth" component={AuthenticationScreen}
                          options={{title: '회원가입', headerStyle: {elevation: 0}, headerTitleStyle: {fontSize: 18}}}/>
            <Stack.Screen name="MainPage" component={HomeNavigator} options={{headerShown: false}}/>
            <Stack.Screen name="DirectoryBtn" component={MakeDirectoryBtn} />
            <Stack.Screen name="Directory" component={MakeFreeDirectory} options={{headerShown: false}}/>
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
