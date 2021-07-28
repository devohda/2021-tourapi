import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Text} from "react-native";

import MainPageNavigator from "./MainPageNavigator";
import MypageScreen from "../screens/MypageScreen";



const Tab = createBottomTabNavigator();

const MakeDirectoryBtn = () => {
    return (
        <View flex={1} style={{alignItems : "center", justifyContent : "center"}}>
            <Text>make directory btn</Text>
        </View>
    )
}

export default function HomeNavigator() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="main" component={MainPageNavigator}/>
            <Tab.Screen name="directory" component={MakeDirectoryBtn} options={{title: ''}}/>
            <Tab.Screen name="mypage" component={MypageScreen} options={{title: '마이페이지'}}/>
        </Tab.Navigator>
    );
}