//전역 선언 방법 찾아보기
import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View, Dimensions, Text, onError, Alert} from 'react-native';
import {useTheme} from '@react-navigation/native';

import {useIsSignedIn} from '../../contexts/SignedInContextProvider';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenContainerView from '../../components/ScreenContainerView';
import AppText from '../../components/AppText';

import MainBoxIcon from '../../assets/images/login/main_box_icon.svg';
import AppleLogo from '../../assets/images/login/apple.svg';
import KakaotalkLogo from '../../assets/images/login/kakaotalk.svg';

import * as SecureStore from 'expo-secure-store';
import * as AppleAuthentication from 'expo-apple-authentication';
import {Cache} from 'react-native-cache';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useToken} from '../../contexts/TokenContextProvider';
import {useAlertDuplicated} from '../../contexts/LoginContextProvider';


const cache = new Cache({
    namespace: 'myapp',
    policy: {
        maxEntries: 50000
    },
    backend: AsyncStorage
});

const SignUpSocialScreen = ({appNavigation, navigation}) => {

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [isSignedIn, setIsSignedIn] = useIsSignedIn();
    const [token, setToken] = useToken();
    const [alertDuplicated, setAlertDuplicated] = useAlertDuplicated(false);

    const {colors} = useTheme();

    useEffect(() => {
        if(alertDuplicated){
            Alert.alert('다른 기기에서 로그인했습니다.');
        }
        setAlertDuplicated(false);
    },[]);

    const loginApple = async (user, email, nickname, token) => {
        try {
            let url = 'http://34.64.185.40/auth/loginApple';
            let options = {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({
                    userInfo: {
                        user,
                        email,
                        password: 'FJO4rI!@EK#WJaN!FbdK&%1&',
                        nickname,
                        token,
                    }
                })
            };

            await fetch(url, options)
                .then(res => res.json())
                .then(async response => {
                    if (response.code === 200) {
                        // 캐시 삭제하고 로그인 처리
                        if(user){
                            await cache.remove(user);
                        }
                        // 로그인
                        await SecureStore.setItemAsync('accessToken', response.accessToken);
                        setToken(response.accessToken);
                        setIsSignedIn(true);
                        return true;
                    } else {
                        Alert.alert('서버에 이상이 생겼습니다.');
                        return false;
                    }
                })
                .catch(error => console.log(error));
        } catch (e) {
            console.log(e.toString());
        }
    };

    return (
        <ScreenContainer backgroundColor={colors.backgroundColor}>
            <ScreenContainerView flex={1}>
                <View style={{height: 24, marginTop: 20, justifyContent: 'center'}}>
                    <TouchableOpacity onPress={async () => {
                        // await SecureStore.setItemAsync('isSignedIn', 'true');
                        setIsSignedIn(true);
                    }}>
                        <AppText style={{
                            color: colors.mainColor,
                            fontSize: 16,
                            fontWeight: '400',
                            alignSelf: 'flex-end',
                            display: 'none'
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
                        <TouchableOpacity style={{...styles.socialLoginBtn, backgroundColor: '#FEE500'}}>
                            <KakaotalkLogo width={23} height={23}/>
                            <AppText style={{...styles.loginText}}>카카오로 계속하기</AppText>
                        </TouchableOpacity>
                        <AppleAuthentication.AppleAuthenticationButton
                            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                            cornerRadius={10}
                            style={{width: '100%', height: 52, marginVertical: 8}}
                            onPress={
                                async () => {
                                    try {
                                        const available = await AppleAuthentication.isAvailableAsync();
                                        if(available){
                                            const credential = await AppleAuthentication.signInAsync({
                                                requestedScopes: [
                                                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                                                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                                                ],
                                            });

                                            const cachedName = await cache.get(credential.user);
                                            const detailsArePopulated = (!!credential.fullName && !!credential.email);

                                            // 항상 토큰을 같이 보내기.
                                            if (!detailsArePopulated && !cachedName) {
                                                await loginApple(credential.user, null, null, credential.identityToken);
                                            } else if (!detailsArePopulated && cachedName) {
                                                // 새로 계정 만드는 것.(중간에 튕겼을 때)
                                                await loginApple(credential.user, cachedName.email, cachedName.fullName, credential.identityToken);
                                            } else {
                                                // 새로 계정 만드는 것.
                                                // 캐시에 저장
                                                await cache.set(credential.user, {
                                                    fullName: credential.fullName,
                                                    email: credential.email
                                                });
                                                await loginApple(credential.user, credential.email, credential.fullName, credential.identityToken);
                                            }
                                        }
                                    } catch (error) {
                                        if (error.code === 'ERR_CANCELED') {
                                            onError('Continue was cancelled.');
                                        } else {
                                            onError(error.message);
                                        }
                                    }
                                }}
                        />
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 24, alignSelf: 'center', alignContent: 'stretch'}}>
                        <TouchableOpacity onPress={() => navigation.navigate('SignInEmail')} style={{marginRight: 29}}>
                            <AppText>이메일로 로그인</AppText>
                        </TouchableOpacity>
                        <AppText style={{marginRight: 29, color: colors.gray[8]}}>|</AppText>
                        <TouchableOpacity onPress={() => navigation.navigate('SignUpEmail')}>
                            <AppText>이메일 회원가입</AppText>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScreenContainerView>
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    loginText: {
        textAlign: 'center',
        padding: 14,
        fontSize: 16,
        fontWeight: '700',
    },
    socialLoginBtn: {
        flexDirection : 'row',
        height: 52,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width : '100%'
    }
});

export default SignUpSocialScreen;