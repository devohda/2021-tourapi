import React, {useState, useEffect} from 'react';
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
import styled from 'styled-components/native';
import {Icon, ListItem, Button, BottomSheet} from 'react-native-elements';
import { SwipeListView } from 'react-native-swipe-list-view';

// import MapView, {Marker} from 'react-native-maps';
import AppText from '../../components/AppText';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenDivideLine from '../../components/ScreenDivideLine';
import ScreenContainerView from '../../components/ScreenContainerView';
import { tipsList } from '../../contexts/TipsListContextProvider';

import BackIcon from '../../assets/images/back-icon.svg';
import MoreIcon from '../../assets/images/more-icon.svg';
import Jewel from '../../assets/images/jewel.svg';
import DefaultProfile from '../../assets/images/profile_default.svg';

import {useToken} from '../../contexts/TokenContextProvider';
// import DragAndDropListForFree from './DragAndDropListForFree';
import ShowPlacesForFree from './ShowPlacesForFree';
import { setUpdated } from '../../contexts/SetUpdateContextProviders';
import * as SecureStore from 'expo-secure-store';
import {useIsSignedIn} from '../../contexts/SignedInContextProvider';

import moment from 'moment';
import 'moment/locale/ko';

const windowWidth = Dimensions.get('window').width;

const FreeCollectionScreen = ({route, navigation}) => {
    const {colors} = useTheme();
    const {data} = route.params;
    const [collectionData, setCollectionData] = useState({});
    const [placeData, setPlaceData] = useState([]);
    const [commentsData, setCommentsData] = useState([]);
    const [placeLength, setPlaceLength] = useState(0);
    const [isLimited, setIsLimited] = useState(true);
    const [isTrue, setIsTrue] = useState(false);
    const [tmpData, setTmpData] = tipsList();
    const [tmpPlaceData, setTmpPlaceData] = useState([]);
    const [visible, setVisible] = useState(false);
    const [isEditPage, setIsEditPage] = useState(false);
    const isFocused = useIsFocused();
    const [isLiked, setIsLiked] = useState(false);

    const [token, setToken] = useToken();
    const [userData, setUserData] = useState({});
    const [isSignedIn, setIsSignedIn] = useIsSignedIn();
    const [update, setUpdate] = setUpdated();

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

    useEffect(() => {
        if(typeof data.collection_private !== 'boolean') {
            getInitialCollectionData();
            getInitialPlaceData();
            getCollectionCommentsData();
        }

        setTmpData([
            {
                id: 1,
                tip: '근처에 xxx파전 맛집에서 막걸리 한잔 캬',
            },
            {
                id: 2,
                tip: '두번째 팁'
            }
        ]);
        getUserData();
        // setUpdate(false)
    }, [isFocused]);

    const getInitialCollectionData = () => {
        try {
            fetch(`http://34.64.185.40/collection/${data.collection_pk}`, {
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

                    setCollectionData(response.data);
                    // setPlaceLength(response.data.places.length);
                    // setFalse();
                    // console.log(response.data)
                    // setIsTrue(userData.user_pk === data.user_pk && collectionData.collection_private === 0);
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const getInitialPlaceData = () => {
        try {
            fetch(`http://34.64.185.40/collection/${data.collection_pk}/places`, {
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

                    setPlaceData(response.data);
                    setPlaceLength(response.data.length);
                    setFalse();
                    // console.log(response.data)
                    // setIsTrue(userData.user_pk === data.user_pk && collectionData.collection_private === 0);
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const getCollectionCommentsData = () => {
        try {
            fetch(`http://34.64.185.40/collection/${data.collection_pk}/comments`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
            }).then((res) => res.json())
                .then(async (response) => {
                    if(response.code === 401 || response.code === 403 || response.code === 419){
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }
                    setCommentsData(response.data)
                    console.log(response.data)
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const [comments, setComments] = useState('');

    const postCollectionCommentsData = (comment) => {
        try {
            fetch(`http://34.64.185.40/collection/${data.collection_pk}/comments`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
                body: JSON.stringify({
                    comment: comment
                })
            }).then((res) => res.json())
                .then(async (response) => {
                    if(response.code === 401 || response.code === 403 || response.code === 419){
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }
                    console.log(response.data)
                    getCollectionCommentsData();
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const deletePlace = (place_pk) => {
        try {
            fetch(`http://34.64.185.40/collection/${collectionData.collection_pk}/place/${place_pk}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
                body: JSON.stringify({
                    planDay: -1,
                })
            }).then((res) => res.json())
                .then(async (response) => {
                    if(response.code === 401 || response.code === 403 || response.code === 419){
                        // Alert.alert('','로그인이 필요합니다');
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }

                    getInitialPlaceData();
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const checkTrue = () => {
        //생성에서 바로 넘어오는 데이터 처리
        if(typeof data === 'undefined') {
            if (collectionData.collection_private === 0) return false;
        } else {
            if (data.collection_private === false) return false;
        }
        if (collectionData.collection_private === 0) return false;
        return true;
    };

    const checkPrivate = () => {
        //생성에서 바로 넘어오는 데이터 처리
        if(typeof data.collection_private === 'boolean') {
            return false;
        } else {
            if (collectionData.is_creator) {
                return true;
            }
        }
        return false;
    };

    const checkCreated = () => {
        if(data.collection_private === true || data.collection_private === false) {
            return false;
        } else {
            if(collectionData.is_creator) return false;
        }
        return true;
    };

    const [isPress, setIsPress] = useState([]);
    const setFalse = () => {
        var pressed = [];
        for (let i = 0; i < placeLength; i++) {
            pressed.push(false);
        }
        setIsPress(pressed);
    };

    const deleteCollection = () => {
        try {
            fetch(`http://34.64.185.40/collection/${collectionData.collection_pk}`, {
                method: 'DELETE',
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

                    Alert.alert('', '삭제되었습니다.');
                    navigation.goBack();
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const LikeCollection = () => {
        //보관함 좋아요
        try {
            fetch(`http://34.64.185.40/like/collection/${collectionData.collection_pk}`, {
                method: 'POST',
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

                    getInitialCollectionData();
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const DeleteLikedCollection = () => {
        //보관함 좋아요 삭제
        try {
            fetch(`http://34.64.185.40/like/collection/${collectionData.collection_pk}`, {
                method: 'DELETE',
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

                    getInitialCollectionData();
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const Keyword = props => {
        return (
            <AppText style={{color: colors.gray[2], fontSize: 10, marginEnd: 8}}># {props.keyword}</AppText>
        );
    };

    const SwipeList = () => {
        return (
            <>
                <SafeAreaView>
                <FlatList data={placeData}
                    renderItem={({item, index}) => <ShowPlacesForFree item={item} index={index} key={index} isEditPage={isEditPage} isPress={isPress} length={placeData.length} navigation={navigation} private={collectionData.is_creator} pk={collectionData.collection_pk}/>}
                    keyExtractor={(item, idx) => {idx.toString();}}
                    key={(item, idx) => {idx.toString();}}
                nestedScrollEnabled/>
                </SafeAreaView>
            </>
        );};
    
    const [showMenu, setShowMenu] = useState(false);
    const keywords = data.keywords;
    const [deleteMenu, setDeleteMenu] = useState(false);

    const deleteMode = () => {
        setDeleteMenu(true);
    };

    const [isVisible, setIsVisible] = useState(false);
    const list = [
        { title: '프로필 수정하기',
        onPress: () => {
            setIsVisible(false)
        }},
        { title: '공간 수정하기',
        onPress: () => {
            setIsVisible(false)
        }},
        { title: '공유하기',
        onPress: () => {
            setIsVisible(false)
        }
        },
        {
            title: '삭제하기',
            containerStyle: { backgroundColor: colors.red[3] },
            titleStyle: { color: colors.defaultColor },
            onPress: () => {
                deleteMode();
                setIsVisible(false)
            }
        },
    ];

    const DeleteModal = () => (
        <Modal
            transparent={true}
            visible={deleteMenu}
            onRequestClose={() => {
                setDeleteMenu(!deleteMenu);
            }}
        >
            <View style={styles.centeredView}>
                <View style={{...styles.modalView, backgroundColor: colors.backgroundColor}}>
                    <AppText style={{...styles.modalText, color: colors.blue[1]}}>보관함을 삭제하시겠습니까?</AppText>
                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <Pressable
                            style={{...styles.button, backgroundColor: colors.gray[4]}}
                            onPress={() => setDeleteMenu(!deleteMenu)}
                        >
                            <AppText style={styles.textStyle}>취소하기</AppText>
                        </Pressable>
                        <Pressable
                            style={{...styles.button, backgroundColor: colors.mainColor}}
                            onPress={() => {
                                setDeleteMenu(!deleteMenu);
                                deleteCollection();
                                setIsVisible(true);
                            }}
                        >
                            <AppText style={styles.textStyle}>삭제하기</AppText>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );

    const setBGColor = (idx) => {
        if (idx === 0 || idx === 2) {
            return colors.red[3];
        } else if (idx === 1 || idx === 6) {
            return '#FFC36A';
        } else if (idx === 3 || idx === 8) {
            return '#639A94';
        } else if (idx === 4 || idx === 5) {
            return colors.blue[2];
        } else {
            return '#8F6DA4';
        }
    };

    const ShowComments = props => {
        const { data, idx } = props;
        return (
            <>
            <View flexDirection="row" style={{flex: 1, alignItems: 'flex-start'}}>
                <View style={{...styles.authorImage, backgroundColor: setBGColor(idx)}}>
                    <DefaultProfile width={36} height={36}/>
                </View>
                <View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 8,
                        flexWrap: 'wrap'
                    }}>
                        <AppText style={{color: colors.mainColor, fontSize: 12}}>{data.user_nickname}</AppText>
                        <AppText style={{
                            marginHorizontal: 8,
                            color: colors.gray[5],
                            fontSize: 10
                        }}>|</AppText>
                        <AppText style={{color: colors.gray[4], fontSize: 12}}>{moment(data.cc_create_time).format('YY.MM.DD')}</AppText>
                    </View>
                    <View style={{flex: 1, width: '100%'}}><AppText style={{
                        fontSize: 12,
                        color: colors.mainColor,
                        lineHeight: 16,
                        fontWeight: '700',
                        flexWrap: 'wrap',
                        width: windowWidth - 100
                    }}>{data.collection_comment}
                    </AppText></View>
                </View>
            </View>

            <View style={{
                width: '100%',
                height: 1,
                backgroundColor: colors.red_gray[6],
                zIndex: -1000,
                marginVertical: 12
            }}></View>
            </>
        )
    };

    return (
        <ScreenContainer backgroundColor={colors.backgroundColor}>
            {
                showMenu && (
                    <>
                        <View style={{
                            position: 'absolute',
                            width: 80,
                            // height: 80,
                            height: 40,
                            top: 50,
                            right: 60,
                            backgroundColor: '#fff',
                            flex: 1,
                            borderRadius: 10,
                            zIndex: 100000000,
    
                            shadowColor: '#000',
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,
    
                            overflow: 'visible'
                        }}>
                            {/* <TouchableOpacity
                            onPress={() => {
                                setIsEditPage(true);
                                setShowMenu(state => !state);
                            }}
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}><AppText>수정하기</AppText>
                        </TouchableOpacity> */}
                            <View style={{
                                height: 1,
                                borderColor: colors.gray[5],
                                borderWidth: 0.4,
                                borderRadius: 1,
                            }}></View>
                            <TouchableOpacity
                                onPress={async () => {
                                    await deleteMode();
                                }}
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}><AppText>삭제하기</AppText></TouchableOpacity>
                            <DeleteModal />
                        </View>
                    </>
                )
            }

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
                        if(typeof data.collection_private === 'boolean') {
                            navigation.pop(2);
                        }
                        else navigation.goBack();}}>
                        <BackIcon style={{color: colors.mainColor}}/>
                    </TouchableOpacity>
                </View>
                {checkPrivate() && <>
                    {
                        !isEditPage ?
                            <View style={{position: 'absolute', right: 0}}>
                                <TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                                    disabled={typeof data.collection_private === 'boolean'}
                                    style={{flex: 1, height: '100%'}} onPress={() => {
                                        // setShowMenu(state => !state)
                                        setIsVisible(true);
                                    }}>
                                    <MoreIcon style={{color: colors.mainColor}}/>
                                </TouchableOpacity>
                                <BottomSheet
                                        isVisible={isVisible}
                                        containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}
                                        >
                                        {list.map((l, i) => (
                                            <ListItem key={i} containerStyle={l.containerStyle} onPress={l.onPress}>
                                            <ListItem.Content>
                                                <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
                                            </ListItem.Content>
                                            </ListItem>
                                        ))}
                                </BottomSheet>
                                <DeleteModal />
                            </View> :
                            <View style={{position: 'absolute', right: 0}}>
                                <TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} style={{flex: 1, height: '100%'}} onPress={() => setIsEditPage(false)}>
                                    <View>
                                        <AppText style={{color: colors.mainColor, fontSize: 16, lineHeight: 19.2, fontWeight: '700'}}>완료</AppText>
                                    </View>
                                </TouchableOpacity>
                            </View>
                    }</>}
            </View>

            <ScrollView>
                <ScreenContainerView>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 8
                    }}>
                        <View
                            style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <View style={[styles.dirType,
                                {
                                    borderColor: colors.defaultColor,
                                    backgroundColor: colors.defaultColor,
                                    shadowColor: colors.red[8]
                                }]}>
                                <AppText style={{...styles.dirFreeText, color: colors.mainColor}}>자유</AppText>
                            </View>
                            {
                                keywords.map((keyword, idx) => (
                                    <Keyword keyword={keyword} key={idx} />
                                ))
                            }
                        </View>
                        <View>
                            {checkTrue() &&
                            <Image source={require('../../assets/images/lock_forDir.png')}
                                style={{width: 22, height: 22}}></Image>}
                        </View>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <View style={{justifyContent: 'center', alignItems: 'flex-start'}}>
                            <AppText style={{
                                fontSize: 22,
                                fontWeight: '700',
                                color: colors.mainColor
                            }}>{data.collection_name}</AppText>
                            {
                                typeof data.collection_private === 'boolean' ?
                                    <AppText style={{
                                        fontSize: 12,
                                        fontWeight: '400',
                                        color: colors.gray[2],
                                        lineHeight: 19.2,
                                        marginTop: 12
                                    }}>by. {userData.user_nickname}</AppText> :
                                    <AppText style={{
                                        fontSize: 12,
                                        fontWeight: '400',
                                        color: colors.gray[2],
                                        lineHeight: 19.2,
                                        marginTop: 12
                                    }}>by. {collectionData.created_user_name}</AppText>
                                
                            }
                        </View>
                        {
                            userData.user_nickname !== data.created_user_name &&
                           <TouchableOpacity onPress={() => {
                               if (collectionData.like_flag) {
                                   DeleteLikedCollection();
                               } else {
                                   LikeCollection();
                               }
                           }}>
                               {!(data.collection_private === false || data.collection_private === true) && <View style={{
                                   justifyContent: 'center',
                                   alignItems: 'center',
                                   marginVertical: 5
                               }}>
                                   <Jewel width={26} height={21}
                                       style={collectionData.like_flag ? {color: colors.red[3]} : {color: colors.red_gray[3]}}/>
                                   <AppText style={{
                                       fontSize: 10,
                                       fontWeight: '700',
                                       color: collectionData.like_flag ? colors.red[3] : colors.red_gray[3],
                                       marginTop: 2
                                   }}>{collectionData.like_cnt}</AppText>
                               </View>}
                           </TouchableOpacity>
                        }
                    </View>
                </ScreenContainerView>

                <View style={{marginTop: 20}}>
                    <Image source={require('../../assets/images/map_tmp.png')} style={{width: '100%', height: 201}}/>
                    {/* TODO 카카오 지도 api 가져오기
                    <View>
                        <MapView style={{width: Dimensions.get('window').width, height: 200}}
                                 initialRegion={{
                                     latitude: 37.56633546113615,
                                     longitude: 126.9779482762618,
                                     latitudeDelta: 0.0015,
                                     longitudeDelta: 0.0015,
                                 }}
                        ><Marker coordinate={{
                            latitude: 37.56633546113615,
                            longitude: 126.9779482762618
                        }}
                                 title="서울시청"
                                 description="기본값입니다"/>
                        </MapView>
                    </View> */}
                </View>

                <ScreenContainerView>
                    {
                        placeLength !== 0 ?
                            <View style={{marginTop: 16}}>
                                <View style={{marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <View>
                                        <AppText style={{color: colors.gray[4]}}>총 <AppText
                                            style={{fontWeight: '700'}}>{placeLength}개</AppText> 공간</AppText>
                                    </View>
                                    <TouchableOpacity onPress={()=>{
                                        navigation.navigate('SearchForPlan', {pk: collectionData.collection_pk, placeData: placeData, day : data});
                                    }} style={!collectionData.is_creator && {display: 'none'}}>
                                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                            <Icon type="ionicon" name={'add-outline'} size={18} color={colors.mainColor} />
                                            <AppText style={{color: colors.mainColor, fontSize: 14, lineHeight: 22.4, fontWeight: '700'}}>공간 추가하기</AppText>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <SafeAreaView>
                                    <SafeAreaView>
                                        {
                                            !isEditPage ?
                                                <SwipeList /> :
                                                <SwipeList />
                                            // <DragAndDropListForFree data={placeData} isEditPage={isEditPage} isPress={isPress} navigation={navigation}/>
                                        }
                                    </SafeAreaView>
                                </SafeAreaView>
                                {/* <TouchableOpacity onPress={() => {
                                    // if(isLimited) setIsLimited(false);
                                    // else setIsLimited(true);
                                    // console.log(isLimited)
                                }}>
                                    <View style={{
                                        flexDirection: 'row',
                                        marginTop: 26,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <AppText style={{
                                            fontSize: 14,
                                            fontWeight: '400',
                                            color: colors.gray[2]
                                        }}>전체보기</AppText>
                                        <Image source={require('../../assets/images/showWhole_forDir.png')}
                                            style={{
                                                width: 15,
                                                height: 15,
                                                marginLeft: 10,
                                                marginBottom: 5
                                            }}></Image>
                                    </View>
                                </TouchableOpacity> */}
                            </View> :
                            <View style={{marginTop: 16}}>
                                <View style={{marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <View>
                                        <AppText style={{color: colors.gray[4]}}>총 <AppText
                                            style={{fontWeight: '700'}}>{placeLength}개</AppText> 공간</AppText>
                                    </View>
                                    <TouchableOpacity onPress={()=>{
                                        if(typeof data.collection_private === 'boolean') navigation.navigate('Search');
                                        else navigation.navigate('SearchForPlan', {pk: collectionData.collection_pk, placeData: placeData, day : data});
                                    }} style={ checkCreated() && {display:'none'}}>
                                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                            <Icon type="ionicon" name={'add-outline'} size={18} color={colors.mainColor} />
                                            <AppText style={{color: colors.mainColor, fontSize: 14, lineHeight: 22.4, fontWeight: '700'}}>공간 추가하기</AppText>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: 40,
                                    marginBottom: 52
                                }}>
                                    <Image source={require('../../assets/images/empty_forDir.png')} style={{
                                        width: 150,
                                        height: 120,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginBottom: 12
                                    }}></Image>
                                    <AppText style={{fontSize: 14, color: colors.red_gray[2], fontWeight: '500', lineHeight: 22.4}}>보관함이 비어있네요.</AppText>
                                    <AppText style={{fontSize: 14, color: colors.red_gray[2], fontWeight: '500', lineHeight: 22.4}}>마음에 드는 공간을 수집해보세요!</AppText>
                                </View>
                            </View>
                    }

                </ScreenContainerView>

                <ScreenDivideLine style={{marginVertical: 16}}/>

                <ScreenContainerView>
                    <View style={{marginBottom: 143}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <AppText style={{...styles.titles, color: colors.mainColor}}>댓글</AppText>
                            <AppText style={{
                                color: colors.gray[3],
                                fontSize: 14,
                                marginStart: 11,
                                marginTop: 5
                            }}>총 <AppText style={{fontWeight: '700'}}>{commentsData.length}개</AppText></AppText>
                        </View>
                        <View style={{marginVertical: 20}}>
                            <View flexDirection="row" style={{...styles.comment_box, borderColor: colors.gray[5]}}>
                                <TextInput flex={1} style={{fontSize: 16}}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    placeholder="보관함에 댓글을 남겨보세요!"
                                    value={comments}
                                    placeholderTextColor={colors.gray[5]}
                                    onChangeText={(text)=>setComments(text)}
                                    />
                                <Pressable style={{marginLeft: 5}} onPress={()=>{
                                    postCollectionCommentsData(comments);
                                    setComments('');
                                }}>
                                    <Icon style={{color: colors.gray[5], marginTop: 3, marginRight: 2}} type="ionicon"
                                        name={'pencil'} size={16}></Icon>
                                </Pressable>
                            </View>
                        </View>
                        {
                            commentsData.length !== 0 &&
                            <View style={{marginTop: 4}}>{
                                commentsData.map((data, idx) => (
                                    <ShowComments data={data} key={idx} idx={idx}/>
                                ))
                            }</View>
                        }
                    </View>
                </ScreenContainerView>
            </ScrollView>
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

export default FreeCollectionScreen;