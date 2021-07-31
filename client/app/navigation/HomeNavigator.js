import * as React from 'react';
import {useState, useRef, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Text, Button, Touchable, TouchableOpacity} from "react-native";
import {Icon} from 'react-native-elements';
import RBSheet from "react-native-raw-bottom-sheet";

import MainPageNavigator from "./MainPageNavigator";
import MyPageScreen from "../screens/MyPageScreen";
import DirectoryScreen from '../screens/DirectoryScreen';
import MakeDirectoryBtn from '../screens/MakeDirectoryBtn';
import DirectoryNavigator from './DirectoryNavigator';
import { BottomSheet, ListItem } from 'react-native-elements';
import MakeFreeDirectoy from '../screens/MakeFreeDirectoy';


const Tab = createBottomTabNavigator();

function directoryTab({navigation}) {
const refRBSheet = useRef();
useEffect(() => {
    refRBSheet.current.open()
  });
    return(
        // <View style={{justifyContent: 'flex-end', paddingBottom: 15}}>
        // <TouchableOpacity onPress={() => refRBSheet.current.open()}>
        //     <Icon type="ionicon" name={"add-circle"} size={68}/>
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
                <View style={{marginTop: '1%'}}>
                {/* marginTop: '5%',  */}
                <View style={{flexDirection:'row', marginLeft: '3%'}}>
                <Text style={{fontSize: 16, fontWeight: 'bold', marginLeft: '7%'}}>보관함 만들기</Text>
                {/* <TouchableOpacity onPress={() => {props.ref}}><Icon type="ionicon" name={"close"}></Icon></TouchableOpacity> */}
                </View>
                <View style={{alignItems : "center", justifyContent : "center", marginTop: '1%'}}>
                <TouchableOpacity style={{backgroundColor: '#FFF0B4', width: '80%', height: '33%', borderRadius: 10, margin: 10}}>
                <Text style={{textAlign: 'center', paddingTop: 10, fontSize: 14, fontWeight: 'bold'}}>일정 보관함</Text>
                <Text style={{textAlign: 'center', paddingTop: 5, paddingBottom: 15, fontSize: 10, fontWeight: 'bold'}}>공간을 시간 순서대로 보관할 수 있어요</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{backgroundColor: '#FFF0B4', width: '80%', height: '33%', borderRadius: 10, margin: 10}} onPress={()=> navigation.navigate('free')}>
                <Text style={{textAlign: 'center', paddingTop: 10, fontSize: 14, fontWeight: 'bold'}}>자유 보관함</Text>
                <Text style={{textAlign: 'center', paddingTop: 5, paddingBottom: 15, fontSize: 10, fontWeight: 'bold'}}>순서 상관없이 자유롭게 공간을 보관할 수 있어요</Text>
                </TouchableOpacity>
                </View>
                </View>
                         </RBSheet>
                //  </TouchableOpacity>
                //  </View>
     )

}

export default function HomeNavigator() {
    const refRBSheet = useRef();

        return (
            <Tab.Navigator>
                <Tab.Screen name="main" component={MainPageNavigator}/>
                <Tab.Screen name="directory" component={DirectoryNavigator} options={{title:'', tabBarIcon:()=>(
                                            <View style={{justifyContent: 'flex-end', paddingBottom: 15, height: '200%'}}>
                                            {/* <TouchableOpacity onPress={() => refRBSheet.current.open()}> */}
                                                <Icon type="ionicon" name={"add-circle"} size={68}/>
                                                    {/* <RBSheet
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
                                                </RBSheet> */}
                                        {/* </TouchableOpacity> */}
                                        </View>
                )}}/>
                <Tab.Screen name="mypage" component={MyPageScreen} options={{title: '마이페이지'}}/>
            </Tab.Navigator>
        );
}