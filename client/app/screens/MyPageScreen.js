import React, {useEffect, useState} from "react";
import {View, Text, TextInput, Image, ScrollView, Dimensions} from "react-native";
import ScreenContainer from "../components/ScreenContainer";

const screenWidth = Dimensions.get('window').width;
import MyTabs from "../navigation/MypageNavigator";

const MyPageScreen = ({navigation}) => {
    useEffect(() => {
        getCollections();
    })
    // const { from } = route.params;
    // console.log(from)
    const [DATA, useDATA] = useState({
        user_email: '',
        user_nickname: '',
        user_password: '',
        user_pk: 0,
        user_profileImage: '',
    })
    const getCollections = () => {
        try {
    
            fetch('http://172.30.1.36:3000/user/users', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            }).then((res) => res.json())
                .then((responsedata) => {
                    DATA.user_email = responsedata[0].user_email;
                    DATA.user_nickname = responsedata[0].user_nickname;
                    DATA.user_password = responsedata[0].user_password;
                    DATA.user_pk = responsedata[0].user_pk;
                    DATA.user_profileImage = responsedata[0].user_profileImage;
                    console.log(responsedata[0])
                })
                .catch((err) => {
                    console.error(err)
                });
    
        } catch (err) {
            console.error(err);
        }
    }
    return (
        <ScreenContainer>
            <View style={{
                height: 220,
                alignItems: "flex-end"
            }} className="profile-container">
                <View style={{
                    marginTop: 50,
                    flexDirection: "row",
                    alignItems: "center"
                }}>
                    <View className="profile-img-container">
                        <Image style={{width: 120, height: 120, borderRadius: 60}}
                            source={require('../assets/images/suzy.jpeg')}
                               resizeMode={"cover"}
                        />
                    </View>
                    <View flex={1} style={{
                        marginLeft: 30,
                        height: "100%",
                        justifyContent: "space-around",
                        paddingVertical: 40
                    }}>
                        <Text style={{fontSize: 20, fontWeight: "bold"}}>{DATA.user_nickname}</Text>
                        <Text>#조용한 #따뜻한</Text>
                    </View>
                </View>
            </View>
            <MyTabs/>
        </ScreenContainer>
    )
};

const styles = {}

export default MyPageScreen;