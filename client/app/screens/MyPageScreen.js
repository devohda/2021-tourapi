import React, {useState, useEffect} from 'react';
import {Platform, View, Image, StyleSheet, Button, TouchableOpacity, Alert, Modal, Pressable} from 'react-native';
import {useTheme} from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

import AppText from '../components/AppText';
import ScreenContainer from '../components/ScreenContainer';
import MyPageNavigation from '../navigation/MypageNavigator';
import { useToken } from '../contexts/TokenContextProvider';
import {useIsSignedIn} from '../contexts/SignedInContextProvider';

// import SettingsIcon from '../assets/images/settings-icon.svg';
import SettingsIcon from '../assets/images/SystemSettingIcon.svg';
import ReportIcon from '../assets/images/Report.svg';

const MyPageScreen = ({navigation}) => {
    const {colors} = useTheme();
    const [token, setToken] = useToken();
    const [userData, setUserData] = useState({});
    const [isSignedIn, setIsSignedIn] = useIsSignedIn();

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
                    if(response.code === 401 || response.code === 403 || response.code === 419){
                        // Alert.alert('','로그인이 필요합니다');
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

    const [reportMenu, setReportMenu] = useState(false);
    const [confirmMenu, setConfirmMenu] = useState(false);

    const ReportModal = () => (
        <Modal
            transparent={true}
            visible={reportMenu}
            onRequestClose={() => {
                setReportMenu(!reportMenu);
            }}
        >
            <View style={styles.centeredView}>
                <View style={{...styles.modalView, backgroundColor: colors.backgroundColor}}>
                    <AppText style={{...styles.modalText, color: colors.blue[1]}}>해당 계정을 신고하시겠습니까?</AppText>
                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <Pressable
                            style={{...styles.button, backgroundColor: colors.gray[4]}}
                            onPress={() => setReportMenu(!reportMenu)}
                        >
                            <AppText style={styles.textStyle}>취소하기</AppText>
                        </Pressable>
                        <Pressable
                            style={{...styles.button, backgroundColor: colors.red[3]}}
                            onPress={() => {
                                setReportMenu(!reportMenu);
                                setConfirmMenu(true);
                            }}
                        >
                            <AppText style={styles.textStyle}>신고하기</AppText>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );

    const ConfirmModal = () => (
        <Modal
            transparent={true}
            visible={confirmMenu}
            onRequestClose={() => {
                setConfirmMenu(!confirmMenu);
            }}
        >
            <View style={styles.centeredView}>
                <View style={{...styles.modalView, backgroundColor: colors.backgroundColor}}>
                    <AppText style={{...styles.modalText, color: colors.blue[1]}}>신고되었습니다.</AppText>
                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <Pressable
                            style={{...styles.button, backgroundColor: colors.mainColor}}
                            onPress={() => {
                                setConfirmMenu(!confirmMenu);
                            }}
                        >
                            <AppText style={styles.textStyle}>확인</AppText>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );


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
                    <TouchableOpacity onPress={()=>setReportMenu(true)}>
                        <AppText style={{color: colors.mainColor, fontSize: 16, fontWeight: '400', lineHeight: 25.6}}>신고하기</AppText>
                    </TouchableOpacity>
                    <ReportModal />
                    <ConfirmModal />
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
                            source={require('../assets/images/here_default.png')}
                        />
                        <View style={{position: 'absolute', left: '17%', bottom: '65%', backgroundColor: colors.defaultColor, borderRadius: 50, padding: 7,
                            shadowOffset: {
                                width: 4,
                                height: 4
                            },
                            shadowOpacity: 0.25,
                            elevation: 1,
                            shadowColor: 'rgba(132, 92, 92, 0.14)',
                    }}>
                            <TouchableOpacity onPress={() => navigation.navigate('SystemSetting')}>
                                <SettingsIcon width={18} height={18} style={{color: colors.gray[5]}}/>
                            </TouchableOpacity>
                        </View>
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
        fontWeight: 'bold',
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
