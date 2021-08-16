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
        // navigation.setOptions({tabBarVisible: false})
    }
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
                {Platform.OS === 'android' ?
                <Stack.Screen name="main" component={MainPage} options={{headerTitle: 'Here.', headerTitleStyle: {fontSize: 28, fontWeight: 'bold', color: 'white'}, headerStyle: {backgroundColor: 'black'}, headerLeft: ()=>null, headerRight: ({navigation})=><TouchableOpacity onPress={navSearch}>
                    <View style={{flexDirection: 'row'}}>
                        <Icon type="ionicon" name={"md-search"} color="white" style={{marginEnd: 20}}  size={28}></Icon>
                    </View>
                </TouchableOpacity>}}/> : <Stack.Screen name="main" component={MainPage} options={{headerShown: false}}/>
                }
                <Stack.Screen name="search" component={SearchScreen}/>
                <Stack.Screen name="place" component={PlaceScreen} />
                {/* <Stack.Screen name="btn" component={MakeDirectoryBtn} /> */}
                <Stack.Screen name="Directory" component={MakeFreeDirectory}options={{title:'자유보관함 만들기', headerStyle:{backgroundColor: '#FCF6F5', elevation: 0, shadowOpacity: 0}, headerTitleStyle:{fontSize: 16, color: '#40516E', fontWeight: 'bold', paddingLeft: '20%'}, 
                                                                            // headerLeft:()=><Icon type="ionicon" name={"chevron-back-outline"} iconStyle={{paddingLeft: 10}} color={'#40516E'} onPress={navMain}></Icon>
                                                                            }}/>
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