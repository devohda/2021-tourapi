import React, {useState, useEffect} from 'react';
import {
    View,
    Image,
    ScrollView,
    Dimensions,
    Pressable,
    StyleSheet,
    Platform,
    FlatList,
    TouchableOpacity
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useToken} from '../contexts/TokenContextProvider';
import {Icon} from 'react-native-elements';

import AppText from '../components/AppText';
import DefaultThumbnail from '../assets/images/profile_default.svg';

const ShowRecommendCollection = props => {
    const {colors} = useTheme();
    const {navigation} = props;
    const [popularCollection, setPopularCollection] = useState({});
    const [token, setToken] = useToken();

    useEffect(() => {
        getPopularCollectionData();
    }, []);

    const getPopularCollectionData = () => {
        try {
            fetch('http://34.64.185.40/collection/list?type=MAIN&sort=POPULAR', {
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
                    setPopularCollection(response.data);
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
                <View flexDirection="row" style={{
                    flexWrap: 'wrap',
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    justifyContent: 'center',
                    alignContent: 'center'
                }}>
                    <View style={{
                        width: '100%',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: setBGColor(thumbnail)
                    }}>
                        <DefaultThumbnail width={107} height={80.38}/>
                    </View>
                </View>
            );
        } else {
            return (
                <View flexDirection="row" style={{
                    flexWrap: 'wrap',
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    justifyContent: 'center',
                    alignContent: 'center'
                }}>
                    <Image source={{uri: thumbnail}} style={{width: '100%', height: '100%'}}/>
                </View>
            );
        }
    };

    const ShowRecommends = props => {
        const {item, index} = props;

        return (
            <TouchableOpacity onPress={() => {
                const data = {
                    'collection_pk': item.collection_pk,
                    'now': false,
                };
                item.collection_type === 1 ?
                    navigation.navigate('PlanCollection', {data: data}) : navigation.navigate('FreeCollection', {data: data});
            }} activeOpacity={0.8}>
                <View style={{
                    width: 162,
                    height: 249,
                    shadowColor: colors.red_gray[7],
                    shadowOffset: {width: 0, height: 1},
                    shadowOpacity: 0.27,
                    shadowRadius: 6,
                    marginRight: 8,
                    borderRadius: 10,
                    overflow: 'hidden'
                }}>
                    <View style={{height: '68%'}}>
                        <View style={{zIndex: 10000, flexDirection: 'row', justifyContent: 'flex-start'}}>
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
                        </View>
                        {item.collection_thumbnail ?
                            <ShowThumbnail thumbnail={item.collection_thumbnail}/> :
                            <Image style={styles.defaultImage} source={require('../assets/images/here_default.png')}/>
                        }
                    </View>
                    <View flex={1} style={{backgroundColor: colors.defaultColor, padding: 8}}>
                        <AppText style={{color: colors.mainColor, fontSize: 14, fontWeight: '700'}}>
                            {item.collection_name}
                        </AppText>
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
                        <View flexDirection="row" style={{
                            position: 'absolute',
                            bottom: 8,
                            justifyContent: 'space-between',
                            paddingHorizontal: 8
                        }}>
                            <View style={{flexDirection: 'row'}}>
                                <AppText style={{
                                    fontSize: 8,
                                    width: '75%',
                                    color: colors.gray[2]
                                }}>by {item.created_user_name}</AppText>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                <View style={{marginRight: 8, flexDirection: 'row'}}>
                                    <Image source={require('../assets/images/here_icon.png')}
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

    return (
        <FlatList data={popularCollection}
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

const styles = StyleSheet.create({
    directoryContainer: {
        width: '48%',
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
    likesContainer: {
        width: Dimensions.get('screen').width / 2.25,
        marginTop: 16,
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
        height: '100%',
        position: 'absolute',
        justifyContent: 'center',
        alignContent: 'center'
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
        alignItems: 'center'
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

export default ShowRecommendCollection;