import React, {useState, useEffect} from 'react';
import {Platform, View, Image, StyleSheet, Button, TouchableOpacity, Alert, Modal, Pressable} from 'react-native';
import {useTheme} from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

import AppText from '../../components/AppText';
import ScreenContainer from '../../components/ScreenContainer';
import MyPageNavigation from '../../navigation/MypageNavigator';
import { useToken } from '../../contexts/TokenContextProvider';
import {useIsSignedIn} from '../../contexts/SignedInContextProvider';

import SettingsIcon from '../../assets/images/settings-icon.svg';
import ReportIcon from '../../assets/images/Report.svg';

const MyPageScreen = ({navigation}) => {
    const {colors} = useTheme();
    const [token, setToken] = useToken();
    const [userData, setUserData] = useState({});
    const [isSignedIn, setIsSignedIn] = useIsSignedIn();
    const [alertDuplicated, setAlertDuplicated] = useState(false);

    useEffect(() => {
        getUserData();
    },[]);

    const getUserData = () => {
        try {
            fetch('http://34.64.185.40/user', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
            }).then((res) => res.json())
                .then(async (response) => {
                    if (response.code === 405 && !alertDuplicated) {
                        Alert.alert('', '다른 기기에서 로그인했습니다.');
                        setAlertDuplicated(true);
                    }

                    if (parseInt(response.code / 100) === 4) {
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }

                    setUserData(response.data);
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <ScreenContainer backgroundColor={colors.backgroundColor}>
            <View flexDirection="row" style={{
                height: 24,
                marginTop: Platform.OS === 'android' ? 20 : 10,
                marginHorizontal: 20,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <View style={{position: 'absolute', right: 0}}>
                    <TouchableOpacity onPress={() => navigation.navigate('SystemSetting')}>
                        <SettingsIcon width={24} height={24} style={{color: colors.mainColor}}/>
                    </TouchableOpacity>
                </View>
            </View>
            <View
                style={{
                    backgroundColor: colors.backgroundColor,
                }}
                className="profile-container"
            >
                <View
                    style={{
                        alignItems: 'center',
                    }}
                >
                    <View
                        className="profile-img-container"
                        style={{justifyContent: 'center', alignItems: 'center'}}
                    >
                        <Image
                            style={{
                                width: 90,
                                height: 90,
                                borderRadius: 60,
                                backgroundColor: colors.defaultColor,
                            }}
                            source={require('../../assets/images/here_default.png')}
                        />
                    </View>
                    <View style={{marginTop: 4}}>
                        <AppText
                            style={{
                                fontSize: 18,
                                fontWeight: '700',
                                textAlign: 'center',
                                color: colors.mainColor,
                                lineHeight: 28.8
                            }}
                        >
                            {userData.user_nickname}
                        </AppText>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <View style={styles.myPageHashtag}>
                                <AppText style={{...styles.myPageHashtagText, color: colors.gray[3]}}>#조용한</AppText>
                            </View>
                            <View style={styles.myPageHashtag}>
                                <AppText style={{...styles.myPageHashtagText, color: colors.gray[3]}}>#따뜻한</AppText>
                            </View>
                        </View>
                        <TouchableOpacity style={{marginTop: 8}} onPress={()=>navigation.navigate('ProfileSetting')}>
                            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                <View style={{...styles.editProfileButton, backgroundColor: colors.defaultColor, borderColor: colors.defaultColor, borderWidth: 1}}>
                                    <AppText style={{color: colors.gray[5], fontSize: 12, lineHeight: 19.2, paddingVertical: 2.5, paddingHorizontal: 12, fontWeight: '700'}}>
                                        프로필 수정
                                    </AppText>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <MyPageNavigation navigation={navigation}/>
        </ScreenContainer>
    );
};


const styles = StyleSheet.create({
    myPageHashtag: {
        borderRadius: 12,
        marginHorizontal: 4
    },
    myPageHashtagText: {
        fontSize: 12,
        textAlign: 'center',

    },
    editProfileButton: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 24,
        borderRadius: 27,
        shadowColor: 'rgba(203, 180, 180, 0.3)',
        shadowOffset: {
            width: 3,
            height: 6
        },
        shadowOpacity: 0.25,
        elevation: 1,
    },
    //modal example
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        height: 150
    },
    button: {
        borderRadius: 10,
        marginHorizontal: 9.5,
        marginTop: 26,
        width: 108,
        height: 38,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textStyle: {
        color: 'white',
        textAlign: 'center',
        fontSize: 14,
        lineHeight: 22.4,
        fontWeight: '500'
    },
    modalText: {
        textAlign: 'center',
        fontSize: 14,
        lineHeight: 22.4,
        fontWeight: '700'
    }
});

export default MyPageScreen;
