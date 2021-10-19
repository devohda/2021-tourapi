import React, {useState, useRef, useEffect} from 'react';
import { View, ScrollView, Image, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, Share, Alert, FlatList } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useTheme, useIsFocused} from '@react-navigation/native';
import {Icon, Rating} from 'react-native-elements';
import MapView, {Marker, UrlTile, PROVIDER_GOOGLE} from 'react-native-maps';
import * as SecureStore from 'expo-secure-store';
import * as Linking from 'expo-linking';

import NavigationTop from '../../components/NavigationTop';
import Score from '../../components/Score';
import Time from '../../components/Time';
import Facility from '../../components/Facility';
import AppText from '../../components/AppText';

import Jewel from '../../assets/images/jewel.svg';
import CustomMarker from '../../assets/images/map/map-marker.svg';

import ScreenContainer from '../../components/ScreenContainer';
import ScreenContainerView from '../../components/ScreenContainerView';
import ScreenDivideLine from '../../components/ScreenDivideLine';
import {useToken} from '../../contexts/TokenContextProvider';
import {useIsSignedIn} from '../../contexts/SignedInContextProvider';

import moment from 'moment';
import 'moment/locale/ko';
import {useAlertDuplicated} from '../../contexts/LoginContextProvider';

const ShowDirectories = ({refRBSheet, colors, collectionList, placeData, height, getCollectionList}) => {
    const maxHeight = Dimensions.get('screen').height;
    const [isCollectionClicked, setIsCollectionClicked] = useState(Array.from({length: collectionList.length}, () => false));
    const [token, setToken] = useToken();
    const [isSignedIn, setIsSignedIn] = useIsSignedIn();
    const [alertDuplicated, setAlertDuplicated] = useAlertDuplicated(false);

    const postPlace = (refRBSheet) => {
        const index = isCollectionClicked.findIndex((element) => element === true);
        const collectionId = collectionList[index].collection_pk;
        const placeCnt = collectionList[index].place_cnt;
        const placeId = placeData.place_pk;
        let day = -1;
        if(collectionList[index].collection_type) day = 0;

        try {
            fetch(`http://34.64.185.40/collection/${collectionId}/place`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
                body: JSON.stringify({
                    planDay: day,
                    order: placeCnt+1,
                    placeId: placeId,
                }),
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

                    if(response.code === 500) Alert.alert('', '공간 저장에 실패했습니다.', [
                        {text : 'OK', onPress: () => {
                            getCollectionList();
                            setIsCollectionClicked([]);
                            refRBSheet.current.close();
                        }}]);
                    else if(response.code === 200) Alert.alert('', '보관함에 공간이 저장되었습니다.', [
                        {text : 'OK', onPress: () => {
                            getCollectionList();
                            setIsCollectionClicked([]);
                            refRBSheet.current.close();
                        }}]); 
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const ShowFreeDir = ({item, idx}) => {

        return (
            <View style={{marginTop: 12, marginHorizontal: 20}}>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <View style={{
                        width: '100%',
                        backgroundColor: colors.defaultColor,
                        borderRadius: 5,
                        borderWidth: 3,
                        borderColor: isCollectionClicked[idx] ? colors.blue[6] : colors.defaultColor
                    }}>
                        <TouchableOpacity onPress={() => {
                            const newArr = [...isCollectionClicked];
                            if (newArr[idx]) {
                                newArr[idx] = false;
                                setIsCollectionClicked(arr => newArr);
                            } else {
                                for (let i = 0; i < newArr.length; i++) {
                                    if (i == idx) continue;
                                    else newArr[i] = false;
                                }
                                newArr[idx] = true;
                                setIsCollectionClicked(arr => newArr);
                            }
                        }}>
                            <View style={{paddingTop: 12}}>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginLeft: 10,
                                    marginRight: 15
                                }}>
                                    <View style={{paddingRight: 8, flexDirection: 'row'}}>
                                        <Icon type="ionicon" name={'location'} size={10} color={colors.mainColor}
                                            style={{marginVertical: 2, marginRight: 2}}></Icon>
                                        <AppText style={{fontSize: 12, color: colors.mainColor}}>{item.place_cnt}</AppText>
                                    </View>
                                    {item.collection_private == 1 &&
                                    <Image style={{width: 10, height: 10, marginLeft: 2}}
                                        source={require('../../assets/images/lock_outline.png')}></Image>}
                                </View>
                            </View>
                            <View
                                style={{flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 11}}>
                                <View style={{
                                    flexDirection: 'row',
                                    marginLeft: 10,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <AppText numberOfLines={2} style={{
                                        color: colors.mainColor,
                                        lineHeight: 28.8,
                                        fontSize: 18,
                                        fontWeight: '500',
                                        width: 236
                                    }}>{item.collection_name}</AppText>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {idx === collectionList.length - 1 &&
                <View style={{marginVertical: 22, borderRadius: 10, bottom: 0}}>
                    <TouchableOpacity
                        style={{
                            height: 48,
                            borderRadius: 10,
                            backgroundColor: isCollectionClicked.filter(element => element === true).length > 0 ? colors.mainColor : colors.gray[6]
                        }
                        }
                        onPress={() => {
                            postPlace(refRBSheet);
                        }}
                    ><AppText
                            style={{
                                textAlign: 'center',
                                padding: 14,
                                fontSize: 16,
                                color: colors.defaultColor,
                                fontWeight: 'bold'
                            }}
                        >보관함에 추가하기</AppText>
                    </TouchableOpacity>
                </View>}
            </View>
        );
    };

    return (
        <>
            <View style={{width: '100%'}}>
                <Icon type="ionicon" name={'add'} color={colors.red_gray[3]} size={26}></Icon>
            </View>
            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={true}
                height={height}
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
                <View style={{marginTop: 16, backgroundColor: colors.yellow[7], marginHorizontal: 20}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.yellow[7]}}>
                        <AppText
                            style={{fontSize: 18, fontWeight: 'bold', marginTop: '1%', color: colors.mainColor}}>보관함에 추가하기</AppText>
                        <Image source={require('../../assets/images/folder.png')}
                            style={{width: 32, height: 32}}></Image>
                    </View>
                </View>

                <SafeAreaView flex={1}>
                    <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
                        {collectionList.map((item, idx) => (
                            <ShowFreeDir item={item} idx={idx} key={idx}/>
                        ))}
                    </ScrollView>
                </SafeAreaView>
            </RBSheet>
        </>
    );
};


const PlaceScreen = ({route, navigation}) => {
    const {colors} = useTheme();
    const { data } = route.params;
    const [placeData, setPlaceData] = useState({});
    const [reviewData, setReviewData] = useState({});
    const [imageList, setImageList] = useState([]);
    const [collectionList, setCollectionList] = useState([]);
    const [commentList, setCommentList] = useState([]);
    const [commentLength, setCommentLength] = useState(0);
    const [facilityData, setFacilityData] = useState([]);
    const [morningCongestion, setMorningCongestion] = useState(0);
    const [afternoonCongestion, setAfternoonCongestion] = useState(0);
    const [eveningCongestion, setEveningCongestion] = useState(0);
    const [nightCongestion, setNightCongestion] = useState(0);
    const [reviewAccess, setReviewAccess] = useState(0);

    const [popularPlace, setPopularPlace] = useState({});

    const [placeLat, setPlaceLat] = useState(0);
    const [placeLng, setPlaceLng] = useState(0);
    const [placeTitle, setPlaceTitle] = useState('');

    const [token, setToken] = useToken();
    const [placeScore, setPlaceScore] = useState(0);
    const [isSignedIn, setIsSignedIn] = useIsSignedIn();
    const isFocused = useIsFocused();
    const [height, setHeight] = useState(180 + 90 * collectionList.length);

    const [alertDuplicated, setAlertDuplicated] = useAlertDuplicated(false);

    const getInitialData = () => {
        try {
            fetch(`http://34.64.185.40/place/${data.place_pk}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
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
                    console.log(response.data);
                    setPlaceData(response.data.placeData);
                    setReviewData(response.data.review);
                    setFacilityData(response.data.review.facility);
                    setMorningCongestion(response.data.review.review_congestion_morning);
                    setAfternoonCongestion(response.data.review.review_congestion_afternoon);
                    setEveningCongestion(response.data.review.review_congestion_evening);
                    setNightCongestion(response.data.review.review_congestion_night);
                    setPlaceScore(parseFloat(response.data.review.review_score).toFixed(2));
                    setReviewAccess(response.data.review.recent_review_flag);

                    setPlaceLat(parseFloat(response.data.placeData.place_latitude).toFixed(5));
                    setPlaceLng(parseFloat(response.data.placeData.place_longitude).toFixed(5));
                    setPlaceTitle(response.data.placeData.place_name);

                    setImages(response.data);
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const setImages = (data) => {
        var newArr = [];
        if(data.placeData.place_img !== null) newArr.push(data.placeData.place_img);
        if(data.review.review_img.length !== 0) newArr.push(...data.review.review_img);
        setImageList(newArr);
    };

    const getPopularPlaceData = () => {
        try {
            fetch('http://34.64.185.40/place/list?type=MAIN&sort=POPULAR', {
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

                    setPopularPlace(response.data);
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getInitialData();
        getCollectionList();
        getCommentList();
        getPopularPlaceData();
        () => {
            setPlaceData({});
            setReviewData({});
            setCollectionList([]);
            setFacilityData([]);
            setMorningCongestion(0);
            setAfternoonCongestion(0);
            setEveningCongestion(0);
            setNightCongestion(0);
        };
    }, [isFocused]);


    const getCollectionList = () => {
        try {
            fetch('http://34.64.185.40/collection/list?type=MY', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
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

                    if(response.data.length > 5) setHeight(180 + 90 * 5);
                    else setHeight(180 + 90 * response.data.length);
                    setCollectionList(response.data);
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const getCommentList = () => {
        try {
            fetch(`http://34.64.185.40/place/${data.place_pk}/comments`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
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

                    setCommentList(response.data);
                    setCommentLength(response.data.length);
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const PlaceInfo = ({collectionList, checkType}) => {
        const [token, setToken] = useToken();
        const [isLiked, setIsLiked] = useState(false);
        const refRBSheet = useRef();
        const [isSignedIn, setIsSignedIn] = useIsSignedIn();
    
        const PlaceInfo = (props) => {
            return (
                <View flexDirection="row" style={{marginVertical: 2}}>
                    <Icon type="ionicon" name={props.icon} size={14} color={colors.mainColor}></Icon>
                    <View style={{marginLeft: 5}}>
                        {props.children}
                    </View>
                </View>
            );
        };
        const IconTab = () => {
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
                    }).then(res => res.json())
                        .then(async response => {
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

                            getInitialData();
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
                    }).then(res => res.json())
                        .then(async response => {
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

                            getInitialData();
                        })
                        .catch((err) => {
                            console.error(err);
                        });
        
                } catch (err) {
                    console.error(err);
                }
            };
    
            // 공유
            const onShare = async () => {
                try {
                    const result = await Share.share({
                        message:
                        `[히든쥬얼] ${placeData.place_name}${'\n'}${placeData.place_addr}`
                    });
                    if (result.action === Share.sharedAction) {
                        if (result.activityType) {
                            // shared with activity type of result.activityType
                        } else {
                            // shared
                        }
                    } else if (result.action === Share.dismissedAction) {
                        // dismissed
                    }
                } catch (error) {
                    Alert.alert('', error.message);
                }
            };
    
            return (
                <View style={styles.iconTabContainer}>
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <TouchableOpacity onPress={() => {
                            if (placeData.like_flag) {
                                DeleteLikedPlace(placeData.place_pk);
                            } else {
                                LikePlace(placeData.place_pk);
                            }
                        }} style={{marginBottom: 2}}>
                            <Jewel width={26} height={21}
                                style={placeData.like_flag ? {color: colors.red[3]} : {color: colors.red_gray[3]}}/>
                        </TouchableOpacity>
                        <AppText style={{color: colors.red_gray[2], fontSize: 10, fontWeight: '400', lineHeight: 16}}>찜</AppText>
                    </View>
                    
                    <View style={{
                        borderWidth: 0.5,
                        transform: [{rotate: '90deg'}],
                        width: 42,
                        borderColor: colors.red_gray[5],
                        marginHorizontal: 21
                    }}/>

                    <View style={{justifyContent: 'center', alignItems: 'center'}}> 
                        <TouchableOpacity onPress={() => {
                            refRBSheet.current.open();
                        }}>
                            <ShowDirectories refRBSheet={refRBSheet} placeData={placeData} colors={colors}
                                collectionList={collectionList} height={height} getCollectionList={getCollectionList}/>
                        </TouchableOpacity>
                        <AppText style={{color: colors.red_gray[2], fontSize: 10, fontWeight: '400', lineHeight: 16}}>보관함에 추가</AppText>
                    </View>

                    <View style={{
                        borderWidth: 0.5,
                        transform: [{rotate: '90deg'}],
                        width: 42,
                        borderColor: colors.red_gray[5],
                        marginHorizontal: 21
                    }}/>

                    <View style={{justifyContent: 'center', alignItems: 'center'}}> 
                        <TouchableOpacity onPress={onShare}>
                            <Icon type="ionicon" name={'share-social'} color={colors.red_gray[3]} size={26}/>
                        </TouchableOpacity>
                        <AppText style={{color: colors.red_gray[2], fontSize: 10, fontWeight: '400', lineHeight: 16}}>공유</AppText>
                    </View>
                </View>
            );
        };
    
        return (
            <>
                <View style={{flexDirection: 'row'}}>
                    <Image style={{width: '50%', height: 204, marginRight: 2, marginTop: 2}}
                        source={imageList.length > 0 ? {uri: imageList[0]} : require('../../assets/images/here_default.png')}
                        resizeMode="cover"
                    />
                    <View style={{width: '50%', height: 200}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Image style={{width: '50%', height: 100, margin: 2}}
                                source={imageList.length > 1 ? {uri: imageList[1]} : require('../../assets/images/here_default.png')}
                                resizeMode="cover"
                            />
                            <Image style={{width: '50%', height: 100, margin: 2}}
                                source={imageList.length > 2 ? {uri: imageList[2]} : require('../../assets/images/here_default.png')}
                                resizeMode="cover"
                            />
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Image style={{width: '50%', height: 100, margin: 2}}
                                source={imageList.length > 3 ? {uri: imageList[3]} : require('../../assets/images/here_default.png')}
                                resizeMode="cover"
                            />
                            <Image style={{width: '50%', height: 100, margin: 2}}
                                source={imageList.length > 4 ? {uri: imageList[4]} : require('../../assets/images/here_default.png')}
                                resizeMode="cover"
                            />
                        </View>
                    </View>
                </View>

                <ScreenContainerView>
                    <View style={{marginVertical: 18}}>
                        <View flexDirection="row" style={{justifyContent: 'space-between', marginBottom: 8}}>
                            <View style={{...styles.placeName, width: '80%'}}>
                                <AppText style={{...styles.placeName, color: colors.mainColor}}>{placeData.place_name}</AppText>
                            </View>
                            <View style={{
                                ...styles.categoryBorder,
                                borderColor: colors.red_gray[6],
                                backgroundColor: colors.red_gray[6],
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <AppText style={{...styles.categoryText, color: colors.gray[1]}}>{checkType(placeData.place_type)}</AppText>
                            </View>
                        </View>
    
                        <PlaceInfo icon={'location'}>
                            <AppText style={{...styles.location, color: colors.gray[1]}}>{placeData.place_addr}</AppText>
                            {/* <AppText style={{
                                color: colors.gray[4],
                                fontSize: 14,
                                lineHeight: 22.4
                            }}>{placeData.place_addr}</AppText> */}
                        </PlaceInfo>
                        {/* <PlaceInfo icon={'globe-outline'}>
                            <TouchableOpacity onPress={()=>Linking.openURL('https://www.2021tourapi.com/')}>
                                <AppText style={{color: colors.blue[3], fontSize: 12}}>https://www.2021tourapi.com/</AppText>
                            </TouchableOpacity>
                        </PlaceInfo> */}
                        {/* <PlaceInfo icon={'time-outline'}>
                            <AppText style={{color: colors.blue[3], fontSize: 12}}>매일 11:00~17:00</AppText>
                        </PlaceInfo>
                        <PlaceInfo icon={'call'}>
                            <AppText style={{color: colors.blue[3], fontSize: 12}}>02-450-9311</AppText>
                        </PlaceInfo> */}
                    </View>
    
                    <IconTab />
                </ScreenContainerView>
            </>
        );
    };

    const ShowFacilities = ({item}) => {
        return (
            <View style={{
                borderColor: colors.defaultColor,
                backgroundColor: colors.defaultColor,
                borderStyle: 'solid',
                borderWidth: 1,
                borderRadius: 30,
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 4,
                paddingHorizontal: 10,
                marginRight: 10,
                flexDirection: 'row'
            }}>
                <AppText style={{fontSize: 14, color: colors.mainColor}}>{item}</AppText>
            </View>
        );
    };

    const window = Dimensions.get('window');
    const WIDTH = window.width;
    const HEIGHT = window.height;

    const ASPECT_RATIO = WIDTH / HEIGHT;
    const LATITUDE_DELTA = 0.35;
    const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

    const [lnt, setLnt] = useState(126.9775482762618);
    const [region, setRegion] = useState({
        latitude: 37.56633546113615,
        longitude: 126.9775482762618,
        latitudeDelta: 0.0015,
        longitudeDelta: 0.0015,
    });

    const onMarkerPress = (event) => {
        const { id, coordinate } = event.nativeEvent;
        // console.log(coordinate)
        const newRegion = { ...region };
        newRegion.latitude = coordinate.latitude;
        newRegion.longitude = coordinate.longitude;
    
        setRegion(newRegion);
    };

    const countPlaceView = (place_pk) => {
        try {
            fetch(`http://34.64.185.40/view/place/${place_pk}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
            }).then((res) => {
                res.json();
            })
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
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const countCollectionView = (collection_pk) => {
        try {
            fetch(`http://34.64.185.40/view/collection/${collection_pk}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
            }).then((res) => {
                res.json();
            })
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
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const ShowComments = props => {
        const { item, index } = props;
        return (
            <View key={index}>
                <TouchableOpacity onPress={()=>{
                    countCollectionView(item.collection_pk);
                    const data = {
                        'collection_pk': item.collection_pk,
                        'now': false,
                    };
                    if(item.collection_type === 1) {
                        navigation.navigate('PlanCollection', {data: data});
                    } else {
                        navigation.navigate('FreeCollection', {data: data});
                    }
                }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <View>
                            { item.user_img === '' || item.user_img === 'default-user' || item.user_img === 'default-img' ?
                                <Image style={styles.reviewImage}
                                    source={require('../../assets/images/default-profile.png')}></Image> :
                                <Image style={styles.reviewImage}
                                    source={{ uri: item.user_img }}></Image>
                            }
                        </View>
                        <View style={{marginLeft: 12, marginRight: 20}}>
                            <View style={{
                                backgroundColor: colors.defaultColor,
                                height: 27,
                                paddingVertical: 6,
                                paddingLeft: 6,
                                marginBottom: 6,
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                flexDirection: 'row'
                            }}>
                                <AppText style={{color: colors.blue[1], paddingLeft: 4, fontSize: 12}}>
                                    {item.cpc_comment}</AppText>
                            </View>
                            <View><AppText
                                style={{fontSize: 12, color: colors.mainColor, width: 267, lineHeight: 16}}>
                                {item.collection_name}
                            </AppText></View>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: 267,
                                marginTop: 4
                            }}>
                                <View style={{flexDirection: 'row'}}>
                                    <AppText style={{
                                        color: colors.gray[3],
                                        fontWeight: 'bold',
                                        fontSize: 12
                                    }}>by. </AppText>
                                    <AppText style={{color: colors.gray[3], fontSize: 12}}>{item.user_nickname}</AppText>
                                </View>
                                <View>
                                    <AppText
                                        style={{color: colors.gray[3], fontSize: 12}}>{moment(item.cc_create_time).format('YY.MM.DD')}</AppText>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>

                <View style={[{
                    width: '100%',
                    height: 1,
                    backgroundColor: colors.red_gray[6],
                    zIndex: -1000,
                    marginVertical: 18,
                }, index === commentLength-1 && {display: 'none'}]}></View>
            </View>
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

    const ShowRecommends = props => {
        const { item } = props;
        return (
            <TouchableOpacity onPress={()=>{
                countPlaceView(item.place_pk);
                const data = {
                    'place_pk': item.place_pk,
                };
                navigation.push('Place', {data: data});
            }}>
                <View style={{marginEnd: 8, width: 141}}>
                    <View>
                        <Image source={item.place_img ? {uri: item.place_img} : require('../../assets/images/here_default.png')}
                            style={{width: 141, height: 101, borderRadius: 10}}></Image>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 8}}>
                        <AppText style={{color: colors.gray[3], fontSize: 10}}>{checkType(item.place_type)}</AppText>
                        { parseInt(item.review_score) !== -1 && <>
                            <AppText style={{
                                color: colors.gray[3],
                                fontSize: 10,
                                marginHorizontal: 6
                            }}>|</AppText>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 2
                            }}>
                                <Image source={require('../../assets/images/review_star.png')}
                                    style={{
                                        width: 10,
                                        height: 10,
                                        alignSelf: 'center',
                                    }}></Image>
                                <AppText style={{color: colors.gray[3], fontSize: 10, marginLeft: 2}}>{parseFloat(item.review_score).toFixed(2)}</AppText>
                            </View></>}
                    </View>
                    <View style={{width: '90%'}}>
                        <AppText style={{
                            color: colors.blue[1],
                            fontSize: 16,
                            fontWeight: 'bold',
                            lineHeight: 23.68
                        }}>{item.place_name}</AppText>
                    </View>
                    <View style={{width: '90%'}}>
                        <AppText style={{color: colors.gray[4], fontSize: 12, lineHeight: 19.2}}>{item.place_addr}</AppText>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <ScreenContainer backgroundColor={colors.backgroundColor}>
            <NavigationTop navigation={navigation} title=""/>
            <ScrollView showsVerticalScrollIndicator={false}>
                <PlaceInfo placeData={placeData} collectionList={collectionList} colors={colors} styles={styles} data={data} checkType={checkType}/>
                <ScreenDivideLine/>
                <ScreenContainerView>
                    <View style={{alignItems: 'center'}}>
                        <View flex={1} style={{alignItems: 'center', justifyContent: 'center'}}>
                            <View flex={1} flexDirection="row" style={{marginTop: 3, alignItems: 'center'}}>
                                {
                                    placeScore != 0.00 ?
                                        <Jewel width={30} height={26}
                                            style={{color: colors.red[3], marginTop: 4}}/> :
                                        <Jewel width={30} height={26}
                                            style={{color: colors.red_gray[5], marginTop: 4}}/>
                                }
                                <View style={{marginLeft: 6, marginRight: 4}}><AppText
                                    style={{
                                        fontSize: 22,
                                        fontWeight: 'bold',
                                        marginRight: 5,
                                        color: colors.mainColor
                                    }}>{placeScore}점</AppText></View>
                                <View><AppText style={{color: colors.gray[5]}}>({reviewData.review_total_cnt}명)</AppText></View>
                            </View>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            width: '100%',
                            marginVertical: 16
                        }}>
                            <Score name="쾌적성" color={colors.mainColor} marginBottom={5} fontSize={12}
                                textAlign={'center'}>
                                <Rating
                                    type='custom'
                                    ratingCount={5}
                                    imageSize={14}
                                    fractions={0}
                                    readonly
                                    startingValue={reviewData.review_cleanliness}
                                    ratingColor={colors.red[3]}
                                    tintColor={colors.backgroundColor}
                                    ratingBackgroundColor={colors.red_gray[5]}
                                />
                            </Score>
                            <Score name="접근성" color={colors.mainColor} marginBottom={5} fontSize={12}
                                textAlign={'center'}>
                                <Rating
                                    type='custom'
                                    ratingCount={5}
                                    imageSize={14}
                                    fractions={0}
                                    readonly
                                    startingValue={reviewData.review_accessibility}
                                    ratingColor={colors.red[3]}
                                    tintColor={colors.backgroundColor}
                                    ratingBackgroundColor={colors.red_gray[5]}
                                />
                            </Score>
                            <Score name="주변상권" color={colors.mainColor} marginBottom={5} fontSize={12}
                                textAlign={'center'}>
                                <Rating
                                    type='custom'
                                    ratingCount={5}
                                    imageSize={14}
                                    fractions={0}
                                    readonly
                                    startingValue={reviewData.review_market}
                                    ratingColor={colors.red[3]}
                                    tintColor={colors.backgroundColor}
                                    ratingBackgroundColor={colors.red_gray[5]}
                                />
                            </Score>
                        </View>

                        <TouchableOpacity style={[{
                            width: '100%',
                            flexDirection: 'row',
                            height: 38,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 10,
                            paddingVertical: 6
                        }, !reviewAccess ? {backgroundColor: colors.red[3]} : {backgroundColor: colors.gray[6]}]}
                        onPress={()=>navigation.navigate('MakeReview', { placeName: placeData.place_name, place_pk: placeData.place_pk})}
                        disabled={!reviewAccess ? false : true}
                        >
                            <Image style={{width: 20.82, height: 27, marginTop: 3}}
                                source={require('../../assets/images/write_review_icon.png')}></Image>
                            <AppText style={{color: colors.backgroundColor, fontWeight: 'bold', marginStart: 4}}>평점
                                남기기</AppText>
                        </TouchableOpacity>
                    </View>
                </ScreenContainerView>
                <ScreenDivideLine/>
                <ScreenContainerView>
                    <View style={[{marginVertical: 8}, !morningCongestion && !afternoonCongestion && !eveningCongestion && !nightCongestion && {display: 'none'}]}>
                        <AppText style={{color: colors.mainColor, fontSize: 14, fontWeight: '700'}}>혼잡한 시간</AppText>
                        <View style={{flexDirection: 'row', marginTop: 6}}>
                            <Time name="오전" iconColor={colors.gray[6]} iconSize={12} style={!morningCongestion && {display: 'none'}}/>
                            <Time name="오후" iconColor={colors.gray[6]} iconSize={12} style={!afternoonCongestion && {display: 'none'}}/>
                            <Time name="저녁" iconColor={colors.gray[6]} iconSize={12} style={!eveningCongestion && {display: 'none'}}/>
                            <Time name="밤" iconColor={colors.gray[6]} iconSize={12} style={!nightCongestion && {display: 'none'}}/>
                        </View>
                    </View>
                    {
                        facilityData.length !== 0 &&
                        <View style={{marginVertical: 8}}>
                            <AppText style={{color: colors.mainColor, fontSize: 14, fontWeight: '700'}}>주변시설</AppText>
                            <View style={{flexDirection: 'row', marginTop: 6}}>
                                {
                                    facilityData.map((item, idx) => (
                                        <ShowFacilities item={item} key={idx+'0000'}/>
                                    ))
                                }
                            </View>
                        </View>
                    }
                </ScreenContainerView>
                <View style={{marginVertical: 24}}>
                    <View flex={1}>
                        <MapView style={{width: Dimensions.get('window').width, height: 200, flex: 1}}
                            region={region}
                            moveOnMarkerPress
                            tracksViewChanges={false}
                            onMarkerPress={onMarkerPress}
                        >
                            <Marker coordinate={{
                                latitude: 37.56633546113615,
                                longitude: 126.9779482762618
                            }} title={'기본'}
                            description="기본값입니다" onPress={()=>setLnt(126.9779482762618)}>
                                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                    <CustomMarker />
                                    <View style={{position: 'absolute', justifyContent: 'center', alignItems: 'center', bottom: 8}}>
                                        <AppText style={{fontSize: 12, fontWeight: '500', lineHeight: 19.2, color: colors.mainColor}}>1</AppText>
                                    </View>
                                </View>
                            </Marker>
                        </MapView>
                    </View>
                </View>
                <View>
                    <View style={{alignItems: 'center'}}>
                        <View style={{width: '90%', paddingBottom: 12}}>
                            <View style={{flexDirection: 'row'}}>
                                <AppText style={{
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                    color: colors.mainColor,
                                    lineHeight: 32
                                }}>한줄 TIP</AppText>
                            </View>
                            <AppText style={{color: colors.gray[3], fontSize: 12}}>한줄팁은 보관함에 공유된 소중한 리뷰입니다</AppText>
                        </View>
                        <View style={{width: '90%', marginBottom: 29}}>
                            {/* count data 여야 */}
                            <View style={{marginBottom: 6}}><AppText style={{
                                color: colors.gray[3],
                                fontSize: 14,
                                lineHeight: 20.72,
                                fontWeight: 'bold'
                            }}>총 {commentLength}개</AppText></View>
                            <FlatList data={commentList}
                                renderItem={({item, index}) => <ShowComments item={item} index={index} key={index} />}
                                keyExtractor={(item, idx) => {idx.toString();}}
                                key={(item, idx) => {idx.toString();}}
                                nestedScrollEnabled/>
                        </View>
                    </View>
                </View>
                <View style={{width: '100%', height: 8, backgroundColor: colors.red_gray[6], zIndex: -1000}}></View>
                <View>
                    <View style={{
                        alignItems: 'center'
                    }}>
                        <View style={{width: '90%', paddingTop: 24, paddingBottom: 24}}>
                            <AppText
                                style={{fontSize: 20, fontWeight: 'bold', color: colors.mainColor, lineHeight: 28}}>추천하는 공간</AppText>
                        </View>
                        <View style={{marginBottom: 92, flexDirection: 'row', marginHorizontal: 20}}>
                            <FlatList data={popularPlace}
                                renderItem={({item, index}) => <ShowRecommends item={item} index={index} key={index} />}
                                keyExtractor={(item, idx) => {idx.toString();}}
                                key={(item, idx) => {idx.toString();}}
                                nestedScrollEnabled horizontal showsHorizontalScrollIndicator={false}/>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    categoryBorder: {
        borderWidth: 1,
        borderRadius: 14,
        height: 19,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryText: {
        fontSize: 10,
        textAlign: 'center',
        textAlignVertical: 'center',
        paddingVertical: 2,
        paddingHorizontal: 8
    },
    reviewImage: {
        width: 56,
        height: 56,
        backgroundColor: '#c4c4c4',
        borderRadius: 50,
    },
    placeName: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    iconTabContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    location: {
        fontSize: 14,
        marginBottom: 1
    }
});

export default PlaceScreen;