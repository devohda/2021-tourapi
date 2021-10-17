import React, {useState} from 'react';
import {StyleSheet, TextInput, TouchableOpacity, View, Alert} from "react-native";
import { useTheme } from '@react-navigation/native';
import * as SMS from 'expo-sms';

import AppText from '../../../components/AppText';
import styled from "styled-components/native";
import CustomTextInput from "../../../components/CustomTextInput";
import Timer from '../../../components/Timer';

const Form = styled(View)`
  margin-top: 63px;
`;

const FindPasswordTab = ({route, navigation}) => {
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [certificateNumber, setCertificateNumber] = useState('');
    const { colors } = useTheme();
    const [emailColor, setEmailColor] = useState(colors.gray[5]);
    const [phoneNumColor, setPhoneNumColor] = useState(colors.gray[5]);
    const [certNumColor, setCertNumColor] = useState(colors.gray[5]);
    const emailRegExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

    const [minutes, setMinutes] = useState(3);
    const [seconds, setSeconds] = useState(0);

    const countdown = setInterval(() => {
        if (parseInt(seconds) > 0) {
          setSeconds(parseInt(seconds) - 1);
        }
        if (parseInt(seconds) === 0) {
          if (parseInt(minutes) === 0) {
            clearInterval(countdown);
          } else {
            setMinutes(parseInt(minutes) - 1);
            setSeconds(59);
          }
        }
      }, 1000);

    const [verifyCode, setVerifyCode] = useState(0);

    const [isEmailRegistered, setIsEmailRegistered] = useState(false);

    const findEmail = async (email) => {
        try {
            const result = await fetch('http://34.64.185.40/auth/sameEmail', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email})
            }).then(res => res.json())
                .then(response => {
                    setIsEmailRegistered(response.data.isDuplicated === true)
                    return response.data.isDuplicated === true;
                })
                .catch(error => console.log(error));
            return result;
        } catch (err) {
            console.error(err);
        }
    };

    const [numVisible, setNumVisible] = useState(false);

    const sendSMS = (pn) => {
        const phoneNum = `+82${phoneNumber.slice(1)}`;
        console.log(phoneNum)
        if(pn.length !== 11 || pn.startsWith('010')) {
            Alert.alert('', '정확한 전화번호를 입력해주세요.');
            return;
        };
        setNumVisible(true);
        // try {
        //     fetch('http://34.64.185.40/auth/authPhone', {
        //         method: 'POST',
        //         headers: {
        //             'Accept': 'application/json',
        //             'Content-Type': 'application/json'
        //         },
        //         body: {
        //             phoneNumber: pn,
        //         }
        //     }).then(res => res.json())
        //         .then(response => console.log('Success:', JSON.stringify(response)))
        //         .catch(error => console.error('Error:', error));
        // } catch (err) {
        //     console.error(err);
        // }
    };

    const getInfo = async () => {
        try {
            fetch('http://34.64.185.40/auth/authPhone', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            }).then(res => res.json())
                .then(response => {
                    setVerifyCode(response.data.verifyCode);
                })
                .catch(error => console.error('Error:', error));
        } catch (err) {
            console.error(err);
        }
    }

    const checkIsValid = async () => {
        if(!(email && phoneNumber && certificateNumber)) {
            Alert.alert('', '정보를 모두 입력해주세요.');
            return;
        };
        console.log(isEmailRegistered)
        if(!isEmailRegistered) {
            Alert.alert('', '가입되지 않은 이메일입니다.');
            return;
        }

        if(certificateNumber === verifyCode) navigation.navigate('changeTab', {email});
        else Alert.alert('', '인증번호가 일치하지 않습니다.');

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
            backgroundColor: email && phoneNumber && certificateNumber ? colors.mainColor : colors.gray[6],
            height: 48,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center'
        },
        certificate_btn: {
            backgroundColor: email && phoneNumber ? colors.mainColor : colors.gray[6],
            width: 88,
            height: 40,
            marginTop: 14,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center'
        },
        input_box: {
            borderBottomWidth: 1,
            alignItems: 'center',
            paddingBottom: 11,
            marginTop: 44,
            marginBottom: 6
        },
    });

    const isCorrect = (type) => {
        if(type === 'send') {
            if(email && phoneNumber) return false;
            else return true;
        } else {
            if(email && phoneNumber && certificateNumber) return false;
            else return true;
        }
    }

    return (
        <>
            <View flex={1}>
                <Form>
                    <View flexDirection="row" style={{...styles.input_box, borderColor: emailColor, marginTop: 0}}>
                        <CustomTextInput
                            placeholder="이메일 주소를 입력해주세요"
                            autoCapitalize="none"
                            style={{
                                fontSize: 18,
                                color: colors.mainColor
                            }}
                            flex={1}
                            onChangeText={async (text) => {
                                await findEmail(text);

                                if(text.length) setEmailColor(colors.mainColor);
                                else setEmailColor(colors.gray[5]);
                                setEmail(text);
                            }}
                        />
                    </View>
                    <View flexDirection="row" style={{...styles.input_box, borderColor: colors.backgroundColor, justifyContent: 'space-between', alignItems: 'center'}}>
                        <View flexDirection="row" style={{...styles.input_box, borderColor: phoneNumColor, width: '70%', justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
                            <CustomTextInput
                                placeholder="휴대폰 번호를 입력해주세요"
                                autoCapitalize="none"
                                style={{
                                    fontSize: 18,
                                    color: colors.mainColor
                                }}
                                flex={1}
                                onChangeText={(text) => {
                                    if(text.length) setPhoneNumColor(colors.mainColor);
                                    else setPhoneNumColor(colors.gray[5]);
                                    setPhoneNumber(text);
                                }}
                                keyboardType={'number-pad'}
                            />
                        </View>
                        <View>
                            <TouchableOpacity
                                style={styles.certificate_btn}
                                onPress={() => sendSMS(phoneNumber)}
                                disabled={isCorrect('send')}
                            >
                                <AppText style={{color: colors.defaultColor, fontSize: 14, fontWeight: 'bold'}}>인증요청</AppText>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View flexDirection="row" style={{...styles.input_box, borderColor: certNumColor}}>
                        <CustomTextInput
                            placeholder="인증번호를 입력해주세요"
                            autoCapitalize="none"
                            style={{
                                fontSize: 18,
                                color: colors.mainColor
                            }}
                            flex={1}
                            onChangeText={async (text) => {
                                if(text.length) setCertNumColor(colors.mainColor);
                                else setCertNumColor(colors.gray[5]);
                                setCertificateNumber(text);
                            }}
                            keyboardType={'number-pad'}
                        />
                        <Timer mm={minutes} ss={seconds} style={!numVisible && {display: 'none'}}/>
                    </View>
                </Form>
            </View>
            <View style={{marginBottom: 20}}>
                <TouchableOpacity
                    style={styles.continue_btn}
                    onPress={() => {
                        findEmail(email);
                        getInfo(); 
                        checkIsValid();
                    }}
                    disabled={isCorrect('continue')}
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