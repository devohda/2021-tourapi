import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import {StyleSheet, TouchableOpacity, View, Text, Platform} from "react-native";
import { Icon } from 'react-native-elements';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import MainPage from "../screens/MainPage";
import SearchScreen from "../screens/SearchScreen";
import PlaceScreen from '../screens/PlaceScreen';
import MakeDirectoryBtn from '../screens/MakeDirectoryBtn';
import MakeFreeDirectory from "../screens/MakeFreeDirectory";

const Stack = createStackNavigator();

export default function MainPageNavigator({navigation}) {
    const navSearch = () => {
        navigation.navigate('search')
    }
    const navMain = () => {
        navigation.navigate('main')
        // navigation.goBack(null)
        navigation.setOptions({tabBarVisible: true})
    }
        return (
            <Stack.Navigator initialRouteName="main">
                <Stack.Screen name="main" component={MainPage} options={{headerShown: false}} />
                <Stack.Screen name="search" component={SearchScreen}/>
                <Stack.Screen name="place" component={PlaceScreen} />
                <Stack.Screen name="Directory" component={MakeFreeDirectory} options={{headerShown: false}} />
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