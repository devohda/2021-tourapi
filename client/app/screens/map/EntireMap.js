import React, {useState, useRef, useEffect} from 'react';
import { View, ScrollView, Image, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, Share, Alert, FlatList, Platform } from 'react-native';
import {useTheme, useIsFocused} from '@react-navigation/native';
import {Icon, Rating} from 'react-native-elements';
import MapView, {Marker, UrlTile, PROVIDER_GOOGLE} from 'react-native-maps';
import * as Location from 'expo-location';
import Constants from 'expo-constants';

import CustomMarker from '../../assets/images/map/map-marker.svg';
import CustomMyMarker from '../../assets/images/map/map-mylocation-marker.svg';
import Jewel from '../../assets/images/jewel.svg';

import ScreenContainer from '../../components/ScreenContainer';
import ScreenContainerView from '../../components/ScreenContainerView';
import NavigationTop from '../../components/NavigationTop';
import AppText from '../../components/AppText';

import { myLocation } from '../../contexts/LocationContextProvider';

const EntireMap = ({route, navigation}) => {
    const {colors} = useTheme();
    const { title, placeData } = route.params;
    const [myLocations, setMyLocations] = myLocation();
    const [region, setRegion] = useState({
        latitude: 37.56633546113615,
        longitude: 126.9779482762618-parseFloat(1/100000000),
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
    });
    const [visible, setVisible] = useState(false);
    const [myLocationVisible, setMyLocationVisible] = useState(false);
    const [curPlacePk, setCurPlacePk] = useState(0);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
      (async () => {
        if(!myLocations) {
            if (Platform.OS === 'android' && !Constants.isDevice) {
                setErrorMsg(
                  'Oops, this will not work on Snack in an Android emulator. Try it on your device!'
                );
                return;
            }
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
            }
    
            let loc = await Location.getCurrentPositionAsync({});
            setMyLocations(loc);
        }
      })();
    }, [myLocations]);

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
                        Alert.alert('', '다른 기기에서 로그인했습니다.');
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

    const onMarkerPress = (event) => {
        const { id, coordinate } = event.nativeEvent;
        // console.log(coordinate)
        const newRegion = { ...region };
    
        newRegion.latitude = coordinate.latitude;
        newRegion.longitude = coordinate.longitude;
    
        setRegion(newRegion);

        // placeData latitude랑 비교하면 될듯 (현재 뭐 클릭했는지 알려줘서 장소까지도 갈수있게)
        // const marker = this.props.markers.find(
        //     m => m.coordinate.latitude === coordinate.latitude && m.coordinate.longitude === coordinate.longitude
        //   );
        //   if (marker) {
        //     this.props.onMarkerPress(marker);
        //   }
        if(myLocations !== null) {
            if(!(newRegion.latitude === myLocations.coords.latitude && newRegion.longitude === myLocations.coords.longitude)) setVisible(true);
        } else setVisible(true);
    };

    const [currentData, setCurrentData] = useState({});

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

    const ShowMarkers = props => {
        const { data, idx } = props;
        const setL = parseFloat((idx+1)/10000);

        return (
            <Marker coordinate={{
                latitude: 37.56633546113615,
                longitude: 126.9779482762618 - setL
            }} style={{width: 100, height: 100}}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <CustomMarker />
                    <View style={{position: 'absolute', justifyContent: 'center', alignItems: 'center', top: 2}}>
                        <AppText style={{fontSize: 12, fontWeight: '500', lineHeight: 19.2, color: colors.mainColor}}>{data.cpm_plan_day === -1 ? 1 : data.cpm_plan_day + 1}</AppText>
                    </View>
                    <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: colors.mainColor, borderRadius: 30, height: 22, widht: '100%', marginTop: 4}}>
                        <View style={{justifyContent: 'center', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 1.5}}>
                            <AppText style={{foneSize: 12, lineHeight: 19.2, fontWeight: '500', color: colors.defaultColor}} numberOfLines={1}>
                                {data.place_name}
                            </AppText>
                        </View>
                    </View>
                </View>
            </Marker>
        )
    };

    const ShowMyMarkers = () => {
        return (
            <Marker coordinate={{
                latitude: myLocations.coords.latitude,
                longitude: myLocations.coords.longitude
            }} style={{width: 100, height: 100}}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <CustomMyMarker />
                </View>
            </Marker>
        )
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

                    // setCurrentData() : 현재 데이터의 좋아요 상태 보여주기
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

                    getInitialPlaceData();
                    console.log(response);
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

                    getInitialPlaceData();
                    console.log(response);
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const ShowInfos = props => {
        return (
            <View style={[{position: 'absolute', left: 0, bottom: 0}, !visible && {display: 'none'}]}>
                <View style={{backgroundColor: colors.backgroundColor, width: Dimensions.get('window').width, height: 173, borderTopStartRadius: 10, borderTopEndRadius: 10, borderColor: colors.backgroundColor}}>
                    <ScreenContainerView>
                        <View style={{flexDirection: 'row', marginTop: 16, marginBottom: 4, justifyContent: 'center', alignItems: 'center'}}>
                            {/* <TouchableOpacity onPress={()=>{
                                countPlaceView(data.place_pk);
                                const item = {
                                    'place_pk': data.place_pk,
                                };
                                navigation.navigate('Place', {data: item});
                            }}> */}
                            <TouchableOpacity>
                                <View style={{flexDirection: 'row', width: '100%'}}>
                                    <View style={{justifyContent: 'center', alignItems: 'center', marginEnd: 12}}>
                                        <View style={{borderRadius: 50, width: 24, height: 24, backgroundColor: colors.mainColor, justifyContent: 'center', alignItems: 'center'}}>
                                            {/* 여기도 순서 고쳐야함 (order로 고치면 될듯) */}
                                            <AppText style={{color: colors.defaultColor, fontSize: 12, lineHeight: 19.2, fontWeight: '500', textAlign: 'center'}}>1</AppText>
                                        </View>
                                    </View>
                                    {/* {
                                        data.place_img ?
                                            <Image source={{uri: data.place_img}}
                                                style={{borderRadius: 10, width: 72, height: 72, marginTop: 2}}/> :
                                            <Image source={require('../../assets/images/here_default.png')}
                                                style={{borderRadius: 10, width: 72, height: 72, marginTop: 2}}/> 
                                    } */}
                                                                                <Image source={require('../../assets/images/here_default.png')}
                                                style={{borderRadius: 10, width: 72, height: 72, marginTop: 2}}/> 
                                    <View style={{
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        width: '67%'
                                    }}>
                                        <View style={{marginLeft: 8, marginTop: '2%'}}>
                                            <View style={{flexDirection: 'row'}}>
                                                {/* <AppText style={{
                                                    color: colors.gray[3],
                                                    textAlign: 'center',
                                                    fontSize: 10,
                                                    fontWeight: 'bold'
                                                }}>{checkType(data.place_type)}</AppText> */}
                                                <AppText style={{
                                                    color: colors.gray[3],
                                                    textAlign: 'center',
                                                    fontSize: 10,
                                                    fontWeight: 'bold'
                                                }}>음식점</AppText>
                                                {/* <View style={[{flexDirection: 'row'}, parseInt(data.review_score) == -1 && {display: 'none'}]}> */}
                                                <View style={[{flexDirection: 'row'}]}>

                                                <AppText style={{
                                                    marginHorizontal: 4, color: colors.gray[7],
                                                    textAlign: 'center',
                                                    fontSize: 10,
                                                    fontWeight: 'bold',
                                                }}>|</AppText>
                                                <Image source={require('../../assets/images/review_star.png')}
                                                    style={{
                                                        width: 10,
                                                        height: 10,
                                                        alignSelf: 'center',
                                                        marginTop: '1%',
                                                    }}></Image>
                                                {/* <AppText style={{
                                                    color: colors.gray[3],
                                                    textAlign: 'center',
                                                    fontSize: 10,
                                                    fontWeight: 'bold',
                                                    marginLeft: 2,
                                                }}>{parseFloat(data.review_score).toFixed(2)}</AppText> */}
                                                <AppText style={{
                                                    color: colors.gray[3],
                                                    textAlign: 'center',
                                                    fontSize: 10,
                                                    fontWeight: 'bold',
                                                    marginLeft: 2,
                                                }}>4.84</AppText>
                                                </View>
                                            </View>
                                            {/* <View style={{width: '100%'}}>
                                                <AppText style={{
                                                    fontSize: 16,
                                                    fontWeight: 'bold',
                                                    color: colors.mainColor,
                                                    marginVertical: 5,
                                                }}>{data.place_name}</AppText>
                                            </View> */}
                                            <View style={{width: '100%'}}>
                                                <AppText style={{
                                                    fontSize: 16,
                                                    fontWeight: 'bold',
                                                    color: colors.mainColor,
                                                    marginVertical: 5,
                                                }}>가상 데이터</AppText>
                                            </View>
                                            {/* <AppText
                                                style={{fontSize: 12, color: colors.gray[4]}}>{data.place_addr}</AppText> */}
                                                <AppText
                                                style={{fontSize: 12, color: colors.gray[4]}}>주소주소</AppText>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                <TouchableOpacity onPress={() => {
                                    // if (placeData.like_flag) {
                                    //     DeleteLikedPlace(placeData.place_pk);
                                    // } else {
                                    //     LikePlace(placeData.place_pk);
                                    // }
                                }}>
                                    <Jewel width={26} height={21}
                                        style={{color: placeData.like_flag ? colors.red[3] : colors.red_gray[5]}}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScreenContainerView>
                </View>
            </View>
        )
    };

    console.log(region)
    const GetMyLocationButton = () => {
        return (
            <View style={{position: 'absolute', right: 10, bottom: 10}}>
                <TouchableOpacity onPress={()=>{

                    setMyLocationVisible(!myLocationVisible);
                    const newRegion = { ...region };
    
                    newRegion.latitude = myLocations.coords.latitude;
                    newRegion.longitude = myLocations.coords.longitude;
                
                    setRegion(newRegion);
                }}>
                    <Image source={require('../../assets/images/map/search-location-button.png')} style={{width: 40, height: 40}}/>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <ScreenContainer backgroundColor={colors.backgroundColor}>
            <NavigationTop navigation={navigation} title={title}/>
            <MapView style={{width: Dimensions.get('window').width, height: Platform.OS === 'android' ? Dimensions.get('window').height - 89 : Dimensions.get('window').height - 104}}
                region={region}
                moveOnMarkerPress
                tracksViewChanges={false}
                provider={PROVIDER_GOOGLE}
                onMarkerPress={onMarkerPress}
                onPress={()=>setVisible(false)}
            >
                {/* <Marker coordinate={{
                    latitude: 37.56633546113615,
                    longitude: 126.9779482762618
                }} title={'기본'}
                description="기본값입니다">
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <CustomMarker />
                        <View style={{position: 'absolute', justifyContent: 'center', alignItems: 'center', bottom: 8}}>
                            <AppText style={{fontSize: 12, fontWeight: '500', lineHeight: 19.2, color: colors.mainColor}}>1</AppText>
                        </View>
                    </View>
                </Marker> */}
                {
                    placeData.map((data, idx) => (
                        <ShowMarkers data={data} idx={idx} key={idx}/>
                    ))
                }
                { myLocations !== null &&
                    <ShowMyMarkers />
                }
            </MapView>
            { myLocations !== null &&
                <GetMyLocationButton />
            }
            <ShowInfos />
        </ScreenContainer>
    );
};

export default EntireMap;