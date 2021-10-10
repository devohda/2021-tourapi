import React, {useState, useEffect, useRef} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Image,
    SafeAreaView,
    ScrollView,
    Dimensions,
    TextInput,
    Pressable,
    FlatList,
    Animated,
    TouchableHighlight,
    Modal,
    Alert
} from 'react-native';
import {useTheme, useIsFocused} from '@react-navigation/native';
import {Icon, ListItem, Button, BottomSheet} from 'react-native-elements';

import AppText from '../../components/AppText';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenDivideLine from '../../components/ScreenDivideLine';
import ScreenContainerView from '../../components/ScreenContainerView';

import BackIcon from '../../assets/images/back-icon.svg';
import MoreIcon from '../../assets/images/more-icon.svg';
import Jewel from '../../assets/images/jewel.svg';
import SlideMenu from '../../assets/images/menu_for_edit.svg';

import ShowPlacesForFree from './ShowPlacesForFree';
import { setUpdated } from '../../contexts/SetUpdateContextProviders';
import * as SecureStore from 'expo-secure-store';
import {useIsSignedIn} from '../../contexts/SignedInContextProvider';
import { useToken } from '../../contexts/TokenContextProvider';

import moment from 'moment';
import 'moment/locale/ko';

const windowWidth = Dimensions.get('window').width;

