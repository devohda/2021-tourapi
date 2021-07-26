import React from 'react';
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator()

export default function SubAuth({navigation}) {

        return (
            <>
                <View style={styles.button}>
                    {/* 위에 progression bar 추가 -> 이미지로 추가해도 될듯 */}
                </View>
                <View style={styles.container}>
                    <Text style={{fontSize: 28}}>
                        <Text><Text>나만의 </Text><Text style={{fontWeight: "bold"}}>공간 보관함</Text><Text>을</Text></Text>
                        <Text>{"\n"}채워볼까요?</Text>
                    </Text>             
                    <Text style={{fontSize: 16, marginTop: 67, marginBottom: 12}}><Text style={{fontWeight: "bold"}}>비밀번호</Text><Text>를 입력해주세요</Text></Text>
                    <TextInput style={{fontSize: 16, borderBottomWidth: 1, borderBottomColor: '#C5C5C5', marginBottom: 27, paddingBottom: 11}} placeholder="대/소문자 및 숫자 포함 8자리 이상"/>                    
                </View>
                <TouchableOpacity style={{backgroundColor: '#DCDCDC', height: 52, borderRadius: 10, margin: 16, marginTop: 303}}><Text style={{textAlign: 'center', padding: 14, fontSize: 16, color: '#fff', fontWeight: 'bold'}}>계속하기</Text></TouchableOpacity>
           </>
          );
}

const styles = StyleSheet.create({
    // mainpage : {
    //     // position: 'absolute'

    // },
    button : {
        left: 312,
        width: 67,
        height: 24,
        fontWeight: 'normal',
        backgroundColor: '#fff',
        borderColor: '#fff',
        top: 44,
    },
    container: {
        margin: 10,
        fontSize: 28,
        fontWeight: "400",
        top: 36,
        left: 16,
        width: 343,
    },
  });