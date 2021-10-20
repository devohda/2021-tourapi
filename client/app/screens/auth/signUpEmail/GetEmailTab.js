import React, {useState} from 'react';
import {StyleSheet, TextInput, TouchableOpacity, View, Text, Alert} from 'react-native';
import ScreenContainer from '../../../components/ScreenContainer';
import styled from 'styled-components/native';
import CustomTextInput from '../../../components/CustomTextInput';
import AppText from '../../../components/AppText';
import {useTheme} from '@react-navigation/native';

const ProgressBar = styled(View)`
  flexDirection: row;
  width: 100%;
  justify-content: flex-end;
  height: 8px;
`;

const Form = styled(View)`
  margin-top: 63px;
`;

const InputBox = styled(TextInput)`
  fontSize: 16px;
  borderBottomWidth: 1px;
  borderBottomColor: #C5C5C5;
  marginBottom: 27px;
  paddingBottom: 11px;
`;

const GetEmailTab = ({navigation}) => {
    const { colors } = useTheme();

    const [email, setEmail] = useState('');
    const [isEmailDuplicated, setIsEmailDuplicated] = useState(undefined);
    const [color, setColor] = useState(colors.gray[5]);
    const emailRegExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

    const findSameEmail = async (email) => {
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
                    setIsEmailDuplicated(response.data.isDuplicated === true);
                    return response.data.isDuplicated === true;
                })
                .catch(error => console.log(error));
            return result;
        } catch (err) {
            console.error(err);
        }
    };

    const checkIsValid = () => {
        
        if(isEmailDuplicated) {
            Alert.alert('', '이미 사용중인 아이디예요.');
        } else {
            navigation.navigate('passwordTab', {email});
        }
    };

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
            backgroundColor: !email.match(emailRegExp) ? colors.gray[6] : colors.mainColor,
            height: 48,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center'
        }
    });

    return (
        <>
            <View flex={1}>
                <ProgressBar>
                    <View style={{...styles.progress, ...styles.progress_active}}></View>
                    <View style={{...styles.progress, ...styles.progress_inactive}}></View>
                    <View style={{...styles.progress, ...styles.progress_inactive}}></View>
                    <View style={{...styles.progress, ...styles.progress_inactive}}></View>
                </ProgressBar>
                <Form>
                    <AppText>
                        <View>
                            <AppText style={styles.title_text}>
                                <AppText style={{fontWeight: 'bold'}}>이메일주소</AppText><AppText>를</AppText></AppText>
                            <AppText style={styles.title_text}>입력해주세요</AppText>
                        </View>
                    </AppText>
                    <CustomTextInput
                        placeholder="hiddenjewel@gmail.com"
                        autoCapitalize="none"
                        style={{
                            marginTop : 40,
                            fontSize: 16,
                            borderBottomWidth: 1,
                            borderBottomColor: color,
                            marginBottom: 6,
                            paddingBottom: 11
                        }}
                        onChangeText={async (text) => {
                            await findSameEmail(text);
                            if(!text.match(emailRegExp)) {
                                setColor(colors.red[2]);
                            }

                            if(text === '') setColor(colors.gray[5]);
                            if(text.match(emailRegExp)) setColor(colors.gray[5]);
                            setEmail(text);
                        }}

                    />
                    <AppText style={{color: colors.red[2],
                        display: email && !email.match(emailRegExp) ? 'flex' : 'none'
                    }}>
                        이메일 형식이 올바르지 않아요.
                    </AppText>
                </Form>
            </View>
            <View style={{marginBottom: 20}}>
                <TouchableOpacity
                    style={styles.continue_btn}
                    onPress={() => checkIsValid()}
                    disabled={!email.match(emailRegExp) ? true : false}
                    activeOpacity={0.8}
                >
                    <AppText style={{color: colors.defaultColor, fontSize: 16, fontWeight: 'bold'}}>계속하기</AppText>
                </TouchableOpacity>
            </View>
        </>
    );
};

export default GetEmailTab;