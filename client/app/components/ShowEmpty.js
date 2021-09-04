import React from "react";
import {View} from "react-native";
import AppText from "./AppText";
import { useTheme } from "@react-navigation/native";

const ShowEmpty = (props) => {
    const { colors } = useTheme();

    return (
        <View style={{justifyContent: 'center', alignItems: 'center', marginVertical: '35%', ...props.style}}>
            <AppText style={{fontSize: 16, color: colors.gray[5], fontWeight: '700', textAlign: 'center'}}>검색결과가 없습니다</AppText>
        </View>
    )
}

export default ShowEmpty;