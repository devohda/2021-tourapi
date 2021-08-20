import React, {useState, useContext} from "react";
import {StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, Image} from "react-native";
import ScreenContainer from '../../../components/ScreenContainer'
import styled from "styled-components/native";
import { useTheme } from '@react-navigation/native';

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
        let url = 'http://192.168.0.11:3000/auth/makeAccount';
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
        const result = await fetch(url, options)
            .then(res => res.json())
            .then(response => {
                return response.result === true;
            })
            .catch(error => console.log(error));

        return result;
    } catch (e) {
        console.log(e.toString())
    }
}

const GetNicknameTab = ({route, authNavigation}) => {
    const {email, password} = route.params;
    const [isValid, setIsValid] = useState(false);
    const [nickname, setNickname] = useState("");
    const { colors } = useTheme();

    const checkIsValid = async () => {
        const nicknameRegExp = /^([A-Z]|[a-z]|[0-9]|[가-힣]){2,12}$/g;
        if (!nickname.match(nicknameRegExp)) {
            alert('Error');
            setIsValid(false)
            return 0;
        }

        const result = await signUp(email, password, nickname)
        if (result) {
            authNavigation.navigate('SignInEmail');
        }
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
            backgroundColor: colors.mainColor
        },
        progress_inactive: {
            width: 8,
            backgroundColor: '#CDD0D7'
        },
        title_text: {
            fontSize: 30,
            lineHeight: 44,
        },
        continue_btn: {
            backgroundColor: nickname ? colors.mainColor : '#CDD0D7',
            height: 48,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center'
        }
    })

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
                        <Text style={[styles.title_text, {color: colors.notClicked}]}><Text
                            style={{fontWeight: 'bold'}}>닉네임</Text><Text>을</Text></Text>
                        <Text style={[styles.title_text, {color: colors.notClicked}]}>설정해주세요</Text>
                    </View>
                    <InputBox
                        placeholder="한글, 영문, 숫자 혼용 가능(영문 기준 12자 이내)"
                        autoCapitalize="none"
                        style={{marginTop: 40}}
                        onChangeText={(text) => setNickname(text)}
                    />
                </Form>
            </View>
            <View style={{marginBottom: 20}}>
                <TouchableOpacity
                    style={styles.continue_btn}
                    onPress={() => checkIsValid()}
                    disabled={nickname ? false : true}
                >
                    <Text style={{color: colors.defaultColor, fontSize: 16, fontWeight: 'bold'}}>가입완료</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

export default GetNicknameTab;