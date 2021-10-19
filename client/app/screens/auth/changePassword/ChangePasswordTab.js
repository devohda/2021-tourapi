import React, {useState} from 'react';
import {StyleSheet, TextInput, TouchableOpacity, View, Pressable} from "react-native";
import { useTheme } from '@react-navigation/native';
import { Icon } from "react-native-elements";
import * as SMS from 'expo-sms';
import PhoneInput from 'react-native-phone-number-input';

import ScreenContainer from '../../../components/ScreenContainer';
import AppText from '../../../components/AppText';
import styled from "styled-components/native";
import CustomTextInput from "../../../components/CustomTextInput";

const Form = styled(View)`
  margin-top: 63px;
`;

const ChangePasswordTab = ({route, authNavigation}) => {
    const {email} = route.params;
    const [password, setPassword] = useState("");
    const { colors } = useTheme();
    const [color, setColor] = useState(colors.gray[5]);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [showPassword, setShowPassword] = useState(true);

    const checkPassword = async (pw) => {
        var pattern1 = /[0-9]/; // 숫자
        var pattern2 = /[a-zA-Z]/; // 문자
        var pattern3 = /[~!@#$%^&*()_+|<>?:{}]/; // 특수문자

        if(!pattern1.test(pw) || !pattern2.test(pw) || !pattern3.test(pw)) {
            setIsPasswordValid(false);
        }
        else {
            setIsPasswordValid(true);
        }
    };
    
    
    const changePw = async (e, pw) => {
        try {
            let url = 'http://34.64.185.40/auth/password';
            let options = {
                method: 'PUT',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({
                    email: e,
                    password: pw,
                })
            };
            const result = await fetch(url, options)
                .then(res => res.json())
                .then(response => {
                    console.log(response)
                    console.log(e); console.log(pw);
                    return response.code === 200;
                })
                .catch(error => console.log(error));

            return result;
        } catch (e) {
            console.log(e.toString());
        }
    };

    const checkIsValid = async () => {
        const result = await changePw(email, password);
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
            backgroundColor: colors.gray[5]
        },
        title_text: {
            fontSize: 16,
            color: colors.mainColor,
            lineHeight: 23.68
        },
        continue_btn: {
            backgroundColor: password.length >= 8 && isPasswordValid ? colors.mainColor : colors.gray[6],
            height: 48,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center'
        },
        password_box: {
            borderBottomWidth: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 11,
            marginTop: 16,
            marginBottom: 6
        },
    })

    return (
        <>
            <View flex={1} style={{marginTop: 10}}>
                <Form>
                    <AppText style={styles.title_text}><AppText
                        style={{fontWeight: 'bold'}}>비밀번호</AppText>
                        <AppText>를 입력해주세요</AppText>
                    </AppText>
                    <View flexDirection="row" style={{...styles.password_box, borderColor: color}}>
                        <CustomTextInput
                            placeholder="영문, 숫자, 특수문자 2가지 조합 8자리 이상"
                            autoCapitalize="none"
                            password={true}
                            secureTextEntry={showPassword}
                            style={{
                                fontSize: 16,
                                color : colors.mainColor
                            }}
                            flex={1}
                            onChangeText={async (text) => {
                                await checkPassword(text);

                                var pattern1 = /[0-9]/; // 숫자
                                var pattern2 = /[a-zA-Z]/; // 문자
                                var pattern3 = /[~!@#$%^&*()_+|<>?:{}]/; // 특수문자
                        
                                if(pattern1.test(text) && pattern2.test(text)) {
                                    setColor(colors.gray[5]);
                                    setIsPasswordValid(true);
                                    if(text.length >= 8) {
                                        setColor(colors.gray[5]);
                                    } else setColor(colors.red[2]);

                                } else if(pattern1.test(text) && pattern3.test(text)) {
                                    setColor(colors.gray[5]);
                                    setIsPasswordValid(true);
                                    if(text.length >= 8) {
                                        setColor(colors.gray[5]);
                                    } else setColor(colors.red[2]);

                                } else if(pattern2.test(text) && pattern3.test(text)) {
                                    setColor(colors.gray[5]);
                                    setIsPasswordValid(true); 
                                    if(text.length >= 8) {
                                        setColor(colors.gray[5]);
                                    } else setColor(colors.red[2]);
                                    
                                }
                                else {
                                    setColor(colors.red[2]);
                                    setIsPasswordValid(false);
                                }
                                
                                if(text === '') setColor(colors.gray[5]);
                                
                                setPassword(text);
                            }}
                        />
                        <Pressable style={{marginLeft: 5}} onPress={()=>{setShowPassword(!showPassword)}}>
                                {
                                    showPassword ?
                                    <Icon style={{marginTop: 3, marginRight: 5}} name={'eye'} type="ionicon"
                                    size={18} color={password ? colors.mainColor : colors.gray[9]}></Icon>
                                    :
                                    <Icon style={{marginTop: 3, marginRight: 5}} name={'eye-off'} type="ionicon"
                                    size={18} color={password ? colors.mainColor : colors.gray[9]}></Icon>
                                }
                        </Pressable>
                    </View>
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
                    <AppText style={{color: colors.defaultColor, fontSize: 16, fontWeight: 'bold'}}>비밀번호 재설정하기</AppText>
                </TouchableOpacity>
            </View>
        </>
    );
};

export default ChangePasswordTab;