//전역 선언 방법 찾아보기
import React, {useContext, useState} from 'react';
import {Button, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {useTheme} from '@react-navigation/native';

import {useIsSignedIn} from "../../contexts/SignedInContextProvider";
import ScreenContainer from "../../components/ScreenContainer";
import {useIsUserData} from "../../contexts/UserDataContextProvider";
import ScreenContainerView from "../../components/ScreenContainerView";
import NavigationTop from "../../components/NavigationTop";
import AppText from "../../components/AppText";


const SignInEmailScreen = ({appNavigation, navigation}) => {

    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [isSignedIn, setIsSignedIn] = useIsSignedIn()
    const [userData, setUserData] = useIsUserData()

    const { colors } = useTheme();

    const styles = StyleSheet.create({
        button: {
            left: 312,
            width: 67,
            height: 24,
            fontWeight: 'normal',
            top: 44,
        },
        loginText: {
            color: colors.defaultColor,
            textAlign: 'center',
            padding: 14,
            fontSize: 16,
            fontWeight: 'bold'
        }
    });

    const signIn = async () => {
        try {
            let url = 'http://34.146.140.88/auth/loginEmail';
            let options = {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({
                    user: {
                        email, password
                    }
                })
            };
            const {state, userData: user} = await fetch(url, options)
                .then(res => res.json())
                .catch(error => console.log(error));

            switch (state) {
                case 'NOT EXIST' :
                    alert('가입되지 않은 정보입니다.')
                    break;
                case 'NOT MATCHED' :
                    alert('비밀번호를 다시 확인해주세요.')
                    break;
                case 'SUCCESS' :
                    setUserData(user);
                    setIsSignedIn(true);
                    break;
            }
        } catch (e) {
            console.log(e.toString())
        }
    }

    return (
        <ScreenContainer backgroundColor={colors.backgroundColor}>
            <NavigationTop navigation={navigation}/>
            <ScreenContainerView>
                <View style={{marginTop: 60}}>
                    <View>
                        <AppText style={{fontSize: 28, color: colors.mainColor}}>나만의 <AppText style={{fontSize: 28, color: colors.mainColor,fontWeight: "bold"}}>공간 보관함</AppText>을</AppText>
                        <AppText style={{fontSize: 28, color: colors.mainColor}}>채워볼까요?</AppText>
                    </View>
                    <TextInput style={{
                        marginTop: 38,
                        fontSize: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.gray[5],
                        marginBottom: 27,
                        paddingBottom: 11
                    }}
                               placeholder="이메일 주소를 입력해주세요"
                               onChangeText={(text) => setEmail(text)}
                               autoCapitalize="none"
                    />
                    <TextInput style={{
                        fontSize: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.gray[5],
                        marginBottom: 38,
                        paddingBottom: 11
                    }} placeholder="비밀번호를 입력해주세요" secureTextEntry={true}
                               onChangeText={(text) => setPassword(text)}
                               autoCapitalize="none"
                    />
                    <TouchableOpacity
                        style={{
                            backgroundColor: colors.gray[6],
                            height: 52,
                            borderRadius: 10,
                            alignItems: 'center',
                            justifyContent: "center"
                        }}
                        disabled={email && password ? false : true}
                        onPress={() => signIn()}
                    >
                        <AppText style={styles.loginText}>로그인</AppText>
                    </TouchableOpacity>
                    <View style={{flexDirection: 'row', marginTop: 24, alignSelf: 'center'}}>
                        <TouchableOpacity onPress={() => navigation.navigate('SignUpEmail')} style={{marginRight: 29}}>
                            <AppText>회원가입</AppText>
                        </TouchableOpacity>
                        <AppText style={{marginRight: 29, color: colors.gray[8]}}>|</AppText>
                        <TouchableOpacity onPress={() => navigation.navigate('FindPassword')}>
                            <AppText>비밀번호 재설정</AppText>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScreenContainerView>
        </ScreenContainer>
    );
}

export default SignInEmailScreen;