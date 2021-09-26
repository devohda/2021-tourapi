import React, {useState, useEffect, cloneElement} from 'react';
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
    Modal,
    Alert
} from 'react-native';
import {useIsFocused, useTheme} from '@react-navigation/native';
import styled from 'styled-components/native';
import {Icon, ListItem, Button} from 'react-native-elements';
import { SwipeListView } from 'react-native-swipe-list-view';
// import MapView, {Marker} from 'react-native-maps';

import AppText from '../../components/AppText';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenDivideLine from '../../components/ScreenDivideLine';
import { tipsList } from '../../contexts/TipsListContextProvider';
import {useToken} from '../../contexts/TokenContextProvider';
import { updatedList } from '../../contexts/UpdatedListContextProvider';

import TipsList from './TipsList';
// import DragAndDropList from './DragAndDropList';
import ShowPlaces from './ShowPlaces';

import Jewel from '../../assets/images/jewel.svg';
import ScreenContainerView from '../../components/ScreenContainerView';
import BackIcon from '../../assets/images/back-icon.svg';
import MoreIcon from '../../assets/images/more-icon.svg';
import SlideMenu from '../../assets/images/menu_for_edit.svg';

import moment from 'moment';
import 'moment/locale/ko';

const windowWidth = Dimensions.get('window').width;

