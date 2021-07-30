import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack';
// import firebase from '@react-native-firebase/app';

const Stack = createStackNavigator()
const NavigationTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: 'transparent'
    },
};

export default class SubAuth extends React.Component {
    constructor(props) {
        super(props);
        const {navigation} = this.props;
        this.state = {
            step: 0,
            QuestionComponent: {
                buttonStyleFirst: [styles.yellowRect, styles.grayRect, styles.grayRect],
                buttonStyleSecond: [styles.grayRect, styles.yellowRect, styles.grayRect],
                buttonStyleThird: [styles.grayRect, styles.grayRect, styles.yellowRect],
                question: ['이메일', '비밀번호', '닉네임'],
                placeHolder: ['hiddenJewel@gmai.com', '대/소문자 및 숫자 포함 8자리 이상', '2자 이상 10자 미만으로 한글, 영문 대소문자 가능'],
                continue: ['계속하기', '계속하기', '회원가입'],
                whenPressed: ['', '', '()=>navigation.goBack()']
            }
        };
        this.goBack = this.goBack.bind(this);
    }
    goBack() {
        console.log(this.state.step)
        this.setState({ step: this.state.step + 1 });
        if(this.state.step == 3) {
            this.props.navigation.goBack()
            // this.props.navigation.push('MainAuth')
        }
    }

    render() {
        return (
            <>
                {this.state.step<3 ?
                    <>
                        <View style={styles.button}>
                            <View style={this.state.QuestionComponent.buttonStyleFirst[this.state.step]}></View>
                            <View style={this.state.QuestionComponent.buttonStyleSecond[this.state.step]}></View>
                            <View style={this.state.QuestionComponent.buttonStyleThird[this.state.step]}></View>
                        </View>
                        <View style={styles.container}>
                            <Text style={{fontSize: 28}}>
                                <Text><Text>나만의 </Text><Text style={{fontWeight: "bold"}}>공간 보관함</Text><Text>을</Text></Text>
                                <Text>{"\n"}채워볼까요?</Text>
                            </Text>
                            <Text style={{fontSize: 16, marginTop: 67, marginBottom: 12}}><Text style={{fontWeight: "bold"}}>{this.state.QuestionComponent.question[this.state.step]}</Text><Text>을 입력해주세요</Text></Text>
                            <TextInput style={{fontSize: 16, borderBottomWidth: 1, borderBottomColor: '#C5C5C5', marginBottom: 27, paddingBottom: 11}} placeholder={this.state.QuestionComponent.placeHolder[this.state.step]}/>
                        </View>
                        <TouchableOpacity style={{backgroundColor: '#DCDCDC', height: 52, borderRadius: 10, margin: 16, marginTop: 303}} onPress={() => this.goBack()}><Text style={{textAlign: 'center', padding: 14, fontSize: 16, color: '#fff', fontWeight: 'bold'}}>{this.state.QuestionComponent.continue[this.state.step]}</Text></TouchableOpacity>
                    </>
                    :
                    <>
                        <View style={styles.button}>
                            <View style={{width: 8, height: 8, backgroundColor: '#dcdcdc', borderRadius: 6, top: 0, marginLeft: 12, display: 'none'}}></View>
                        </View>
                        <View style={styles.container}>
                            <Text style={{fontSize: 26, lineHeight: 45}}>
                                <Text><Text style={{fontWeight: "bold"}}>회원가입</Text><Text>이 완료되었습니다!</Text></Text>
                                <Text>{"\n"}히든쥬얼을 마음껏 즐겨보세요.</Text>
                            </Text>
                            <Text style={{fontSize: 16, marginTop: 67, marginBottom: 12}}></Text>
                            <TextInput style={{fontSize: 16, marginBottom: 27, paddingBottom: 11}}/>
                        </View>
                        <TouchableOpacity style={{backgroundColor: '#DCDCDC', height: 52, borderRadius: 10, margin: 16, marginTop:293}} onPress={() => this.goBack()}><Text style={{textAlign: 'center', padding: 14, fontSize: 16, color: '#fff', fontWeight: 'bold'}}>로그인 화면으로 돌아가기</Text></TouchableOpacity>
                    </>
                }

            </>
        );
    }

}
// ReactDOM.render(<forQuestion />)
const styles = StyleSheet.create({
    yellowRect : {
        width: 28,
        height: 8,
        backgroundColor: '#fff0B4',
        borderRadius: 6,
        top: 0,
        marginLeft: 12,
    },
    grayRect : {
        width: 8,
        height: 8,
        backgroundColor: '#dcdcdc',
        borderRadius: 6,
        top: 0,
        marginLeft: 12,
    },
    button : {
        left: 300,
        width: 67,
        height: 24,
        fontWeight: 'normal',
        backgroundColor: '#fff',
        borderColor: '#fff',
        top: 44,
        flexDirection: 'row'
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