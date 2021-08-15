import React from 'react'
import {SafeAreaView, View} from "react-native";

const ScreenContainer = props => {
    return (
        <SafeAreaView style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: props.backgroundColor,
            width: "100%",
            paddingHorizontal : 20,
        }}>
            <View style={{width: "100%", height: "100%"}}>
                {props.children}
            </View>
        </SafeAreaView>
    )
}

export default ScreenContainer;