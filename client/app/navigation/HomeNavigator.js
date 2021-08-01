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

function sameComponent({navigation}) {
    const refRBSheet = useRef();

    return (
        <View style={{justifyContent: 'flex-end', paddingBottom: 15, width:'100%', height: '200%'}}>
        <TouchableOpacity onPress={() => {refRBSheet.current.open()}}>
            <Icon type="ionicon" name={"add-circle"} size={68}/>
                <RBSheet
                    ref={refRBSheet}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    customStyles={{
                    wrapper: {
                        backgroundColor: "transparent"
                    },
                    draggableIcon: {
                        backgroundColor: "#000"
                        // display: 'none'
                    }
                    }}
                >
                <MakeDirectoryBtn nav={navigation} />
            </RBSheet>
     </TouchableOpacity>
    </View>
    )
}

export default function HomeNavigator({navigation}) {
    const refRBSheet = useRef();

        return (
            <Tab.Navigator>
                <Tab.Screen name="main" component={MainPageNavigator}/>
                <Tab.Screen name="directory" component={sameComponent} options={{title:'', tabBarIcon:()=>(
                    sameComponent({navigation})
                )}}/>
                <Tab.Screen name="mypage" component={MyPageScreen} options={{title: '마이페이지'}}/>
            </Tab.Navigator>
        );
}