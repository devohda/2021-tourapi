import {Image, Text, TouchableOpacity, View} from "react-native";
import ScreenContainer from "../../components/ScreenContainer";
import React from "react";
import SignUpEmailNavigator from "../../navigation/SignUpEmailNavigator";
import NavigationTop from '../../components/NavigationTop'

const SignUpEmailScreen = ({navigation}) => {
    return (
        <ScreenContainer backgroundColor="#FCF6F5">
            <NavigationTop navigation={navigation} title="회원가입"/>
            <SignUpEmailNavigator navigation={navigation}/>
        </ScreenContainer>
    )
}

export default SignUpEmailScreen;