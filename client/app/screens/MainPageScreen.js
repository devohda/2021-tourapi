import React, {useState, useEffect} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Image,
    ScrollView,
    ImageBackground, Platform,
} from 'react-native';
import {useTheme, useIsFocused} from '@react-navigation/native';
import {Icon} from 'react-native-elements';

import AppText from '../components/AppText';
import ScreenContainer from '../components/ScreenContainer';
import ScreenContainerView from '../components/ScreenContainerView';
import {useToken} from '../contexts/TokenContextProvider';
import {useIsSignedIn} from '../contexts/SignedInContextProvider';

import Jewel from '../assets/images/jewel.svg';
import DefaultProfile from '../assets/images/profile_default.svg';
import * as SecureStore from 'expo-secure-store';

export default function MainPageScreen({navigation}) {
    const {colors} = useTheme();
    const [popularCollection, setPopularCollection] = useState([]);
    const [popularPlace, setPopularPlace] = useState([]);
    const [popularUser, setPopularUser] = useState([]);
    const [token, setToken] = useToken();
    const [days, setDays] = useState('DAY');
    const isFocused = useIsFocused();
    const [isSignedIn, setIsSignedIn] = useIsSignedIn();

    useEffect(() => {
        getPopularCollectionData();
        getPopularPlaceData();
        getPopularUserData();
        () => {
            setPopularCollection([]);
            setPopularPlace([]);
            setPopularUser([]);
        };
    }, []);

    const getPopularCollectionData = (day) => {
        try {
            fetch(`http://34.64.185.40/collection/list?type=MAIN&sort=POPULAR&term=${decodeURIComponent(day)}`, {
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
                    setPopularCollection(response.data);
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
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
                    if (response.code === 401 || response.code === 403 || response.code === 419) {
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }
                    console.log(response.data);
                    setPopularPlace(response.data);
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const getPopularUserData = () => {
        try {
            fetch('http://34.64.185.40/user/list?type=MAIN&sort=LIKE', {
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
                    setPopularUser(response.data);
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
                .then((response) => {
                    // if(response.code === 401 || response.code === 403 || response.code === 419){
                    //     // Alert.alert('','로그인이 필요합니다');
                    //     await SecureStore.deleteItemAsync('accessToken');
                    //     setToken(null);
                    //     setIsSignedIn(false);
                    //     return;
                    // }
                    console.log(response);
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
                    getPopularPlaceData();
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
                    getPopularPlaceData();
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const ShowPopularCollection = props => {
        const {item} = props;
        return (
            <TouchableOpacity style={[{
                ...styles.directoryContainer,
                shadowColor: colors.red_gray[6]
            }]} onPress={() => {
                countCollectionView(item.collection_pk);
                item.collection_type === 1 ?
                    navigation.navigate('PlanCollection', {data: item}) : navigation.navigate('FreeCollection', {data: item});
            }}>
                <View flex={1} style={{overflow: 'hidden', borderRadius: 10}}>
                    <View style={{height: '68%'}}>
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
                                    source={require('../assets/images/lock_outline.png')}></Image>
                            </View>
                            }
                        </View>
                        <View style={styles.defaultImageView}>
                            <Image style={styles.defaultImage} source={item.collection_thumbnail ? {uri: item.collection_thumbnail} : require('../assets/images/here_default.png')}/>
                        </View>
                    </View>
                    <View flex={1} style={{marginLeft: 10, marginTop: 8}}>
                        <AppText style={{
                            fontSize: 14,
                            fontWeight: '400',
                            color: colors.mainColor
                        }}>{item.collection_name}</AppText>
                        <View flexDirection="row"
                            style={{position: 'absolute', bottom: 10, justifyContent: 'space-between'}}>
                            <View style={{flexDirection: 'row'}}>
                                <AppText style={{
                                    fontSize: 10,
                                    width: '85%',
                                    color: colors.gray[4]
                                }}>{item.created_user_name}</AppText>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{flexDirection: 'row'}}>
                                    <Icon type="ionicon" name={'location'} size={8} color={colors.gray[2]}
                                        style={{margin: 2}}></Icon>
                                    <AppText style={{
                                        fontSize: 10,
                                        color: colors.gray[4],
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

    const [backgroundColor, setBackgroundColor] = useState(colors.red[3]);

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

    const ShowPopularUser = props => {
        const {user_nickname} = props.data;
        const {keyword, idx} = props;

        return (
            <View style={{alignItems: 'center'}}>
                <View style={{...styles.authorImage, backgroundColor: setBGColor(idx)}}>
                    <DefaultProfile width={70} height={70}/>
                </View>
                <AppText style={{
                    fontSize: 14,
                    fontWeight: '700',
                    color: colors.mainColor,
                    marginTop: 8
                }}>{user_nickname}</AppText>
                {
                    keyword.length !== 0 &&
                    <View style={{flexDirection: 'row', marginTop: 4}}>{
                        keyword.map((data, idx) => (
                            <UserKeyword data={data} key={idx + 'user'}/>
                        ))
                    }</View>
                }
            </View>
        );
    };

    const UserKeyword = props => {
        const {data} = props;
        return (
            <View
                style={{
                    ...styles.keywordHashTagView,
                    backgroundColor: colors.backgroundColor,
                    borderColor: colors.backgroundColor,
                }}>
                <AppText style={{...styles.keywordHashTag, color: colors.gray[4]}}>#{data}</AppText>
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

    const ShowPopularPlace = props => {
        const {data} = props;
        return (
            <TouchableOpacity onPress={() => navigation.navigate('Place', {data: data})}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 14}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        {
                            data.place_img ?
                                <Image source={{uri: data.place_img}}
                                    style={{borderRadius: 15, width: 72, height: 72, marginTop: 2}}/> :
                                <Image source={require('../assets/images/here_default.png')}
                                    style={{borderRadius: 15, width: 72, height: 72, marginTop: 2}}/>
                        }
                        <View style={{marginLeft: 8, width: '60%'}}>
                            <View style={{flexDirection: 'row'}}>
                                <AppText style={{
                                    color: colors.gray[3],
                                    textAlign: 'center',
                                    fontSize: 10,
                                    fontWeight: '700'
                                }}>{checkType(data.place_type)}</AppText>
                                <AppText style={{
                                    marginHorizontal: 8, color: colors.gray[4],
                                    textAlign: 'center',
                                    fontSize: 10,
                                    fontWeight: '700'
                                }}>|</AppText>
                                <Image source={require('../assets/images/review_star.png')}
                                    style={{
                                        width: 10,
                                        height: 10,
                                        alignSelf: 'center',
                                    }}></Image>
                                <AppText style={{
                                    color: colors.gray[3],
                                    textAlign: 'center',
                                    fontSize: 10,
                                    fontWeight: '700',
                                    marginLeft: 2
                                }}>{data.star}</AppText>
                            </View>
                            <AppText style={{
                                fontSize: 16,
                                fontWeight: '700',
                                color: colors.mainColor,
                                marginVertical: 3,
                            }}>{data.place_name}</AppText>
                            <AppText style={{
                                fontSize: 12,
                                color: colors.gray[4]
                            }}>{data.place_addr ? data.place_addr.split(' ')[0] + ' ' + data.place_addr.split(' ')[1] : ''}</AppText>
                        </View>
                    </View>
                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <View style={{justifyContent: 'center'}}>
                            <TouchableOpacity onPress={() => {
                                if (data.like_flag) {
                                    DeleteLikedPlace(data.place_pk);
                                } else {
                                    LikePlace(data.place_pk);
                                }
                            }}>
                                <Jewel width={26} height={21}
                                    style={data.like_flag ? {color: colors.red[3]} : {color: colors.red_gray[3]}}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <ScreenContainer backgroundColor={colors.backgroundColor}>
            <View flexDirection="row" style={{
                height: 24,
                marginBottom: 20,
                marginTop: Platform.OS === 'android' ? 20 : 10,
                marginHorizontal: 20,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <View style={{position: 'absolute', left: 0}}>
                    <AppText style={{
                        color: colors.mainColor,
                        fontSize: 28,
                        fontWeight: '700',
                        lineHeight: 41.44
                    }}>Here.</AppText>
                </View>
                <View style={{position: 'absolute', right: 0}}>
                    <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                        <Icon
                            type="ionicon"
                            name={'md-search'}
                            color={colors.mainColor}
                            size={28}>
                        </Icon>
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView>
                <ScreenContainerView>
                    <View>
                        <View style={{marginTop: 31}}>
                            <AppText style={{
                                color: colors.mainColor,
                                fontSize: 24,
                                lineHeight: 36,
                                fontWeight: '700'
                            }}>가장 인기있는</AppText>
                            <View style={{flexDirection: 'row'}}>
                                <AppText style={{
                                    color: colors.mainColor,
                                    fontSize: 24,
                                    lineHeight: 36,
                                    fontWeight: '700'
                                }}>보관함</AppText>
                                <TouchableOpacity style={Platform.OS === 'ios' ? {marginTop: 5} : {marginTop: 4}}><Icon
                                    type="ionicon"
                                    name={'chevron-forward-outline'}
                                    color={colors.mainColor}
                                    size={26}></Icon></TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View>
                        <View style={{flexDirection: 'row', marginTop: 28}}>
                            <View style={{paddingEnd: 42}}><TouchableOpacity
                                onPress={() => {
                                    setDays('DAY');
                                    getPopularCollectionData('DAY');
                                }}
                                style={days === 'DAY' ?
                                    {...styles.selectedRankings, borderBottomColor: colors.red[3]} :
                                    {...styles.notSelectedRankings}
                                }><AppText
                                    style={
                                        days === 'DAY' ?
                                            {
                                                ...styles.selectedRankingsText,
                                                color: colors.mainColor
                                            } :
                                            {
                                                ...styles.selectedRankingsText,
                                                color: colors.gray[6]
                                            }
                                    }>일간</AppText></TouchableOpacity></View>
                            <View style={{paddingEnd: 42}}><TouchableOpacity
                                onPress={() => {
                                    setDays('WEEK');
                                    getPopularCollectionData('WEEK');
                                }}
                                style={days === 'WEEK' ?
                                    {...styles.selectedRankings, borderBottomColor: colors.red[3]} :
                                    {...styles.notSelectedRankings}
                                }><AppText
                                    style={
                                        days === 'WEEK' ?
                                            {
                                                ...styles.selectedRankingsText,
                                                color: colors.mainColor
                                            } :
                                            {
                                                ...styles.selectedRankingsText,
                                                color: colors.gray[6]
                                            }
                                    }>주간</AppText></TouchableOpacity></View>
                            <View style={{paddingEnd: 42}}><TouchableOpacity
                                onPress={() => {
                                    setDays('MONTH');
                                    getPopularCollectionData('MONTH');
                                }}
                                style={days === 'MONTH' ?
                                    {...styles.selectedRankings, borderBottomColor: colors.red[3]} :
                                    {...styles.notSelectedRankings}
                                }><AppText
                                    style={
                                        days === 'MONTH' ?
                                            {
                                                ...styles.selectedRankingsText,
                                                color: colors.mainColor
                                            } :
                                            {
                                                ...styles.selectedRankingsText,
                                                color: colors.gray[6]
                                            }
                                    }>월간</AppText></TouchableOpacity></View>
                        </View>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            {
                                popularCollection.map((data, idx) => {
                                    return (
                                        <ShowPopularCollection item={data} key={idx} idx={idx}
                                            keyword={data.keywords}/>);
                                })
                            }
                        </ScrollView>
                    </View>
                    <View style={{marginTop: 48}}>
                        <AppText style={{...styles.titles, color: colors.mainColor}}>요즘 뜨는 수집가</AppText>
                        <View style={{flexDirection: 'row'}}>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                {
                                    popularUser.map((data, idx) => {
                                        return (
                                            <ShowPopularUser data={data} key={idx} idx={idx} keyword={data.keywords}/>);
                                    })
                                }
                            </ScrollView>
                        </View>
                    </View>

                    {/* <View style={{marginTop: 38}}>
                        <AppText style={{...styles.titles, color: colors.mainColor}}>지역추천</AppText>
                        <View style={{flexDirection: 'row', marginTop: 18}}>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                <ImageBackground source={{uri: 'https://via.placeholder.com/150/56a8c2'}}
                                    style={styles.regionImage} imageStyle={{borderRadius: 15}}>
                                    <View style={styles.regionText}>
                                        <AppText
                                            style={{fontSize: 16, fontWeight: '700', color: colors.backgroundColor}}>충청북도
                                            단양</AppText>
                                        <AppText numberOfLines={2} ellipsizeMode='tail'
                                            style={{fontSize: 12, marginTop: 7, color: colors.backgroundColor}}>추천하는
                                            이유는 다음과 같습니다</AppText>
                                    </View>
                                </ImageBackground>
                                <ImageBackground source={{uri: 'https://via.placeholder.com/150/1ee8a4'}}
                                    style={styles.regionImage} imageStyle={{borderRadius: 15}}>
                                    <View style={styles.regionText}>
                                        <AppText
                                            style={{fontSize: 16, fontWeight: '700', color: colors.backgroundColor}}>전라남도
                                            여수</AppText>
                                        <AppText numberOfLines={2} ellipsizeMode='tail'
                                            style={{fontSize: 12, marginTop: 7, color: colors.backgroundColor}}>추천하는
                                            이유는 다음과 같습니다. 추천하는 이유는 다음과 같습니다</AppText>
                                    </View>
                                </ImageBackground>
                            </ScrollView>
                        </View>
                    </View> */}

                    <View style={{marginTop: 45, marginBottom: 30}}>
                        <AppText style={{...styles.titles, color: colors.mainColor}}>요즘 뜨는 공간</AppText>
                        {
                            popularPlace.map((data, idx) => {
                                return (
                                    <ShowPopularPlace data={data} key={idx} idx={idx}/>);
                            })
                        }
                    </View>
                </ScreenContainerView>
            </ScrollView>
        </ScreenContainer>
    );
}


const styles = StyleSheet.create({
    selectedRankings: {
        borderBottomWidth: 1.5,
        paddingBottom: 2

    },
    notSelectedRankings: {},
    selectedRankingsText: {
        fontSize: 16,
        fontWeight: '700'
    },
    rankingContainer: {
        backgroundColor: 'white',
        width: 197,
        height: 282,
        marginTop: 10,
        borderRadius: 10,
        shadowOffset: {
            width: 8,
            height: 8
        },
        shadowOpacity: 0.25,
        elevation: 1,
        shadowColor: 'rgba(132, 92, 92, 0.14)',
        marginHorizontal: 6
    },
    defaultImageView:{
        borderTopStartRadius : 10,
        width: '100%',
        height: '100%',
        position: 'absolute'
    },
    defaultImage: {
        backgroundColor: '#c4c4c4',
        width: '100%',
        height: '100%',
    },
    titles: {
        fontSize: 22,
        fontWeight: '700'
    },
    authorImage: {
        width: 88,
        height: 88,
        borderRadius: 50,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 21,
    },
    authorDesc: {
        marginTop: 10
    },
    keywordHashTagView: {
        borderWidth: 1,
        borderRadius: 27,
        paddingHorizontal: 7,
        marginHorizontal: 2.5,
    },
    keywordHashTag: {
        elevation: 1,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 12
    },
    regionImage: {
        width: 237,
        height: 163,
        marginEnd: 20,
        borderRadius: 10,
        paddingHorizontal: 10
    },
    regionText: {
        position: 'absolute',
        bottom: 10,
        marginLeft: 16,
    },
    directoryContainer: {
        width: 180,
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
        elevation: 1,
        marginRight: 12,
        marginTop: 20
    },
    dirType: {
        borderWidth: 1,
        paddingVertical: 1,
        paddingHorizontal: 8,
        borderRadius: 14,
        elevation: 1,
        width: 43,
        height: 22,
        marginLeft: 9,
        marginTop: 8,
        flexDirection: 'row',
        zIndex: 10000,
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
    }
});

