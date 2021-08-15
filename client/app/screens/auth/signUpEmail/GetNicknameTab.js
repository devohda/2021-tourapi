import React, {useState} from "react";
import {StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, Image} from "react-native";
import ScreenContainer from '../../../components/ScreenContainer'
import styled from "styled-components/native";

const ProgressBar = styled(View)`
  flexDirection: row;
  width: 100%;
  justify-content: flex-end;
  height: 8px;
`

const Form = styled(View)`
  margin-top: 63px;
`

const InputBox = styled(TextInput)`
  fontSize: 16px;
  borderBottomWidth: 1px;
  borderBottomColor: #C5C5C5;
  marginBottom: 27px;
  paddingBottom: 11px;
`

const signUp = async (user_email, user_password, user_nickname) => {
    try {
        let url = 'http://localhost:3000/auth/makeAccount';
        let options = {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify({
                userInfo: {
                    user_email,
                    user_password,
                    user_nickname
                }
            })
        };
        let response = await fetch(url, options);
        let responseOK = response && response.ok;
        if (responseOK) {
            let data = await response.json();
            alert(data)
        }
    } catch (e) {
        console.log(e.toString())
    }
}

const GetNicknameTab = ({navigation, authNavigation}) => {
    const [isValid, setIsValid] = useState(false)
    return (
        <>
            <View flex={1}>
                <ProgressBar>
                    <View style={{...styles.progress, ...styles.progress_inactive}}></View>
                    <View style={{...styles.progress, ...styles.progress_inactive}}></View>
                    <View style={{...styles.progress, ...styles.progress_active}}></View>
                </ProgressBar>
                <Form>
                    <View>
                        <Text style={styles.title_text}><Text
                            style={{fontWeight: 'bold'}}>닉네임</Text><Text>을</Text></Text>
                        <Text style={styles.title_text}>설정해주세요</Text>
                    </View>
                    <InputBox
                        placeholder="hiddenjewel@gmail.com"
                        autoCapitalize="none"
                        style={{marginTop: 40}}
                    />
                </Form>
            </View>
            <View style={{marginBottom: 20}}>
                <TouchableOpacity
                    style={styles.continue_btn}
                    onPress={() => authNavigation.navigate('SignInEmail')}
                    disabled={email.length === 0 ? true : false}
                >
                    <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>가입완료</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    progress: {
        height: 8,
        borderRadius: 6,
        top: 0,
        marginLeft: 12,
    },
    progress_active: {
        width: 28,
        backgroundColor: '#7B9ACC'
    },
    progress_inactive: {
        width: 8,
        backgroundColor: '#CDD0D7'
    },
    title_text: {
        fontSize: 30,
        color: '#40516E',
        lineHeight: 44,
    },
    continue_btn: {
        backgroundColor: '#CDD0D7',
        height: 48,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default GetNicknameTab;