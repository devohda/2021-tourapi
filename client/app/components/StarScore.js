import React from "react";
import {View, Text, StyleSheet} from "react-native";
import Star from "./Star";
import AppText from "./AppText";

const StarScore = (props) => {

    return (
        <View flexDirection="row" style={{alignItems : 'center', justifyContent : 'center'}}>
            {/* <View style={styles.score_container}>
                <AppText style={styles.score_text}>{props.score}</AppText>
            </View> */}
            <Star score={props.score} starSize={props.starSize} />
        </View>
    )
}
export default StarScore;