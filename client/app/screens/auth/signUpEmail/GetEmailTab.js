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

const findSameEmail = async (email) => {
    try {
        const result = await fetch('http://localhost:3000/auth/sameEmail', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email})
        }).then(res => res.json())
            .then(response => {
                return response.isDuplicated === true;
            })
            .catch(error => console.log(error));

        return result
    } catch (err) {
        console.error(err);
    }
}

const GetEmailTab = ({navigation}) => {
    const [email, setEmail] = useState("");

    const checkIsValid = async () => {
        const emailRegExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
        if (!email.match(emailRegExp)) {
            alert('Error');
            return 0;
        }

        const isDuplicated = await findSameEmail(email)
        if (isDuplicated) {
            alert('이미 가입된 아이디입니다.');
            return 0;
        }

        navigation.navigate('passwordTab', {email})
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
            backgroundColor: email ? '#7B9ACC' : '#CDD0D7',
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
                    <View style={{...styles.progress, ...styles.progress_active}}></View>
                    <View style={{...styles.progress, ...styles.progress_inactive}}></View>
                    <View style={{...styles.progress, ...styles.progress_inactive}}></View>
                </ProgressBar>
                <Form>
                    <Text>
                        <View>
                            <Text style={styles.title_text}><Text
                                style={{fontWeight: 'bold'}}>이메일주소</Text><Text>를</Text></Text>
                            <Text style={styles.title_text}>입력해주세요</Text>
                        </View>
                    </Text>
                    <InputBox
                        placeholder="hiddenjewel@gmail.com"
                        autoCapitalize="none"
                        style={{marginTop: 40}}
                        onChangeText={(text) => setEmail(text)}
                    />
                </Form>
            </View>
            <View style={{marginBottom: 20}}>
                <TouchableOpacity
                    style={styles.continue_btn}
                    onPress={() => checkIsValid()}
                    disabled={email ? false : true}
                >
                    <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>계속하기</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

export default GetEmailTab;