//전역 선언 방법 찾아보기
import React from 'react';
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { spacing, positions } from '@material-ui/system';
import { Font } from 'expo';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import Button from '@material-ui/core/Button';

export default class Auth extends React.Component {
    constructor(props) {
        super(props);
        
    //     // // 폰트로딩이 완료되면 true로 변경
    //     // this.state = {isReady: false};
    //   }
    
    //   async componentDidMount() {
    //     // await키워드를 붙여 비동기식으로 변경
    //     await Font.loadAsync({'NotoSansCJKkr': require('../assets/fonts/NotoSansCJKkr-Regular.ttf'),});
        
    //     // 폰트로드가 완료되어 true로 변경
    //     this.setState({ isReady: true });
      }
    
    render() {
        return (
            <View style={styles.mainpage}>
                <View style={styles.button}>
                    <TouchableOpacity><Text style={{color: '#DCDCDC', fontSize: 16}}>둘러보기</Text></TouchableOpacity>
                </View>
                <View style={styles.container}>
                    <Text style={{fontSize: 28}}>
                        <Text><Text>나만의 </Text><Text style={{fontWeight: "bold"}}>공간 보관함</Text><Text>을</Text></Text>
                        <Text>{"\n"}채워볼까요?</Text>
                    </Text>
                    <TextInput style={{marginTop: 38, right: -4, fontSize: 16, borderBottomWidth: 1, borderBottomColor: '#C5C5C5', marginBottom: 27, paddingBottom: 11}} placeholder="이메일 주소를 입력해주세요" />
                    <TextInput style={{fontSize: 16, right: -4, borderBottomWidth: 1, borderBottomColor: '#C5C5C5', marginBottom: 27, paddingBottom: 11}} placeholder="비밀번호를 입력해주세요" />
                </View>
                <View style={styles.inputs}>

                </View>
            </View>
          );
    }
}

const styles = StyleSheet.create({
    mainpage : {

    },
    container: {
        margin: 10,
        fontSize: 28,
        fontWeight: "400",
        flex : 2,
        top: 28,
        right: 56,
    },
    button : {
        left: 255,
        // width: 80,
        height: 24,
        fontWeight: 'normal',
        backgroundColor: '#fff',
        borderColor: '#fff',
        fontSize: 16,
        flex: 1,
        top: 44,
    },
    inputs : {
        // marginTop: 18,
        width: '100%',
        flex: 3,
    }
  });