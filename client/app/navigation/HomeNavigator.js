import * as React from 'react';
import {useState, useRef} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Text, Button, Touchable, TouchableOpacity} from "react-native";
import {Icon} from 'react-native-elements';
import RBSheet from "react-native-raw-bottom-sheet";

import MainPageNavigator from "./MainPageNavigator";
import MyPageScreen from "../screens/MyPageScreen";
import MakeDirectoryBtn from '../screens/MakeDirectoryBtn';
import DirectoryNavigator from './DirectoryNavigator';
import { BottomSheet, ListItem } from 'react-native-elements';


const Tab = createBottomTabNavigator();

export default function HomeNavigator() {
    const refRBSheet = useRef();
        return (
            <Tab.Navigator>
                <Tab.Screen name="main" component={MainPageNavigator}/>
                <Tab.Screen name="directory" component={DirectoryNavigator} options={{title: '', tabBarButton: ()=>(
                    <View style={{justifyContent: 'flex-end', paddingBottom: 15}}>
                        <TouchableOpacity onPress={() => refRBSheet.current.open()}>
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
                                <MakeDirectoryBtn />
                            </RBSheet>
                    </TouchableOpacity>
                    </View>
    )}}/>
                <Tab.Screen name="mypage" component={MyPageScreen} options={{title: '마이페이지'}}/>
            </Tab.Navigator>
        );

}