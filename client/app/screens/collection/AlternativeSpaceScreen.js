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
import RBSheet from 'react-native-raw-bottom-sheet';
import {Card} from '@ui-kitten/components';

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
    const refRBSheet = useRef();

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

    const [deleteMenu, setDeleteMenu] = useState(false);

    const list = [
        { 
            title: '대체공간 수정',
            containerStyle: { backgroundColor: colors.backgroundColor },
            titleStyle: { color: colors.mainColor, fontSize: 16, fontWeight: '500', lineHeight: 25.6 },
        },
        {
            title: '대체공간 삭제',
            containerStyle: { backgroundColor: colors.backgroundColor },
            titleStyle: { color: colors.red[3], fontSize: 16, fontWeight: '500', lineHeight: 25.6 },
        },
    ];
    
    const DeleteModal = props => (
        <Modal
            transparent={true}
            visible={deleteMenu}
            onRequestClose={() => {
                setDeleteMenu(!deleteMenu);
                props.refRBSheet.current.close();
            }}
            style={{backgroundColor: colors.backgroundColor, maxHeight: '100%', borderRadius: 10, width: '95%'}}
        >
        <View style={styles.centeredView}>
            <View style={{...styles.modalView, backgroundColor: colors.backgroundColor}}>
                <View style={{marginTop: 55}}>
                    <AppText style={{color: colors.mainColor, fontSize: 14, lineHeight: 22.4, fontWeight: '700', textAlign: 'center'}}>한줄팁을 삭제할까요?</AppText>
                </View>
                <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 49}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
                        <TouchableOpacity onPress={() => {
                                props.refRBSheet.current.close();
                                setDeleteMenu(!deleteMenu);
                        }}>
                            <View style={{width: 138, height: 43, borderRadius: 10, backgroundColor: colors.defaultColor, justifyContent: 'center', alignItems: 'center', marginHorizontal: 9.5, ...styles.shadowOption}}>
                                <AppText style={{padding: 4, color: colors.mainColor, fontSize: 14, textAlign: 'center', lineHeight: 22.4, fontWeight: '500'}}>취소하기</AppText>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            props.refRBSheet.current.close();
                            setDeleteMenu(!deleteMenu);
                            // deleteCollection();
                        }}>
                            <View style={{width: 138, height: 43, borderRadius: 10, backgroundColor: colors.red[3], justifyContent: 'center', alignItems: 'center', marginHorizontal: 9.5, ...styles.shadowOption}}>
                                <AppText style={{padding: 4, color: colors.defaultColor, fontSize: 14, textAlign: 'center', lineHeight: 22.4, fontWeight: '500'}}>삭제하기</AppText>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    </Modal>

        // <Modal
        //     transparent={true}
        //     visible={deleteMenu}
        //     onRequestClose={() => {
        //         setDeleteMenu(!deleteMenu);
        //         props.refRBSheet.current.close();
        //     }}
        //     style={{backgroundColor: colors.backgroundColor, maxHeight: '100%', borderRadius: 10, width: '95%'}}
        // >
        //     <View style={styles.centeredView}>
        //         <View style={{...styles.modalView, backgroundColor: colors.backgroundColor}}>
        //             <View style={{marginTop: 55}}>
        //                 <AppText style={{...styles.modalText, color: colors.blue[1]}}>대체공간을 삭제할까요?</AppText>
        //             </View>
        //             <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
        //                 <Pressable
        //                     style={{...styles.button, backgroundColor: colors.gray[4]}}
        //                     onPress={() => {
        //                         props.refRBSheet.current.close();
        //                         setDeleteMenu(!deleteMenu);
        //                     }}
        //                 >
        //                     <AppText style={styles.textStyle}>취소하기</AppText>
        //                 </Pressable>
        //                 <Pressable
        //                     style={{...styles.button, backgroundColor: colors.red[3]}}
        //                     onPress={() => {
        //                         props.refRBSheet.current.close();
        //                         setDeleteMenu(!deleteMenu);
        //                         deleteCollection();
        //                     }}
        //                 >
        //                     <AppText style={styles.textStyle}>삭제하기</AppText>
        //                 </Pressable>
        //             </View>
        //         </View>
        //     </View>
        // </Modal>
    );

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
                {route.params.private && <>
                    {
                        !isEditSpace ?
                        <View style={{position: 'absolute', right: 0}}>
                            <TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                                style={{flex: 1, height: '100%'}} onPress={() => {
                                refRBSheet.current.open();
                                }}>
                                <MoreIcon style={{color: colors.mainColor}}/>
                            </TouchableOpacity>
                            <RBSheet
                            ref={refRBSheet}
                            closeOnDragDown={true}
                            closeOnPressMask={true}
                            height={180}
                            customStyles={{
                                wrapper: {
                                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                },
                                draggableIcon: {
                                    display: 'none'
                                },
                                container: {
                                    borderTopLeftRadius: 10,
                                    borderTopRightRadius: 10,
                                    backgroundColor: colors.yellow[7],
                                    paddingTop: 10
                                }
                            }}>
                                {list.map((l, i) => (
                                <TouchableOpacity onPress={()=>{
                                    if(i === 0) {
                                        setIsEditSpace(true);
                                        refRBSheet.current.close();
                                    }
                                    if(i === 1) {
                                        setDeleteMenu(true);
                                    }
                                }}>
                                    <View key={i} style={{marginLeft: 20, marginVertical: 11.5}}>
                                        <AppText style={l.titleStyle}>{l.title}</AppText>
                                    </View>
                                </TouchableOpacity>
                                ))}
                                <DeleteModal refRBSheet={refRBSheet}/>
                            </RBSheet>
                        </View> :
                            <View style={{position: 'absolute', right: 0}}>
                                <TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} style={{flex: 1, height: '100%'}}
                                    onPress={() => {
                                        setIsEditSpace(false);
                                        // console.log('나 맞아용!!!!!!')
                                        // isDeleted(isDeletedOrigin);
                                        // checkDeletedPlace();
                                    }}>
                                    <View>
                                        <AppText style={{color: colors.mainColor, fontSize: 16, lineHeight: 19.2, fontWeight: '700'}}>완료</AppText>
                                    </View>
                                </TouchableOpacity>
                            </View>
                    }</>}
            </View>
            <ScreenContainerView>
                <View>
                    <View style={{flexDirection: 'row', marginTop: 16, marginBottom: 4, justifyContent: 'center', alignItems: 'center'}}>
                        <TouchableOpacity>
                            <View style={{flexDirection: 'row', width: '100%'}}>
                                <View style={{justifyContent: 'center', alignItems: 'center', marginEnd: 12}}>
                                    <View style={{borderRadius: 50, width: 24, height: 24, backgroundColor: colors.mainColor, justifyContent: 'center', alignItems: 'center'}}>
                                        <AppText style={{color: colors.defaultColor, fontSize: 12, lineHeight: 19.2, fontWeight: '500', textAlign: 'center'}}>1</AppText>
                                    </View>
                                </View>
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
                            <TouchableOpacity onPress={() => {
                                    if (placeData.like_flag) {
                                        DeleteLikedPlace(data.place_pk);
                                    } else {
                                        LikePlace(data.place_pk);
                                    }
                                }}>
                                <Jewel width={26} height={21}
                                    style={{color: placeData.like_flag ? colors.red[3] : colors.red_gray[5]}}/>
                            </TouchableOpacity>
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
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 0,
        justifyContent: 'center',
        alignItems: 'center',
        height: 193
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

    //대체공간 삭제 모달
    backdrop: {
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    planContainer : {
        // height: 30,
        paddingVertical: 6,
        paddingLeft: 6,
        paddingRight: 5,
        marginBottom: 6,
        marginRight: 4,
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '88%'
    },
    freeContainer: {
        // height: 30,
        paddingVertical: 6,
        paddingLeft: 6,
        paddingRight: 5,
        marginBottom: 6,
        marginRight: 4,
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '88%'
    },
    shadowOption: {
        shadowOffset: {
            width: 6,
            height: 6
        },
        shadowOpacity: 0.25,
        elevation: 1,
        shadowColor: 'rgba(203, 180, 180, 0.3)',
    }
});

export default AlternativeSpaceScreen;