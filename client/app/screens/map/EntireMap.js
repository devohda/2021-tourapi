import React, {useState, useRef, useEffect} from 'react';
import {
    View,
    ScrollView,
    Image,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
    Share,
    Alert,
    FlatList,
    Platform
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

import CustomMarker from '../../assets/images/map/map-marker.svg';

import ScreenContainer from '../../components/ScreenContainer';
import ScreenContainerView from '../../components/ScreenContainerView';
import NavigationTop from '../../components/NavigationTop';
import AppText from '../../components/AppText';

import {useToken} from '../../contexts/TokenContextProvider';

const EntireMap = ({route, navigation}) => {
    const {colors} = useTheme();
    const {title, placeData, type, pk} = route.params;
    const [region, setRegion] = useState({
        latitude: 35.86933546113615,
        longitude: 127.5779482762618,
        latitudeDelta: 3.5,
        longitudeDelta: 3.5,
    });
    const [visible, setVisible] = useState(false);
    const [curReviewScore, setCurReviewScore] = useState(0);
    const [currentData, setCurrentData] = useState({});
    const [token, setToken] = useToken();

    const countPlaceView = (place_pk) => {
        try {
            fetch(`http://34.64.185.40/view/place/${place_pk}`, {
                method: 'POST',
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
        const currentInfo = placeData.find(
            m => m.place_latitude == coordinate.latitude && m.place_longitude == coordinate.longitude
        );

        const newRegion = { ...region };

        newRegion.latitude = coordinate.latitude;
        newRegion.longitude = coordinate.longitude;
        newRegion.latitudeDelta = 0.015;
        newRegion.longitudeDelta = 0.015;

        setRegion(newRegion);

        setCurrentData(currentInfo);
        setCurReviewScore(parseFloat(currentData.review_score).toFixed(2));
        setVisible(true);
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

    const checkIndex = (pk) => {
        var cnt = 0;
        for (var i = 0; i < placeData.length; i++) {
            if(placeData[i].place_pk !== -1 && placeData[i].place_pk !== -2) cnt += 1;
            if(placeData[i].place_pk === pk) break;
        }
        return cnt;
    };

    const checkStyle = (lat, lng) => {
        if(lat === null && lng === null) {
            return {
                display: 'none'
            }
        } else {
            return {
                width: 100, height: 100
            }
        }
    };

    const ShowMarkers = props => {
        const {data, idx} = props;
        let lat = 37.56633546113615;
        let lng = 126.9779482762618;
        if(data.place_latitude) lat =  Number(parseFloat(data.place_latitude).toFixed(10));
        if(data.place_longitude) lng = Number(parseFloat(data.place_longitude).toFixed(10));

        return (
            <Marker coordinate={{
                latitude: lat,
                longitude: lng,
            }} style={checkStyle(data.place_latitude, data.place_longitude)}>
                <View style={[{justifyContent: 'center', alignItems: 'center'}, (!data.place_latitude || !data.place_longitude) && {display: 'none'}]}>
                    <CustomMarker/>
                    <View style={{position: 'absolute', justifyContent: 'center', alignItems: 'center', top: 2}}>
                        <AppText style={{
                            fontSize: 12,
                            fontWeight: '500',
                            lineHeight: 19.2,
                            color: colors.mainColor
                        }}>{data.cpm_plan_day === -1 ? 1 : data.cpm_plan_day + 1}</AppText>
                    </View>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: colors.mainColor,
                        borderRadius: 30,
                        height: 22,
                        width: '100%',
                        marginTop: 4
                    }}>
                        <View style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingHorizontal: 12,
                            paddingVertical: 1.5
                        }}>
                            <AppText
                                style={{fontSize: 12, lineHeight: 19.2, fontWeight: '500', color: colors.defaultColor}}
                                numberOfLines={1}>
                                {data.place_name}
                            </AppText>
                        </View>
                    </View>
                </View>
            </Marker>
        );
    };

    const ShowInfos = () => {
        return (
            <View style={[{position: 'absolute', left: 0, bottom: 0}, !visible && {display: 'none'}]}>
                <View style={{
                    backgroundColor: colors.backgroundColor,
                    width: Dimensions.get('window').width,
                    height: 133,
                    borderTopStartRadius: 10,
                    borderTopEndRadius: 10,
                    borderColor: colors.backgroundColor
                }}>
                    <ScreenContainerView>
                        <View style={{
                            flexDirection: 'row',
                            marginTop: 16,
                            marginBottom: 4,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <TouchableOpacity onPress={() => {
                                countPlaceView(currentData.place_pk);
                                const item = {
                                    'place_pk': currentData.place_pk,
                                };
                                navigation.navigate('Place', {data: item});
                            }} activeOpacity={0.8}>
                                <View style={{flexDirection: 'row', width: '100%'}}>
                                    <View style={{justifyContent: 'center', alignItems: 'center', marginEnd: 12}}>
                                        <View style={{
                                            borderRadius: 50,
                                            width: 24,
                                            height: 24,
                                            backgroundColor: colors.mainColor,
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <AppText style={{
                                                color: colors.defaultColor,
                                                fontSize: 12,
                                                lineHeight: 19.2,
                                                fontWeight: '500',
                                                textAlign: 'center'
                                            }}>{checkIndex(currentData.place_pk)}</AppText>
                                        </View>
                                    </View>
                                    {
                                        currentData.place_img ?
                                            <Image source={{uri: currentData.place_img}}
                                                   style={{borderRadius: 10, width: 72, height: 72, marginTop: 2}}/> :
                                            currentData.review_img ?
                                                <Image source={{uri: currentData.review_img}}
                                                       style={{
                                                           borderRadius: 10,
                                                           width: 72,
                                                           height: 72,
                                                           marginTop: 2,
                                                       }}/> :
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
                                                }}>{checkType(currentData.place_type)}</AppText>
                                                <View
                                                    style={[{flexDirection: 'row'}, parseInt(currentData.review_score) == -1 && {display: 'none'}]}>
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
                                                    <AppText style={{
                                                        color: colors.gray[3],
                                                        textAlign: 'center',
                                                        fontSize: 10,
                                                        fontWeight: 'bold',
                                                        marginLeft: 2,
                                                    }}>{parseFloat(currentData.review_score).toFixed(2)}</AppText>
                                                </View>
                                            </View>
                                            <View style={{width: '100%'}}>
                                                <AppText style={{
                                                    fontSize: 16,
                                                    fontWeight: 'bold',
                                                    color: colors.mainColor,
                                                    marginVertical: 5,
                                                }}>{currentData.place_name}</AppText>
                                            </View>
                                            <AppText
                                                style={{
                                                    fontSize: 12,
                                                    color: colors.gray[4]
                                                }}>{currentData.place_addr}</AppText>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScreenContainerView>
                </View>
            </View>
        );
    };

    return (
        <ScreenContainer backgroundColor={colors.backgroundColor}>
            <NavigationTop navigation={navigation} title={title}/>
            {
                Platform.OS == 'ios' ?
                <MapView style={{
                    width: Dimensions.get('window').width,
                    height: Platform.OS === 'android' ? Dimensions.get('window').height - 89 : Dimensions.get('window').height - 104
                }}
                    region={region}
                    moveOnMarkerPress
                    tracksViewChanges={false}
                    onMarkerPress={onMarkerPress}
                    onPress={()=>setVisible(false)}
                >
                    { placeData.length > 0 &&
                        placeData.map((data, idx) => (
                            <ShowMarkers data={data} idx={idx} key={idx}/>
                        ))
                    }
                </MapView> :
                <MapView style={{
                    width: Dimensions.get('window').width,
                    height: Platform.OS === 'android' ? Dimensions.get('window').height - 89 : Dimensions.get('window').height - 104
                }}
                    region={region}
                    moveOnMarkerPress
                    tracksViewChanges={false}
                    onMarkerPress={onMarkerPress}
                    provider={PROVIDER_GOOGLE}
                >
                    { placeData.length > 0 &&
                        placeData.map((data, idx) => (
                            <ShowMarkers data={data} idx={idx} key={idx}/>
                        ))
                    }
                </MapView>
            }

            {visible &&
            <ShowInfos/>
            }
        </ScreenContainer>
    );
};

export default EntireMap;