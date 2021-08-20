import {Image, KeyboardAvoidingView, Platform, Text, TouchableOpacity, View} from "react-native";
import ScreenContainer from "../../components/ScreenContainer";
import React from "react";
import SignUpEmailNavigator from "../../navigation/SignUpEmailNavigator";
import NavigationTop from '../../components/NavigationTop';
import {useTheme} from '@react-navigation/native';
import ScreenContainerView from "../../components/ScreenContainerView";

const SignUpEmailScreen = ({navigation}) => {
    const {colors} = useTheme();

    return (
        <ScreenContainer backgroundColor={colors.background}>
            <KeyboardAvoidingView flex={1} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <ScreenContainerView>
                    <NavigationTop navigation={navigation} title="회원가입"/>
                    <SignUpEmailNavigator navigation={navigation}/>
                </ScreenContainerView>
            </KeyboardAvoidingView>
        </ScreenContainer>
    )
}

export default SignUpEmailScreen;