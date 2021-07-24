import React from 'react';
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

export default class SubAuth extends React.Component {
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

    componentDidMount() {
        // this.setState({forProgress: this.state.forProgress.map(item => {
        //     questions: item.
        // })})
    }

    render() {

        const progressComponent = this.state.forProgress.map(item => {
            if(this.state.current == 0) {
                return (
                <View style={styles.button}>
                    <View style={styles.yellowRect}></View>
                    <View style={styles.grayRect}></View>
                    <View style={styles.grayRect}></View>
                </View>)
            } else {
                return (<View style={styles.grayRect}></View>)
            }
        })
        // const questionComponent = this.state.forAuth[this.state.current]


        return (
            <>
                <Text style={{display: 'none'}}>{this.state.current + 1}</Text>
                <View style={styles.button}>
                    <View style={styles.yellowRect}></View>
                    <View style={styles.grayRect}></View>
                    <View style={styles.grayRect}></View>
                </View>
                    {/* {progressComponent} */}

                <View style={styles.container}>
                    <Text style={{fontSize: 28}}>
                        <Text><Text>나만의 </Text><Text style={{fontWeight: "bold"}}>공간 보관함</Text><Text>을</Text></Text>
                        <Text>{"\n"}채워볼까요?</Text>
                    </Text>
                <Text style={{fontSize: 16, marginTop: 67, marginBottom: 12}}><Text style={{fontWeight: "bold"}}>{this.state.forAuth[this.state.current].question}</Text><Text>를 입력해주세요</Text></Text>


                    {/* placeholder 물어보기 */}
                    <TextInput style={{fontSize: 16, borderBottomWidth: 1, borderBottomColor: '#C5C5C5', marginBottom: 27, paddingBottom: 11}} />                    
                </View>
                <TouchableOpacity style={{backgroundColor: '#DCDCDC', height: 52, borderRadius: 10, margin: 16, marginTop: 303}}><Text style={{textAlign: 'center', padding: 14, fontSize: 16, color: '#fff', fontWeight: 'bold'}}>계속하기</Text></TouchableOpacity>

           </>
          );
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