import React, {useEffect, useState} from 'react';
import {useTheme} from '@react-navigation/native';
import {
    Alert,
    Dimensions,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    SafeAreaView
} from 'react-native';
import {Icon} from 'react-native-elements';
import { Button, IndexPath, Layout, Select, SelectItem} from '@ui-kitten/components';

import ScreenContainerView from '../../components/ScreenContainerView';
import AppText from '../../components/AppText';
import {useToken} from '../../contexts/TokenContextProvider';
import { useIsFocused } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import {useIsSignedIn} from '../../contexts/SignedInContextProvider';

import DefaultThumbnail from '../../assets/images/profile_default.svg';
import {useAlertDuplicated} from '../../contexts/LoginContextProvider';

const CollectionTab = ({navigation}) => {

    const [token, setToken] = useToken();
    const isFocused = useIsFocused();
    const [collectionList, setCollectionList] = useState({});
    const [isSignedIn, setIsSignedIn] = useIsSignedIn();
    const [alertDuplicated, setAlertDuplicated] = useAlertDuplicated(false);
    const [directoryType, setDirectoryType] = useState([
        {
            name: '전체',
            isClicked: true
        },
        {
            name: '내 보관함',
            isClicked: false
        },
        {
            name: '수집한 보관함',
            isClicked: false
        },
        {
            name: '일정보관함',
            isClicked: false
        },
        {
            name: '자유보관함',
            isClicked: false
        }
    ]);

    useEffect(() => {
        getCollectionsFromUsers('RESENT');
        setShowMenu(false);
        setCurrentMenu('최근 추가순');
    },[isFocused]);

    const {colors} = useTheme();

    // 보관함 데이터 가져오는 함수
    const getCollectionsFromUsers = (NOW) => {
        try {
            fetch(`http://34.64.185.40/collection/list?type=MY&sort=${NOW}`, {
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
            <TouchableOpacity style={{...styles.directoryContainer, shadowColor: colors.red_gray[6], zIndex: 9999}} onPress={() => {
                const data = {
                    'collection_pk': item.collection_pk,
                    'now': false,
                };
                item.collection_type === 1 ?
                    navigation.navigate('PlanCollection', {data : data}) : navigation.navigate('FreeCollection', {data : data});
            }} disabled={showMenu ? true : false} activeOpacity={0.8}>
                <View flex={1} style={{overflow: 'hidden', borderRadius: 10}}>
                    <View style={{height: '68%'}}> 
                        <View style={{zIndex: 10000, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View style={[styles.dirType, {
                                borderColor: colors.backgroundColor,
                                backgroundColor: colors.backgroundColor
                            }]}>
                                <AppText
                                    style={item.collection_type === 1 ? {...styles.dirPlanText, color: colors.red[3]} : {...styles.dirFreeText, color: colors.mainColor}}>{item.collection_type === 1 ? '일정' : '자유'}</AppText>
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
                        <View style={{marginTop: 4, flexDirection: 'row', width: '90%', flexWrap: 'wrap', alignItems: 'flex-start'}}>
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
                        <View flexDirection="row" style={{position: 'absolute', bottom: 8, justifyContent: 'space-between'}}>
                            <View style={{flexDirection: 'row'}}>
                                <AppText style={{fontSize: 8, width: '68%', color: colors.gray[2]}}>by {item.created_user_name}</AppText>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{marginRight: 8, flexDirection: 'row'}}>
                                    <Image source={require('../../assets/images/here_icon.png')}
                                        style={{width: 8, height: 8, margin: 2}}></Image>
                                    <AppText style={{fontSize: 8, color: colors.gray[2], fontWeight: 'bold'}}>{item.like_cnt}</AppText>
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
        );};

    const [showMenu, setShowMenu] = useState(false);
    const [currentMenu, setCurrentMenu] = useState('인기순');

    const SelectBox = () => {
        return (
            <View style={{
                position: 'absolute',
                marginTop: 20,
                marginLeft: 20,
                zIndex: 9000
            }} flex={1}>
                {
                    showMenu && <View style={{
                        width: 100,
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
                            onPress={() => {
                                setShowMenu(false);
                                setCurrentMenu('최근 추가순');
                                getCollectionsFromUsers('RESENT');
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
                                <AppText style={{color: colors.mainColor, fontSize: 14, lineHeight: 16.8, fontWeight: '400'}}>최근 추가순</AppText>
                                {currentMenu === '최근 추가순' && <Icon type="ionicon" name={'checkmark-sharp'} size={14} color={colors.mainColor} style={{marginLeft: 10}}></Icon>}
                            </View>
                        </TouchableOpacity>

                        <View style={{
                            height: 1,
                            borderColor: colors.gray[5],
                            borderWidth: 0.4,
                            borderRadius: 1,
                            backgroundColor: colors.backgroundColor,
                        }}></View>
                        
                        <TouchableOpacity
                            onPress={() => {
                                setShowMenu(false);
                                setCurrentMenu('인기순');
                                getCollectionsFromUsers('LIKE');
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
                                <AppText style={{color: colors.mainColor, fontSize: 14, lineHeight: 16.8, fontWeight: '400'}}>인기순</AppText>
                                {currentMenu === '인기순' && <Icon type="ionicon" name={'checkmark-sharp'} size={14} color={colors.mainColor} style={{marginLeft: 10}}></Icon>}
                            </View>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        );};

    return (
        <View style={{backgroundColor: colors.backgroundColor, flex: 1, position: 'relative'}}>
            <SelectBox />
            <ScreenContainerView flex={1}>
                <View flexDirection="row" style={{justifyContent: 'flex-start', marginTop: 6, marginBottom: 8, position: 'relative', zIndex: 50}}>
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
                    <FlatList columnWrapperStyle={{justifyContent: 'space-between'}} numColumns={2}
                        showsVerticalScrollIndicator={false}
                        data={collectionList} renderItem={CollectionContainer}
                        keyExtractor={(item) => item.collection_pk} nestedScrollEnabled
                    />
                </SafeAreaView>
            </ScreenContainerView>
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

export default CollectionTab;