//전역 선언 방법 찾아보기
import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View, Dimensions, Text} from 'react-native';
import {useTheme} from '@react-navigation/native';

import {useIsSignedIn} from "../../contexts/SignedInContextProvider";
import ScreenContainer from "../../components/ScreenContainer";
import ScreenContainerView from "../../components/ScreenContainerView";
import AppText from "../../components/AppText";

import MainBoxIcon from '../../assets/images/login/main_box_icon.svg';
import AppleLogo from '../../assets/images/login/apple.svg';
import KakaotalkLogo from '../../assets/images/login/kakaotalk.svg'

const SignUpSocialScreen = ({appNavigation, navigation}) => {

    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [isSignedIn, setIsSignedIn] = useIsSignedIn()

    const { colors } = useTheme()

    return (
        <ScreenContainer backgroundColor={colors.backgroundColor}>
            <ScreenContainerView flex={1}>
                <View style={{height: 24, marginTop: 20, justifyContent: 'center'}}>
                    <TouchableOpacity onPress={() => setIsSignedIn(true)}>
                        <AppText style={{
                            color: colors.mainColor,
                            fontSize: 16,
                            fontWeight: '400',
                            alignSelf: 'flex-end'
                        }}>둘러보기</AppText>
                    </TouchableOpacity>
                </View>
                <View flex={1} style={{alignItems: 'center', justifyContent: 'flex-end'}}>
                    <MainBoxIcon/>
                    <View style={{marginTop: 35.08, alignItems: 'center'}}>
                        <AppText style={{fontSize: 28, color: colors.mainColor}}>나만의 </AppText>
                        <AppText style={{fontSize: 28, color: colors.mainColor}}>
                            <AppText style={{fontWeight: '700'}}>공간 보관함</AppText>을
                        </AppText>
                        <AppText style={{fontSize: 28, color: colors.mainColor}}>채워볼까요?</AppText>
                    </View>
                </View>
                <View flex={1} style={{marginTop: 50}}>
                    <View style={{alignItems: 'center'}}>
                        <TouchableOpacity
                            style={{
                                backgroundColor: colors.yellow[8],
                                ...styles.socialLoginBtn
                            }}
                            onPress={() => signIn(email, password, navigation, setIsSignedIn)}
                        >
                            <View flexDirection="row" style={{alignItems : 'center'}}>
                                <KakaotalkLogo />
                                <Text style={{...styles.loginText, color: colors.defaultDarkColor}}>카카오로 계속하기</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                backgroundColor: colors.defaultDarkColor,
                                ...styles.socialLoginBtn
                            }}
                            onPress={() => signIn(email, password, navigation, setIsSignedIn)}
                        >
                            <View flexDirection="row" style={{alignItems: 'center'}}>
                                <AppleLogo/>
                                <AppText style={{...styles.loginText, color: colors.defaultColor}}>Apple로 계속하기</AppText>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 24, alignSelf: 'center', alignContent: 'stretch'}}>
                        <TouchableOpacity onPress={() => navigation.navigate('SignInEmail')} style={{marginRight: 29}}>
                            <Text>이메일로 로그인</Text>
                        </TouchableOpacity>
                        <Text style={{marginRight: 29, color: colors.gray[8]}}>|</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('SignUpEmail')}>
                            <AppText>이메일 회원가입</AppText>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScreenContainerView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    loginText: {
        textAlign: 'center',
        padding: 14,
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1
    },
    socialLoginBtn: {
        height: 52,
        borderRadius: 10,
        marginVertical: 8,
        paddingLeft: 20,
        paddingRight: 45,
        width: '100%',
        // maxWidth: 650
    }
});

export default SignUpSocialScreen;