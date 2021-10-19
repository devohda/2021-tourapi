import React, {useState, useEffect} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Image,
    ScrollView,
    ImageBackground, Platform, Alert,
} from 'react-native';
import {useTheme, useIsFocused} from '@react-navigation/native';
import {Icon} from 'react-native-elements';

import AppText from '../components/AppText';
import ScreenContainer from '../components/ScreenContainer';
import ScreenContainerView from '../components/ScreenContainerView';
import {useToken} from '../contexts/TokenContextProvider';
import {useIsSignedIn} from '../contexts/SignedInContextProvider';

import Jewel from '../assets/images/jewel.svg';
import DefaultThumbnail from '../assets/images/profile_default.svg';
import * as SecureStore from 'expo-secure-store';

export default function MainPageScreen({navigation}) {
    const {colors} = useTheme();
    const [popularCollection, setPopularCollection] = useState([]);
    const [popularPlace, setPopularPlace] = useState([]);
    const [popularUser, setPopularUser] = useState([]);
    const [recommendRegion, setRecommendRegion] = useState([]);
    const [thumbnail, setThumbnail] = useState([]);
    const [token, setToken] = useToken();
    const [days, setDays] = useState('DAY');
    const isFocused = useIsFocused();
    const [isSignedIn, setIsSignedIn] = useIsSignedIn();
    const [alertDuplicated, setAlertDuplicated] = useState(false);
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

    useEffect(() => {
        getPopularCollectionData('DAY');
        getPopularPlaceData();
        getRecommendRegionData();
        getPopularUserData();
        () => {
            setPopularCollection([]);
            setPopularPlace([]);
            setPopularUser([]);
        };
    }, [isFocused]);

    const getPopularCollectionData = (day) => {
        try {
            fetch(`http://34.64.185.40/collection/list?type=MAIN&sort=LIKE&term=${day}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
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
            fetch('http://34.64.185.40/place/list?type=MAIN&sort=LIKE', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
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

                    setPopularPlace(response.data);
                    var newArr = [];
                    const res = response.data;
                    for(var i=0;i<res.length;i++) {
                        if(res[i].place_img) {
                            newArr.push(res[i].place_img);
                        } else if(res[i].place_thumbnail) {
                            newArr.push(res[i].place_thumbnail);
                        } else if(res[i].review_img) {
                            newArr.push(res[i].review_img);
                        } else{
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

                    setPopularUser(response.data);
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const getRecommendRegionData = () => {
        try {
            fetch('http://34.64.185.40/visitant/place', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
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
                    setRecommendRegion(response.data);
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

                    getPopularPlaceData();
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const setBGColor = (thumbnail) => {
        if(thumbnail === defaultThumbnailList[0].name) return defaultThumbnailList[0].color;
        else if(thumbnail === defaultThumbnailList[1].name) return defaultThumbnailList[1].color;
        else if(thumbnail === defaultThumbnailList[2].name) return defaultThumbnailList[2].color
        else if(thumbnail === defaultThumbnailList[3].name) return defaultThumbnailList[3].color;
        else if(thumbnail === defaultThumbnailList[4].name) return defaultThumbnailList[4].color;
        else return defaultThumbnailList[5].color;
    };

    const ShowThumbnail = props => {
        const {thumbnail} = props;
        if (thumbnail.startsWith('default')) {
            return (
                <View style={{...styles.defaultImage, justifyContent: 'center', alignItems: 'center', backgroundColor: setBGColor(thumbnail)}}>
                    <DefaultThumbnail width={117} height={90.38}/>
                </View>
            );
        } else {
            return (
                <Image source={{uri: thumbnail}} style={{...styles.defaultImage}}/>
            );
        }
    };

    const ShowPopularCollection = props => {
        const {item, idx} = props;

        return (
            <TouchableOpacity style={[{
                ...styles.directoryContainer,
                shadowColor: colors.red_gray[6]
            }]} onPress={() => {
                countCollectionView(item.collection_pk);
                const data = {
                    'collection_pk': item.collection_pk,
                    'now': false,
                };
                item.collection_type === 1 ?
                    navigation.navigate('PlanCollection', {data: data}) : navigation.navigate('FreeCollection', {data: data});
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
                            {item.collection_thumbnail ?
                                <ShowThumbnail thumbnail={item.collection_thumbnail}/> :
                                <Image style={styles.defaultImage}
                                    source={require('../assets/images/here_default.png')}/>
                            }
                        </View>
                    </View>
                    <View flex={1} style={{marginLeft: 10, marginTop: 8}}>
                        <AppText style={{
                            fontSize: 14,
                            fontWeight: '400',
                            color: colors.mainColor
                        }}>{item.collection_name}</AppText>
                        <View flexDirection="row"
                            style={{marginTop: '24%', bottom: 10, justifyContent: 'space-between'}}>
                            <View style={{flexDirection: 'row'}}>
                                <AppText style={{
                                    fontSize: 10,
                                    color: colors.gray[4]
                                }}>{item.created_user_name}</AppText>
                            </View>
                            <View style={{flexDirection: 'row', marginRight: 10}}>
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
            </TouchableOpacity>
        );
    };

    const ShowPopularUser = props => {
        const {user_nickname, user_img} = props.data;
        const {keyword, idx} = props;
        return (
            <View style={{alignItems: 'center'}}>
                {
                    user_img === '' || user_img === 'default-user' || user_img.startsWith('../') || user_img === 'default-img' ?
                    <View style={{...styles.authorImage}}>
                        <Image
                        style={{
                            width: 88,
                            height: 88,
                            borderRadius: 50,
                            backgroundColor: colors.defaultColor,
                        }}
                        source={require('../assets/images/default-profile.png')}
                        /></View> :
                    <View style={{...styles.authorImage}}>
                        <Image source={{ uri: user_img }} style={{
                                width: 88,
                                height: 88,
                                borderRadius: 50,
                                backgroundColor: colors.defaultColor,
                            }}/></View>
                }
                <AppText style={{
                    fontSize: 14,
                    fontWeight: '700',
                    color: colors.mainColor,
                    marginTop: 8
                }}>{user_nickname}</AppText>
                <View style={{justifyContent: 'center'}}>
                {
                    keyword.length !== 0 &&
                    <View style={{flexDirection: 'row', marginTop: 4, width: '95%', flexWrap: 'wrap', alignItems: 'flex-start'}}>{
                        keyword.map((data, idx) => (
                            <UserKeyword data={data} key={idx + 'user'}/>
                        ))
                    }</View>
                }
                </View>
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
    
    const rec = [
        require('../assets/images/main/recommend-default-1.jpg'),
        require('../assets/images/main/recommend-default-2.jpg'),
        require('../assets/images/main/recommend-default-3.jpg'),
        require('../assets/images/main/recommend-default-4.jpg'),
        require('../assets/images/main/recommend-default-5.jpg'),
    ]

    const ShowRecommendRegion = props => {
        const {data, idx} = props;

        return (
            <ImageBackground source={rec[idx]}
                style={styles.regionImage} imageStyle={{borderRadius: 15}}>
                <View style={{backgroundColor: 'rgba(0, 0, 0, 0.1)', width: 237, height: 163, position: 'absolute', borderRadius: 15}}></View>
                <View style={styles.regionText}>
                    <AppText
                        style={{fontSize: 16, fontWeight: '700', color: colors.backgroundColor}}>{data.sigungu_name}</AppText>
                    <AppText numberOfLines={2} ellipsizeMode='tail'
                        style={{fontSize: 12, marginTop: 7, color: colors.backgroundColor}}>한 달간 총 {data.visitant_cnt} 명 방문</AppText>
                </View>
            </ImageBackground>
        )
    }

    const ShowPopularPlace = props => {
        const {data, idx} = props;
        const item = {
            'place_pk': data.place_pk,
        };

        return (
            <TouchableOpacity onPress={() => {
                countPlaceView(data.place_pk);
                navigation.navigate('Place', {data: item});
            }}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 14}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        {
                            thumbnail[idx] !== '' ?
                                <Image style={{borderRadius: 15, width: 72, height: 72, marginTop: 2}} source={{uri: thumbnail[idx]}}/> :
                                <Image style={{borderRadius: 15, width: 72, height: 72, marginTop: 2}} source={require('../assets/images/here_default.png')}/> 
                        }
                        <View style={{marginLeft: 8, width: '70%'}}>
                            <View style={{flexDirection: 'row'}}>
                                <AppText style={{
                                    color: colors.gray[3],
                                    textAlign: 'center',
                                    fontSize: 10,
                                    fontWeight: '700'
                                }}>{checkType(data.place_type)}</AppText>
                                { parseInt(data.review_score) !== -1 &&
                                    <View style={{flexDirection: 'row'}}>
                                        <AppText style={{
                                            marginHorizontal: 4,
                                            color: colors.gray[4],
                                            textAlign: 'center',
                                            fontSize: 10,
                                            fontWeight: '700',
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
                                            marginLeft: 2,
                                        }}>{parseFloat(data.review_score).toFixed(2)}</AppText>
                                    </View>
                                }
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
            <View flexDirection="row" style={[{
                height: 24,
                marginBottom: 20,
                marginHorizontal: 20,
                alignItems: 'center',
                justifyContent: 'center'
            }, Platform.OS === 'android' ? {marginTop: 20} : {marginTop: 10}]}>
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
                                lineHeight: 33.6,
                                fontWeight: '700'
                            }}>가장 인기있는</AppText>
                            <View style={{flexDirection: 'row'}}>
                                <AppText style={{
                                    color: colors.mainColor,
                                    fontSize: 24,
                                    lineHeight: 33.6,
                                    fontWeight: '700'
                                }}>보관함</AppText>
                            </View>
                        </View>
                    </View>
                    <View>
                        <View style={{flexDirection: 'row', marginTop: 12}}>
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

                    <View style={{marginTop: 38}}>
                        <AppText style={{...styles.titles, color: colors.mainColor}}>지역 추천</AppText>
                        <View style={{flexDirection: 'row', marginTop: 18}}>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                {
                                    recommendRegion.map((data, idx) => {
                                        return (
                                            <ShowRecommendRegion data={data} key={idx} idx={idx} />);
                                    })
                                }
                            </ScrollView>
                        </View>
                    </View>

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
        shadowColor: 'rgba(132, 92, 92, 0.14)',
        marginHorizontal: 6
    },
    defaultImageView: {
        borderTopStartRadius: 10,
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
        marginHorizontal: 2.5,
    },
    keywordHashTag: {
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 12
    },
    regionImage: {
        width: 237,
        height: 163,
        marginEnd: 20,
        borderRadius: 10,
        paddingHorizontal: 10,
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
        marginRight: 12,
        marginTop: 20
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

