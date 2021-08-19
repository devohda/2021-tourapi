import React, {useState} from "react";
import ScreenContainer from '../../components/ScreenContainer'
import {View, TextInput, Text, Button} from "react-native";
import * as SMS from 'expo-sms';
import PhoneInput from "react-native-phone-number-input";


const FindPasswordScreen = () => {
    const [email, setEmail] = useState(null)
    const [phoneNumber, setPhoneNumber] = useState(null)
    const sendSMS = () => {
        try {
            fetch('http://34.146.140.88/auth/authPhone', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: {}
            }).then(res => res.json())
                .then(response => console.log('Success:', JSON.stringify(response)))
                .catch(error => console.error('Error:', error));
        } catch (err) {
            console.error(err);
        }
    }
    return (
        <ScreenContainer>
            <View>
                <Text>이메일을 입력하세요.</Text>
                <TextInput autoCapitalize="none" onChangeText={(text) => setEmail(email)}/>
                <Button title="확인 코드 입력" onPress={() => {
                }}/>
                <Text>전화번호를 입력하세요.</Text>
                <TextInput autoCapitalize="none" onChangeText={(text) => setEmail(email)}/>
                <PhoneInput
                    defaultCode="KR"
                    layout="first"
                    onChangeText={(text) => {
                        setPhoneNumber(text);
                    }}
                />
                <Button title="sms 전송" onPress={() => {
                    sendSMS()
                }}/>
            </View>
        </ScreenContainer>
    )
}

export default FindPasswordScreen;