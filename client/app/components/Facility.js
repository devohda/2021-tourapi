import React from "react";
import {View, Text} from "react-native";
import { useTheme } from "@react-navigation/native";
import AppText from "./AppText";

const Facility = (props) => {
    const { colors } = useTheme();
    return (
        <View style={{
            borderColor: colors.defaultColor,
            backgroundColor: colors.defaultColor,
            borderStyle: 'solid',
            borderWidth: 1,
            borderRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 4,
            paddingHorizontal: 10,
            marginRight: 10,
        }}>
            <AppText style={{fontSize: 14}}>{props.name}</AppText>
        </View>
    )
};

export default Facility;