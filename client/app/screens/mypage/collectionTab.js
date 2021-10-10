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
    View
} from 'react-native';
import {Icon} from 'react-native-elements';
import { Button, IndexPath, Layout, Select, SelectItem} from '@ui-kitten/components';

import ScreenContainerView from '../../components/ScreenContainerView';
import AppText from '../../components/AppText';
import {useToken} from '../../contexts/TokenContextProvider';
import { useIsFocused } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import {useIsSignedIn} from '../../contexts/SignedInContextProvider';

const CollectionTab = ({navigation}) => {

    const [token, setToken] = useToken();
    const isFocused = useIsFocused();
    const [collectionList, setCollectionList] = useState({});
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
        getCollectionsFromUsers();
    },[isFocused]);

    const {colors} = useTheme();

    // 보관함 데이터 가져오는 함수
    const getCollectionsFromUsers = () => {
        try {
            fetch(`http://34.64.185.40/collection/list?type=MY`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
            }).then((res) => res.json())
                .then((response) => {
                    // if(response.code === 401 || response.code === 403 || response.code === 419){
                    //     // Alert.alert('','로그인이 필요합니다');
                    //     await SecureStore.deleteItemAsync('accessToken');
                    //     setToken(null);
                    //     setIsSignedIn(false);
                    //     return;
                    // }

                    setCollectionList(response.data);
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
            }).then(res => res.json())
            .then(response => {
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

    const CollectionContainer = ({item}) => {
        return (
            <TouchableOpacity style={{...styles.directoryContainer, shadowColor: colors.red_gray[6], zIndex: 8000}} onPress={() => {
                countCollectionView(item.collection_pk);
                item.collection_type === 1 ?
                    navigation.navigate('PlanCollection', {data : item}) : navigation.navigate('FreeCollection', {data : item});
            }}>
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
                        <Image style={styles.defaultImage} source={item.collection_thumbnail ? {uri: item.collection_thumbnail} : require('../../assets/images/here_default.png')}/>
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

    const Keyword = ({type, idx}) => {
        return (
            <View style={styles.keyword}>
                <TouchableOpacity
                    style={type.isClicked ?
                        {...styles.selectTypeClicked, borderColor: colors.mainColor,
                            backgroundColor: colors.mainColor,
                            shadowColor: colors.red[7]} :
                        {...styles.selectType, borderColor: colors.defaultColor,
                            backgroundColor: colors.defaultColor,
                            shadowColor: colors.red[7]}}
                    onPress={() => {
                        // 클릭하면 색 바꾸기
                        setDirectoryType(dirType => dirType.map(
                            (val, i) =>
                                i === idx ? {name: val.name, isClicked: true} : {
                                    name: val.name,
                                    isClicked: false
                                })
                        );
                    }}
                >
                    <AppText
                        style={type.isClicked ? {...styles.selectTypeTextClicked, color: colors.defaultColor} : {...styles.selectTypeText, color: colors.subColor}}>{type.name}</AppText>
                </TouchableOpacity>
            </View>
        );
    };

    const [showMenu, setShowMenu] = useState(false);
    const [currentMenu, setCurrentMenu] = useState('최근 추가순');

    const SelectBox = () => {
        return (
            <>
                {
                    showMenu && <View style={{
                        position: 'absolute',
                        width: 100,
                        height: 80,
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
                                setCurrentMenu('최근 추가순');
                            }}
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}><AppText>최근 추가순</AppText>
                        </TouchableOpacity>

                        <View style={{
                            height: 1,
                            borderColor: colors.gray[5],
                            borderWidth: 0.4,
                            borderRadius: 1,
                            zIndex: 9900,
                            backgroundColor: colors.backgroundColor,
                        }}></View>
                        <TouchableOpacity
                            onPress={() => {
                                setShowMenu(false);
                                setCurrentMenu('인기순');
                            }}
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}><AppText>인기순</AppText>
                        </TouchableOpacity>

                        <View style={{
                            height: 1,
                            borderColor: colors.gray[5],
                            borderWidth: 0.4,
                            borderRadius: 1,
                            zIndex: 9900
                        }}></View>
                        <TouchableOpacity
                            onPress={() => {
                                setShowMenu(false);
                                setCurrentMenu('리뷰순');
                            }}
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}><AppText>리뷰순</AppText>
                        </TouchableOpacity>
                    </View>
                }
            </>
        );};

    return (
        <View style={{backgroundColor: colors.backgroundColor, flex: 1}}>
            <ScreenContainerView flex={1}>
                {/* 키워드 선택 */}
                {/* <View flexDirection="row" style={{alignItems: 'center', justifyContent: 'center', marginVertical: 4}}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        {directoryType.map(
                            (type, idx) => <Keyword type={type} key={idx} idx={idx}/>
                        )}
                    </ScrollView>
                </View> */}

                <View flexDirection="row" style={{justifyContent: 'space-between', marginTop: 6, marginBottom: 8, position: 'relative', zIndex: 1}}>
                    <TouchableWithoutFeedback onPress={()=>setShowMenu(false)}>
                        <View flexDirection="row" flex={1}>
                            <TouchableOpacity onPress={()=>{
                                // setShowMenu(!showMenu);
                            }} style={{flexDirection: 'row'}}>
                                <AppText style={{color: colors.mainColor}}>{currentMenu}</AppText>
                                <Icon style={{color: colors.mainColor, paddingTop: 1, paddingLeft: 8}} type="ionicon"
                                    name={'chevron-down-outline'} size={16}></Icon>
                            </TouchableOpacity>
                            <SelectBox />
                        </View>
                    </TouchableWithoutFeedback>
                    <View flexDirection="row">
                        <View flexDirection="row">
                            <Icon style={{color: colors.mainColor, marginTop: 3, marginRight: 2}} type="ionicon"
                                name={'funnel'} size={13}></Icon>
                            <AppText style={{color: colors.mainColor}}>필터</AppText>
                        </View>
                        <View style={{marginHorizontal: 10}}><AppText
                            style={{color: colors.subColor}}>|</AppText></View>
                        <View flexDirection="row">
                            <Icon style={{color: colors.mainColor, marginTop: 3, marginRight: 2}} type="ionicon"
                                name={'pencil'} size={13}></Icon>
                            <AppText style={{color: colors.mainColor}}>편집</AppText>
                        </View>
                    </View>
                </View>
                <FlatList columnWrapperStyle={{justifyContent: 'space-between'}} numColumns={2}
                    showsVerticalScrollIndicator={false}
                    style={{zIndex: 0}}
                    data={collectionList} renderItem={CollectionContainer}
                    keyExtractor={(item) => item.collection_pk} nestedScrollEnabled
                />
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
        elevation: 5,
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

export default CollectionTab;