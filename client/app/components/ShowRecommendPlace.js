import React, {useState, useEffect} from 'react';
import {View, Image, FlatList, TouchableOpacity} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useToken} from '../contexts/TokenContextProvider';

import AppText from '../components/AppText';

const ShowRecommendPlace = props => {
    const {colors} = useTheme();
    const {navigation} = props;
    const [popularPlace, setPopularPlace] = useState({});
    const [thumbnail, setThumbnail] = useState([]);
    const [token, setToken] = useToken();

    useEffect(() => {
        getPopularPlaceData();
    }, []);

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

    const ShowRecommends = props => {
        const {item, index} = props;
        return (
            <TouchableOpacity onPress={() => {
                countPlaceView(item.place_pk);
                const data = {
                    'place_pk': item.place_pk,
                };
                navigation.navigate('Place', {data: data});
            }}>
                <View style={{marginEnd: 8, width: 141}}>
                    <View>
                        {
                            thumbnail[index] !== '' ?
                                <Image style={{width: 141, height: 101, borderRadius: 10}}
                                       source={{uri: thumbnail[index]}}/> :
                                <Image style={{width: 141, height: 101, borderRadius: 10}}
                                       source={require('../assets/images/here_default.png')}/>
                        }
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 8}}>
                        <AppText style={{color: colors.gray[3], fontSize: 10}}>{checkType(item.place_type)}</AppText>
                        {parseInt(item.review_score) !== -1 && <>
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
                                <Image source={require('../assets/images/review_star.png')}
                                       style={{
                                           width: 10,
                                           height: 10,
                                           alignSelf: 'center',
                                       }}></Image>
                                <AppText style={{
                                    color: colors.gray[3],
                                    fontSize: 10,
                                    marginLeft: 2
                                }}>{parseFloat(item.review_score).toFixed(2)}</AppText>
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
                        <AppText
                            style={{color: colors.gray[4], fontSize: 12, lineHeight: 19.2}}>{item.place_addr}</AppText>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <FlatList data={popularPlace}
                  renderItem={({item, index}) => <ShowRecommends item={item} index={index} key={index}/>}
                  keyExtractor={(item, idx) => {
                      idx.toString();
                  }}
                  key={(item, idx) => {
                      idx.toString();
                  }}
                  nestedScrollEnabled horizontal showsHorizontalScrollIndicator={false}/>
    );
};

export default ShowRecommendPlace;