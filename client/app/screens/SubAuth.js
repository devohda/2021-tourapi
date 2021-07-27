/////////
//SubAuth.js
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack';

const Stack = createStackNavigator()
const NavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent'
  },
};
const onIncrease = () => {
    setStep(step+1);
    console.log(step)
}
const onDecrease = () => {
    setStep(step-1)
}

export default class SubAuth extends React.Component {
    constructor(props) {
        super(props);
        this.state = {step: 0};
    }
    updateGrandparent(value) {
        this.setState({step: value});
    }
    render() {

        console.log(step);
        return (
            <ParentAuth key={this.state.step} updateParent={this.updateGrandparent.bind(this)}/>
        )
    }

}
class ParentAuth extends React.Component {
    updateParent(value) {
        this.props.updateGrandparent(value);
    }
    constructor(props) {
        super(props);
        this.state = {
            forAuth : [{
                question : '이메일',
                placeHolder: '',
                continue: '계속하기',
            }, {
                question : '비밀번호',
                placeHolder: '대/소문자 및 숫자 포함 8자리 이상',
                continue: '계속하기',
            }, {
                question : '닉네임',
                placeHolder: '',
                continue: '회원가입',
            }],
            questions : ['이메일', '비밀번호', '닉네임'],
            placeHolder : ['', '대/소문자 및 숫자 포함 8자리 이상', ''],
            continue : ['계속하기', '계속하기', '회원가입'],
            forProgress : [],
            current: 0
        }
    }
    data() {
        return {
        }
    };
    componentDidMount() {

    }
    render() {
        // console.log(this.state.forAuth.map((card, index)=>{return card.question}))
        return (
            <>
                <View key={0}>
                    <View style={styles.button}>
                        <View style={styles.yellowRect}></View>
                        <View style={styles.grayRect}></View>
                        <View style={styles.grayRect}></View>
                    </View>
                    <AuthChild title="이메일" ad="을" placeholder="hiddenJewel@gmail.com" continue="계속하기" step={this.props.step} updateParent={this.updateParent.bind(this)}/>
                </View>
                <View key={1}>
                    <View style={styles.button}>
                        <View style={styles.grayRect}></View>
                        <View style={styles.yellowRect}></View>
                        <View style={styles.grayRect}></View>
                    </View>
                    <AuthChild title="비밀번호" ad="를" placeholder="대/소문자 및 숫자 포함 8자리 이상" continue="계속하기" />
                </View>
                <View key={2}>
                    <View style={styles.button}>
                        <View style={styles.grayRect}></View>
                        <View style={styles.grayRect}></View>
                        <View style={styles.yellowRect}></View>
                    </View>
                    <AuthChild title="닉네임" ad="을" placeholder="2자 이상 10자 미만으로 한글, 영문 대소문자만 가능" continue="가입완료" />
                </View>
           </>
          );
    }
}

class AuthChild extends React.Component {
    handleClick(event) {
        this.props.updateParent(this.props.step + 1);
    }
    render() {
        return (
            <>

                    <View style={styles.container}>
                        <Text style={{fontSize: 28}}>
                            <Text><Text>나만의 </Text><Text style={{fontWeight: "bold"}}>공간 보관함</Text><Text>을</Text></Text>
                            <Text>{"\n"}채워볼까요?</Text>
                        </Text>
                        <Text style={{fontSize: 16, marginTop: 67, marginBottom: 12}} ><Text style={{fontWeight: "bold"}}>{this.props.title}</Text><Text>{this.props.ad} 입력해주세요</Text></Text>

                        {/* placeholder 물어보기 */}
                        {/* → email : hiddenJewel@gmail.com
                        → 닉네임 : 2자 이상 10자 미만으로 한글, 영문 대소문자만 가능 */}
                        <TextInput style={{fontSize: 16, borderBottomWidth: 1, borderBottomColor: '#C5C5C5', marginBottom: 27, paddingBottom: 11}} placeholder={this.props.placeholder}/>                    
                    </View>
                    <TouchableOpacity style={{backgroundColor: '#DCDCDC', height: 52, borderRadius: 10, margin: 16, marginTop: 303}} onPress={()=>this.handleClick.bind(this)}><Text style={{textAlign: 'center', padding: 14, fontSize: 16, color: '#fff', fontWeight: 'bold'}}>{this.props.continue}</Text></TouchableOpacity>

            </>
        )
    }
}

const styles = StyleSheet.create({
    yellowRect : {
        width: 28,
        height: 8,
        backgroundColor: '#fff0B4',
        borderRadius: 6,
        top: 0,
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
        left: 312,
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
