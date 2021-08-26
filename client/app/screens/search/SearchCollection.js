import React from "react";
import {Image, Text, View} from "react-native";
import {useTheme} from "@react-navigation/native";

const SearchCollection = (props) => {
    const {colors} = useTheme();
    const PlaceContainer = (props) => {
        return (
            <View flexDirection="row" style={{marginVertical: 8}}>
                <Image source={require('../../assets/images/mountain.jpeg')}
                       style={{borderRadius: 10, width: 72, height: 72}}/>
            </View>
        )
    }

    return (
        <View>
            <PlaceContainer />
        </View>
    )
}

export default SearchCollection;