import {Image, KeyboardAvoidingView, Platform, Text, TouchableOpacity, View} from "react-native";
import ScreenContainer from "../../components/ScreenContainer";
import React from "react";
import ChangePasswordNavigator from "../../navigation/ChangePasswordNavigator";
import NavigationTop from '../../components/NavigationTop';
import {useTheme} from '@react-navigation/native';
import ScreenContainerView from "../../components/ScreenContainerView";

const SignUpEmailScreen = ({navigation}) => {
    const {colors} = useTheme();

    return (
        <ScreenContainer backgroundColor={colors.backgroundColor}>
            <NavigationTop navigation={navigation} title="비밀번호 재설정"/>
            <KeyboardAvoidingView flex={1} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <ScreenContainerView flex={1}>
                    <ChangePasswordNavigator navigation={navigation}/>
                </ScreenContainerView>
            </KeyboardAvoidingView>
        </ScreenContainer>
    )
}

export default SignUpEmailScreen;