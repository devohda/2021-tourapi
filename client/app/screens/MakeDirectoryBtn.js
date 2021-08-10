import * as React from 'react';
import {useState, useRef, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Text, Button, Touchable, TouchableOpacity} from "react-native";
import {Icon} from 'react-native-elements';
import RBSheet from "react-native-raw-bottom-sheet";

export default function sameComponent({navigation}) {
    const refRBSheet = useRef();
    return (
        <View style={{justifyContent: 'flex-end', paddingBottom: '3%', width:'100%', height: '200%'}}>
        <TouchableOpacity onPress={() => {refRBSheet.current.open();}}>
            <Icon type="ionicon" name={"add-circle"} size={45}/>
                <RBSheet
                    ref={refRBSheet}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    customStyles={{
                    wrapper: {
                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                    },
                    draggableIcon: {
                        backgroundColor: "#000",
                        display: 'none'
                    },
                    container: {
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10
                    }
                    }}
                >
               <View style={{marginTop: '5%'}}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{fontSize: 18, fontWeight: 'bold', marginLeft: '5%', marginTop: '1%'}}>보관함 만들기</Text>
                        <TouchableOpacity onPress={() => {refRBSheet.current.close()}} style={{marginLeft: '58%'}}><Icon type="ionicon" name={"close"}></Icon></TouchableOpacity>
                    </View>
                    <View style={{alignItems : "center", justifyContent : "center", marginTop: '1%'}}>
                        <TouchableOpacity style={{backgroundColor: '#FFF0B4', width: '90%', height: 72, borderRadius: 10, margin: 10}}>
                            <Text style={{textAlign: 'center', paddingTop: 13, fontSize: 18, fontWeight: 'bold'}}>일정 보관함</Text>
                            <Text style={{textAlign: 'center', paddingTop: 5, paddingBottom: 15, fontSize: 12, fontWeight: 'bold', color: '#7C828E'}}>공간을 시간 순서대로 보관할 수 있어요</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{backgroundColor: '#FFF0B4', width: '90%', height: 72, borderRadius: 10, margin: 10}} onPress={()=> {refRBSheet.current.close(); navigation.navigate('Directory')}}>
                            <Text style={{textAlign: 'center', paddingTop: 13, fontSize: 18, fontWeight: 'bold'}}>자유 보관함</Text>
                            <Text style={{textAlign: 'center', paddingTop: 5, paddingBottom: 15, fontSize: 12, fontWeight: 'bold', color: '#7C828E'}}>순서 상관없이 자유롭게 공간을 보관할 수 있어요</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </RBSheet>
     </TouchableOpacity>
    </View>
    )
}