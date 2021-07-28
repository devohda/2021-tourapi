import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import {StyleSheet} from "react-native";

import MainPage from "../screens/MainPage";
import SearchScreen from "../screens/SearchScreen";
import PlaceScreen from '../screens/PlaceScreen'

const Stack = createStackNavigator()

export default function MainPageNavigator() {
    return (
        <Stack.Navigator initialRouteName="main">
            <Stack.Screen name="main" component={MainPage} options={{headerShown: false}}/>
            <Stack.Screen name="search" component={SearchScreen}/>
            <Stack.Screen name="place" component={PlaceScreen} />
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