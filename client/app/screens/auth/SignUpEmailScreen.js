import {Image, Text, TouchableOpacity, View} from "react-native";
import ScreenContainer from "../../components/ScreenContainer";
import React from "react";
import SignUpEmailNavigator from "../../navigation/SignUpEmailNavigator";

const SignUpEmailScreen = ({navigation}) => {
    return (
        <ScreenContainer backgroundColor="#FCF6F5">
            <View flexDirection="row" style={{height: 24, marginTop: 20, alignItems: 'center', justifyContent : 'center'}}>
                <View style={{position: 'absolute', left : 0}}>
                    <TouchableOpacity onPress={() => {navigation.goBack()}}>
                        <Image source={require('../../assets/images/back-icon.png')} width={24} height={24}/>
                    </TouchableOpacity>
                </View>
                <Text style={{color: '#40516E', fontSize: 16, fontWeight: 'bold'}}>회원가입</Text>
            </View>
            {/* 회원가입 시 입력받는 tab*/}
            <SignUpEmailNavigator navigation={navigation}/>
        </ScreenContainer>
    )
}

export default SignUpEmailScreen;