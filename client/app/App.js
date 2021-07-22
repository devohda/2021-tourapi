import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Auth from './screens/Auth';
import MainNavigator from "./navigation/MainNavigator";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from '@react-navigation/stack';
import LoginNavigator from "./navigation/LoginNavigator";

const MainStack = createStackNavigator()

export default function App() {
    return (
        <NavigationContainer>
            <MainStack.Navigator screenOptions={{
                headerShown: false
            }}>
                <MainStack.Screen name="Login" component={LoginNavigator}/>
                <MainStack.Screen name="App" component={MainNavigator}/>
            </MainStack.Navigator>
        </NavigationContainer>
        // <View style={styles.container}>
        //   {/* <Text>Open up App.js to start working on your app!</Text> */}
        //   <StatusBar style="auto" />
        //   {/*<Auth />*/}
        // </View>
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
