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

const FindPasswordTab = ({route, navigation}) => {
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
    const [emailColor, setEmailColor] = useState(colors.gray[5]);
    const [phoneNumColor, setPhoneNumColor] = useState(colors.gray[5]);
    const [certNumColor, setCertNumColor] = useState(colors.gray[5]);

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
        certificate_btn: {
            backgroundColor: password.length >= 8 && isPasswordValid ? colors.mainColor : colors.gray[6],
            width: 88,
            height: 40,
            marginTop: 14,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center'
        },
        password_box: {
            borderBottomWidth: 1,
            alignItems: 'center',
            paddingBottom: 11,
            marginTop: 44,
            marginBottom: 6
        },
    });

    const EmailInput = () => {
        return (
            <CustomTextInput
                placeholder="이메일 주소를 입력해주세요"
                autoCapitalize="none"
                password={true}
                secureTextEntry={showPassword}
                style={{
                    fontSize: 18,
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
        )
    };

    const PhoneNumberInput = () => {
        return (
            <CustomTextInput
                placeholder="휴대폰 번호를 입력해주세요"
                autoCapitalize="none"
                password={true}
                secureTextEntry={showPassword}
                style={{
                    fontSize: 18,
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
        )
    };
    
    const CertificationNumberInput = () => {
        return (
            <CustomTextInput
                placeholder="인증번호를 입력해주세요"
                autoCapitalize="none"
                password={true}
                secureTextEntry={showPassword}
                style={{
                    fontSize: 18,
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
        )
    };

    return (
        <>
            <View flex={1}>
                <Form>
                    <View flexDirection="row" style={{...styles.password_box, borderColor: emailColor, marginTop: 0}}>
                        <EmailInput />
                    </View>
                    <View flexDirection="row" style={{...styles.password_box, borderColor: colors.backgroundColor, justifyContent: 'space-between', alignItems: 'center'}}>
                        <View flexDirection="row" style={{...styles.password_box, borderColor: phoneNumColor, width: '70%', justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
                            <PhoneNumberInput />
                        </View>
                        <View>
                            <TouchableOpacity
                                style={styles.certificate_btn}
                                onPress={() => checkIsValid()}
                                disabled={password.length >= 8 && isPasswordValid ? false : true}
                            >
                                <AppText style={{color: colors.defaultColor, fontSize: 14, fontWeight: 'bold'}}>인증요청</AppText>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View flexDirection="row" style={{...styles.password_box, borderColor: certNumColor}}>
                        <CertificationNumberInput />
                    </View>
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

export default FindPasswordTab;