const AlternativeSpaceScreen = ({route, navigation}) => {
    const {colors} = useTheme();
    const { data } = route.params;
    const [placeData, setPlaceData] = useState({});
    const [isEditSpace, setIsEditSpace] = useState(false);
    const isFocused = useIsFocused();
    const [token, setToken] = useToken();

    useEffect(() => {
        getInitialData();
        () => {
            setPlaceData({});
        }
    }, [isFocused]);

    const getInitialData = () => {
        try {
            fetch(`http://34.64.185.40/place/${data.place_pk}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            }).then((res) => res.json())
                .then((response) => {
                    // console.log(response.data.placeData)
                    setPlaceData(response.data.placeData);
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const LikePlace = (pk) => {
        //공간 좋아요
        try {
            fetch(`http://34.64.185.40/like/place/${pk}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                }
            }).then((res) => res.json())
                .then(async (response) => {
                    if (response.code === 401 || response.code === 403 || response.code === 419) {
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }
                    getInitialData();
                    console.log(response)
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const DeleteLikedPlace = (pk) => {
        //공간 좋아요 삭제
        try {
            fetch(`http://34.64.185.40/like/place/${pk}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                }
            }).then((res) => res.json())
                .then(async (response) => {
                    if (response.code === 401 || response.code === 403 || response.code === 419) {
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }
                    getInitialData();
                    console.log(response);
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const checkType = (type) => {
        if (type === 12) {
            return '관광지';
        } else if (type === 14) {
            return '문화시설';
        } else if (type === 15) {
            return '축제/공연/행사';
        } else if (type === 28) {
            return '레포츠';
        } else if (type === 32) {
            return '숙박';
        } else if (type === 38) {
            return '쇼핑';
        } else if (type === 39) {
            return '음식';
        } else {
            return '기타';
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
                        navigation.goBack();}}>
                        <BackIcon style={{color: colors.mainColor}}/>
                    </TouchableOpacity>
                </View>
                <AppText style={{color: colors.mainColor, fontSize: 16, fontWeight: 'bold'}}>
                    대체 공간
                </AppText>
                <View style={{position: 'absolute', right: 0}}>
                    <TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                        style={{flex: 1, height: '100%'}}>
                        <MoreIcon style={{color: colors.mainColor}}/>
                    </TouchableOpacity>
                </View>
            </View>

            <ScreenContainerView>
                <View>
                    <View style={{flexDirection: 'row', marginTop: 16, marginBottom: 4, justifyContent: 'center', alignItems: 'center'}}>
                        <TouchableOpacity>
                            <View style={{flexDirection: 'row', width: '100%'}}>
                            { isEditSpace ?
                                <View style={{justifyContent: 'center', alignItems: 'center', marginEnd: 12}}>
                                    <Icon type="ionicon" name={"remove-circle"} color={colors.red[3]} size={28}/>
                                </View> :
                                <View style={{justifyContent: 'center', alignItems: 'center', marginEnd: 12}}>
                                    <View style={{borderRadius: 50, width: 24, height: 24, backgroundColor: colors.mainColor, justifyContent: 'center', alignItems: 'center'}}>
                                        <AppText style={{color: colors.defaultColor, fontSize: 12, lineHeight: 19.2, fontWeight: '500', textAlign: 'center'}}>1</AppText>
                                    </View>
                                </View>
                            }
                            {
                                data.place_img ?
                                <Image source={{uri: data.place_img}}
                                style={{borderRadius: 10, width: 72, height: 72, marginTop: 2}}/> :
                                <Image source={require('../../assets/images/here_default.png')}
                                style={{borderRadius: 10, width: 72, height: 72, marginTop: 2}}/> 
                            }
                                <View style={{
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    width: '67%'
                                }}>
                                    <View style={{marginLeft: 8, marginTop: '2%'}}>
                                        <View style={{flexDirection: 'row'}}>
                                            <AppText style={{
                                                color: colors.gray[3],
                                                textAlign: 'center',
                                                fontSize: 10,
                                                fontWeight: 'bold'
                                            }}>{checkType(data.place_type)}</AppText>
                                            <AppText style={{
                                                marginHorizontal: 4, color: colors.gray[7],
                                                textAlign: 'center',
                                                fontSize: 10,
                                                fontWeight: 'bold'
                                            }}>|</AppText>
                                            <Image source={require('../../assets/images/review_star.png')}
                                                style={{
                                                    width: 10,
                                                    height: 10,
                                                    alignSelf: 'center',
                                                    marginTop: '1%'
                                                }}></Image>
                                            <AppText style={{
                                                color: colors.gray[3],
                                                textAlign: 'center',
                                                fontSize: 10,
                                                fontWeight: 'bold',
                                                marginLeft: 2
                                            }}>4.8</AppText>
                                        </View>
                                        <View style={{width: '100%'}}>
                                            <AppText style={{
                                                fontSize: 16,
                                                fontWeight: 'bold',
                                                color: colors.mainColor,
                                                marginVertical: 5,
                                            }}>{data.place_name}</AppText>
                                        </View>
                                        <AppText
                                            style={{fontSize: 12, color: colors.gray[4]}}>{data.place_addr}</AppText>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            { !isEditSpace ?
                                <TouchableOpacity onPress={() => {
                                    if (placeData.like_flag) {
                                        DeleteLikedPlace(data.place_pk);
                                    } else {
                                        LikePlace(data.place_pk);
                                    }
                                }}>
                                    <Jewel width={26} height={21}
                                    style={{color: placeData.like_flag ? colors.red[3] : colors.red_gray[5]}}/>
                                </TouchableOpacity> :
                                <TouchableOpacity>
                                    <SlideMenu width={21} height={21} style={{marginLeft: 2}}/>
                                </TouchableOpacity>
                                }
                        </View>
                    </View>
                </View>
            </ScreenContainerView>

            <ScreenDivideLine />

            <ScreenContainerView>
                <View style={{marginTop: 16}}>
                    <View style={{marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View>
                            <AppText style={{color: colors.gray[4]}}>총 <AppText
                                // style={{fontWeight: '700'}}>{placeLength}개</AppText> 공간</AppText>
                                style={{fontWeight: '700'}}>0개</AppText> 대체공간</AppText>
                        </View>
                        <TouchableOpacity onPress={()=>{
                            navigation.navigate('SearchForAdd', {pk: 0, placeData: {}, day : {}});
                        }} style={!route.params.private && {display: 'none'}}>
                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                <Icon type="ionicon" name={'add-outline'} size={18} color={colors.mainColor} />
                                    <AppText style={{color: colors.mainColor, fontSize: 14, lineHeight: 22.4, fontWeight: '700'}}>공간 추가하기</AppText>
                            </View>
                        </TouchableOpacity>
                    </View>
                    {/* <SafeAreaView>
                        <SafeAreaView>
                            {
                                !isEditSpace ?
                                <SwipeList /> :
                                <FlatList data={placeData}
                                    renderItem={({item, index}) => <ShowPlacesForFree item={item} index={index} key={index} isEditPage={isEditPage} isPress={isPress} length={placeData.length} navigation={navigation} private={collectionData.is_creator} pk={collectionData.collection_pk}/>}
                                    keyExtractor={(item, idx) => {idx.toString();}}
                                    key={(item, idx) => {idx.toString();}}
                                    nestedScrollEnabled/>
                            }
                        </SafeAreaView>
                    </SafeAreaView> */}
                </View>
            </ScreenContainerView>
        </ScreenContainer>
    );
};


const styles = StyleSheet.create({
    titles: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    dirType: {
        borderWidth: 1,
        paddingVertical: 1,
        paddingHorizontal: 8,
        marginEnd: 8,
        borderRadius: 14,
        width: 43,
        height: 22,
        flexDirection: 'row',
        zIndex: 10000,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOpacity: 0.1,
        shadowOffset: {width: 0, height: 1},
        elevation: 1
    },
    dirFreeText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    reviewImage: {
        width: 56,
        height: 56,
        borderRadius: 50,
    },
    comment_box: {
        borderBottomWidth: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 5
    },
    //swipe style
    rowBack: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
        marginTop: 13,
        height: '100%'
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
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
    },
    authorImage: {
        width: 44,
        height: 44,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8
    },
});

export default AlternativeSpaceScreen;