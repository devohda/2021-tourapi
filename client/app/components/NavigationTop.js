import React from 'react';
import {Image, Text, TouchableOpacity, View} from "react-native";
import {useTheme} from '@react-navigation/native';
import BackIcon from '../assets/images/back-icon.svg'

// ** customize 한 스택 네비게이션 헤더 입니다.
// ** props 로 navigation(navigation 객체), title(String) 을 받습니다.

const NavigationTop = props => {
    const {colors} = useTheme();

    return (
        <View flexDirection="row" style={{height: 24, marginTop: 20, alignItems: 'center', justifyContent: 'center'}}>
            <View style={{position: 'absolute', left: 0}}>
                <TouchableOpacity onPress={() => {
                    props.navigation.goBack()
                }}>
                    <BackIcon width={24} height={24}/>
                </TouchableOpacity>
            </View>
            <Text style={{color: colors.mainTextColor, fontSize: 16, fontWeight: 'bold'}}>
                {props.title}
            </Text>
        </View>
    )
}

export default NavigationTop;