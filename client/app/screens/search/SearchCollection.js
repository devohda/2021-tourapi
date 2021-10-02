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
    StyleSheet, Alert
} from 'react-native';
import {useIsFocused, useTheme} from '@react-navigation/native';
import AppText from '../../components/AppText';
import {Icon} from 'react-native-elements';
import {useSearchKeyword} from '../../contexts/search/SearchkeywordContextProvider';
import ShowEmpty from '../../components/ShowEmpty';
import {useToken} from '../../contexts/TokenContextProvider';
import {searchCollectionResult} from '../../contexts/search/SearchCollectionContextProvider';
import * as SecureStore from 'expo-secure-store';
import {useIsSignedIn} from '../../contexts/SignedInContextProvider';

const SearchCollection = (props, {navigation}) => {
    const {colors} = useTheme();
    const [collectionList, setCollectionList] = useState([]);
    const [like, setLike] = useState(false);
    const [searchKeyword, setSearchKeyword] = useSearchKeyword();
    const {user} = props;
    const [searchLength, setSearchLength] = searchCollectionResult();
    const [token, setToken] = useToken();
    const [isSignedIn, setIsSignedIn] = useIsSignedIn();
    const isFocused = useIsFocused();

    useEffect(() => {
        getResults();
    }, [searchKeyword, isFocused]);

    const getResults = () => {
        try {
            fetch(`http://34.64.185.40/search?keyword=${decodeURIComponent(searchKeyword)}&type=collection`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
            }).then((res) => res.json())
                .then(async (response) => {
                    if (response.code === 401 || response.code === 403 || response.code === 419){
                        // Alert.alert('','로그인이 필요합니다');
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }

                    setSearchLength(response.data.length);
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
                .then((response) => {
                    // if(response.code === 401 || response.code === 403 || response.code === 419){
                    //     // Alert.alert('','로그인이 필요합니다');
                    //     await SecureStore.deleteItemAsync('accessToken');
                    //     setToken(null);
                    //     setIsSignedIn(false);
                    //     return;
                    // }
                    console.log(response)
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

    const CollectionContainer = ({item}) => {
        const collectionMargin = (Dimensions.get('screen').width - 162 * 2) / 9;

        return (
            <TouchableOpacity style={[{
                ...styles.directoryContainer,
                shadowColor: colors.red_gray[6]
            }, collectionList.length === 1 ? {width: 172} : {width: '48%'}]} onPress={() => {
                countCollectionView(item.collection_pk);
                item.collection_type === 1 ?
                    props.navigation.navigate('PlanCollection', {data: item}) : props.navigation.navigate('FreeCollection', {data: item});
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
                                    source={require('../../assets/images/lock_outline.png')}></Image>
                            </View>
                            }
                        </View>
                        <Image style={styles.defaultImage}
                            source={item.collection_thumbnail ? {uri: item.collection_thumbnail} : require('../../assets/images/here_default.png')}/>
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
                                <AppText style={{fontSize: 8, width: '68%'}}>by {item.created_user_name}</AppText>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{marginRight: 8, flexDirection: 'row'}}>
                                    <Image source={require('../../assets/images/here_icon.png')}
                                        style={{width: 8, height: 8, margin: 2}}></Image>
                                    <AppText style={{
                                        fontSize: 8,
                                        color: colors.hashTagColor,
                                        fontWeight: 'bold'
                                    }}>{item.like_cnt}</AppText>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    <Icon type="ionicon" name={'location'} size={8} color={colors.gray[2]}
                                        style={{margin: 1}}></Icon>
                                    <AppText style={{
                                        fontSize: 8,
                                        color: colors.hashTagColor,
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
        <View flexDirection="row" style={{
            marginBottom: 8,
            alignItems: 'center',
            marginTop: 22,
            width: '100%'
        }, collectionList.length === 0 && {justifyContent: 'center'}
        }>
            {
                collectionList.length === 0 ?
                    <ShowEmpty/> :
                    <SafeAreaView>
                        <FlatList contentContainerStyle={{justifyContent: 'space-between'}} numColumns={2}
                            data={collectionList} renderItem={CollectionContainer}
                            key={(item) => item.collection_pk.toString()}
                            keyExtractor={(item) => item.collection_pk.toString()} nestedScrollEnabled/>
                    </SafeAreaView>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    directoryContainer: {
        // width: '48%',
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
        marginHorizontal: 4
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
});

export default SearchCollection;