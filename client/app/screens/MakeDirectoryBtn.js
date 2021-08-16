import * as React from 'react';
import {useState, useRef, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Text, Button, Touchable, TouchableOpacity, Image} from "react-native";
import {Icon} from 'react-native-elements';
import RBSheet from "react-native-raw-bottom-sheet";

export default function MakeDirectoryBtn({navigation}) {
    const refRBSheet = useRef();
    const [clicked, setClicked] = useState(false);
    return (
        <View style={{justifyContent: 'flex-end', paddingBottom: '3%', width:'100%', height: '200%'}}>
        <TouchableOpacity onPress={() => {refRBSheet.current.open(); setClicked(true)}}>
            <Image style={{alignSelf:'center', marginBottom: 0}} source={require('../assets/images/add_btn_nonclick.png')}></Image>
            {/* <Icon type="ionicon" name={"add-circle-outline"} size={45} color={'#7B9ACC'}/> */}
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
                        borderTopRightRadius: 10,
                        backgroundColor: '#FCF6F5'
                    }
                    }}
                >
               <View style={{paddingTop: '5%', backgroundColor: '#FCF6F5'}}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{fontSize: 18, fontWeight: 'bold', marginLeft: '5%', marginTop: '1%', color: '#40516E'}}>보관함 만들기</Text>
                        <TouchableOpacity onPress={() => {refRBSheet.current.close()}} style={{marginLeft: '58%'}}><Icon type="ionicon" name={"close"}></Icon></TouchableOpacity>
                    </View>
                    <View style={{alignItems : "center", justifyContent : "center", marginTop: '1%'}}>
                        <TouchableOpacity style={{backgroundColor: '#7B9ACC', width: '90%', height: 72, borderRadius: 10, margin: 10}}>
                            <Text style={{textAlign: 'center', paddingTop: 13, fontSize: 18, fontWeight: 'bold', color: '#FCF6F5'}}>일정 보관함</Text>
                            <Text style={{textAlign: 'center', paddingTop: 5, paddingBottom: 15, fontSize: 12, fontWeight: 'bold', color: '#FCF6F5'}}>공간을 시간 순서대로 보관할 수 있어요</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{backgroundColor: '#7B9ACC', width: '90%', height: 72, borderRadius: 10, margin: 10}} onPress={()=> {refRBSheet.current.close(); navigation.navigate('Directory'); navigation.setOptions({tabBarVisible: false})}}>
                            <Text style={{textAlign: 'center', paddingTop: 13, fontSize: 18, fontWeight: 'bold', color: '#FCF6F5'}}>자유 보관함</Text>
                            <Text style={{textAlign: 'center', paddingTop: 5, paddingBottom: 15, fontSize: 12, fontWeight: 'bold', color: '#FCF6F5'}}>순서 상관없이 자유롭게 공간을 보관할 수 있어요</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </RBSheet>
     </TouchableOpacity>
    </View>
    )
}