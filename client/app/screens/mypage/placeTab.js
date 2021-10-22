import {useTheme} from '@react-navigation/native';
import {
    Dimensions, FlatList, Image, SafeAreaView, ScrollView,
    StyleSheet, View, TouchableOpacity, TouchableWithoutFeedback, Platform, Alert
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AppText from '../../components/AppText';
import {Icon} from 'react-native-elements';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenContainerView from '../../components/ScreenContainerView';
import {useToken} from '../../contexts/TokenContextProvider';
import {useIsFocused} from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import {useIsSignedIn} from '../../contexts/SignedInContextProvider';

import Jewel from '../../assets/images/jewel.svg';
import DefaultThumbnail from '../../assets/images/profile_default.svg';
import {useAlertDuplicated} from '../../contexts/LoginContextProvider';

const PlaceTab = ({navigation}) => {
    const {colors} = useTheme();
    const [token, setToken] = useToken();
    const [isSignedIn, setIsSignedIn] = useIsSignedIn();
    const isFocused = useIsFocused();
    const [thumbnail, setThumbnail] = useState([]);

    const [placeList, setPlaceList] = useState({});
    const [collectionList, setCollectionList] = useState({});
    const [alertDuplicated, setAlertDuplicated] = useAlertDuplicated(false);
    const [directoryType, setDirectoryType] = useState([
        {
            name: '공간',
            isClicked: true
        },
        {
            name: '보관함',
            isClicked: false
        }
    ]);
    const [currentRendering, setCurrentRendering] = useState(0);

    useEffect(() => {
        getLikedPlace('RESENT');
        getLikedCollection('RESENT');
        setShowMenu(false);
        setCurrentMenu('최근 추가순');
    }, [isFocused]);

    const getLikedPlace = (NOW) => {
        try {
            fetch(`http://34.64.185.40/like/placeList?sort=${NOW}`, {
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

                    setPlaceList(response.data);

                    var newArr = [];
                    const res = response.data;
                    for (var i = 0; i < res.length; i++) {
                        if (res[i].place_img) {
                            newArr.push(res[i].place_img);
                        } else if (res[i].place_thumbnail) {
                            newArr.push(res[i].place_thumbnail);
                        } else if (res[i].review_img) {
                            newArr.push(res[i].review_img);
                        } else {
                            newArr.push('');
                        }
                    }
                    setThumbnail(newArr);
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const getLikedCollection = (NOW) => {
        try {
            fetch(`http://34.64.185.40/like/collectionList?sort=${NOW}`, {
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

                    setCollectionList(response.data);
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

    const countCollectionView = (collection_pk) => {
        try {
            fetch(`http://34.64.185.40/view/collection/${collection_pk}`, {
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

                    getLikedPlace();
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const DeleteLikedCollection = (pk) => {
        try {
            fetch(`http://34.64.185.40/like/collection/${pk}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
            }).then(res => res.json())
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

                    getLikedCollection();
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

    const SetRenderings = (i) => {
        setCurrentRendering(i);
        if (i === 0) {
            getLikedPlace('RESENT');
        } else {
            getLikedCollection('RESENT');
        }
        setShowMenu(false);
        setCurrentMenu('최근 추가순');
    };

    const Keyword = ({type, idx}) => {
        return (
            <View style={styles.keyword}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={type.isClicked ?
                        {
                            ...styles.selectTypeClicked, borderColor: colors.mainColor,
                            backgroundColor: colors.mainColor,
                            shadowColor: colors.red[7]
                        } :
                        {
                            ...styles.selectType, borderColor: colors.defaultColor,
                            backgroundColor: colors.defaultColor,
                            shadowColor: colors.red[7]
                        }}
                    onPress={() => {
                        // 클릭하면 색 바꾸기
                        setDirectoryType(dirType => dirType.map(
                            (val, i) =>
                                i === idx ? {name: val.name, isClicked: true} : {
                                    name: val.name,
                                    isClicked: false
                                })
                        );
                        directoryType.map((val, i) =>
                            (i === idx) &&
                            SetRenderings(i)
                        );
                    }}
                >
                    <AppText
                        style={type.isClicked ? {
                            ...styles.selectTypeTextClicked,
                            color: colors.defaultColor
                        } : {...styles.selectTypeText, color: colors.subColor}}>{type.name}</AppText>
                </TouchableOpacity>
            </View>
        );
    };

    const SetRendering = () => {
        if (currentRendering) return (
            <FlatList columnWrapperStyle={{justifyContent: 'space-between'}} numColumns={2}
                      showsVerticalScrollIndicator={false}
                      style={{zIndex: 0}}
                      data={collectionList} renderItem={CollectionContainer}
                      keyExtractor={(item) => item.collection_pk.toString()} nestedScrollEnabled/>
        );
        else return (
            <FlatList contentContainerStyle={{justifyContent: 'space-between'}} numColumns={2}
                      showsVerticalScrollIndicator={false}
                      data={placeList} renderItem={PlaceContainer}
                      keyExtractor={(item) => item.place_pk.toString()} nestedScrollEnabled/>
        );
    };

    const PlaceContainer = ({item, index}) => (
        <TouchableOpacity style={{
            ...styles.placeContainer,
            shadowColor: colors.red_gray[6],
            backgroundColor: colors.backgroundColor,
            zIndex: 9999
        }} onPress={() => {
            countPlaceView(item.place_pk);
            const data = {
                'place_pk': item.place_pk,
            };
            navigation.navigate('Place', {data: data});
        }} activeOpacity={0.8}>
            <View style={{overflow: 'hidden', borderRadius: 10, marginHorizontal: 4}}>
                {
                    thumbnail[index] !== '' ?
                        <Image style={styles.defaultPlaceImage} source={{uri: thumbnail[index]}}/> :
                        <Image style={styles.defaultPlaceImage}
                               source={require('../../assets/images/here_default.png')}/>
                }
                <View style={{backgroundColor: 'rgba(0, 0, 0, 0.1)', width: '100%', height: 113, position: 'absolute'}}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <TouchableOpacity onPress={() => {
                            DeleteLikedPlace(item.place_pk);
                        }} activeOpacity={0.8}>
                            <Jewel width={26} height={21}
                                   style={{marginTop: 10, marginRight: 10, color: colors.red[3]}}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{marginLeft: 5, height: 67}}>
                    <View style={{flexDirection: 'row', marginTop: 8}}>
                        <AppText style={{
                            color: colors.mainColor,
                            fontSize: 10,
                            marginTop: 2
                        }}>{checkType(item.place_type)}</AppText>
                        <View style={[{flexDirection: 'row'}, parseInt(item.review_score) == -1 && {display: 'none'}]}>
                            <AppText style={{color: colors.mainColor, fontSize: 11, marginHorizontal: 6}}>|</AppText>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Image source={require('../../assets/images/here_icon.png')}
                                       style={{width: 11.36, height: 9.23, marginTop: 2, marginRight: 3.24}}></Image>
                                <AppText style={{
                                    color: colors.mainColor,
                                    fontSize: 10
                                }}>{parseFloat(item.review_score).toFixed(2)}</AppText>
                            </View>
                        </View>
                    </View>
                    <View style={{width: '100%'}}>
                        <AppText style={{
                            color: colors.mainColor,
                            fontSize: 16,
                            fontWeight: 'bold',
                            lineHeight: 24.8
                        }}>{item.place_name}</AppText>
                    </View>
                    <View style={{width: '90%', flexWrap: 'wrap', alignItems: 'flex-start', height: '100%'}}>
                        <AppText style={{
                            color: colors.gray[4],
                            fontSize: 12,
                            lineHeight: 19.2
                        }}>{item.place_addr}</AppText>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    const [defaultThumbnailList, setDefaultThumbnailList] = useState([
        {
            id: 1,
            name: 'default-red',
            color: colors.red[3]
        },
        {
            id: 2,
            name: 'default-yellow',
            color: '#FFC36A'
        },
        {
            id: 3,
            name: 'default-green',
            color: '#639A94'
        },
        {
            id: 4,
            name: 'default-blue',
            color: '#637DA9'
        },
        {
            id: 5,
            name: 'default-purple',
            color: '#8F6DA4'
        },
        {
            id: 6,
            name: 'selected-photo',
            color: colors.defaultColor
        },
    ]);

    const setBGColor = (thumbnail) => {
        if (thumbnail === defaultThumbnailList[0].name) return defaultThumbnailList[0].color;
        else if (thumbnail === defaultThumbnailList[1].name) return defaultThumbnailList[1].color;
        else if (thumbnail === defaultThumbnailList[2].name) return defaultThumbnailList[2].color;
        else if (thumbnail === defaultThumbnailList[3].name) return defaultThumbnailList[3].color;
        else if (thumbnail === defaultThumbnailList[4].name) return defaultThumbnailList[4].color;
        else return defaultThumbnailList[5].color;
    };

    const ShowThumbnail = props => {
        const {thumbnail} = props;
        if (thumbnail.startsWith('default')) {
            return (
                <View style={{
                    ...styles.defaultImage,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: setBGColor(thumbnail)
                }}>
                    <DefaultThumbnail width={97} height={70.38}/>
                </View>
            );
        } else {
            return (
                <Image source={{uri: thumbnail}} style={{...styles.defaultImage}}/>
            );
        }
    };

    const CollectionContainer = ({item, index}) => {
        return (
            <TouchableOpacity style={{...styles.directoryContainer, shadowColor: colors.red_gray[6], zIndex: 9999}}
                              onPress={() => {
                                  countCollectionView(item.collection_pk);
                                  const data = {
                                      'collection_pk': item.collection_pk,
                                      'now': false,
                                  };
                                  if (item.collection_type === 1) navigation.navigate('PlanCollection', {data: data});
                                  else navigation.navigate('FreeCollection', {data: data});
                              }} activeOpacity={0.8}>
                <View style={{overflow: 'hidden', borderRadius: 10}}>
                    {item.collection_thumbnail ?
                        <ShowThumbnail thumbnail={item.collection_thumbnail}/> :
                        <Image style={styles.defaultImage} source={require('../../assets/images/here_default.png')}/>
                    }
                    <View style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        width: '100%',
                        height: 163,
                        position: 'absolute'
                    }}>
                        <View style={{zIndex: 10000, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View style={[styles.dirType, {
                                borderColor: colors.backgroundColor,
                                backgroundColor: colors.backgroundColor
                            }]}>
                                <AppText
                                    style={item.collection_type === 1 ? {
                                        ...styles.dirPlanText,
                                        color: colors.red[3]
                                    } : {
                                        ...styles.dirFreeText,
                                        color: colors.mainColor
                                    }}>{item.collection_type === 1 ? '일정' : '자유'}</AppText>
                            </View>
                            {item.collection_private === 1 &&
                            <View style={{marginRight: 9, marginTop: 8}}>
                                <Image style={{width: 20, height: 20}}
                                       source={require('../../assets/images/lock_outline.png')}></Image>
                            </View>
                            }
                            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                                <TouchableOpacity onPress={() => {
                                    DeleteLikedCollection(item.collection_pk);
                                }} activeOpacity={0.8}>
                                    <Jewel width={26} height={21}
                                           style={{marginTop: 10, marginRight: 10, color: colors.red[3]}}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={{marginLeft: 10, marginTop: 8, height: 86}}>
                        <AppText style={{
                            fontSize: 14,
                            fontWeight: '400',
                            color: colors.mainColor
                        }}>{item.collection_name}</AppText>
                        <View style={{
                            marginTop: 4,
                            flexDirection: 'row',
                            width: '90%',
                            flexWrap: 'wrap',
                            alignItems: 'flex-start'
                        }}>
                            {item.keywords.map((keyword, idx) => {
                                return (
                                    <AppText key={idx} style={{
                                        color: colors.gray[2],
                                        fontSize: 10,
                                        marginRight: 8,
                                        lineHeight: 14
                                    }}># {keyword}</AppText>);
                            })}
                        </View>
                        <View flexDirection="row"
                              style={{position: 'absolute', bottom: 15, justifyContent: 'space-between'}}>
                            <View style={{flexDirection: 'row'}}>
                                <AppText style={{
                                    fontSize: 8,
                                    width: '68%',
                                    color: colors.gray[2]
                                }}>by {item.created_user_name}</AppText>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{marginRight: 8, flexDirection: 'row'}}>
                                    <Image source={require('../../assets/images/here_icon.png')}
                                           style={{width: 8, height: 8, margin: 2}}></Image>
                                    <AppText style={{
                                        fontSize: 8,
                                        color: colors.gray[2],
                                        fontWeight: 'bold'
                                    }}>{item.like_cnt}</AppText>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    <Icon type="ionicon" name={'location'} size={8} color={colors.gray[2]}
                                          style={{margin: 1}}></Icon>
                                    <AppText style={{
                                        fontSize: 8,
                                        color: colors.gray[2],
                                        fontWeight: 'bold'
                                    }}>{item.place_cnt}</AppText>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const [showMenu, setShowMenu] = useState(false);
    const [currentMenu, setCurrentMenu] = useState('최근 추가순');

    const SelectBox = () => {
        return (
            <View style={{
                position: 'absolute',
                marginTop: 40,
                marginLeft: 20,
                zIndex: 9000
            }} flex={1}>
                {
                    showMenu && <View style={{
                        width: 100,
                        height: currentRendering ? 60 : 80,
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
                            onPress={() => {
                                setShowMenu(false);
                                setCurrentMenu('최근 추가순');
                                if (currentRendering) getLikedCollection('RESENT');
                                else getLikedPlace('RESENT');
                            }}
                            style={{
                                flex: 1,
                                zIndex: 0,
                            }} activeOpacity={0.8}>
                            <View style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                flexDirection: 'row',
                                paddingLeft: 8.5,
                                width: '100%'
                            }}>
                                <AppText style={{
                                    color: colors.mainColor,
                                    fontSize: 14,
                                    lineHeight: 16.8,
                                    fontWeight: '400'
                                }}>최근 추가순</AppText>
                                {currentMenu === '최근 추가순' &&
                                <Icon type="ionicon" name={'checkmark-sharp'} size={14} color={colors.mainColor}
                                      style={{marginLeft: 10}}></Icon>}
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
                            onPress={() => {
                                setShowMenu(false);
                                setCurrentMenu('인기순');
                                if (currentRendering) getLikedCollection('LIKE');
                                else getLikedPlace('LIKE');
                            }} style={{
                            flex: 1,
                            zIndex: 0,
                        }} activeOpacity={0.8}>
                            <View style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                flexDirection: 'row',
                                paddingLeft: 8.5,
                                width: '100%',
                            }}>
                                <AppText style={{
                                    color: colors.mainColor,
                                    fontSize: 14,
                                    lineHeight: 16.8,
                                    fontWeight: '400'
                                }}>인기순</AppText>
                                {currentMenu === '인기순' &&
                                <Icon type="ionicon" name={'checkmark-sharp'} size={14} color={colors.mainColor}
                                      style={{marginLeft: 10}}></Icon>}
                            </View>
                        </TouchableOpacity>
                        {!currentRendering &&
                        <View style={{
                            height: 1,
                            borderColor: colors.gray[5],
                            borderWidth: 0.4,
                            borderRadius: 1,
                            zIndex: 0
                        }}></View>}

                        {!currentRendering &&
                        <TouchableOpacity
                            onPress={() => {
                                setShowMenu(false);
                                setCurrentMenu('평점순');
                                getLikedPlace('SCORE');
                            }} style={{
                            flex: 1,
                            zIndex: 0,
                        }} activeOpacity={0.8}>
                            <View style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                flexDirection: 'row',
                                paddingLeft: 8.5,
                                width: '100%',
                            }}>
                                <AppText style={{
                                    color: colors.mainColor,
                                    fontSize: 14,
                                    lineHeight: 16.8,
                                    fontWeight: '400'
                                }}>평점순</AppText>
                                {currentMenu === '평점순' &&
                                <Icon type="ionicon" name={'checkmark-sharp'} size={14} color={colors.mainColor}
                                      style={{marginLeft: 10}}></Icon>}
                            </View>
                        </TouchableOpacity>}
                    </View>
                }
            </View>
        );
    };

    return (
        <View style={{backgroundColor: colors.backgroundColor, flex: 1, position: 'relative'}}>
            <SelectBox/>
            <ScreenContainerView flex={1}>
                <View flexDirection="row" style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginVertical: 4,
                    position: 'relative',
                    zIndex: 50
                }}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        {directoryType.map(
                            (type, idx) => <Keyword type={type} key={idx} idx={idx}/>
                        )}
                    </ScrollView>
                </View>

                <View flexDirection="row" style={{
                    justifyContent: 'flex-start',
                    marginTop: 2,
                    marginBottom: 8,
                    position: 'relative',
                    zIndex: 50
                }}>
                    <TouchableWithoutFeedback onPress={() => setShowMenu(false)}>
                        <View flexDirection="row" flex={1}>
                            <TouchableOpacity onPress={() => {
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
                    <SetRendering/>
                </SafeAreaView>
            </ScreenContainerView>
        </View>
    );
};

const styles = StyleSheet.create({

    directoryContainer: {
        width: '49%',
        height: 249,
        borderRadius: 10,
        backgroundColor: '#fff',
        marginBottom: 11,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 1,
        shadowRadius: 6,
    },
    placeContainer: {
        width: '49%',
        height: 180,
        borderRadius: 10,
        marginBottom: 11,
    },
    dirType: {
        borderWidth: 1,
        paddingVertical: 1,
        paddingHorizontal: 8,
        borderRadius: 14,
        width: 43,
        height: 22,
        marginLeft: 9,
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dirFreeText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    dirPlanText: {
        fontSize: 12,
        fontWeight: 'bold'
    },
    defaultImage: {
        width: '100%',
        height: 163,
    },
    defaultPlaceImage: {
        width: '100%',
        height: 113,
        borderRadius: 10,
    },
    selectType: {
        borderWidth: 1,
        paddingVertical: 1,
        paddingHorizontal: 8.5,
        borderRadius: 12,
        marginRight: 10,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectTypeClicked: {
        borderWidth: 1,
        paddingVertical: 1,
        paddingHorizontal: 8.5,
        borderRadius: 12,
        marginRight: 10,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center'
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
        marginVertical: 2
    },

    keyword: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 2,
    },

    //profile
    thumbnailImage: {
        width: 108,
        height: 108,
        borderRadius: 10,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});


export default PlaceTab;