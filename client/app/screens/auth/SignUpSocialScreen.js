//전역 선언 방법 찾아보기
import React, {useContext, useState} from 'react';
import {Button, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import { useTheme } from '@react-navigation/native';

import {useIsSignedIn} from "../../contexts/SignedInContextProvider";
import ScreenContainer from "../../components/ScreenContainer";

const signIn = (email, password, navigation, setIsSignedIn) => {

}


const SignUpSocialScreen = ({appNavigation, navigation}) => {

    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [isSignedIn, setIsSignedIn] = useIsSignedIn()

    const {colors} = useTheme()

    return (
        <ScreenContainer backgroundColor={colors.backgroundColor}>
            <View style={{height : 24, marginTop : 20, justifyContent : 'center'}}>
                <TouchableOpacity onPress={() => setIsSignedIn(true)}>
                    <Text style={{color: colors.textNotClicked, fontSize: 16, alignSelf: 'flex-end'}}>둘러보기</Text>
                </TouchableOpacity>
            </View>
            <View style={{marginTop : 86}}>
                <View style={{alignContent : "flex-start"}}>
                    <Text style={{fontSize: 28, color : colors.mainColor}}>나만의 </Text>
                    <Text style={{fontSize: 28, color : colors.mainColor}}><Text style={{fontWeight: "bold"}}>공간 보관함</Text><Text>을</Text></Text>
                    <Text style={{fontSize: 28, color : colors.mainColor}}>채워볼까요?</Text>
                </View>
                <View style={{marginTop : 200}}>
                    <TouchableOpacity
                        style={{backgroundColor: '#FEE500', height: 52, borderRadius: 10, marginVertical : 8, width : '100%'}}
                        onPress={() => signIn(email, password, navigation, setIsSignedIn)}
                    >
                        <Text style={{...styles.loginText, color : '#000'}}>카카오로 계속하기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{backgroundColor: '#000', height: 52, borderRadius: 10, marginVertical : 8}}
                        onPress={() => signIn(email, password, navigation, setIsSignedIn)}
                    >
                        <Text style={{...styles.loginText, color : colors.defaultColor}}>Apple로 계속하기</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row', marginTop: 24, alignSelf: 'center', alignContent : 'stretch'}}>
                    <TouchableOpacity onPress={() => navigation.navigate('SignInEmail')} style={{marginRight: 29}}>
                        <Text>이메일로 로그인</Text>
                    </TouchableOpacity>
                    <Text style={{marginRight: 29, color : '#929292'}}>|</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SignUpEmail')}>
                        <Text>이메일 회원가입</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    loginText: {
        textAlign: 'center',
        padding: 14,
        fontSize: 16,
        fontWeight: 'bold'
    }
});

export default SignUpSocialScreen;