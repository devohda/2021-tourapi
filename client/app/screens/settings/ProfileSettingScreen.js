import React, {useState, useEffect} from 'react';
import {View, Image, StyleSheet, TouchableOpacity, TextInput, Alert} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {Icon} from 'react-native-elements';

import AppText from '../../components/AppText';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenContainerView from '../../components/ScreenContainerView';
import { useToken } from '../../contexts/TokenContextProvider';

import BackIcon from '../../assets/images/back-icon.svg';
import * as SecureStore from 'expo-secure-store';
import {useIsSignedIn} from '../../contexts/SignedInContextProvider';

const ProfileSettingScreen = ({route, navigation}) => {
    useEffect(() => {
        getUserData();
    }, []);

    const { colors } = useTheme();
    
    const [token, setToken] = useToken();
    const [isSignedIn, setIsSignedIn] = useIsSignedIn();
    const [userData, setUserData] = useState({});
    const [userNickname, setUserNickname] = useState('');
    const [isPress, setIsPress] = useState([]);
    const [keywordData, setKeywordData] = useState([
        {
            id : 1,
            data: '힐링'
        },
        {
            id: 2,
            data: '관광'
        }]);

    const getUserData = () => {
        try {
            fetch('http://localhost:3000/user', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
            }).then((res) => res.json())
                .then(async (response) => {
                    if(response.code === 401 || response.code === 403 || response.code === 419){
                        Alert.alert('','로그인이 필요합니다');
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }

                    setUserData(response.data);
                    setFalse();
                    setUserNickname(response.data.user_nickname);
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const setFalse = () => {
        var pressed = [];
        for (let i = 0; i < keywordData.length; i++) {
            pressed.push(false);
        }
        setIsPress(pressed);
    };

    const Keyword = ({keyword, idx}) => {
        console.log(keyword);
        return (
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <TouchableOpacity style={[styles.selectType, {
                    borderColor: colors.defaultColor,
                    backgroundColor: colors.defaultColor
                }]}>
                    <AppText
                        style={{...styles.selectTypeText, color: colors.mainColor}}>{keyword.data}</AppText>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <ScreenContainer backgroundColor={colors.backgroundColor}>
            <View flexDirection="row" style={{
                height: 24,
                marginBottom: 20,
                marginTop: 20,
                marginHorizontal: 20,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <View style={{position: 'absolute', left: 0}}>
                    <TouchableOpacity onPress={() => {navigation.goBack();}}>
                        <BackIcon style={{color: colors.mainColor}}/>
                    </TouchableOpacity>
                </View>
                <View style={{position: 'absolute', right: 0}}>
                    <TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} style={{flex: 1, height: '100%'}} onPress={() => {
                        // TODO 수정 코드 넣기
                        navigation.goBack();
                    }}>
                        <View>
                            <AppText style={{color: colors.mainColor, fontSize: 16, lineHeight: 23.68, fontWeight: '400'}}>완료</AppText>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <View
                style={{
                    backgroundColor: colors.backgroundColor
                }}
                className="profile-container"
            >
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
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
                    <View style={{position: 'absolute', paddingTop: 60, paddingLeft: 64}}>
                        <View style={{...styles.cameraIcon, backgroundColor: colors.defaultColor}}>
                            <Icon size={18} type="ionicon" name={'camera'} color={colors.gray[5]} style={{padding: 6}}/>
                        </View>
                    </View>
                </View>
            </View>

            <ScreenContainerView>
                <View style={{marginTop: 40}}>
                    <AppText style={{color: colors.mainColor, fontSize: 16, lineHeight: 23.68, fontWeight: '500', marginBottom: 12}}>닉네임</AppText>
                    <View style={{borderBottomWidth: 1, borderBottomColor: colors.mainColor}}>
                        <TextInput
                            style={{
                                color: colors.mainColor,
                                fontSize: 16,
                                lineHeight: 25.6,
                                fontWeight: '400',
                                paddingBottom: 8
                            }}
                            placeholderTextColor={colors.mainColor}
                            value={userNickname}
                            onChangeText={(name) => setUserNickname(name)}>
                        </TextInput>
                    </View>
                </View>

                <View style={{marginTop: 32}}>
                    <AppText style={{color: colors.mainColor, fontSize: 16, lineHeight: 23.68, fontWeight: '500', marginBottom: 12}}>사용자 키워드</AppText>
                    <View flexDirection="row">
                        <TouchableOpacity>
                            <Image source={require('../../assets/images/add_keyword.png')}
                                style={{width: 32, height: 32, marginEnd: 8.5}}></Image>
                        </TouchableOpacity>
                        {
                            keywordData.map((keyword, idx) => (
                                <Keyword keyword={keyword} key={idx}/>
                            ))
                        }
                    </View>
                </View>
            </ScreenContainerView>
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    selectType: {
        borderWidth: 1,
        paddingVertical: 1,
        paddingHorizontal: 8.5,
        borderRadius: 12,
        marginRight: 10,
        shadowColor: 'rgba(203, 180, 180, 0.3)',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        elevation: 1,
        width: 58, height: 28,
        alignItems: 'center',
        justifyContent: 'center'
    },
    selectTypeText: {
        fontSize: 14,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontWeight: '500',
        lineHeight: 20.72,
        marginVertical: 2
    },
    cameraIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        shadowColor: 'rgba(0, 0, 0, 0.15)',
        shadowOffset: {
            width: 4,
            height: 4
        },
        shadowOpacity: 0.25,
        elevation: 4,
    }
});

export default ProfileSettingScreen;