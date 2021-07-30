import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import {StyleSheet, TouchableOpacity, View, Text} from "react-native";
import { Icon } from 'react-native-elements';
import {NavigationContainer} from '@react-navigation/native';

import MainPage from "../screens/MainPage";
import SearchScreen from "../screens/SearchScreen";
import PlaceScreen from '../screens/PlaceScreen';
import Free from '../screens/MakeFreeDirectoy';
import make from '../screens/MakeDirectoryBtn';

const Stack = createStackNavigator();

export default function DirectoryNavigator() {
        return (
            <NavigationContainer>
                <Stack.Navigator initialRouteName="make">
                    <Stack.Screen name="Free" component={Free} />
                    <Stack.Screen name="make" component={make} {...props} navigation={navigation} />
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
    }
});

// export default DirectoryNavigator