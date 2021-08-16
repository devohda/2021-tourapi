import React, {useEffect, useState} from "react";
import {Platform, View, Text, TextInput, Image, ScrollView, Dimensions, StyleSheet} from "react-native";
import ScreenContainer from "../components/ScreenContainer";

const screenWidth = Dimensions.get('window').width;
import MyTabs from "../navigation/MypageNavigator";

const MyPageScreen = () => {
    useEffect(() => {
        getCollections();
    },[])
    const [DATA, useDATA] = useState({
        user_email: '',
        user_nickname: '',
        user_password: '',
        user_pk: 0,
        user_profileImage: '',
    })
    const [directoryData, setDirectoryData] = useState([])

    const getCollections = () => {
        try {
    
<<<<<<< HEAD
            fetch('http://localhost:3000/user/users', {
=======
            fetch('http://172.30.1.38:3000/user/users', {
>>>>>>> feature/edit-mvp
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
        <ScreenContainer backgroundColor="#FCF6F5">
            <View style={{
                height: 200,
                backgroundColor: '#FCF6F5',
                paddingTop: '10%'
            }} className="profile-container">
                <View style={{
                    alignItems: "center"
                }}>
                    <View className="profile-img-container" style={{justifyContent: 'center', alignItems: 'center'}}>
                        <Image style={{width: 90, height: 90, borderRadius: 60, position: 'absolute', backgroundColor: '#fff'}}
                            source={require('../assets/images/default_profile.png')}
                        />
                        <Image style={{width: 30, height: 30, marginLeft: '20%', marginBottom: '17.5%'}}
                            source={require('../assets/images/setting.png')} 
                        ></Image>
                    </View>
                    <View style={{marginTop: Platform.OS === 'ios' && 5}}>
                        <Text style={{fontSize: 18, fontWeight: "bold", textAlign: 'center', color: '#40516E'}}>{DATA.user_nickname}</Text>
<<<<<<< HEAD
                        <View style={{flexDirection: 'row', marginTop: Platform.OS === 'ios' ? 8 : 3}}>
=======
                        <View style={{flexDirection: 'row', marginTop: 8}}>
>>>>>>> feature/edit-mvp
                            <View style={styles.myPageHashtag}><Text style={styles.myPageHashtagText}>#조용한</Text></View>
                            <View style={styles.myPageHashtag}><Text style={styles.myPageHashtagText}>#따뜻한</Text></View>
                        </View>
                    </View>
                </View>
            </View>
            <MyTabs/>
        </ScreenContainer>
    )
};

const styles = StyleSheet.create({
    myPageHashtag : {
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 2,
        paddingHorizontal: 5,
        marginRight: 10,
<<<<<<< HEAD
        // shadowColor: '#470000',
        // shadowOffset: {width: 0, height: 10},
        // shadowOpacity: 0.2,
=======
        shadowColor: '#470000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
>>>>>>> feature/edit-mvp
        elevation: 1,
        backgroundColor: '#fff',
    },

    myPageHashtagText: {
        fontSize: 12, textAlign: 'center',
        color: '#9DA2AB'
    }
})

export default MyPageScreen;