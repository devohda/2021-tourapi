import React from 'react';
import {Image, Text, TouchableOpacity, View} from "react-native";
import { useTheme } from '@react-navigation/native';

const NavigationTop = props => {
    const { colors } = useTheme();

    return (
        <View flexDirection="row" style={{height: 24, marginTop: 20, alignItems: 'center', justifyContent : 'center'}}>
            <View style={{position: 'absolute', left : 0}}>
                <TouchableOpacity onPress={() => {props.navigation.goBack()}}>
                    <Image source={require('../assets/images/back-icon.png')} width={24} height={24}/>
                </TouchableOpacity>
            </View>
            <Text style={{color: colors.mainColor, fontSize: 16, fontWeight: 'bold'}}>{props.title}</Text>
        </View>
    )
}

export default NavigationTop;