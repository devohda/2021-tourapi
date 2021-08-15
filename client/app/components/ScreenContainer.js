import React from 'react'
import {SafeAreaView, View, Platform} from "react-native";

const ScreenContainer = props => {
    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: props.backgroundColor,
            width: "100%",
            paddingTop: Platform.OS === 'android' ? 25 : 0
        }}>
            <View flex={1} style={{marginHorizontal : 20}}>
                {props.children}
            </View>
        </SafeAreaView>
    )
}

export default ScreenContainer;