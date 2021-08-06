import * as React from 'react';
import {useState, useRef, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Text, Button, Touchable, TouchableOpacity} from "react-native";
import {Icon} from 'react-native-elements';
import RBSheet from "react-native-raw-bottom-sheet";

import MainPageNavigator from "./MainPageNavigator";
import MyPageScreen from "../screens/MyPageScreen";
import MakeDirectoryBtn from '../screens/MakeDirectoryBtn';

const Tab = createBottomTabNavigator();

export default function HomeNavigator({navigation}) {
        return (
            <Tab.Navigator>
                <Tab.Screen name="main" component={MainPageNavigator} options={{
                    tabBarIcon:()=>(
                    <Icon type="ionicon" name={"home-outline"} size={26}></Icon>),
                    tabBarLabel:()=>{return null}
                }}/>
                <Tab.Screen name="directory" component={MakeDirectoryBtn} options={{title:'', tabBarIcon:()=>(
                    MakeDirectoryBtn({navigation}))
                }}/>
                <Tab.Screen name="mypage" component={MyPageScreen} options={{title: '마이페이지',
                    tabBarIcon:()=>(
                    <Icon type="ionicon" name={"person-outline"} size={26}></Icon>),
                    tabBarLabel:()=>{return null}
                }}/>
            </Tab.Navigator>
        );
}