import React, {useState, useEffect, useContext} from 'react';
import {Image, TouchableOpacity, View, StyleSheet, SafeAreaView, FlatList, ScrollView} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useIsFocused} from '@react-navigation/native';

import AppText from '../../components/AppText';
import {useSearchKeyword} from '../../contexts/search/SearchkeywordContextProvider';
import ShowEmpty from '../../components/ShowEmpty';
import {useToken} from '../../contexts/TokenContextProvider';
import {searchPlaceResult} from '../../contexts/search/SearchPlaceContextProvider';

import Star from '../../assets/images/search/star.svg';
import Jewel from '../../assets/images/jewel.svg';
import * as SecureStore from 'expo-secure-store';
import {useIsSignedIn} from '../../contexts/SignedInContextProvider';

const SearchPlace = ({navigation}) => {
    const {colors} = useTheme();
    const [placeList, setPlaceList] = useState([]);
    const [like, setLike] = useState(false);
    const [searchKeyword, setSearchKeyword] = useSearchKeyword();
    const [searchLength, setSearchLength] = searchPlaceResult();
    const isFocused = useIsFocused();
    const [isSignedIn, setIsSignedIn] = useIsSignedIn();

    const [token, setToken] = useToken();

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
        getResults();
    }, [searchKeyword, isFocused]);

    const getResults = () => {
        try {
            fetch(`http://34.64.185.40/search?keyword=${decodeURIComponent(searchKeyword)}&type=place`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
            }).then((res) => res.json())
                .then(async (response) => {
                    if (response.code === 401 || response.code === 403 || response.code === 419) {
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }
                    setSearchLength(response.data.length);
                    setPlaceList(response.data);
                    // setFalse();
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

                    getResults();
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

                    getResults();
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

    const [isPress, setIsPress] = useState([]);
    // const setFalse = () => {
    //     var pressed = [];
    //     for (let i = 0; i < placeList.length; i++) {
    //         pressed.push(false);
    //     }
    //     setIsPress(pressed);
    // };

    const PlaceContainer = ({item, index}) => {
        return (
            <TouchableOpacity onPress={() => navigation.navigate('Place', {data: item})}>
                <View style={{
                    marginBottom: 8,
                    alignItems: 'center',
                    height: 72,
                    marginTop: 22,
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}>
                    <View style={{flexDirection: 'row', width: '85%'}}>
                        {
                            item.place_img ?
                                <Image source={{uri: item.place_img}}
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
                                <View style={styles.score_line}></View>
                                <Star width={11} height={11} style={{marginTop: 2}}/>
                                <AppText
                                    style={{fontSize: 10, color: colors.mainColor, marginLeft: 2}}>{item.star}</AppText>
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
                        // let newArr = [...isPress];
                        // if (newArr[index]) {
                        //     newArr[index] = false;
                        //     setIsPress(newArr);
                        //     deletePlace(item.place_pk);
                        // } else {
                        //     for (let i = 0; i < newArr.length; i++) {
                        //         if (i == index) continue;
                        //         else newArr[i] = false;
                        //     }
                        //     newArr[index] = true;
                        //     setIsPress(newArr);
                        //     likePlace(item.place_pk);
                        // }
                        if (item.like_flag) {
                            DeleteLikedPlace(item.place_pk);
                        } else {
                            LikePlace(item.place_pk);
                        }
                    }}>
                        <Jewel width={26} height={21}
                            style={{color: item.like_flag ? colors.red[3] : colors.red_gray[5]}}/>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={{backgroundColor: colors.backgroundColor}}>
            <ScrollView>
                {
                    placeList.length === 0 ?
                        <ShowEmpty/> :
                        <SafeAreaView>
                            <FlatList data={placeList} renderItem={PlaceContainer}
                                keyExtractor={(item, index) => item.place_pk.toString()} nestedScrollEnabled/>
                        </SafeAreaView>
                }
            </ScrollView>
        </View>
    );
};


export default SearchPlace;
