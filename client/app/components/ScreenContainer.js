import React from 'react'
import {SafeAreaView, View} from "react-native";

const ScreenContainer = props => {
    return (
        <SafeAreaView style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#FCF6F5",
            width: "100%"
        }}>
            <View style={{width: "90%", height: "100%"}}>
                {props.children}
            </View>
        </SafeAreaView>
    )
}

export default ScreenContainer;