import React, {useState, useEffect} from 'react';
import {
    Image,
    Text,
    View,
    ScrollView,
    FlatList,
    SafeAreaView,
    Dimensions,
    TouchableOpacity,
    StyleSheet, Alert,
    TouchableWithoutFeedback
} from 'react-native';
import {useIsFocused, useTheme} from '@react-navigation/native';
import AppText from '../../components/AppText';
import {Icon} from 'react-native-elements';
import {useSearchKeyword} from '../../contexts/SearchkeywordContextProvider';
import ShowEmpty from '../../components/ShowEmpty';
import {useToken} from '../../contexts/TokenContextProvider';
import * as SecureStore from 'expo-secure-store';
import {useIsSignedIn} from '../../contexts/SignedInContextProvider';

import DefaultThumbnail from '../../assets/images/profile_default.svg';
import {useAlertDuplicated} from '../../contexts/LoginContextProvider';

const SearchCollection = (props, {navigation}) => {
    const {colors} = useTheme();
    const { countCollection } = props;
    const [collectionList, setCollectionList] = useState([]);
    const [like, setLike] = useState(false);
    const [searchKeyword, setSearchKeyword] = useSearchKeyword();
    const {user} = props;
    const [token, setToken] = useToken();
    const [isSignedIn, setIsSignedIn] = useIsSignedIn();
    const isFocused = useIsFocused();
    const [alertDuplicated, setAlertDuplicated] = useAlertDuplicated(false);

    useEffect(() => {
        getResults('LIKE');
        setShowMenu(false);
        setCurrentMenu('인기순');
    }, [searchKeyword, isFocused]);

    const getResults = (NOW) => {
        try {
            fetch(`http://34.64.185.40/collection/list?keyword=${decodeURIComponent(searchKeyword)}&sort=${NOW}`, {
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

                    countCollection(response.data.length);
                    checkPrivate(response.data);
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

    const checkPrivate = (item) => {
        var newArr = [];
        for (var i = 0; i < item.length; i++) {
            if (item[i].created_user_name !== user && item[i].collection_private === 1) continue;
            else newArr.push(item[i]);
        }
        setCollectionList(newArr);
    };

    const [showMenu, setShowMenu] = useState(false);
    const [currentMenu, setCurrentMenu] = useState('인기순');

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
                        elevation: 5,
                        overflow: 'visible'
                    }}>
                        <TouchableOpacity
                            onPress={() => {
                                setShowMenu(false);
                                setCurrentMenu('인기순');
                                getResults('LIKE');
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
                                setCurrentMenu('최신순');
                                getResults('RESENT');
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
                                <AppText style={{
                                    color: colors.mainColor,
                                    fontSize: 14,
                                    lineHeight: 16.8,
                                    fontWeight: '400'
                                }}>최신순</AppText>
                                {currentMenu === '최신순' &&
                                <Icon type="ionicon" name={'checkmark-sharp'} size={14} color={colors.mainColor}
                                    style={{marginLeft: 10}}></Icon>}
                            </View>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        );
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
        if(thumbnail === defaultThumbnailList[0].name) return defaultThumbnailList[0].color;
        else if(thumbnail === defaultThumbnailList[1].name) return defaultThumbnailList[1].color;
        else if(thumbnail === defaultThumbnailList[2].name) return defaultThumbnailList[2].color;
        else if(thumbnail === defaultThumbnailList[3].name) return defaultThumbnailList[3].color;
        else if(thumbnail === defaultThumbnailList[4].name) return defaultThumbnailList[4].color;
        else return defaultThumbnailList[5].color;
    };

    const ShowThumbnail = props => {
        const { thumbnail } = props;
        if(thumbnail.startsWith('default')) {
            return (
                <View style={{...styles.defaultImage, justifyContent: 'center', alignItems: 'center', backgroundColor: setBGColor(thumbnail)}}>
                    <DefaultThumbnail width={97} height={70.38}/>
                </View>
            );
        } else {
            return (
                <Image source={{ uri: thumbnail }} style={{...styles.defaultImage}} />
            );
        }
    };

    const CollectionContainer = ({item, index}) => {
        return (
            <TouchableOpacity style={[{
                ...styles.directoryContainer,
                shadowColor: colors.red_gray[6],
                zIndex: 9999
            }, collectionList.length % 2 !== 0 ? {width: 163} : {width: '48%'}]} onPress={() => {
                countCollectionView(item.collection_pk);
                const data = {
                    'collection_pk': item.collection_pk,
                    'now': false,
                };
                item.collection_type === 1 ?
                    props.navigation.navigate('PlanCollection', {data: data}) : props.navigation.navigate('FreeCollection', {data: data});
            }}>
                <View flex={1} style={{overflow: 'hidden', borderRadius: 10, justifyContent: 'space-between'}}>
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
                                    source={require('../../assets/images/lock_outline.png')}></Image>
                            </View>
                            }
                        </View>
                        { item.collection_thumbnail ?
                            <ShowThumbnail thumbnail={item.collection_thumbnail} /> :
                            <Image style={styles.defaultImage} source={require('../../assets/images/here_default.png')}/>
                        }
                    </View>
                    <View flex={1} style={{marginLeft: 10, marginTop: 8}}>
                        <AppText style={{
                            fontSize: 14,
                            fontWeight: '400',
                            color: colors.mainColor
                        }}>{item.collection_name}</AppText>
                        <View style={{marginTop: 4, flexDirection: 'row'}}>
                            {item.keywords.map((keyword, idx) => {
                                return (
                                    <AppText key={idx} style={{
                                        color: colors.gray[4],
                                        fontSize: 10,
                                        marginRight: 6.21
                                    }}># {keyword}</AppText>);
                            })}
                        </View>
                        <View flexDirection="row"
                            style={{position: 'absolute', bottom: 10, justifyContent: 'space-between'}}>
                            <View style={{flexDirection: 'row'}}>
                                <AppText style={{
                                    fontSize: 8,
                                    width: '68%',
                                    color: colors.gray[4]
                                }}>by {item.created_user_name}</AppText>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{marginRight: 8, flexDirection: 'row'}}>
                                    <Image source={require('../../assets/images/here_icon.png')}
                                        style={{width: 8, height: 8, margin: 2}}></Image>
                                    <AppText style={{
                                        fontSize: 8,
                                        color: colors.gray[4],
                                        fontWeight: 'bold'
                                    }}>{item.like_cnt}</AppText>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    <Icon type="ionicon" name={'location'} size={8} color={colors.gray[2]}
                                        style={{margin: 1}}></Icon>
                                    <AppText style={{
                                        fontSize: 8,
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

    return (
        <View flexDirection="row" style={[{
            marginBottom: 8,
            alignItems: 'center',
        }, collectionList.length === 0 && {justifyContent: 'center'}]}>
            {
                collectionList.length === 0 ?
                    <ShowEmpty/> :
                    <View style={{backgroundColor: colors.backgroundColor, flex: 1, position: 'relative'}}>
                        <SelectBox />
                        <View flexDirection="row" style={{justifyContent: 'space-between', marginTop: 2, marginBottom: 8, position: 'relative', zIndex: 50}} flex={1}>
                            <TouchableWithoutFeedback onPress={()=>setShowMenu(false)}>
                                <View flexDirection="row" flex={1}>
                                    <TouchableOpacity onPress={()=>{
                                        setShowMenu(!showMenu);
                                    }} style={{flexDirection: 'row'}}>
                                        <AppText style={{color: colors.mainColor}}>{currentMenu}</AppText>
                                        <Icon style={{color: colors.mainColor, paddingTop: 1, paddingLeft: 8}} type="ionicon"
                                            name={'chevron-down-outline'} size={16}></Icon>
                                    </TouchableOpacity>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        <SafeAreaView flex={1}>
                            <FlatList contentContainerStyle={{justifyContent: 'space-between', alignItems: 'flex-start'}} numColumns={2}
                                data={collectionList} renderItem={CollectionContainer}
                                key={(item) => item.collection_pk.toString()}
                                keyExtractor={(item) => item.collection_pk.toString()} nestedScrollEnabled/>
                        </SafeAreaView>
                    </View>
            }
        </View>
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
        elevation: 5,
        marginHorizontal: 4,
        marginTop: 5
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
    },
    defaultImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    selectType: {
        borderWidth: 1,
        paddingVertical: 1,
        paddingHorizontal: 8.5,
        borderRadius: 12,
        marginRight: 10,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        elevation: 1,
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
        elevation: 1,
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

export default SearchCollection;