import React, {useState} from 'react';
import {Image, TouchableOpacity, View} from "react-native";
import {useTheme} from '@react-navigation/native';
import AppText from "./AppText";
import BackIcon from '../assets/images/back-icon.svg';
import { Menu, Provider, Divider, Appbar } from 'react-native-paper';
import { Icon } from 'react-native-elements';

// ** customize 한 스택 네비게이션 헤더 입니다.
// ** props 로 navigation(navigation 객체), title(String) 을 받습니다.

const NavigationTop = props => {
    const {colors} = useTheme();

    // const MenuComponent = () => {
    // }

    return (
        <View flexDirection="row" style={{
            height: 24,
            marginVertical: 20,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <View style={{position: 'absolute', left: 0}}>
                <TouchableOpacity onPress={() => {
                    props.navigation.goBack()
                }}>
                    <BackIcon width={24} height={24} style={{color : colors.mainColor}}/>
                </TouchableOpacity>
            </View>
            <AppText style={{color: colors.mainColor, fontSize: 16, fontWeight: 'bold'}}>
                {props.title}
            </AppText>
            {/* <View style={{position: 'absolute', right: 0}}> */}
                {/* {props.type === 'freeDir' && <MenuComponent />} */}
            {/* </View> */}
        </View>
    )
}

export default NavigationTop;