import React, {useState, useEffect, useContext} from 'react';
import {
    Image,
    TouchableOpacity,
    View,
    StyleSheet,
    SafeAreaView,
    FlatList,
    ScrollView,
    TouchableWithoutFeedback,
    Alert
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useIsFocused} from '@react-navigation/native';
import { Icon } from 'react-native-elements';

import AppText from '../../components/AppText';
import ScreenContainerView from '../../components/ScreenContainerView';
import {useSearchKeyword} from '../../contexts/SearchkeywordContextProvider';
import ShowEmpty from '../../components/ShowEmpty';
import {useToken} from '../../contexts/TokenContextProvider';

import Star from '../../assets/images/search/star.svg';
import Jewel from '../../assets/images/jewel.svg';
import * as SecureStore from 'expo-secure-store';
import {useIsSignedIn} from '../../contexts/SignedInContextProvider';
import {useAlertDuplicated} from '../../contexts/LoginContextProvider';

const SearchPlace = props => {
    const {colors} = useTheme();
    const { countPlace, navigation } = props;
    const [placeList, setPlaceList] = useState([]);
    const [like, setLike] = useState(false);
    const [searchKeyword, setSearchKeyword] = useSearchKeyword();
    const isFocused = useIsFocused();
    const [isSignedIn, setIsSignedIn] = useIsSignedIn();

    const [token, setToken] = useToken();
    const [alertDuplicated, setAlertDuplicated] = useAlertDuplicated(false);

    const styles = StyleSheet.create({
        info_container: {
            marginLeft: 8,
            paddingVertical: 1.5,
            justifyContent: 'space-between',
            height: '100%'
        },
        score_line: {
            width: 1,
            height: '80%',
            backgroundColor: colors.gray[4],
            marginHorizontal: 4
        }
    });

    useEffect(() => {
        getResults('SCORE');
        setShowMenu(false);
        setCurrentMenu('평점순');
    }, [searchKeyword, isFocused]);

    const getResults = (NOW) => {
        try {
            fetch(`http://34.64.185.40/place/list?keyword=${decodeURIComponent(searchKeyword)}&sort=${NOW}`, {
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

                    countPlace(response.data.length);
                    setPlaceList(response.data);
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
                        setAlertDuplicated(true);
                    }

                    if (parseInt(response.code / 100) === 4) {
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }

                    getResults('SCORE');
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
                        setAlertDuplicated(true);
                    }

                    if (parseInt(response.code / 100) === 4) {
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }

                    getResults('SCORE');
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const countPlaceView = (place_pk) => {
        try {
            fetch(`34.64.185.40/view/place/${place_pk}`, {
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

    const [showMenu, setShowMenu] = useState(false);
    const [currentMenu, setCurrentMenu] = useState('평점순');

    const SelectBox = () => {
        return (
            <View style={{
                position: 'absolute',
                zIndex: 9000
            }} flex={1}>
                {
                    showMenu && <View style={{
                        width: 80,
                        height: 60,
                        backgroundColor: '#fff',
                        flex: 1,
                        borderRadius: 10,
                        zIndex: 0,
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        overflow: 'visible'
                    }}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                                setShowMenu(false);
                                setCurrentMenu('평점순');
                                getResults('SCORE');
                            }}
                            style={{
                                flex: 1,
                                zIndex: 0,
                            }}>
                            <View style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                flexDirection: 'row',
                                paddingLeft: 8.5,
                                width: '100%'
                            }}>
                                <AppText style={{color: colors.mainColor, fontSize: 14, lineHeight: 16.8, fontWeight: '400'}}>평점순</AppText>
                                {currentMenu === '평점순' && <Icon type="ionicon" name={'checkmark-sharp'} size={14} color={colors.mainColor} style={{marginLeft: 10}}></Icon>}
                            </View>
                        </TouchableOpacity>
                    
                        <View style={{
                            height: 1,
                            borderColor: colors.gray[5],
                            borderWidth: 0.4,
                            borderRadius: 1,
                            zIndex: 0,
                            backgroundColor: colors.backgroundColor,
                        }}></View>
                    
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                                setShowMenu(false);
                                setCurrentMenu('인기순');
                                getResults('LIKE');
                            }} style={{
                                flex: 1,
                                zIndex: 0,
                            }}>
                            <View style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                flexDirection: 'row',
                                paddingLeft: 8.5,
                                width: '100%',
                            }}>
                                <AppText style={{color: colors.mainColor, fontSize: 14, lineHeight: 16.8, fontWeight: '400'}}>인기순</AppText>
                                {currentMenu === '인기순' && <Icon type="ionicon" name={'checkmark-sharp'} size={14} color={colors.mainColor} style={{marginLeft: 10}}></Icon>}
                            </View>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        );};

    const PlaceContainer = ({item}) => {
        return (
            <TouchableOpacity onPress={() => {
                countPlaceView(item.place_pk);
                const data = {
                    'place_pk': item.place_pk,
                };
                navigation.navigate('Place', {data: data});
            }} style={{zIndex: 9999}} activeOpacity={0.8}>
                <View style={{
                    marginBottom: 8,
                    alignItems: 'center',
                    height: 72,
                    marginTop: 22,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}>
                    <View style={{flexDirection: 'row', width: '85%'}} flex={1}>
                        {
                            item.place_img ?
                                <Image source={{uri: item.place_img}}
                                    style={{borderRadius: 10, width: 72, height: 72}}/> :
                                    item.place_thumbnail ?
                                    <Image source={{uri: item.place_thumbnail}}
                                    style={{borderRadius: 10, width: 72, height: 72}}/> :
                                        item.review_img ?
                                        <Image source={{uri: item.review_img}}
                                        style={{borderRadius: 10, width: 72, height: 72}}/> :
                                        <Image source={require('../../assets/images/here_default.png')}
                                            style={{borderRadius: 10, width: 72, height: 72}}/> 
                        }
                        <View flex={1} style={styles.info_container}>
                            <View flexDirection="row" style={{alignItems: 'center'}}>
                                <AppText
                                    style={{
                                        fontSize: 10,
                                        color: colors.mainColor
                                    }}>{checkType(item.place_type)}</AppText>
                                <View style={[{flexDirection: 'row'}, parseInt(item.review_score) == -1 && {display: 'none'}]}>
                                    <View style={{...styles.score_line}}></View>
                                    <Star width={11} height={11} style={{marginTop: 2}}/>
                                    <AppText
                                        style={{fontSize: 10, color: colors.mainColor, marginLeft: 2}}>{parseFloat(item.review_score).toFixed(2)}</AppText>
                                </View>
                            </View>
                            <AppText style={{
                                fontSize: 16,
                                fontWeight: '700',
                                color: colors.mainColor
                            }}>{item.place_name}</AppText>
                            <AppText
                                style={{
                                    fontSize: 12,
                                    fontWeight: '400',
                                    color: colors.gray[4]
                                }}>{item.place_addr}</AppText>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => {
                        if (item.like_flag) {
                            DeleteLikedPlace(item.place_pk);
                        } else {
                            LikePlace(item.place_pk);
                        }
                    }} activeOpacity={0.8}>
                        <Jewel width={26} height={21}
                            style={{color: item.like_flag ? colors.red[3] : colors.red_gray[5]}}/>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={{backgroundColor: colors.backgroundColor}} flex={1}>
            <ScrollView flex={1}>
                {
                    placeList.length === 0 ?
                        <ShowEmpty/> :
                        <View style={{backgroundColor: colors.backgroundColor, flex: 1, position: 'relative'}}>
                            <SelectBox />
                            <View flexDirection="row" style={{justifyContent: 'space-between', marginTop: 2, position: 'relative', zIndex: 50}} flex={1}>
                                <TouchableWithoutFeedback onPress={()=>setShowMenu(false)}>
                                    <View flexDirection="row" flex={1}>
                                        <TouchableOpacity onPress={()=>{
                                            setShowMenu(!showMenu);
                                        }} style={{flexDirection: 'row'}} activeOpacity={0.8}>
                                            <AppText style={{color: colors.mainColor}}>{currentMenu}</AppText>
                                            <Icon style={{color: colors.mainColor, paddingTop: 1, paddingLeft: 8}} type="ionicon"
                                                name={'chevron-down-outline'} size={16}></Icon>
                                        </TouchableOpacity>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                            <SafeAreaView flex={1}>
                                <FlatList data={placeList} renderItem={PlaceContainer}
                                    keyExtractor={(item, index) => item.place_pk.toString()} nestedScrollEnabled/>
                            </SafeAreaView>
                        </View>
                }
            </ScrollView>
        </View>
    );
};


export default SearchPlace;
