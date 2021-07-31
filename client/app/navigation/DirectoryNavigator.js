import React, {createRef, useRef, useEffect, useCallback} from "react";
import { createStackNavigator } from '@react-navigation/stack';
import {StyleSheet, TouchableOpacity, View, Text, SafeAreaView, ScrollView, ImageBackground, TextInput} from "react-native";
import { Icon } from 'react-native-elements';
import {NavigationContainer} from '@react-navigation/native';
import {useE} from 'react-native';
import RBSheet from "react-native-raw-bottom-sheet";

import MainPage from "../screens/MainPage";
import SearchScreen from "../screens/SearchScreen";
import PlaceScreen from '../screens/PlaceScreen';
import Free from '../screens/MakeFreeDirectoy';
import make from '../screens/MakeDirectoryBtn';
import home from './HomeNavigator';
// import {navigationRef} from '../screens/MakeFreeDirectoy';

const Stack = createStackNavigator();
const navigationRef = React.createRef();

function MakeDirectoryBtn({navigation}){
    const refRBSheet= useRef()
        return (
            <View style={{justifyContent: 'flex-start', paddingBottom: 15, bottom: 0, position: 'absolute', justifyContent: 'center', alignSelf: 'center'}}>
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
                            <TouchableOpacity style={{backgroundColor: '#FFF0B4', width: '80%', height: '33%', borderRadius: 10, margin: 10}} onPress={()=> navigation.navigate('Free')}>
                            <Text style={{textAlign: 'center', paddingTop: 10, fontSize: 14, fontWeight: 'bold'}}>자유 보관함</Text>
                            <Text style={{textAlign: 'center', paddingTop: 5, paddingBottom: 15, fontSize: 10, fontWeight: 'bold'}}>순서 상관없이 자유롭게 공간을 보관할 수 있어요</Text>
                            </TouchableOpacity>
                            </View>
                            </View>
                                     </RBSheet>
                              </TouchableOpacity>
                              </View>
                    )
                    // const {navigation} = this.props;
    }

function DirectoryNavigator() {
    return (
            <Stack.Navigator name="make">
                {/* <Stack.Screen name="home" component={home} /> */}
                <Stack.Screen name="make" component={MakeDirectoryBtn} options={{headerShown: false}} />
                <Stack.Screen name="Free" component={Free} options={{headerShown: false}}/> 

            </Stack.Navigator>

    );

}

const styles = StyleSheet.create({
    selectType : {
        borderColor: 'black',
        borderWidth: 1,
        paddingVertical: 1,
        paddingHorizontal: 8.5,
        borderRadius: 12
    },
    selectTypeText : {
        color: 'black',
        fontSize: 14
    },
    selectTypeIcon: {
        backgroundColor: 'rgb(141, 141, 141)',
        borderColor: 'black',
        borderWidth: 1,
        paddingVertical: 1,
        paddingHorizontal: 8.5,
        borderRadius: 12
    },
    selectTypeIconDetail : {
        color: 'black',
        paddingVertical: 1,
        borderRadius: 12
    },
    rankingContainer: {
        backgroundColor: 'white',
        width: 287,
        height: 320,
        marginTop: 66,
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 10,
        shadowOffset: {
            width: 6,
            height: 3
        },
        shadowOpacity: 0.25,
        elevation: 6,
    },
    defaultImage: {
        backgroundColor: '#c4c4c4',
        width: 287,
        height: 243,
    },
  });

export default DirectoryNavigator