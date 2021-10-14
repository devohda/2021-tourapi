import React, {memo, useState} from 'react';
import {View, Image, Switch, StyleSheet, Pressable, Modal, FlatList, TextInput, Dimensions} from 'react-native';
import {useTheme} from '@react-navigation/native';
import AppText from '../../components/AppText';
import { CheckBox } from 'react-native-elements';

import hereIcon from '../../assets/images/appicon.png';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useToken} from '../../contexts/TokenContextProvider';
import * as SecureStore from 'expo-secure-store';
import {useIsSignedIn} from '../../contexts/SignedInContextProvider';
import { SafeAreaView } from 'react-native-safe-area-context';

const windowHeight = Dimensions.get('window').height;

const ListItem = props => {
    const {colors} = useTheme();
    const [isEnabled, setIsEnabled] = useState(false);
    const [isLogout, setIsLogout] = useState(false);
    const [token, setToken] = useToken();
    const [isSignedIn, setIsSignedIn] = useIsSignedIn();

    const toggleSwitch = () => {
        setIsEnabled(previousState => !previousState);
    };

    const [reportMenu, setReportMenu] = useState(false);
    const [confirmMenu, setConfirmMenu] = useState(false);

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
                        style={{marginTop: 10, marginBottom: 10}}
                        contentContainerStyle={{height: 120}}
                        data={reportReasons} renderItem={({item, index}) => <ShowReportReasons item={item} index={index} key={index}/>}
                        keyExtractor={(item) => item.index} nestedScrollEnabled
                    />
                    <SafeAreaView>
                        <TextInput
                            style={{padding: 15, backgroundColor: colors.defaultColor, width: 295, height: 124}}
                            placeholder='기타 사유를 입력해주세요'
                            textAlignVertical={'top'}
                            autoCapitalize="none"
                            autoCorrect={false}
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
                                shadowOpacity: 0.25,
                                elevation: 1}}
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
                                shadowOpacity: 0.25,
                                elevation: 1}}
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
        <>
            {
                props.index === 1 || props.index === 2 ?
                    <View
                        style={props.index === 1 ? {...styles.list_style, ...styles.list_style_version1} : {...styles.list_style, ...styles.list_style_version2}}>
                        {props.index === 1 &&
                        <Image source={hereIcon} style={{width: 24, height: 24, marginEnd: 9}}></Image>}
                        <AppText style={{color: colors.mainColor, fontSize: 16, lineHeight: 20}}>{props.data}</AppText>
                        {props.index === 2 && <Switch
                            trackColor={{false: colors.gray[6], true: colors.mainColor}}
                            thumbColor={colors.defaultColor}
                            ios_backgroundColor={colors.gray[6]}
                            onChange={toggleSwitch}
                            value={isEnabled}
                        />}
                    </View> :
                    <View style={{...styles.list_style}}>
                        {
                            props.index === 4 ?
                                <>
                                    <TouchableOpacity onPress={() => {
                                        props.data === '로그아웃' && setIsLogout(true);
                                    }}>
                                        <AppText style={{
                                            color: props.data === '로그아웃' ? colors.gray[4] : colors.red[3],
                                            fontSize: 16,
                                            lineHeight: 20
                                        }}>{props.data}</AppText>
                                    </TouchableOpacity>
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
                                </> :
                                <>
                                    <TouchableOpacity disabled={props.data !== '신고하기' ? true: false} onPress={()=>setReportMenu(true)}>
                                        <AppText style={{
                                            color: colors.mainColor,
                                            fontSize: 16,
                                            lineHeight: 20
                                        }}>{props.data}</AppText>
                                    </TouchableOpacity>
                                    <ReportModal />
                                    <ConfirmModal />
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
        alignItems: 'center'
    },
    list_style_version2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
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