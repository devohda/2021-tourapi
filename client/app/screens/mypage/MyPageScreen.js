import React, {useState, useEffect} from 'react';
import {Platform, View, Image, StyleSheet, Button, TouchableOpacity, Alert, Modal, Pressable} from 'react-native';
import {useIsFocused, useTheme} from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

import AppText from '../../components/AppText';
import ScreenContainer from '../../components/ScreenContainer';
import MyPageNavigation from '../../navigation/MypageNavigator';
import { useToken } from '../../contexts/TokenContextProvider';
import {useIsSignedIn} from '../../contexts/SignedInContextProvider';

import SettingsIcon from '../../assets/images/settings-icon.svg';

const MyPageScreen = ({navigation}) => {
    const {colors} = useTheme();
    const [token, setToken] = useToken();
    const [userData, setUserData] = useState({});
    const [userKeywordData, setUserKeywordData] = useState([]);
    const [userImage, setUserImage] = useState('');
    const [isSignedIn, setIsSignedIn] = useIsSignedIn();
    const [alertDuplicated, setAlertDuplicated] = useState(false);
    const isFocused = useIsFocused();

    useEffect(() => {
        getUserData();
    },[isFocused]);

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
                    setUserKeywordData(response.data.keywords);
                    setUserImage(response.data.user_img);
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const UserKeyword = props => {
        const {data} = props;
        return (
            <View
                style={{
                    ...styles.keywordHashTagView,
                    backgroundColor: colors.backgroundColor,
                    borderColor: colors.backgroundColor,
                }}>
                <AppText style={{...styles.keywordHashTag, color: colors.gray[4]}}>#{data}</AppText>
            </View>
        );
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
                        {
                            userImage === '' || userImage === 'default-user' || userImage.startsWith('../') || userImage === 'default-img' ?
                            <Image
                            style={{
                                width: 90,
                                height: 90,
                                borderRadius: 60,
                                backgroundColor: colors.defaultColor,
                            }}
                            source={require('../../assets/images/default-profile.png')}
                            /> :
                            <Image source={{ uri: userImage }} style={{
                                width: 90,
                                height: 90,
                                borderRadius: 60,
                                backgroundColor: colors.defaultColor,
                            }} />
                        }
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
                            style={[{
                                flexDirection: 'row',
                                alignItems: 'center'
                            }, userKeywordData.length === 1 ? {justifyContent: 'center'} : {justifyContent: 'space-between'}]}
                        >
                            {
                                userKeywordData.length !== 0 &&
                                <View style={{flexDirection: 'row', marginTop: 4}}>{
                                    userKeywordData.map((data, idx) => (
                                        <UserKeyword data={data} key={idx + 'user'}/>
                                    ))
                                }</View>
                            }
                        </View>
                        <TouchableOpacity style={{marginTop: 8}} onPress={()=>navigation.navigate('ProfileSetting', {keywords: userData.keywords, img: userData.user_img})}>
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
    keywordHashTagView: {
        borderWidth: 1,
        borderRadius: 27,
        marginHorizontal: 2.5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    keywordHashTag: {
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 12
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
