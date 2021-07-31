import React from "react";
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import styled from "styled-components/native";

const ProgressBar = styled(View)`
  left: 300px;
  width: 67px;
  height: 24px;
  fontWeight: normal;
  backgroundColor: #fff;
  borderColor: #fff;
  top: 44px;
  flexDirection: row;
`

const Form = styled(View)`
  margin: 10px;
  fontSize: 28px;
  top: 36px;
  left: 16px;
  width: 343px;
`

const InputBox = styled(TextInput)`
  fontSize: 16px;
  borderBottomWidth: 1px;
  borderBottomColor: #C5C5C5;
  marginBottom: 27px;
  paddingBottom: 11px;
`

const AuthTab = ({btnStyles, question, placeHolder, nextBtnText}, goToNextTab, setValue, userValue) => {
    return (
        <>
            <ProgressBar>
                {btnStyles.map((btnStyle, idx) => <View key={idx} style={btnStyle}></View>)}
            </ProgressBar>
            <Form>
                <Text style={{fontSize: 28}}>
                    <Text>나만의 <Text style={{fontWeight: "bold"}}>공간 보관함</Text>을</Text>{"\n"}채워볼까요?
                </Text>
                <Text style={{fontSize: 16, marginTop: 67, marginBottom: 12}}>
                    <Text style={{fontWeight: "bold"}}>{question}</Text> 을/를 입력해주세요
                </Text>
                <InputBox
                    defaultValue={userValue}
                    placeholder={placeHolder}
                    onChangeText={(text) => setValue(text)}
                    value={userValue}
                />
                <Text>{userValue}</Text>
            </Form>
            <TouchableOpacity
                style={{
                    backgroundColor: '#DCDCDC',
                    height: 52,
                    borderRadius: 10,
                    margin: 16,
                    marginTop: 303
                }}
                onPress={() => goToNextTab(tab => tab + 1)}
            >
                <Text style={{
                    textAlign: 'center',
                    padding: 14,
                    fontSize: 16,
                    color: '#fff',
                    fontWeight: 'bold'
                }}>
                    {nextBtnText}
                </Text>
            </TouchableOpacity>
        </>
    )
}

export default AuthTab;