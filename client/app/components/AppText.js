import React from "react";
import {Text} from "react-native";

const AppText = (props) => {

    let fontFamily;

    const fontWeight = props.style && props.style.fontWeight ? props.style.fontWeight : '400';
    switch (fontWeight) {
        case '100' :
            fontFamily = 'Pretendard-Thin';
            break;
        case '200' :
            fontFamily = 'Pretendard-ExtraLight';
            break;
        case '300' :
            fontFamily = 'Pretendard-Light';
            break;
        case '400' :
        case 'normal':
            fontFamily = 'Pretendard-Regular';
            break;
        case '500' :
            fontFamily = 'Pretendard-Medium';
            break;
        case '600' :
            fontFamily = 'Pretendard-SemiBold';
            break;
        case '700' :
        case 'bold':
            fontFamily = 'Pretendard-Bold';
            break;
        case '800' :
            fontFamily = 'Pretendard-ExtraBold';
            break;
        case '900' :
            fontFamily = 'Pretendard-Black';
            break;
        default:
            fontFamily = 'Pretendard-Regular';

    }

    return (
        <Text {...props}
              style={{
                  ...props.style,
                  fontFamily: fontFamily,
              }} numberOfLines={props.numberOfLines}>{props.children}
        </Text>
    )
}

export default AppText;