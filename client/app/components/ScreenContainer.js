import React from 'react'
import {SafeAreaView} from "react-native";

const ScreenContainer = props => {
    return (
        <SafeAreaView style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff"
        }}>
            {props.children}
        </SafeAreaView>
    )
}

export default ScreenContainer;