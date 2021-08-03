import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import {StyleSheet, TouchableOpacity, View, Text, Platform} from "react-native";
import { Icon } from 'react-native-elements';

import MainPage from "../screens/MainPage";
import SearchScreen from "../screens/SearchScreen";
import PlaceScreen from '../screens/PlaceScreen'

const Stack = createStackNavigator();

export default class MainPageNavigator extends React.Component {
    constructor(props) {
        super(props);
        const {navigation} = this.props;
    }
    render() {
        return (
            <Stack.Navigator initialRouteName="main">
                {Platform.OS === 'android' ?
                <Stack.Screen name="main" component={MainPage} options={{headerTitle: 'Here.', headerTitleStyle: {fontSize: 28, fontWeight: 'bold', color: 'white'}, headerStyle: {backgroundColor: 'black'}, headerLeft: ()=>null, headerRight: ()=><TouchableOpacity onPress={() => this.props.navigation.navigate('search')}>
                    <View style={{flexDirection: 'row'}}>
                        <Icon type="ionicon" name={"md-search"} color="white" style={{marginEnd: 20}}  size={28}></Icon>
                    </View>
                </TouchableOpacity>}}/> : <Stack.Screen name="main" component={MainPage} options={{headerShown: false}}/>
                }
                <Stack.Screen name="search" component={SearchScreen}/>
                <Stack.Screen name="place" component={PlaceScreen} />
            </Stack.Navigator>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});