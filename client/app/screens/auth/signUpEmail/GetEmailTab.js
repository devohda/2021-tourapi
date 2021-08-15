import React from "react";
import {StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform} from "react-native";
import ScreenContainer from '../../../components/ScreenContainer'
import styled from "styled-components/native";

const ProgressBar = styled(View)`
  flexDirection: row;
  width: 100%;
  justify-content: flex-end;
  height: 8px;
`

const Form = styled(View)`
  fontSize: 28px;
  width: 343px;
  margin-top: 63px;
`

const InputBox = styled(TextInput)`
  fontSize: 16px;
  borderBottomWidth: 1px;
  borderBottomColor: #C5C5C5;
  marginBottom: 27px;
  paddingBottom: 11px;
`


const GetEmailTab = ({navigation}) => {
    return (
        <ScreenContainer backgroundColor="#FCF6F5">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{marginHorizontal: 20, height : '100%'}}>
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
                    />
                </Form>
                <View flex={1} style={{justifyContent : 'flex-end', paddingBottom : 100}}>
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#DCDCDC',
                            height: 48,
                            borderRadius: 10
                        }}
                        onPress={() => navigation.navigate('passwordTab')}
                    >
                        <Text style={{
                            textAlign: 'center',
                            padding: 14,
                            fontSize: 16,
                            color: '#fff',
                            fontWeight: 'bold'
                        }}>
                            계속하기
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </ScreenContainer>
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
    }
})

export default GetEmailTab;