const PlanCollectionScreen = ({route, navigation}) => {
    const {colors} = useTheme();
    const {data} = route.params;
    const [collectionData, setCollectionData] = useState({});
    const [placeData, setPlaceData] = useState([]);
    const [placeLength, setPlaceLength] = useState(0);
    const [isLimited, setIsLimited] = useState(true);
    const [isTrue, setIsTrue] = useState(false);
    const [tmpData, setTmpData] = tipsList();
    const [updatedData, setUpdatedData] = updatedList();
    const [tmpPlaceData, setTmpPlaceData] = useState([]);
    const [visible, setVisible] = useState(false);
    const [isEditPage, setIsEditPage] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [planDays, setPlanDays] = useState([]);

    const isFocused = useIsFocused();

    const [token, setToken] = useToken();
    const [userData, setUserData] = useState({});

    const getUserData = () => {
        try {
            fetch('http://34.146.140.88/user', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
            }).then((res) => res.json())
                .then((response) => {
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
        setTmpData([{
            day: 1,
            places : [
                {
                    id: 1,
                    tip: '근처에 xxx파전 맛집에서 막걸리 한잔 캬',
                },
                {
                    id: 2,
                    tip: '두번째 팁'
                }
            ]
        }, {
            day: 2,
            places: [
                {
                    id: 1,
                    tip: '와웅',
                },
                {
                    id: 2,
                    tip: '두번째 팁'
                }  
            ]
        }
        ]);

        getUserData();

        if(typeof data.collection_private === 'boolean') {
            setStartDate(moment(data.startDate).format('YYYY.MM.DD'));
            setEndDate(moment(data.endDate).format('YYYY.MM.DD'));
        } else {
            getInitialCollectionData();
            getInitialPlaceData();
        }
    }, [isFocused]);

    const getInitialCollectionData = () => {
        try {
            fetch(`http://34.146.140.88/collection/${data.collection_pk}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
            }).then((res) => res.json())
                .then((response) => {
                    setCollectionData(response.data);
                    setStartDate(response.data.collection_start_date.split('T')[0]);
                    setEndDate(response.data.collection_end_date.split('T')[0]);

                    var gap = moment(response.data.collection_end_date.split('T')[0]).diff(moment(response.data.collection_start_date.split('T')[0]), 'days');
                    var newArr = [];
                    for(var i=0;i<=gap;i++) {
                        newArr.push({
                            id: i,
                            days: moment(response.data.collection_start_date.split('T')[0]).add(i, 'd').format('YYYY.MM.DD')
                        })
                    }
                    setPlanDays(newArr)
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
            fetch(`http://34.146.140.88/collection/${data.collection_pk}/places`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
            }).then((res) => res.json())
                .then((response) => {
                    setPlaceData(response.data)
                    var exceptLength = 0;
                    for(let i = 0; i < response.data.length; i++) {
                        if(response.data[i].place_pk === -1 || response.data[i].place_pk === -2) exceptLength += 1;
                    }
                    setPlaceLength(response.data.length - exceptLength);

                    var pressed = [];
                    for (let i = 0; i < placeLength; i++) {
                        pressed.push(false);
                    }
                    setIsPress(pressed);
                    // setIsTrue(userData.user_pk === data.user_pk && collectionData.collection_private === 0);
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const checkTrue = () => {
        // if (userData.user_pk === data.user_pk && collectionData.collection_private === 0) return false;
        if(typeof data.collection_private === 'boolean') {
            if(data.collection_private === true) return true;
            else return false;
        } else {
            if(collectionData.collection_private === 1) return true;
        }
        return false;
    };

    const checkPrivate = () => {
        // if(data.collection_private === true || data.collection_private === false) {
        if(typeof data.collection_private === 'boolean') {

            return false;
        } else {
            if (collectionData.is_creator) {
                return true;
            }
        }
        return false;
    }

    const checkCreated = () => {
        if(data.collection_private === true || data.collection_private === false) {
            return false;
        } else {
            if(collectionData.is_creator) return false;
        }
        return true;
    }

    const [isPress, setIsPress] = useState([]);

    // const setFalse = () => {
    // };

    const deletePlace = (place_pk, day) => {
        //공간 삭제
        try {
            fetch(`http://34.146.140.88/collection/${collectionData.collection_pk}/place/${place_pk}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
                body: JSON.stringify({
                    planDay: day,
                })
            }).then((res) => res.json())
                .then((response) => {
                    getInitialPlaceData();
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    }

    const LikeCollection = () => {
        //보관함 좋아요
        try {
            fetch(`http://34.146.140.88/like/collection/${collectionData.collection_pk}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
            }).then((res) => res.json())
                .then((response) => {
                    // console.log(response)
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
            fetch(`http://34.146.140.88/like/collection/${collectionData.collection_pk}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
            }).then((res) => res.json())
                .then((response) => {
                    // console.log(response)
                    getInitialCollectionData();
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const deleteCollection = () => {
        try {
            fetch(`http://34.146.140.88/collection/${data.collection_pk}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
            }).then((res) => res.json())
                .then((response) => {
                    Alert.alert('', '삭제되었습니다.');
                    navigation.goBack();
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    }

    const Keyword = ({item}) => {
        return (
            <AppText style={{color: colors.gray[2], fontSize: 10, marginEnd: 8}}># {item}</AppText>
        );
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

    const SwipeList = props => {
        return (
        <SwipeListView
            data={placeData}
            renderItem={({item, index}) => <ShowPlaces day={props.idx} item={item} index={index} key={index} isEditPage={isEditPage} isPress={isPress} navigation={navigation} length={placeLength} private={collectionData.is_creator} pk={collectionData.collection_pk}/>}
            keyExtractor={(item, idx) => item.place_pk.toString()}
            key={(item, idx) => item.place_pk.toString()}
            renderHiddenItem={(item, rowMap) => {
                return (
                    <View style={{ ...styles.rowBack, backgroundColor: colors.red[3]}} key={item.place_pk}>
                        <TouchableOpacity
                            style={{...styles.backRightBtn, backgroundColor: colors.red[3]}}
                            onPress={() => {
                                deletePlace(item.item.place_pk, props.idx)
                            }}
                        >
                            <View style={{justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                                <AppText style={{color: colors.defaultColor}}>삭제하기</AppText>
                            </View>
                        </TouchableOpacity>
                    </View>
                );}}
            rightOpenValue={-75}
            previewRowKey={'0'}
            previewOpenDelay={3000}
            disableRightSwipe={true}
            disableLeftSwipe={checkPrivate() ? false : true}
            closeOnRowOpen={true}
            closeOnRowPress={true}
            nestedScrollEnabled
        />
/* {        placeData.map((item, index) => (
        <TipsList data={item} idx={index} day={props.idx} length={placeLength} key={index} private={collectionData.is_creator}/>

            ))} */
        // <SafeAreaView>
        //     <FlatList data={placeData}
        //       renderItem={({item, index}) => <ShowPlaces day={props.idx} item={item} index={index} key={index} isEditPage={isEditPage} isPress={isPress} navigation={navigation} length={placeLength} private={collectionData.is_creator} pk={collectionData.collection_pk}/>}
        //       keyExtractor={(item, idx) => {idx.toString();}}
        //       key={(item, idx) => {idx.toString();}}
        //   nestedScrollEnabled/>
        // </SafeAreaView>
//         placeData.map((item, index) => (
// <ShowPlaces day={props.idx} item={item} index={index} key={index} isEditPage={isEditPage} isPress={isPress} navigation={navigation} length={placeLength} private={collectionData.is_creator} pk={collectionData.collection_pk}/>
//         ))
    )};

    const EditList = props => (
        <View></View>
        // <DragAndDropList data={placeData} idx={props.idx} isEditPage={isEditPage} isPress={isPress} key={props.idx}/>
    );

    const ShowDays = ({item, index}) => {
        const idx = index;
        return (
            <>
                <View>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <View style={{flexDirection: 'row'}}>
                            <View>
                                <AppText style={{color: colors.blue[1], fontSize: 16, lineHeight: 25.6, fontWeight: '700'}}>Day {idx+1}</AppText>
                            </View>
                            <View style={{marginStart: 8}}>
                                <AppText style={{color: colors.blue[1], fontSize: 16, lineHeight: 25.6, fontWeight: '400'}}>{item.days}</AppText>
                            </View>
                        </View>
                        <View>
                            <TouchableOpacity onPress={()=>navigation.navigate('SearchForPlan', {pk: collectionData.collection_pk, placeData: placeData, day : item})}
                                style={!collectionData.is_creator && {display: 'none'}}
                            >
                                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                    <Icon type="ionicon" name={'add-outline'} size={18} color={colors.mainColor} />
                                    <AppText style={{color: colors.mainColor, fontSize: 14, lineHeight: 22.4, fontWeight: '700'}}>공간 추가하기</AppText>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                {!isEditPage ? <SwipeList idx={idx} key={idx}/> : <EditList idx={idx} key={idx}/>}

                <TouchableOpacity onPress={() => {
                // if(isLimited) setIsLimited(false);
                // else setIsLimited(true);
                // console.log(isLimited)
                }}>
                    <View style={{
                        flexDirection: 'row',
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
                </TouchableOpacity>
            </>
        );
    };

    const [showMenu, setShowMenu] = useState(false);
    const [deleteMenu, setDeleteMenu] = useState(false);

    const deleteMode = () => {
        setDeleteMenu(true);
    }

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
                        }}
                    >
                        <AppText style={styles.textStyle}>삭제하기</AppText>
                    </Pressable>
                </View>
            </View>
        </View>
    </Modal>
    )

    const setDate = () => {

        //data로 오는 거 처리
        if(data.collection_private === true || data.collection_private === false) {
            return `${startDate} - ${endDate}`;
        }
        else if(data.collection_private === 0 || data.collection_private === 1) {
            if(Object.keys(collectionData).length === 0 && collectionData.constructor === Object) return '';
            else {
                //년도가 다를 경우
                if(parseInt(startDate.split('-')[0]) !== parseInt(endDate.split('-')[0])) {
                    return `${moment(startDate.split('T')[0]).format('YYYY.MM.DD')}-${moment(endDate.split('T')[0]).format('YYYY.MM.DD')}`;
                }
                //월이 다를 경우
                if(parseInt(startDate.split('-')[1]) !== parseInt(endDate.split('-')[1])) {
                    return `${moment(startDate.split('T')[0]).format('YYYY.MM.DD')}-${moment(endDate.split('T')[0]).format('MM.DD')}`;
                }
                //일이 다를 경우
                if(parseInt(startDate.split('-')[2]) !== parseInt(endDate.split('-')[2])) {
                    return `${moment(startDate.split('T')[0]).format('YYYY.MM.DD')}-${moment(endDate.split('T')[0]).format('DD')}`;
                }
                //시작일과 종료일이 같을 경우
                else return `${moment(startDate.split('T')[0]).format('YYYY.MM.DD')}`;
            }
        }

    }

    return (
        <ScreenContainer backgroundColor={colors.backgroundColor}>
            {
                showMenu && (
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
                        else navigation.goBack()}}>
                        <BackIcon style={{color: colors.mainColor}}/>
                    </TouchableOpacity>
                </View>
                {checkPrivate() && <>
                {
                    !isEditPage ?
                        <View style={{position: 'absolute', right: 0}}>
                            <TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                                disabled={typeof data.collection_private === 'boolean'}
                                style={{flex: 1, height: '100%'}} onPress={() => setShowMenu(state => !state)}>
                                <MoreIcon style={{color: colors.mainColor}}/>
                            </TouchableOpacity>
                        </View> :
                        <View style={{position: 'absolute', right: 0}}>
                            <TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} style={{flex: 1, height: '100%'}}
                            onPress={() => {
                                setIsEditPage(false);
                                console.log(updatedData)
                            }}>
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
                                <AppText style={{...styles.dirFreeText, color: colors.red[3]}}>일정</AppText>
                            </View>
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
                            <AppText style={{color: colors.blue[1], fontSize: 16, lineHeight: 25.6, fontWeight: '500'}}>
                                {setDate()}
                            </AppText>
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
                                <View style={{marginBottom: 16}}>
                                    <AppText style={{color: colors.gray[4]}}>총 <AppText
                                        style={{fontWeight: '700'}}>{placeLength}개</AppText> 공간</AppText>
                                </View>
                                <SafeAreaView>
                                            {/* {
                                            placeData.length > 5 ?
                                        } */}
                                            {/* {collectionData.place.map((item, idx) =>(
                                            <ShowPlaces item={item} idx={idx} key={idx}/>
                                        ))} */}
                                    {/* <FlatList data={collectionData.places} renderItem={ShowPlaces}
                                                keyExtractor={(item) => item.place_pk.toString()}
                                                nestedScrollEnabled/> */}
                                    <FlatList data={planDays} renderItem={ShowDays}
                                        keyExtractor={(item, index) => index.toString()}
                                        key={(item, index) => index.toString()}
                                        nestedScrollEnabled/>
                                </SafeAreaView>
                            </View> :
                            <>
                                <View style={{marginTop: 16}}>
                                    <View style={{marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <View>
                                            <AppText style={{color: colors.gray[4]}}>총 <AppText
                                                style={{fontWeight: '700'}}>{placeLength}개</AppText> 공간</AppText>
                                        </View>
                                        <TouchableOpacity onPress={()=>{
                                                if(typeof data.collection_private === 'boolean') navigation.navigate('Search')
                                                else navigation.navigate('SearchForPlan', {pk: collectionData.collection_pk, placeData: placeData, day : data})
                                            }} style={checkCreated() && {display: 'none'}}>
                                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                                <Icon type="ionicon" name={'add-outline'} size={18} color={colors.mainColor} />
                                                <AppText style={{color: colors.mainColor, fontSize: 14, lineHeight: 22.4, fontWeight: '700'}}>공간 추가하기</AppText>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
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
                                <AppText style={{fontSize: 14, color: colors.red_gray[2], fontWeight: '400'}}>공간이
                                    담겨있지 않아요!</AppText>
                            </View>
                            </>
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
                            }}>총 <AppText style={{fontWeight: '700'}}>20개</AppText></AppText>
                        </View>
                        <View style={{marginVertical: 20}}>
                            <View flexDirection="row" style={{...styles.comment_box, borderColor: colors.gray[5]}}>
                                <TextInput flex={1} style={{fontSize: 16}}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    placeholder="보관함에 댓글을 남겨보세요!"
                                    placeholderTextColor={colors.gray[5]} />
                                <Pressable style={{marginLeft: 5}}>
                                    <Icon style={{color: colors.gray[5], marginTop: 3, marginRight: 2}} type="ionicon"
                                        name={'pencil'} size={16}></Icon>
                                </Pressable>
                            </View>
                        </View>
                        <View flexDirection="row" style={{flex: 1, alignItems: 'flex-start'}}>
                            <View style={{marginRight: 8}}>
                                <Image source={require('../../assets/images/here_default.png')}
                                    style={{width: 40, height: 40, borderRadius: 40, resizeMode: 'stretch'}}/>
                            </View>
                            <View>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginBottom: 8,
                                    flexWrap: 'wrap'
                                }}>
                                    <AppText style={{color: colors.mainColor, fontSize: 12}}>minsun</AppText>
                                    <AppText style={{
                                        marginHorizontal: 8,
                                        color: colors.gray[5],
                                        fontSize: 10
                                    }}>|</AppText>
                                    <AppText style={{color: colors.gray[4], fontSize: 12}}>21.06.24</AppText>
                                </View>
                                <View style={{flex: 1, width: '100%'}}><AppText style={{
                                    fontSize: 12,
                                    color: colors.mainColor,
                                    lineHeight: 16,
                                    fontWeight: '700',
                                    flexWrap: 'wrap',
                                    width: windowWidth - 100
                                }}>
                                    종로 25년 토박종로 25년 토박이가 알려주는 종로 25년 토박종로 25년 토박이가 알려주는 종로 25년 토박종로 25년 토박이가 알려주는 종로 25년
                                    토박종로 25년 토박이가 알려주는
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

                    </View>
                </ScreenContainerView>
            </ScrollView>
        </ScreenContainer>
    );
};


const styles = StyleSheet.create({
    titles: {
        fontSize: 20,
        // marginLeft: '5%',
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
    rowBackTime: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '50%'
    },
    rowBack: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%'
    },
    backRightBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        width: 75,
        right: 0
    },

    //drag and sort style
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    item: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    item_children: {
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    item_icon: {
        marginLeft: 15,
        resizeMode: 'contain',
    },
    item_text: {
        marginRight: 55,
        color: 'black'
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

export default PlanCollectionScreen;