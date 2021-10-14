import React from 'react';
import {View} from "react-native";
import {useTheme} from "@react-navigation/native";

const ScreenDivideLine = (props) => {
    const {colors} = useTheme();

    return (
        <View style={[{
            height: 8,
            backgroundColor: colors.red_gray[6],
        }, props.style && props.style.marginVertical ? {marginVertical: props.style.marginVertical} : {marginVertical: 20}]}></View>
    )
}

export default ScreenDivideLine;