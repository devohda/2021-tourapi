import React from "react";
import {Text} from "react-native";

const AppText = (props) => {
    return (
        <Text {...props}
              style={{
                ...props.style,
                fontFamily: 'Pretendard'
        }}>{props.children}</Text>
    )
}

export default AppText;