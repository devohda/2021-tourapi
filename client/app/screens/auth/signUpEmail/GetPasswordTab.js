import React, {useState, useContext} from "react";
import {StyleSheet, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, Image} from "react-native";
import ScreenContainer from '../../../components/ScreenContainer'
import styled from "styled-components/native";
import AppText from "../../../components/AppText";
import { useTheme } from '@react-navigation/native';
import CustomTextInput from "../../../components/CustomTextInput";

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
    const [password, setPassword] = useState("");
    const { colors } = useTheme();
    const [color, setColor] = useState(colors.gray[5]);
    const [isPasswordValid, setIsPasswordValid] = useState(false);

    const checkPassword = async (pw) => {
        var pattern1 = /[0-9]/; // 숫자
        var pattern2 = /[a-zA-Z]/; // 문자
        var pattern3 = /[~!@#$%^&*()_+|<>?:{}]/; // 특수문자

        if(!(pw.search(/\s/) != -1) &&
        ((pattern1.test(pw) && pattern2.test(pw)) ||
        (pattern1.test(pw) && pattern3.test(pw)) ||
        (pattern2.test(pw) && pattern3.test(pw))
        )) setIsPasswordValid(true)
        else setIsPasswordValid(false)
    }

    const checkIsValid = async () => {
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
            backgroundColor: colors.mainColor
        },
        progress_inactive: {
            width: 8,
            backgroundColor: colors.gray[5]
        },
        title_text: {
            fontSize: 30,
            color: colors.mainColor,
            lineHeight: 44,
        },
        continue_btn: {
            backgroundColor: password.length >= 8 && isPasswordValid ? colors.mainColor : colors.gray[6],
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
                    <AppText>
                        <View>
                            <AppText style={styles.title_text}><AppText
                                style={{fontWeight: 'bold'}}>비밀번호</AppText><AppText>를</AppText></AppText>
                            <AppText style={styles.title_text}>설정해주세요</AppText>
                        </View>
                    </AppText>
                    <CustomTextInput
                        placeholder="영문, 숫자, 특수문자 2가지 조합 8자리 이상"
                        autoCapitalize="none"
                        password={true}
                        secureTextEntry={true}
                        style={{
                            marginTop : 40,
                            fontSize: 16,
                            borderBottomWidth: 1,
                            borderBottomColor: color,
                            marginBottom: 6,
                            paddingBottom: 11
                        }}
                        onChangeText={async (text) => {
                            await checkPassword(text)
                            if(text.length < 8) {
                                setColor(colors.red[2]);
                            }

                            if(!isPasswordValid) {
                                setColor(colors.red[2]);
                            }
                            
                            if(text.length >= 8 && isPasswordValid) setColor(colors.gray[5])
                            if(text === '') setColor(colors.gray[5])
                            
                            setPassword(text);
                        }}
                    />
                    <AppText style={{color: colors.red[2],
                        display: password && password.length < 8 ? 'flex' : 'none'
                    }}>
                        비밀번호가 너무 짧아요. (8자 이상)
                    </AppText>
                    <AppText style={{color: colors.red[2],
                        display: password && !isPasswordValid ? 'flex' : 'none'
                    }}>
                        영문, 숫자, 특수문자를 2가지 이상 조합해주세요.
                    </AppText>
                </Form>
            </View>
            <View style={{marginBottom: 20}}>
                <TouchableOpacity
                    style={styles.continue_btn}
                    onPress={() => checkIsValid()}
                    disabled={password.length >= 8 && isPasswordValid ? false : true}
                >
                    <AppText style={{color: colors.defaultColor, fontSize: 16, fontWeight: 'bold'}}>계속하기</AppText>
                </TouchableOpacity>
            </View>
        </>
    )
}

export default GetPasswordTab;