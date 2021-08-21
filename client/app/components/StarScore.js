import React from "react";
import {View, Text, StyleSheet} from "react-native";
import Star from "./Star";

const StarScore = (props) => {

    return (
        <View flexDirection="row" style={{alignItems : 'center', justifyContent : 'center'}}>
            {/* <View style={styles.score_container}>
                <Text style={styles.score_text}>{props.score}</Text>
            </View> */}
            <Star score={props.score} starSize={props.starSize} />
        </View>
    )
}
// const styles = StyleSheet.create({
//     score_container: {
//         width: 25,
//         height: 15,
//         backgroundColor: 'black',
//         borderRadius: 70,
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginRight : 3
//     },
//     score_text: {
//         color: 'white',
//         textAlign: 'center',
//         fontSize: 10,
//         fontWeight: 'bold'
//     }
// })
export default StarScore;