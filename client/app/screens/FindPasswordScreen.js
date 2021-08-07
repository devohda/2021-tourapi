import React, {useState} from "react";
import ScreenContainer from '../components/ScreenContainer'
import {View, TextInput, Text, Button} from "react-native";


const FindPasswordScreen = () => {
    const [email, setEmail] = useState(null)
    const sendEmail = () => {
        // if email is valid address

    }
    return (
        <ScreenContainer>
            <View>
                <Text>이메일을 입력하세요.</Text>
                <TextInput autoCapitalize="none" onChangeText={(text) => setEmail(email)}/>
                <Button title="확인 코드 입력" onPress={}/>
            </View>
        </ScreenContainer>
    )
}

export default FindPasswordScreen;