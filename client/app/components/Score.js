import React from "react";
import {View, Text} from "react-native";

const Score = (props) => {
    return (
        // <View flexDirection="row" style={{marginVertical: 8, alignItems: 'center'}}>
        <View style={{marginVertical: 8, alignItems: 'center'}}>
            <View width={70}>
                <Text style={{
                    fontWeight: 'bold',
                    fontSize: props.fontSize,
                    color: props.color,
                    textAlign: props.textAlign,
                    marginBottom: props.marginBottom,
                    color: props.textColor,
                }}>{props.name}</Text>
            </View>
            {props.children}
        </View>
    )
}

export default Score;