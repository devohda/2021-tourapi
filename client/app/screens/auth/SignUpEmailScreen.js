import {Image, Text, TouchableOpacity, View} from "react-native";
import ScreenContainer from "../../components/ScreenContainer";
import React from "react";
import SignUpEmailNavigator from "../../navigation/SignUpEmailNavigator";
import NavigationTop from '../../components/NavigationTop';
import { useTheme } from '@react-navigation/native';

const SignUpEmailScreen = ({navigation}) => {
    const { colors } = useTheme();
    
    return (
        <ScreenContainer backgroundColor={colors.backgroundColor}>
            <NavigationTop navigation={navigation} title="회원가입"/>
            <SignUpEmailNavigator navigation={navigation}/>
        </ScreenContainer>
    )
}

export default SignUpEmailScreen;