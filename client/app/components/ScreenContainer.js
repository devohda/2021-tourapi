import React from 'react'
import {SafeAreaView, Platform} from "react-native";

const ScreenContainer = props => {
    return (
        <SafeAreaView style={[{
            flex: 1,
            backgroundColor: props.backgroundColor,
            ...props.style,
        }, Platform.OS === 'android' ? {paddingTop: 25} : {paddingTop: 0}]}>
            {props.children}
        </SafeAreaView>
    )
}

export default ScreenContainer;