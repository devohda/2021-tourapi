import React, {useEffect, useState} from "react";
import {Platform, View, Text, TextInput, Image, ScrollView, Dimensions, StyleSheet} from "react-native";
import ScreenContainer from "../components/ScreenContainer";
import MyPageNavigation from "../navigation/MypageNavigator";
import {useTheme} from '@react-navigation/native';
import AppText from "../components/AppText";

const screenWidth = Dimensions.get('window').width;

const MyPageScreen = ({navigation}) => {
    useEffect(() => {
        getCollections();
    }, []);

    const {colors} = useTheme();

    const styles = StyleSheet.create({
        myPageHashtag: {
            borderWidth: 1,
            borderRadius: 12,
            paddingVertical: 2,
            paddingHorizontal: 5,
            marginRight: 10,
            shadowColor: colors.red[8],
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.1,
            elevation: 1,
        },

        myPageHashtagText: {
            color: colors.gray[2],
            fontSize: 12,
            textAlign: 'center',
        }
    })

    const [DATA, useDATA] = useState({
        user_email: '',
        user_nickname: '',
        user_password: '',
        user_pk: 0,
        user_profileImage: '',
    });
    const [directoryData, setDirectoryData] = useState([]);

    const getCollections = () => {
        try {

            fetch('http://34.146.140.88/user/users', {
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
        <ScreenContainer backgroundColor={colors.backgroundColor}>
            <View style={{
                height: 200,
                backgroundColor: colors.backgroundColor,
                paddingTop: '10%'
            }} className="profile-container">
                <View style={{
                    alignItems: "center"
                }}>
                    <View className="profile-img-container" style={{justifyContent: 'center', alignItems: 'center'}}>
                        <Image style={{
                            width: 90,
                            height: 90,
                            borderRadius: 60,
                            position: 'absolute',
                            backgroundColor: colors.defaultColor
                        }}
                               source={require('../assets/images/default_profile.png')}
                        />
                        <Image style={{width: 30, height: 30, marginLeft: '20%', marginBottom: '17.5%'}}
                               source={require('../assets/images/setting.png')}
                        ></Image>
                    </View>
                    <View style={Platform.OS === 'ios' && {marginTop: 5}}>
                        <AppText style={{
                            fontSize: 18,
                            fontWeight: "bold",
                            textAlign: 'center',
                            color: colors.mainColor
                        }}>{DATA.user_nickname}</AppText>
                        <View style={{flexDirection: 'row', marginTop: Platform.OS === 'ios' ? 8 : 3}}>
                            <View style={[styles.myPageHashtag, {
                                borderColor: colors.defaultColor,
                                backgroundColor: colors.defaultColor
                            }]}><AppText style={styles.myPageHashtagText}>#조용한</AppText></View>
                            <View style={[styles.myPageHashtag, {
                                borderColor: colors.defaultColor,
                                backgroundColor: colors.defaultColor
                            }]}><AppText style={styles.myPageHashtagText}>#따뜻한</AppText></View>
                        </View>
                    </View>
                </View>
            </View>
            <MyPageNavigation navigation={navigation}/>
        </ScreenContainer>
    )
};

export default MyPageScreen;