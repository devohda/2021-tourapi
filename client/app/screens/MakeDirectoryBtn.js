import React, { useState, useRef, useEffect } from 'react';
import 'react-native-gesture-handler';
import {Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { BottomSheet, ListItem } from 'react-native-elements';
import {createStackNavigator} from '@react-navigation/stack';
import {Icon} from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { withNavigation} from 'react-navigation';
import { useNavigation } from '@react-navigation/native';
import * as RootNavigation from './MakeFreeDirectoy';
import RBSheet from "react-native-raw-bottom-sheet";

export default function MakeDirectoryBtn({nav}) {
            return (
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
                    <TouchableOpacity style={{backgroundColor: '#FFF0B4', width: '80%', height: '33%', borderRadius: 10, margin: 10}} onPress={()=> {nav.navigate('Directory')}}>
                    <Text style={{textAlign: 'center', paddingTop: 10, fontSize: 14, fontWeight: 'bold'}}>자유 보관함</Text>
                    <Text style={{textAlign: 'center', paddingTop: 5, paddingBottom: 15, fontSize: 10, fontWeight: 'bold'}}>순서 상관없이 자유롭게 공간을 보관할 수 있어요</Text>
                    </TouchableOpacity>
                    </View>
                    </View>
            )
    }