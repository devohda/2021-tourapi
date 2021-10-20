import React from "react";
import {StyleSheet, TextInput, TouchableOpacity, View} from "react-native";
import styled from "styled-components/native";
import { useTheme } from '@react-navigation/native';
import AppText from "./AppText";

const ProgressBar = styled(View)`
  left: 300px;
  width: 67px;
  height: 24px;
  fontWeight: normal;
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
    const { colors } = useTheme();
    return (
        <>
            <ProgressBar>
                {btnStyles.map((btnStyle, idx) => <View key={idx} style={btnStyle}></View>)}
            </ProgressBar>
            <Form>
                <AppText style={{fontSize : 30, color : colors.mainColor}}>
                    {question}
                </AppText>
                <InputBox
                    defaultValue={userValue}
                    placeholder={placeHolder}
                    onChangeText={(text) => setValue(text)}
                    autoCapitalize="none"
                />
            </Form>
            <TouchableOpacity
                style={{
                    backgroundColor: colors.gray[6],
                    height: 52,
                    borderRadius: 10,
                    margin: 16,
                    marginTop: 303
                }}
                onPress={() => goToNextTab(tab => tab + 1)}
                activeOpacity={0.8}
            >
                <AppText style={{
                    textAlign: 'center',
                    padding: 14,
                    fontSize: 16,
                    color: colors.defaultColor,
                    fontWeight: 'bold'
                }}>
                    {nextBtnText}
                </AppText>
            </TouchableOpacity>
        </>
    )
}

export default AuthTab;