import React from 'react'
import {SafeAreaView, View, Platform, KeyboardAvoidingView} from "react-native";

const ScreenContainer = props => {
    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: props.backgroundColor,
            width: "100%",
            paddingTop: Platform.OS === 'android' ? 25 : 0
        }}>
            <KeyboardAvoidingView flex={1}
                                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                                  keyboardVerticalOffset={+84}
                                  style={{marginHorizontal: 20}}>
                {props.children}
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default ScreenContainer;