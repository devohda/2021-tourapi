import React from "react";
import {View, Text, StyleSheet} from "react-native";
import { useTheme } from '@react-navigation/native';
import FIcon from "react-native-vector-icons/FontAwesome";

const Star = (props) => {
    //props score 에 따라서 별 개수 다르게 렌더링하도록 만들어야 함~!

    const score = props.score;
    const decimalFraction = score - Math.floor(score);

    const star = []
    for (let i = 1; i <= 5; i++) {
        if (score >= i) {
            star.push('star')
        } else if (score.toFixed(0) == i) {
            if (decimalFraction >= 0.5) {
                star.push('star-half-o');
            } else {
                star.push('star-o')
            }
        } else {
            star.push('star-o')
        }
    }


    return (
        <View style={{flexDirection: 'row', justifyContent : 'center', alignItems : 'center'}}>
            {star.map((iconName, idx) =>
                <View key={idx} style={{marginHorizontal : 2}}>
                    <FIcon name={iconName} size={props.starSize} color={iconName == 'star-o' ? '#EAE0E0' :'#FFC978'}></FIcon>
                </View>)}
        </View>
    )
}

export default Star;