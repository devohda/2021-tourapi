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

const ProgressBar = styled(View)`
  flexDirection: row;
  width: 100%;
  justify-content: flex-end;
  height: 8px;
`;

const Form = styled(View)`
  margin-top: 63px;
`;

const ChangePasswordTab = ({route, navigation}) => {
    const [email, setEmail] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState(null);

    const sendSMS = () => {
        try {
            fetch('http://34.64.185.40/auth/authPhone', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: {}
            }).then(res => res.json())
                .then(response => console.log('Success:', JSON.stringify(response)))
                .catch(error => console.error('Error:', error));
        } catch (err) {
            console.error(err);
        }
    };

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
            // setColor(colors.gray[5]);
        }
        else {
            setIsPasswordValid(true);
            // setColor(colors.red[2]);
        }
    }

    const checkIsValid = async () => {
        if(!isPasswordValid) {
            setColor(colors.red[2]);
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
        },
        password_box: {
            borderBottomWidth: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 11,
            marginTop: 40,
            marginBottom: 6
        },
    })

    return (
        <>
            <View flex={1}>
                <ProgressBar>
                    <View style={{...styles.progress, ...styles.progress_inactive}}></View>
                    <View style={{...styles.progress, ...styles.progress_active}}></View>
                    <View style={{...styles.progress, ...styles.progress_inactive}}></View>
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
                    <View flexDirection="row" style={{...styles.password_box, borderColor: color}}>
                        <CustomTextInput
                            placeholder="영문, 숫자, 특수문자 2가지 조합 8자리 이상"
                            autoCapitalize="none"
                            password={true}
                            secureTextEntry={showPassword}
                            style={{
                                fontSize: 16,
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
                                    size={18} color={colors.gray[9]}></Icon>
                                    :
                                    <Icon style={{marginTop: 3, marginRight: 5}} name={'eye-off'} type="ionicon"
                                    size={18} color={colors.gray[9]}></Icon>
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
                    <AppText style={{color: colors.defaultColor, fontSize: 16, fontWeight: 'bold'}}>계속하기</AppText>
                </TouchableOpacity>
            </View>
        </>
        // <ScreenContainer>
        //     <View>
        //         <AppText>이메일을 입력하세요.</AppText>
        //         <TextInput autoCapitalize="none" onChangeText={(text) => setEmail(email)}/>
        //         <Button title="확인 코드 입력" onPress={() => {
        //         }}/>
        //         <AppText>전화번호를 입력하세요.</AppText>
        //         <TextInput autoCapitalize="none" onChangeText={(text) => setEmail(email)}/>
        //         <PhoneInput
        //             defaultCode="KR"
        //             layout="first"
        //             onChangeText={(text) => {
        //                 setPhoneNumber(text);
        //             }}
        //         />
        //         <Button title="sms 전송" onPress={() => {
        //             sendSMS();
        //         }}/>
        //     </View>
        // </ScreenContainer>
    );
};

export default ChangePasswordTab;