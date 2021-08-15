//전역 선언 방법 찾아보기
import React, {useContext, useState} from 'react';
import {Button, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';

import * as firebase from "firebase";
import {useIsSignedIn} from "../../components/SignedInContextProvider";
import ScreenContainer from "../../components/ScreenContainer";

// firebase 연동
const firebaseConfig = {
    apiKey: "AIzaSyAS0DrsLq7TOEIORPQHjGmOpoRqhAskA4k",
    authDomain: "tourapi-321202.firebaseapp.com",
    projectId: "tourapi-321202",
    storageBucket: "tourapi-321202.appspot.com",
    messagingSenderId: "481459429337",
    appId: "1:481459429337:web:4459f5eabdbc43b78a83c8",
    measurementId: "G-06PY1R2CYG"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const signIn = (email, password, navigation, setIsSignedIn) => {
    try {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((user) => {
                setIsSignedIn(true)
            })
    } catch (e) {
        alert('로그인 실패~')
    }
}


const SignInEmailScreen = ({appNavigation, navigation}) => {

    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [isSignedIn, setIsSignedIn] = useIsSignedIn()

    return (
        <ScreenContainer backgroundColor="#FCF6F5">
            <View style={styles.button}>
                <TouchableOpacity onPress={() => {
                    setIsSignedIn(true)
                }}>
                    <Text style={{color: '#40516E', fontSize: 16, alignSelf: 'center'}}>둘러보기</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <Text style={{fontSize: 28, color: '#40516E'}}>
                    <Text><Text>나만의 </Text><Text style={{fontWeight: "bold"}}>공간 보관함</Text><Text>을</Text></Text>
                    <Text>{"\n"}채워볼까요?</Text>
                </Text>
                <TextInput style={{
                    marginTop: 38,
                    fontSize: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: '#C5C5C5',
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
                    borderBottomColor: '#C5C5C5',
                    marginBottom: 38,
                    paddingBottom: 11
                }} placeholder="비밀번호를 입력해주세요" secureTextEntry={true}
                           onChangeText={(text) => setPassword(text)}
                           autoCapitalize="none"
                />
                <TouchableOpacity
                    style={{
                        backgroundColor: '#BDC2CA',
                        height: 52,
                        borderRadius: 10,
                        alignItems: 'center',
                        justifyContent: "center"
                    }}
                    onPress={() => signIn(email, password, navigation, setIsSignedIn)}
                >
                    <Text style={styles.loginText}>로그인</Text>
                </TouchableOpacity>
                <View style={{flexDirection: 'row', marginTop: 24, alignSelf: 'center'}}>
                    <TouchableOpacity onPress={() => navigation.navigate('SignUpEmail')} style={{marginRight: 29}}>
                        <Text>회원가입</Text>
                    </TouchableOpacity>
                    <Text style={{marginRight: 29, color : '#929292'}}>|</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('FindPassword')}>
                        <Text>비밀번호 재설정</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    button: {
        left: 312,
        width: 67,
        height: 24,
        fontWeight: 'normal',
        top: 44,
    },
    container: {
        margin: 10,
        fontSize: 28,
        fontWeight: "400",
        top: 118,
        left: 16,
        width: 343,
    },
    loginText: {
        textAlign: 'center',
        padding: 14,
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold'
    }
});

export default SignInEmailScreen;