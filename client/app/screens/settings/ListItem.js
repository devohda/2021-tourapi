import React, {memo, useState, useEffect} from 'react';
import {View, Image, Switch, StyleSheet, Pressable, Modal, FlatList, TextInput, Dimensions, Platform} from 'react-native';
import Constants from 'expo-constants';
import {useIsFocused, useTheme} from '@react-navigation/native';
import AppText from '../../components/AppText';
import { CheckBox } from 'react-native-elements';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';

import {TouchableOpacity} from 'react-native-gesture-handler';
import {useToken} from '../../contexts/TokenContextProvider';
import {useIsSignedIn} from '../../contexts/SignedInContextProvider';
import { myLocation } from '../../contexts/LocationContextProvider';

import hereIcon from '../../assets/images/appicon.png';

const windowHeight = Dimensions.get('window').height;

const ListItem = props => {
    const {colors} = useTheme();
    const [isEnabled, setIsEnabled] = useState(false);
    const [isLogout, setIsLogout] = useState(false);
    const [isWithdraw, setIsWithdraw] = useState(false);
    const [token, setToken] = useToken();
    const [isSignedIn, setIsSignedIn] = useIsSignedIn();
    const [location, setLocation] = myLocation();
    const [errorMsg, setErrorMsg] = useState(null);
    const isFocused = useIsFocused();

    useEffect(() => {
        if(location !== null) setIsEnabled(true);
    }, [isFocused])
    const askSearchLocation = async (type) => {
        console.log(type)
        if(type === true && location === null) {
            // 안드 에뮬은 안됨
            if (Platform.OS === 'android' && !Constants.isDevice) {
                setErrorMsg(
                  'Oops, this will not work on Snack in an Android emulator. Try it on your device!'
                );
                return;
            };

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                setIsEnabled(false);
                await (await Location.watchPositionAsync(           {
                    accuracy: Location.Accuracy.High,
                    distanceInterval: 1,
                    timeInterval: 1,
                  }, ()=>{
                    setIsEnabled(false);
                    setLocation(null);
                })).remove();
                const location = 'location';
                Location.hasStartedLocationUpdatesAsync(location).then((value) => {
                    if (value) {
                        Location.stopLocationUpdatesAsync(location);
                        setLocation(null);
                    }
                  });
                return;
            }
    
            let getLocation = await Location.getCurrentPositionAsync({});
            setLocation(getLocation);
            setIsEnabled(true);

        } else {
            await (await Location.watchPositionAsync(           {
                accuracy: Location.Accuracy.High,
                distanceInterval: 1,
                timeInterval: 1,
              }, ()=>{
                setIsEnabled(false);
                setLocation(null);
            })).remove();
            const location = 'location';
            Location.hasStartedLocationUpdatesAsync(location).then((value) => {
                if (value) {
                    Location.stopLocationUpdatesAsync(location);
                    setLocation(null);
                }
              });
        }
    }

    const toggleSwitch = () => {
        setIsEnabled(previousState => !previousState);
        askSearchLocation(!isEnabled);
    };

    const [reportMenu, setReportMenu] = useState(false);
    const [reportConfirmMenu, setReportConfirmMenu] = useState(false);
    const [withdrawConfirmMenu, setWithdrawConfirmMenu] = useState(false);
    const [askMenu, setAskMenu] = useState(false);
    const [askConfirmMenu, setAskConfirmMenu] = useState(false);

    const reportReasons = [
        {
            index: 1,
            title: '영리목적/홍보성'
        },
        {
            index: 2,
            title: '욕설/인신공격'
        },
        {
            index: 3,
            title: '음란성/선정성'
        },
        {
            index: 4,
            title: '도배/반복'
        },
        {
            index: 5,
            title: '개인정보노출'
        },
        {
            index: 6,
            title: '기타'
        },
    ];

    const ShowReportReasons = ({item, index}) => {
        const [isPressed, setIsPressed] = useState([
            false,
            false,
            false,
            false,
            false,
            false
        ]);

        return (
            <View style={{justifyContent: 'center', alignItems: 'flex-start', width: 150}}>
                <CheckBox
                    center
                    title={<AppText style={{color: colors.mainColor, padding: 5}}>{item.title}</AppText>}
                    containerStyle={{backgroundColor: colors.backgroundColor, borderWidth: 0, margin: 0, padding: 5, height: 40}}
                    textStyle={{fontSize: 16, lineHeight: 25.6, fontWeight: '400', textAlign: 'left'}}
                    checked={isPressed[index]}
                    onPress={()=>{
                        const newArr = [...isPressed];
                        if (newArr[index]) {
                            newArr[index] = false;
                            setIsPressed(arr => newArr);
                        } else {
                            for (let i = 0; i < newArr.length; i++) {
                                if (i == index) continue;
                                else newArr[i] = false;
                            }
                            newArr[index] = true;
                            setIsPressed(arr => newArr);
                        }
                    }}
                />
            </View>
        );
    };

    const ReportModal = () => (
        <Modal
            transparent={true}
            visible={reportMenu}
            onRequestClose={() => {
                setReportMenu(!reportMenu);
            }}
        >
            <View style={styles.centeredView}>
                <View style={{...styles.modalView, backgroundColor: colors.backgroundColor, height: windowHeight/1.9}}>
                    <AppText style={{...styles.modalText, color: colors.blue[1]}}>신고사유</AppText>
                    <FlatList columnWrapperStyle={{justifyContent: 'space-between'}} numColumns={2}
                        showsVerticalScrollIndicator={false}
                        style={{marginTop: 10}}
                        contentContainerStyle={{height: 120, marginBottom: -20}}
                        data={reportReasons} renderItem={({item, index}) => <ShowReportReasons item={item} index={index} key={index}/>}
                        keyExtractor={(item) => item.index} nestedScrollEnabled
                    />
                    <SafeAreaView>
                        <TextInput
                            style={{padding: 15, backgroundColor: colors.defaultColor, color: colors.mainColor, width: 295, height: 124}}
                            placeholder='기타 사유를 입력해주세요.'
                            placeholderTextColor={colors.gray[5]}
                            textAlignVertical={'top'}
                            autoCapitalize="none"
                            autoCorrect={false}
                            multiline
                        />
                    </SafeAreaView>
                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <Pressable
                            style={{...styles.button, backgroundColor: colors.defaultColor, width: 86,
                                shadowColor: 'rgba(203, 180, 180, 0.3)',
                                shadowOffset: {
                                    width: 3,
                                    height: 6
                                },
                                shadowOpacity: 0.25}}
                            onPress={() => setReportMenu(!reportMenu)}
                        >
                            <AppText style={{...styles.textStyle, color: colors.mainColor}}>취소하기</AppText>
                        </Pressable>
                        <Pressable
                            style={{...styles.button, backgroundColor: colors.red[3], width: 201,
                                shadowColor: 'rgba(203, 180, 180, 0.3)',
                                shadowOffset: {
                                    width: 3,
                                    height: 6
                                },
                                shadowOpacity: 0.25}}
                            onPress={() => {
                                setReportMenu(!reportMenu);
                                setReportConfirmMenu(true);
                            }}
                        >
                            <AppText style={styles.textStyle}>신고하기</AppText>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );

    const ReportConfirmModal = () => (
        <Modal
            transparent={true}
            visible={reportConfirmMenu}
            onRequestClose={() => {
                setReportConfirmMenu(!reportConfirmMenu);
            }}
        >
            <View style={styles.centeredView}>
                <View style={{...styles.modalView, backgroundColor: colors.backgroundColor}}>
                    <AppText style={{...styles.modalText, color: colors.blue[1]}}>신고되었습니다.</AppText>
                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <Pressable
                            style={{...styles.button, backgroundColor: colors.mainColor}}
                            onPress={() => {
                                setReportConfirmMenu(!reportConfirmMenu);
                            }}
                        >
                            <AppText style={styles.textStyle}>확인</AppText>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );

    const AskModal = () => (
        <Modal
            transparent={true}
            visible={askMenu}
            onRequestClose={() => {
                setAskMenu(!askMenu);
            }}
        >
            <View style={styles.centeredView}>
                <View style={{...styles.modalView, backgroundColor: colors.backgroundColor, height: windowHeight/2.9}}>
                    <AppText style={{...styles.modalText, color: colors.blue[1], marginBottom: 10}}>문의하기</AppText>
                    <SafeAreaView>
                        <TextInput
                            style={{padding: 15, backgroundColor: colors.defaultColor, color: colors.mainColor, width: 295, height: 124}}
                            placeholder='문의할 내용을 입력해주세요.'
                            placeholderTextColor={colors.gray[5]}
                            textAlignVertical={'top'}
                            autoCapitalize="none"
                            autoCorrect={false}
                            multiline
                        />
                    </SafeAreaView>
                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <Pressable
                            style={{...styles.button, backgroundColor: colors.defaultColor, width: 108,
                                shadowColor: 'rgba(203, 180, 180, 0.3)',
                                shadowOffset: {
                                    width: 3,
                                    height: 6
                                },
                                shadowOpacity: 0.25}}
                            onPress={() => setAskMenu(!askMenu)}
                        >
                            <AppText style={{...styles.textStyle, color: colors.mainColor}}>취소하기</AppText>
                        </Pressable>
                        <Pressable
                            style={{...styles.button, backgroundColor: colors.mainColor, width: 108,
                                shadowColor: 'rgba(203, 180, 180, 0.3)',
                                shadowOffset: {
                                    width: 3,
                                    height: 6
                                },
                                shadowOpacity: 0.25}}
                                onPress={() => {
                                setAskMenu(!askMenu);
                                setAskConfirmMenu(true);
                            }}
                        >
                            <AppText style={styles.textStyle}>문의하기</AppText>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );

    const AskConfirmModal = () => (
        <Modal
            transparent={true}
            visible={askConfirmMenu}
            onRequestClose={() => {
                setAskConfirmMenu(!askConfirmMenu);
            }}
        >
            <View style={styles.centeredView}>
                <View style={{...styles.modalView, backgroundColor: colors.backgroundColor, height: 200}}>
                    <AppText style={{...styles.modalText, color: colors.blue[1]}}>문의가 완료되었습니다.</AppText>
                    <AppText style={{...styles.modalText, color: colors.blue[1]}}>빠른 시일 내에 반영하도록 노력하겠습니다.</AppText>
                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <Pressable
                            style={{...styles.button, backgroundColor: colors.mainColor}}
                            onPress={() => {
                                setAskConfirmMenu(!askConfirmMenu);
                            }}
                        >
                            <AppText style={styles.textStyle}>확인</AppText>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );

    const LogoutModal = () => {
        return (
            <Modal
                transparent={true}
                visible={isLogout}
                onRequestClose={() => {
                    setIsLogout(!isLogout);
                }}
            >
                <View style={styles.centeredView}>
                    <View
                        style={{...styles.modalView, backgroundColor: colors.backgroundColor}}>
                        <AppText style={{...styles.modalText, color: colors.blue[1]}}>로그아웃
                            하시겠습니까?</AppText>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Pressable
                                style={{...styles.button, backgroundColor: colors.gray[4]}}
                                onPress={() => setIsLogout(!isLogout)}
                            >
                                <AppText style={styles.textStyle}>취소하기</AppText>
                            </Pressable>
                            <Pressable
                                style={{...styles.button, backgroundColor: colors.mainColor}}
                                onPress={() => {
                                    fetch('http://34.64.185.40/auth/logout', {
                                        method: 'DELETE',
                                        headers: {
                                            'Accept': 'application/json',
                                            'Content-Type': 'application/json',
                                            'x-access-token': token
                                        },
                                    }).then((res) => res.json())
                                        .then(async (response) => {
                                            setIsLogout(!isLogout);
                                            setToken(null);
                                            setIsSignedIn(false);
                                            await SecureStore.deleteItemAsync('accessToken');
                                        })
                                        .catch((err) => {
                                            console.error(err);
                                        });
                                }}
                            >
                                <AppText style={styles.textStyle}>로그아웃</AppText>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    };

    const WithdrawModal = () => {
        return (
            <Modal
                transparent={true}
                visible={isWithdraw}
                onRequestClose={() => {
                    setIsWithdraw(!isWithdraw);
                }}
            >
                <View style={styles.centeredView}>
                    <View
                        style={{...styles.modalView, backgroundColor: colors.backgroundColor, height: 200}}>
                        <AppText style={{...styles.modalText, color: colors.blue[1]}}>회원을 탈퇴하시겠습니까?</AppText>
                        <AppText style={{...styles.modalText, color: colors.blue[1]}}>해당 계정 관련 데이터가 모두 사라집니다.</AppText>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Pressable
                                style={{...styles.button, backgroundColor: colors.gray[4]}}
                                onPress={() => setIsWithdraw(!isWithdraw)}
                            >
                                <AppText style={styles.textStyle}>취소하기</AppText>
                            </Pressable>
                            <Pressable
                                style={{...styles.button, backgroundColor: colors.red[3]}}
                                onPress={() => {
                                    setIsWithdraw(!isWithdraw);
                                    setWithdrawConfirmMenu(!withdrawConfirmMenu);
                                }}
                            >
                                <AppText style={styles.textStyle}>탈퇴하기</AppText>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    };


    const WithdrawConfirmModal = () => (
        <Modal
            transparent={true}
            visible={withdrawConfirmMenu}
            onRequestClose={() => {
                setWithdrawConfirmMenu(!withdrawConfirmMenu);
            }}
        >
            <View style={styles.centeredView}>
                <View style={{...styles.modalView, backgroundColor: colors.backgroundColor, height: 200}}>
                    <AppText style={{...styles.modalText, color: colors.blue[1]}}>탈퇴가 완료되었습니다.</AppText>
                    <AppText style={{...styles.modalText, color: colors.blue[1]}}>히든쥬얼을 이용해주셔서 감사합니다.</AppText>
                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <Pressable
                            style={{...styles.button, backgroundColor: colors.mainColor}}
                            onPress={() => {
                                fetch('http://34.64.185.40/auth/account', {
                                        method: 'DELETE',
                                        headers: {
                                            'Accept': 'application/json',
                                            'Content-Type': 'application/json',
                                            'x-access-token': token
                                    },
                                }).then((res) => res.json())
                                    .then(async (response) => {
                                        setWithdrawConfirmMenu(!withdrawConfirmMenu);
                                        setToken(null);
                                        setIsSignedIn(false);
                                        await SecureStore.deleteItemAsync('accessToken');
                                })
                                .catch((err) => {
                                    console.error(err);
                                });
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
        <>
            {
                props.index === 1 ?
                    <View
                        style={props.index === 1 ? {...styles.list_style_version1} : {...styles.list_style_version2}}>
                        {props.index === 1 &&
                        <Image source={hereIcon} style={{width: 24, height: 24, marginEnd: 9}}></Image>}
                        <AppText style={{color: colors.mainColor, fontSize: 16, lineHeight: 20}}>{props.data}</AppText>
                        {/* {props.index === 2 && <Switch
                            trackColor={{false: colors.gray[6], true: colors.mainColor}}
                            thumbColor={colors.defaultColor}
                            ios_backgroundColor={colors.gray[6]}
                            onChange={toggleSwitch}
                            value={isEnabled}
                            style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
                        />} */}
                    </View> :
                    <View style={{...styles.list_style}}>
                        {
                            props.index === 3 ?
                                <>
                                    <TouchableOpacity onPress={() => {
                                        props.data === '로그아웃' && setIsLogout(true);
                                        props.data === '회원 탈퇴하기' && setIsWithdraw(true);
                                    }}>
                                        <AppText style={{
                                            color: props.data === '로그아웃' ? colors.gray[4] : colors.red[3],
                                            fontSize: 16,
                                            lineHeight: 20
                                        }}>{props.data}</AppText>
                                    </TouchableOpacity>
                                    <LogoutModal />
                                    <WithdrawModal />
                                    <WithdrawConfirmModal />
                                </> :
                                <>
                                    <TouchableOpacity disabled={props.data.startsWith('버전 정보') ? true: false} onPress={()=>{
                                        if(props.data === '신고하기') setReportMenu(true);
                                        else setAskMenu(true);
                                    }}>
                                        <AppText style={{
                                            color: colors.mainColor,
                                            fontSize: 16,
                                            lineHeight: 20
                                        }}>{props.data}</AppText>
                                    </TouchableOpacity>
                                    <ReportModal />
                                    <ReportConfirmModal />
                                    <AskModal />
                                    <AskConfirmModal />
                                </>
                        }
                    </View>
            }
        </>
    );
};

const areEqual = (prevProps, nextProps) => {
    const {isSelected} = nextProps;
    const {isSelected: prevIsSelected} = prevProps;

    /*if the props are equal, it won't update*/
    const isSelectedEqual = isSelected === prevIsSelected;

    return isSelectedEqual;
};

const styles = StyleSheet.create({
    header_text: {
        fontSize: 12,
        fontWeight: '500',
        lineHeight: 19.2,
        marginTop: 16
    },
    list_style: {
        marginBottom: 32
    },
    list_style_version1: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20
    },
    list_style_version2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20
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
        height: 43,
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

export default memo(ListItem, areEqual);