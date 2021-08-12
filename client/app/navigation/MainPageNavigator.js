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

export default function MainPageNavigator({navigation, route}) {
    if(getFocusedRouteNameFromRoute(route) === 'Directory') {
        navigation.setOptions({tabBarVisible: false})
    }
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
                <Stack.Screen name="btn" component={MakeDirectoryBtn} />
                <Stack.Screen name="Directory" component={MakeFreeDirectory} options={{title:'자유보관함 만들기', headerStyle:{backgroundColor: '#FCF6F5', elevation: 0, shadowOpacity: 0}, headerTitleStyle:{fontSize: 16, color: '#40516E', fontWeight: 'bold', paddingLeft: '20%'}, 
                                                                            headerLeft:()=>(<Icon type="ionicon" name={"chevron-back-outline"} style={{paddingLeft: '30%'}} color={'#40516E'}></Icon>)}}/>
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