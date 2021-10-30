import React, {useState, useEffect, useRef, useCallback} from 'react';
import {View, Image, StyleSheet, TouchableOpacity, TextInput, Alert, Platform} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {Icon} from 'react-native-elements';
import RBSheet from 'react-native-raw-bottom-sheet';
import * as ImagePicker from 'expo-image-picker';

import AppText from '../../components/AppText';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenContainerView from '../../components/ScreenContainerView';
import {useToken} from '../../contexts/TokenContextProvider';

import BackIcon from '../../assets/images/back-icon.svg';
import * as SecureStore from 'expo-secure-store';
import {useIsSignedIn} from '../../contexts/SignedInContextProvider';
import {useAlertDuplicated} from '../../contexts/LoginContextProvider';

const ProfileSettingScreen = ({route, navigation}) => {
    useEffect(() => {
        getKeywords();
        getUserData();
    }, []);

    const {colors} = useTheme();
    const {keywords, img} = route.params;
    const refRBSheet = useRef();

    const [token, setToken] = useToken();
    const [alertDuplicated, setAlertDuplicated] = useAlertDuplicated(false);
    const [isSignedIn, setIsSignedIn] = useIsSignedIn();
    const [userData, setUserData] = useState({});
    const [userNickname, setUserNickname] = useState('');
    const [isPress, setIsPress] = useState([]);
    const [keywordData, setKeywordData] = useState([]);
    const [userKeywordData, setUserKeywordData] = useState(keywords);
    const patterns = /[~!@#$%^&*()_+|<>?:{}]/;

    const getKeywords = useCallback(() => {
        try {
            fetch('http://34.64.185.40/keyword/list', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            }).then((res) => res.json())
                .then((response) => {
                    setKeywordData(response.data);
                    setFalse(response.data);
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    }, []);

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
                        setAlertDuplicated(true);
                    }

                    if (parseInt(response.code / 100) === 4) {
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }

                    setUserData(response.data);
                    setUserNickname(response.data.user_nickname);
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const updateUserData = () => {
        var datas = [];
        for (let i = 0; i < userKeywordData.length; i++) {
            for (let j = 0; j < keywordData.length; j++) {
                if (userKeywordData[i] === keywordData[j].keyword_title) {
                    datas.push(keywordData[j].keyword_pk);
                }
            }
        }

        var forPostData = {};
        let form = new FormData();

        if (image !== 'default-img' && image) {
            forPostData = {
                nickname: userNickname,
                keywords: datas,
            };
            let file = {
                uri: image,
                type: 'multipart/form-data',
                name: 'image.jpg',
            };
            form.append('img', file);

        } else {
            forPostData = {
                nickname: userNickname,
                keywords: datas,
                img: 'default-img',
            };
        }

        form.append('userData', JSON.stringify(forPostData));
        try {
            fetch('http://34.64.185.40/user/info', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-access-token': token
                },
                body: form
            }).then(res => res.json())
                .then(async response => {
                    if (response.code === 405 && !alertDuplicated) {
                        setAlertDuplicated(true);
                    }

                    if (parseInt(response.code / 100) === 4) {
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }

                    Alert.alert('', '프로필이 수정되었습니다.', [
                        {
                            text: 'OK', onPress: () => {
                                navigation.pop(1);
                            }
                        }]);
                })
                .catch((err) => {
                    console.error(err);
                    Alert.alert('', '프로필 수정에 실패했습니다. 다시 시도해주세요.');
                });

        } catch (err) {
            console.error(err);
        }
    };

    const setFalse = (data) => {
        var pressed = [];
        for (let i = 0; i < data.length; i++) {
            pressed.push(false);
        }
        setIsPress(pressed);
    };

    const SelectedKeyword = ({keyword, idx}) => {
        return (
            <View key={idx}
                  style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center'
                  }}
            >
                <TouchableOpacity style={[styles.selectType, {
                    borderColor: colors.defaultColor,
                    backgroundColor: colors.defaultColor
                }]}
                                  disabled={true}
                                  activeOpacity={0.8}
                >
                    <AppText
                        style={{...styles.selectTypeText, color: colors.mainColor}}>{keyword}</AppText>
                </TouchableOpacity>
            </View>
        );
    };

    const SelectKeyword = () => {
        const setF = () => {
            var pressed = [];
            for (let i = 0; i < keywordData.length; i++) {
                pressed.push(false);
            }
            return pressed;
        };

        const [pressed, setPressed] = useState(setF());

        const Keyword = ({keyword, idx}) => {
            return (
                <View key={idx}
                      style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center'
                      }}
                >
                    <TouchableOpacity onPress={() => {
                        if (pressed[keyword.keyword_pk - 1]) {
                            let newArr = [...pressed];
                            newArr[keyword.keyword_pk - 1] = false;
                            setPressed(newArr);
                        } else {
                            let newArr = [...pressed];
                            newArr[keyword.keyword_pk - 1] = true;
                            setPressed(newArr);
                        }
                    }} style={pressed[keyword.keyword_pk - 1] ? [styles.selectTypeClicked, {
                        borderColor: colors.mainColor,
                        backgroundColor: colors.mainColor,
                        shadowColor: colors.red[8]
                    }] : [styles.selectType, {
                        borderColor: colors.defaultColor,
                        backgroundColor: colors.defaultColor,
                        shadowColor: colors.red[8]
                    }]} activeOpacity={0.8}>
                        <AppText
                            style={pressed[keyword.keyword_pk - 1] ? {
                                ...styles.selectTypeTextClicked,
                                color: colors.defaultColor
                            } : {...styles.selectTypeText, color: colors.gray[3]}}>{keyword.keyword_title}</AppText>
                    </TouchableOpacity>
                </View>
            );
        };


        return (
            <>
                <TouchableOpacity onPress={() => refRBSheet.current.open()} activeOpacity={0.8}>
                    <Image source={require('../../assets/images/add_keyword.png')}
                           style={{width: 32, height: 32, marginEnd: 8.5}}></Image>
                </TouchableOpacity>
                <RBSheet
                    ref={refRBSheet}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    height={450}
                    customStyles={{
                        wrapper: {
                            backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        },
                        draggableIcon: {
                            backgroundColor: colors.gray[4],
                            width: 110
                        },
                        container: {
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10,
                            backgroundColor: colors.yellow[7],
                        }
                    }}
                >
                    <View style={{backgroundColor: colors.backgroundColor}}>
                        <ScreenContainerView>
                            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 19, marginBottom: 17}}>
                                <AppText style={{fontSize: 16, fontWeight: '500', color: colors.mainColor}}>보관함
                                    해시태그</AppText>
                                <AppText
                                    style={{fontSize: 12, color: colors.gray[5], alignSelf: 'center', marginLeft: 9}}>*
                                    최대 3개</AppText>
                            </View>
                            <><View style={{flexDirection: 'row'}}>
                                {
                                    keywordData.map((keyword, idx) => (
                                        <>{0 <= idx && idx <= 3 &&
                                        <Keyword keyword={keyword} key={idx + '0000'} idx={idx + '0000'}/>}</>
                                    ))
                                }
                            </View>
                                <View style={{flexDirection: 'row'}}>
                                    {
                                        keywordData.map((keyword, idx) => (
                                            <>{4 <= idx && idx <= 6 &&
                                            <Keyword keyword={keyword} key={idx + '1111'} idx={idx + '1111'}/>}</>
                                        ))
                                    }
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    {
                                        keywordData.map((keyword, idx) => (
                                            <>{7 <= idx && idx <= 10 &&
                                            <Keyword keyword={keyword} key={idx + '2222'} idx={idx + '2222'}/>}</>
                                        ))
                                    }
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    {
                                        keywordData.map((keyword, idx) => (
                                            <>{11 <= idx && idx <= 13 &&
                                            <Keyword keyword={keyword} key={idx + '3333'} idx={idx + '3333'}/>}</>
                                        ))
                                    }
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    {
                                        keywordData.map((keyword, idx) => (
                                            <>{14 <= idx && idx <= 17 &&
                                            <Keyword keyword={keyword} key={idx + '4444'} idx={idx + '4444'}/>}</>
                                        ))
                                    }
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    {
                                        keywordData.map((keyword, idx) => (
                                            <>{18 <= idx && idx <= 19 &&
                                            <Keyword keyword={keyword} key={idx + '5555'} idx={idx + '5555'}/>}</>
                                        ))
                                    }
                                </View>
                            </>
                            <View style={{marginTop: 30, marginBottom: 20, bottom: 0}}>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: pressed.filter(element => element === true).length > 0 && pressed.filter(element => element === true).length <= 3 ? colors.mainColor : colors.gray[5],
                                        height: 48,
                                        borderRadius: 10
                                    }}
                                    onPress={() => {
                                        setIsPress(pressed);
                                        var newArr = [];
                                        for (var i = 0; i < keywordData.length; i++) {
                                            if (pressed[i]) newArr.push(keywordData[i].keyword_title);
                                        }
                                        setUserKeywordData(newArr);
                                    }}
                                    disabled={pressed.filter(element => element === true).length > 0 && pressed.filter(element => element === true).length <= 3 ? false : true}
                                    activeOpacity={0.8}
                                ><AppText
                                    style={{
                                        textAlign: 'center',
                                        padding: 14,
                                        fontSize: 16,
                                        color: colors.defaultColor,
                                        fontWeight: 'bold'
                                    }}
                                >선택완료</AppText>
                                </TouchableOpacity>
                            </View>
                        </ScreenContainerView>
                    </View>
                </RBSheet>
            </>
        );
    };

    const [image, setImage] = useState(img);
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.uri);
        }
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
                    <TouchableOpacity onPress={() => {
                        navigation.pop(1);
                    }} activeOpacity={0.8}>
                        <BackIcon style={{color: colors.mainColor}}/>
                    </TouchableOpacity>
                </View>
                <View style={{position: 'absolute', right: 0}}>
                    <TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                                      style={{flex: 1, height: '100%'}} onPress={() => {
                        if (patterns.test(userNickname) && userNickname.length > 12) Alert.alert('', `닉네임이 너무 길어요. (영문 기준 12자 이내)${'\n'}특수문자는 사용할 수 없어요.`);
                        else if (patterns.test(userNickname)) Alert.alert('', '특수문자는 사용할 수 없어요.');
                        else if (userNickname.length > 12) Alert.alert('', '닉네임이 너무 길어요. (영문 기준 12자 이내)');
                        else updateUserData();
                    }} activeOpacity={0.8}>
                        <View>
                            <AppText style={{
                                color: colors.mainColor,
                                fontSize: 16,
                                lineHeight: 23.68,
                                fontWeight: '400'
                            }}>완료</AppText>
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
                        {image === '' || image === 'default-user' || image.startsWith('../') || image === 'default-img' ?
                            <Image
                                style={{
                                    width: 90,
                                    height: 90,
                                    borderRadius: 60,
                                    backgroundColor: colors.defaultColor,
                                }}
                                source={require('../../assets/images/default-profile.png')}
                            /> :
                            <Image source={{uri: image}} style={{
                                width: 90,
                                height: 90,
                                borderRadius: 60,
                                backgroundColor: colors.defaultColor,
                            }}/>
                        }
                    </View>
                    <View style={{position: 'absolute', paddingTop: 60, paddingLeft: 64}}>
                        <TouchableOpacity onPress={() => {
                            (async () => {
                                if (Platform.OS !== 'web') {
                                    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
                                    if (status !== 'granted') {
                                        alert('Sorry, we need camera roll permissions to make this work!');
                                    } else {
                                        pickImage();
                                      }
                                }
                            })();
                        }} activeOpacity={0.8}>
                            <View style={{...styles.cameraIcon, backgroundColor: colors.defaultColor}}>
                                <Icon size={18} type="ionicon" name={'camera'} color={colors.gray[5]}
                                      style={{padding: 6}}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <ScreenContainerView>
                <View style={{marginTop: 40}}>
                    <AppText style={{
                        color: colors.mainColor,
                        fontSize: 16,
                        lineHeight: 23.68,
                        fontWeight: '500',
                        marginBottom: 12
                    }}>닉네임</AppText>
                    <View style={{borderBottomWidth: 1, borderBottomColor: colors.mainColor}}>
                        <TextInput
                            style={{
                                color: colors.mainColor,
                                fontSize: 16,
                                lineHeight: 25.6,
                                fontWeight: '400',
                                paddingBottom: 8
                            }}
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholderTextColor={colors.mainColor}
                            value={userNickname}
                            onChangeText={(name) => setUserNickname(name)}>
                        </TextInput>
                    </View>
                </View>

                <View style={{marginTop: 32}}>
                    <AppText style={{
                        color: colors.mainColor,
                        fontSize: 16,
                        lineHeight: 23.68,
                        fontWeight: '500',
                        marginBottom: 12
                    }}>사용자 키워드</AppText>
                    <View flexDirection="row">
                        <SelectKeyword/>
                        {
                            userKeywordData.map((keyword, idx) => {
                                return (
                                    <SelectedKeyword keyword={keyword} key={idx + 'selected'}/>
                                );
                            })
                        }
                    </View>
                </View>
            </ScreenContainerView>
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
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
    },
    selectTypeClicked: {
        borderWidth: 1,
        paddingVertical: 4,
        paddingHorizontal: 16,
        borderRadius: 30,
        marginVertical: 7.5,
        marginRight: 10,
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    selectTypeTextClicked: {
        fontSize: 14,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontWeight: 'bold',
        marginVertical: 2
    },
    selectTypeText: {
        fontSize: 14,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontWeight: '500',
        marginVertical: 2,
        color: '#98A3B5'
    },
    selectType: {
        borderWidth: 1,
        paddingVertical: 4,
        paddingHorizontal: 16,
        borderRadius: 30,
        marginRight: 10,
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default ProfileSettingScreen;