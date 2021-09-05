import React from 'react'
import {SafeAreaView, View, Platform, KeyboardAvoidingView} from "react-native";

const ScreenContainer = props => {
    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: props.backgroundColor,
            paddingTop: Platform.OS === 'android' ? 25 : 0
        }}>
            {props.children}
        </SafeAreaView>
    )
}

export default ScreenContainer;