import React, {useState, useEffect, useRef} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Image,
    Modal,
    SafeAreaView,
    FlatList,
    Alert
} from 'react-native';
import {useTheme, useIsFocused} from '@react-navigation/native';
import {Icon} from 'react-native-elements';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useSharedValue } from 'react-native-reanimated';

import AppText from '../../components/AppText';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenDivideLine from '../../components/ScreenDivideLine';
import ScreenContainerView from '../../components/ScreenContainerView';
import {useToken} from '../../contexts/TokenContextProvider';
import ShowPlacesForReplace from '../collection/ShowPlacesForReplace';

import Jewel from '../../assets/images/jewel.svg';
import BackIcon from '../../assets/images/back-icon.svg';
import MoreIcon from '../../assets/images/more-icon.svg';

import moment from 'moment';
import 'moment/locale/ko';
import * as SecureStore from 'expo-secure-store';
import {useIsSignedIn} from '../../contexts/SignedInContextProvider';
import DragAndDropListForReplace from './DragAndDropListForReplace';

const AlternativeSpaceScreen = ({route, navigation}) => {
    const {colors} = useTheme();
    const { data, day, pk, getReplacement } = route.params;
    const [placeData, setPlaceData] = useState({});
    const [replacementData, setReplacementData] = useState([]);
    const [isDeletedReplacement, setIsDeletedReplacement] = useState([]);
    const [isEditSpace, setIsEditSpace] = useState(false);
    const isFocused = useIsFocused();
    const [token, setToken] = useToken();
    const refRBSheet = useRef();
    const [alertDuplicated, setAlertDuplicated] = useState(false);
    const [isSignedIn, setIsSignedIn] = useIsSignedIn();
    const [thumbnail, setThumbnail] = useState('');

    const setDeletedData = (data) => {
        var newArr = [];
        for(var i=0;i<data.length;i++) {
            newArr.push(false);
        }
        setIsDeletedReplacement(newArr);
    };

    const isReplacementDeleted = (deletedData) => {
        setIsDeletedReplacement(deletedData);
    };

    const checkDeletedReplacement = () => {
        var forDeleteData = [];
        for(var i=0;i<isDeletedReplacement.length;i++) {
            if(isDeletedReplacement[i] === true) {
                // deleteReplacement(data.cpm_map_pk, replacementData[i].place_pk);
                // 구분을 위함
                forDeleteData.push(replacementData[i].place_pk);
            }
        }

        return forDeleteData;
    };

    useEffect(() => {
        getInitialData();
        getInitialReplacementData();
        () => {
            setPlaceData({});
        };
    }, [isFocused]);

    const getInitialData = () => {
        try {
            fetch(`http://34.64.185.40/place/${data.place_pk}`, {
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

                    setPlaceData(response.data.placeData);
                    const res = response.data;
                    if(res.placeData.place_img) {
                        setThumbnail(res.placeData.place_img)
                    } else if(res.review.review_img) {
                        setThumbnail(res.review.review_img);
                    }
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const getInitialReplacementData = () => {
        //대체공간 불러오기 (실시간용)
        try { 
            fetch(`http://34.64.185.40/collection/${pk}/place/${data.cpm_map_pk}/replacements`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
            }).then((res) => res.json())
                .then(async response => {
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
                    setReplacementData(response.data);
                    setDeletedData(response.data);
                    setObjects();

                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const updateReplacementData = (updatedData, deletedData) => {
        // 공간 수정
        var putData = []; var isEmpty = 0;
        // console.log(updatedData)
        for(var j=0;j<replacementData.length;j++) {
            var forPutObj = {};

            //그대로면 api 안쏘도록
            if(Object.values(updatedData[0])[j] == Object.keys(updatedData[0])[j]) isEmpty += 1;
            if(!deletedData.filter((e)=>e === replacementData[j].place_pk).length) {
                if(Object.keys(updatedData[0]).length === 0) {
                    forPutObj = {
                        cpm_map_pk: data.cpm_map_pk,
                        placeId: replacementData[j].place_pk,
                        order: replacementData[j].cpr_order
                    }
                } else {
                    forPutObj = {
                        cpm_map_pk: data.cpm_map_pk,
                        placeId: replacementData[j].place_pk,
                        order: Object.values(updatedData[0])[j]
                    }
                };
                putData.push(forPutObj);
            }
        }

        var DATA = {};
        DATA.replacementPlaceList = putData;
        // console.log(DATA);
        if(isEmpty !== placeData.length) {
            try {
                fetch(`http://34.64.185.40/collection/${data.collection_pk}/place/${data.cpm_map_pk}/replacement`, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'x-access-token': token
                    },
                    body: JSON.stringify(DATA),
                }).then(res => res.json())
                    .then(async response => {
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
                        console.log(response);
                        await getInitialReplacementData();
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            } catch (err) {
                console.error(err);
            }
        }
    };

    const deleteReplacement = (cpmMapPk, place_pk) => {
        //대체공간 삭제
        // console.log(cpmMapPk); console.log(place_pk);
        try {
            fetch(`http://34.64.185.40/collection/${pk}/place/${cpmMapPk}/replacement/${place_pk}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
            }).then(res => res.json())
                .then(async response => {
                    if (response.code === 405 && !alertDuplicated) {
                        Alert.alert('', '다른 기기에서 로그인했습니다.');
                        setAlertDuplicated(true);
                    }
console.log(response)
                    if (parseInt(response.code / 100) === 4) {
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }
                    getInitialReplacementData();
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const deleteAllReplacement = (cpmMapPk) => {
        //대체공간 자체를 삭제
        try {
            fetch(`http://34.64.185.40/collection/${pk}/place/${cpmMapPk}/replacements`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
            }).then((res) => res.json())
                .then(async response => {
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

                    navigation.goBack();
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

                    getInitialData();
                    console.log(response);
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

                    getInitialData();
                    console.log(response);
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

    
    const GeneralPage = () => {
        return (
            <>
                <SafeAreaView>
                    <FlatList data={replacementData}
                        renderItem={({item, index}) => <ShowPlacesForReplace item={item} index={index} key={index} isEditPage={isEditSpace} length={placeData.length} likeFlag={item.like_flag} navigation={navigation} isCreator={0} pk={pk} getInitialReplacementData={getInitialReplacementData} getInitialData={getInitialData}
                            isReplacementDeleted={isReplacementDeleted} isDeletedReplacement={isDeletedReplacement}
                        />}
                        keyExtractor={(item, idx) => {idx.toString();}}
                        key={(item, idx) => {idx.toString();}}
                        nestedScrollEnabled/>
                </SafeAreaView>
            </>
        );};

    const setObjects = () => {
        var newArr = [{}];
        editData.value = newArr;
    }
    const editData = useSharedValue([]);

    const isEdited = (data) => {
        var newObject = [...editData.value];
        newObject[0] = data;
        editData.value = newObject;
        return data;
    };
    
    const EditPage = () => {
        return (
                <DragAndDropListForReplace
                    data={replacementData} isEditPage={isEditSpace} length={placeData.length} navigation={navigation} isCreator={0} pk={pk} getInitialReplacementData={getInitialReplacementData} getInitialData={getInitialData}
                    isReplacementDeleted={isReplacementDeleted} isDeletedReplacement={isDeletedReplacement}
                    isEdited={isEdited}
                />
        )
    };
    
    const [deleteMenu, setDeleteMenu] = useState(false);

    const list = [
        { 
            title: '대체공간 수정',
            containerStyle: { backgroundColor: colors.backgroundColor },
            titleStyle: { color: colors.mainColor, fontSize: 16, fontWeight: '500', lineHeight: 25.6 },
        },
        {
            title: '대체공간 삭제',
            containerStyle: { backgroundColor: colors.backgroundColor },
            titleStyle: { color: colors.red[3], fontSize: 16, fontWeight: '500', lineHeight: 25.6 },
        },
    ];
    
    const DeleteModal = props => (
        <Modal
            transparent={true}
            visible={deleteMenu}
            onRequestClose={() => {
                setDeleteMenu(!deleteMenu);
                props.refRBSheet.current.close();
            }}
            style={{backgroundColor: colors.backgroundColor, maxHeight: '100%', borderRadius: 10, width: '95%'}}
        >
            <View style={styles.centeredView}>
                <View style={{...styles.modalView, backgroundColor: colors.backgroundColor}}>
                    <View style={{marginTop: 35}}>
                        <AppText style={{color: colors.mainColor, fontSize: 14, lineHeight: 22.4, fontWeight: '700', textAlign: 'center'}}>대체공간을 삭제할까요?</AppText>
                    </View>
                    <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 49}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
                            <TouchableOpacity onPress={() => {
                                props.refRBSheet.current.close();
                                setDeleteMenu(!deleteMenu);
                            }}>
                                <View style={{width: 138, height: 43, borderRadius: 10, backgroundColor: colors.defaultColor, justifyContent: 'center', alignItems: 'center', marginHorizontal: 9.5, ...styles.shadowOption}}>
                                    <AppText style={{padding: 4, color: colors.mainColor, fontSize: 14, textAlign: 'center', lineHeight: 22.4, fontWeight: '500'}}>취소하기</AppText>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                props.refRBSheet.current.close();
                                setDeleteMenu(!deleteMenu);
                                deleteAllReplacement(data.cpm_map_pk);
                            }}>
                                <View style={{width: 138, height: 43, borderRadius: 10, backgroundColor: colors.red[3], justifyContent: 'center', alignItems: 'center', marginHorizontal: 9.5, ...styles.shadowOption}}>
                                    <AppText style={{padding: 4, color: colors.defaultColor, fontSize: 14, textAlign: 'center', lineHeight: 22.4, fontWeight: '500'}}>삭제하기</AppText>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );

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

    return (
        <ScreenContainer backgroundColor={colors.backgroundColor}>
            <View flexDirection="row" style={{
                height: 24,
                marginBottom: 20,
                marginTop: 20,
                marginHorizontal: 20,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <View style={{position: 'absolute', left: 0}}>
                    <TouchableOpacity onPress={() => {
                        if(isEditSpace) setIsEditSpace(false);
                        else navigation.goBack();}}>
                        <BackIcon style={{color: colors.mainColor}}/>
                    </TouchableOpacity>
                </View>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <AppText style={{color: colors.mainColor, fontSize: 16, fontWeight: 'bold'}}>
                        대체 공간
                    </AppText>
                </View>
                <>
                    {
                        !isEditSpace ?
                            <View style={[{position: 'absolute', right: 0}, !route.params.private && {display: 'none'}]}>
                                <TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                                    style={{flex: 1, height: '100%'}} onPress={() => {
                                        refRBSheet.current.open();
                                    }}>
                                    <MoreIcon style={{color: colors.mainColor}}/>
                                </TouchableOpacity>
                                <RBSheet
                                    ref={refRBSheet}
                                    closeOnDragDown={true}
                                    closeOnPressMask={true}
                                    height={180}
                                    customStyles={{
                                        wrapper: {
                                            backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                        },
                                        draggableIcon: {
                                            display: 'none'
                                        },
                                        container: {
                                            borderTopLeftRadius: 10,
                                            borderTopRightRadius: 10,
                                            backgroundColor: colors.yellow[7],
                                            paddingTop: 10
                                        }
                                    }}>
                                    {list.map((l, i) => (
                                        <TouchableOpacity onPress={()=>{
                                            if(i === 0) {
                                                setIsEditSpace(true);
                                                refRBSheet.current.close();
                                            }
                                            if(i === 1) {
                                                setDeleteMenu(true);
                                            }
                                        }}>
                                            <View key={i} style={{marginLeft: 20, marginVertical: 11.5}}>
                                                <AppText style={l.titleStyle}>{l.title}</AppText>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                    <DeleteModal refRBSheet={refRBSheet}/>
                                </RBSheet>
                            </View> :
                            <View style={[{position: 'absolute', right: 0}, !route.params.private && {display: 'none'}]}>
                                <TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} style={{flex: 1, height: '100%'}}
                                    onPress={async () => {
                                        setIsEditSpace(false);
                                        isReplacementDeleted(isDeletedReplacement);
                                        // await checkDeletedReplacement();
                                        await updateReplacementData(editData.value, checkDeletedReplacement());
                                    }}>
                                    <View>
                                        <AppText style={{color: colors.mainColor, fontSize: 16, lineHeight: 19.2, fontWeight: '700'}}>완료</AppText>
                                    </View>
                                </TouchableOpacity>
                            </View>
                    }</>
            </View>
            <ScreenContainerView>
                <View>
                    <View style={{flexDirection: 'row', marginTop: 16, marginBottom: 4, justifyContent: 'center', alignItems: 'center'}}>
                        <TouchableOpacity onPress={()=>{
                            countPlaceView(data.place_pk);
                            const item = {
                                'place_pk': data.place_pk,
                            };
                            navigation.navigate('Place', {data: item});
                        }}>
                            <View style={{flexDirection: 'row', width: '100%'}}>
                                <View style={{justifyContent: 'center', alignItems: 'center', marginEnd: 12}}>
                                    <View style={{borderRadius: 50, width: 24, height: 24, backgroundColor: colors.mainColor, justifyContent: 'center', alignItems: 'center'}}>
                                        <AppText style={{color: colors.defaultColor, fontSize: 12, lineHeight: 19.2, fontWeight: '500', textAlign: 'center'}}>1</AppText>
                                    </View>
                                </View>
                                {
                                    thumbnail !== '' ?
                                        <Image style={{borderRadius: 10, width: 72, height: 72, marginTop: 2}} source={{uri: thumbnail}}/> :
                                        <Image style={{borderRadius: 10, width: 72, height: 72, marginTop: 2}} source={require('../../assets/images/here_default.png')}/> 
                                }
                                <View style={{
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    width: '67%'
                                }}>
                                    <View style={{marginLeft: 8, marginTop: '2%'}}>
                                        <View style={{flexDirection: 'row'}}>
                                            <AppText style={{
                                                color: colors.gray[3],
                                                textAlign: 'center',
                                                fontSize: 10,
                                                fontWeight: 'bold'
                                            }}>{checkType(data.place_type)}</AppText>
                                            <View style={[{flexDirection: 'row'}, parseInt(data.review_score) == -1 && {display: 'none'}]}>
                                            <AppText style={{
                                                marginHorizontal: 4, color: colors.gray[7],
                                                textAlign: 'center',
                                                fontSize: 10,
                                                fontWeight: 'bold',
                                            }}>|</AppText>
                                            <Image source={require('../../assets/images/review_star.png')}
                                                style={{
                                                    width: 10,
                                                    height: 10,
                                                    alignSelf: 'center',
                                                    marginTop: '1%',
                                                }}></Image>
                                            <AppText style={{
                                                color: colors.gray[3],
                                                textAlign: 'center',
                                                fontSize: 10,
                                                fontWeight: 'bold',
                                                marginLeft: 2,
                                            }}>{parseFloat(data.review_score).toFixed(2)}</AppText>
                                            </View>
                                        </View>
                                        <View style={{width: '100%'}}>
                                            <AppText style={{
                                                fontSize: 16,
                                                fontWeight: 'bold',
                                                color: colors.mainColor,
                                                marginVertical: 5,
                                            }}>{data.place_name}</AppText>
                                        </View>
                                        <AppText
                                            style={{fontSize: 12, color: colors.gray[4]}}>{data.place_addr}</AppText>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <TouchableOpacity onPress={() => {
                                if (placeData.like_flag) {
                                    DeleteLikedPlace(placeData.place_pk);
                                } else {
                                    LikePlace(placeData.place_pk);
                                }
                            }}>
                                <Jewel width={26} height={21}
                                    style={{color: placeData.like_flag ? colors.red[3] : colors.red_gray[5]}}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScreenContainerView>

            <ScreenDivideLine />

            <ScreenContainerView>
                <View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View>
                            <AppText style={{color: colors.gray[4]}}>총 <AppText
                                style={{fontWeight: '700'}}>{replacementData.length}개</AppText> 대체공간</AppText>
                        </View>
                        <TouchableOpacity onPress={()=>{
                            navigation.navigate('SearchForAdd', {pk: pk, placeData: data, day : day, replace: true});
                        }} style={(!route.params.private || isEditSpace) && {display: 'none'}}>
                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                <Icon type="ionicon" name={'add-outline'} size={18} color={colors.mainColor} />
                                <AppText style={{color: colors.mainColor, fontSize: 14, lineHeight: 22.4, fontWeight: '700'}}>공간 추가하기</AppText>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <SafeAreaView>
                        <SafeAreaView>
                            {
                                !isEditSpace ?
                                    <GeneralPage /> :
                                    <EditPage />
                            }
                        </SafeAreaView>
                    </SafeAreaView>
                </View>
            </ScreenContainerView>
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    titles: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    dirType: {
        borderWidth: 1,
        paddingVertical: 1,
        paddingHorizontal: 8,
        marginEnd: 8,
        borderRadius: 14,
        width: 43,
        height: 22,
        flexDirection: 'row',
        zIndex: 10000,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOpacity: 0.1,
        shadowOffset: {width: 0, height: 1},
    },
    dirFreeText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    reviewImage: {
        width: 56,
        height: 56,
        borderRadius: 50,
    },
    comment_box: {
        borderBottomWidth: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 5
    },
    //swipe style
    rowBack: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
        marginTop: 13,
        height: '100%'
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
    },

    //modal example
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 0,
        justifyContent: 'center',
        alignItems: 'center',
        height: 193
    },
    button: {
        borderRadius: 10,
        marginHorizontal: 9.5,
        marginTop: 26,
        width: 108,
        height: 38,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textStyle: {
        color: 'white',
        textAlign: 'center',
        fontSize: 14,
        lineHeight: 22.4,
        fontWeight: '500'
    },
    modalText: {
        textAlign: 'center',
        fontSize: 14,
        lineHeight: 22.4,
        fontWeight: '700'
    },
    authorImage: {
        width: 44,
        height: 44,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8
    },

    //대체공간 삭제 모달
    backdrop: {
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    planContainer : {
        // height: 30,
        paddingVertical: 6,
        paddingLeft: 6,
        paddingRight: 5,
        marginBottom: 6,
        marginRight: 4,
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '88%'
    },
    freeContainer: {
        // height: 30,
        paddingVertical: 6,
        paddingLeft: 6,
        paddingRight: 5,
        marginBottom: 6,
        marginRight: 4,
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '88%'
    },
    shadowOption: {
        shadowOffset: {
            width: 6,
            height: 6
        },
        shadowOpacity: 0.25,
        shadowColor: 'rgba(203, 180, 180, 0.3)',
    }
});

export default AlternativeSpaceScreen;