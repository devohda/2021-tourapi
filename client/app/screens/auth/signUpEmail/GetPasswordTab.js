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


const GetPasswordTab = ({route, navigation}) => {
    const {email} = route.params
    const [password, setPassword] = useState("")

    const checkIsValid = async () => {
        if (password.length < 8) {
            alert('비밀번호가 짧습니다.');
            return 0;
        }

        navigation.navigate('nicknameTab', {email, password})
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
            backgroundColor: password ? '#7B9ACC' : '#CDD0D7',
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
                    <View style={{...styles.progress, ...styles.progress_active}}></View>
                    <View style={{...styles.progress, ...styles.progress_inactive}}></View>
                </ProgressBar>
                <Form>
                    <Text>
                        <View>
                            <Text style={styles.title_text}><Text
                                style={{fontWeight: 'bold'}}>비밀번호</Text><Text>를</Text></Text>
                            <Text style={styles.title_text}>설정해주세요</Text>
                        </View>
                    </Text>
                    <InputBox
                        placeholder="한글, 영문, 숫자 혼용 가능(영문 기준 12자 이내)"
                        autoCapitalize="none"
                        password={true}
                        secureTextEntry={true}
                        style={{marginTop: 40}}
                        onChangeText={(text) => setPassword(text)}
                    />
                </Form>
            </View>
            <View style={{marginBottom: 20}}>
                <TouchableOpacity
                    style={styles.continue_btn}
                    onPress={() => checkIsValid()}
                    disabled={password ? false : true}
                >
                    <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>계속하기</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

export default GetPasswordTab;