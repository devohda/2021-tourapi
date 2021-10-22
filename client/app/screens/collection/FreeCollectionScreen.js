import React, {useState, useEffect, useRef} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Image,
    SafeAreaView,
    ScrollView,
    Dimensions,
    TextInput,
    Pressable,
    FlatList,
    Modal as RNModal,
    Alert,
    KeyboardAvoidingView,
    Share
} from 'react-native';
import {useTheme, useIsFocused} from '@react-navigation/native';
import { CheckBox, Icon } from 'react-native-elements';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useSharedValue } from 'react-native-reanimated';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {Modal, Card} from '@ui-kitten/components';

import AppText from '../../components/AppText';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenDivideLine from '../../components/ScreenDivideLine';
import ScreenContainerView from '../../components/ScreenContainerView';

import {useToken} from '../../contexts/TokenContextProvider';

import DragAndDropListForFree from './DragAndDropListForFree';
import ShowPlacesForFree from './ShowPlacesForFree';

import Jewel from '../../assets/images/jewel.svg';
import BackIcon from '../../assets/images/back-icon.svg';
import MoreIcon from '../../assets/images/more-icon.svg';
import DefaultThumbnail from '../../assets/images/profile_default.svg';
import CustomMarker from '../../assets/images/map/map-marker.svg';

import moment from 'moment';
import 'moment/locale/ko';
import * as SecureStore from 'expo-secure-store';
import {useIsSignedIn} from '../../contexts/SignedInContextProvider';
import {useAlertDuplicated} from '../../contexts/LoginContextProvider';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const FreeCollectionScreen = ({route, navigation}) => {
    const {colors} = useTheme();
    const {data} = route.params;
    const [collectionData, setCollectionData] = useState({});
    const [placeData, setPlaceData] = useState([]);
    const [commentsData, setCommentsData] = useState([]);
    const [placeLength, setPlaceLength] = useState(0);
    const [isEditPage, setIsEditPage] = useState(false);
    
    const [keywords, setKeywords] = useState([]);
    
    const isFocused = useIsFocused();
    const [isLimited, setIsLimited] = useState(false);

    const [token, setToken] = useToken();
    const [userData, setUserData] = useState({});
    const [isSignedIn, setIsSignedIn] = useIsSignedIn();
    const refRBSheet = useRef();
    const [replacementData, setReplacementData] = useState([]);
    const [alertDuplicated, setAlertDuplicated] = useAlertDuplicated(false);

    const onShare = async () => {
        try {
            const result = await Share.share({
                message:
                `[히든쥬얼] ${collectionData.collection_name}`
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            Alert.alert('', error.message);
        }
    };

    const isDeleted = (deletedData) => {
        setIsDeletedOrigin(deletedData);
    };

    const isCommentDeleted = (deletedCommentData) => {
        setIsDeletedComment(deletedCommentData);
    };

    const isReplacementGotten = (gottenReplacementData) => {
        setIsGottenReplacementMapPk(gottenReplacementData);
    };

    const isReplacementDeleted = (deletedReplacementData) => {
        setIsDeletedReplacement(deletedReplacementData);
    };

    const getUserData = () => {
        try {
            fetch('http://34.64.185.40/user', {
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

                    setUserData(response.data);
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getInitialCollectionData();
        getInitialPlaceData();
        getCollectionCommentsData();
        getUserData();
    }, [isFocused]);

    const getInitialCollectionData = () => {
        try {
            fetch(`http://34.64.185.40/collection/${data.collection_pk}`, {
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

                    setCollectionData(response.data);
                    setKeywords(response.data.keywords);
                    setObjects();

                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const getInitialPlaceData = () => {
        try {
            fetch(`http://34.64.185.40/collection/${data.collection_pk}/places`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
            }).then(res => res.json())
                .then(async response => {
                    if (response.code === 405 && !alertDuplicated) {
                        setAlertDuplicated(true);
                    }

                    if (parseInt(response.code / 100) === 4) {
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }

                    setPlaceData(response.data.placeList);
                    setPlaceLength(response.data.placeList.length);
                    setFalse(response.data.placeList);
                    setDeletedData(response.data.placeList);

                    const newRegion = { ...region };
                    if(response.data.placeList.length > 0) {
                        newRegion.latitude = Number(parseFloat(response.data.placeList[0].place_latitude).toFixed(10));
                        newRegion.longitude = Number(parseFloat(response.data.placeList[0].place_longitude).toFixed(10));
                    }

                    setRegion(newRegion);

                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const updatePlaceData = (updatedData, deletedData) => {
        // 공간 수정
        var putData = []; var isEmpty = 0;
        //빈 객체일때는 원래 순서 그대로 넣어주기
        for(var j=0;j<placeData.length;j++) {
            var forPutObj = {};
            if(Object.keys(updatedData[0]).length === 0) {
                isEmpty += 1;
                forPutObj = {
                    cpm_map_pk: placeData[j].cpm_map_pk,
                    planDay: -1,
                    order: placeData[j].cpm_order
                };
            } else {
                forPutObj = {
                    cpm_map_pk: placeData[j].cpm_map_pk,
                    planDay: -1,
                    order: Object.values(updatedData[0])[j]
                };
            }
            putData.push(forPutObj);
        }

        var DATA = {};
        DATA.placeList = putData;
        DATA.deletePlaceList = deletedData;
        if(isEmpty !== placeData.length || deletedData.length !== 0) {
            try {
                fetch(`http://34.64.185.40/collection/${data.collection_pk}/places`, {
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
                        await getInitialPlaceData();
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            } catch (err) {
                console.error(err);
            }
        }
    };

    const checkDeletedPlace = () => {
        var forDeleteData = [];
        for(var i=0;i<isDeletedOrigin.length;i++) {
            if(isDeletedOrigin[i] === true) {
                // deletePlace(placeData[i].cpm_map_pk, placeData[i].cpm_plan_day);
                forDeleteData.push(placeData[i].cpm_map_pk);
            }
        }
        
        return forDeleteData;
    };

    const getCollectionCommentsData = () => {
        //보관함 댓글 가져오기
        try {
            fetch(`http://34.64.185.40/collection/${data.collection_pk}/comments`, {
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
                    
                    setCommentsData(response.data);
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const postCollectionCommentsData = (comment) => {
        //보관함 댓글 등록
        try {
            fetch(`http://34.64.185.40/collection/${data.collection_pk}/comments`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
                body: JSON.stringify({
                    comment: comment
                })
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

                    getCollectionCommentsData();
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const putCollectionCommentsData = (ccPk, comment) => {
        //보관함 댓글 수정
        try {
            fetch(`http://34.64.185.40/collection/${data.collection_pk}/comments/${ccPk}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
                body: JSON.stringify({
                    comment: comment
                })
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

                    getCollectionCommentsData();
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const deleteCollectionCommentsData = (ccPk) => {
        //보관함 댓글 삭제
        try {
            fetch(`http://34.64.185.40/collection/${data.collection_pk}/comments/${ccPk}`, {
                method: 'DELETE',
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

                    getCollectionCommentsData();
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const reportComment = (ccpk) => {
        //보관함 댓글 신고
        try {
            fetch(`http://34.64.185.40/report/comment/${ccpk}`, {
                method: 'POST',
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
console.log(response)
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const reportCollection = () => {
        //보관함 신고
        try {
            fetch(`http://34.64.185.40/report/collection/${collectionData.collection_pk}`, {
                method: 'POST',
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
console.log(response)
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const checkTrue = () => {
        if (collectionData.collection_private) return true;
        return false;
    };

    const checkPrivate = () => {
        if (collectionData.is_creator) return true;
        return false;
    };

    const [isPress, setIsPress] = useState([]);
    const setFalse = (data) => {
        var pressed = [];
        for (let i = 0; i < data.length; i++) {
            pressed.push(false);
        }
        setIsPress(pressed);
    };

    const deleteCollection = (refRBSheet) => {
        try {
            fetch(`http://34.64.185.40/collection/${data.collection_pk}`, {
                method: 'DELETE',
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

                    Alert.alert('', '삭제되었습니다.', [
                        {text : 'OK', onPress: () => {
                            if(data.now) navigation.pop(2);
                            else navigation.goBack();
                            setDeleteMenu(!deleteMenu);
                            refRBSheet.current.close();
                        }}]);
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const LikeCollection = () => {
        //보관함 좋아요
        try {
            fetch(`http://34.64.185.40/like/collection/${collectionData.collection_pk}`, {
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

                    getInitialCollectionData();
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const DeleteLikedCollection = () => {
        //보관함 좋아요 삭제
        try {
            fetch(`http://34.64.185.40/like/collection/${collectionData.collection_pk}`, {
                method: 'DELETE',
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

                    getInitialCollectionData();
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const postPlaceComment = (cpmMapPk, addedComment) => {
        //한줄평 등록
        try {
            fetch(`http://34.64.185.40/collection/${collectionData.collection_pk}/place/${cpmMapPk}/comment`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
                body: JSON.stringify({
                    comment: addedComment,
                })
            }).then((res) => res.json())
                .then(async response => {
                    if (response.code === 405 && !alertDuplicated) {
                        setAlertDuplicated(true);
                    }

                    if (parseInt(response.code / 100) === 4) {
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }

                    getInitialPlaceData();
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const putPlaceComment = (cpmMapPk, editedComment) => {
        //한줄평 수정
        try {
            fetch(`http://34.64.185.40/collection/${collectionData.collection_pk}/place/${cpmMapPk}/comment`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
                body: JSON.stringify({
                    comment: editedComment,
                })
            }).then((res) => res.json())
                .then(async response => {
                    if (response.code === 405 && !alertDuplicated) {
                        setAlertDuplicated(true);
                    }

                    if (parseInt(response.code / 100) === 4) {
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }

                    getInitialPlaceData();
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const deletePlaceComment = (cpmMapPk, deletedComment) => {
        //한줄평 삭제
        try {
            fetch(`http://34.64.185.40/collection/${collectionData.collection_pk}/place/${cpmMapPk}/comment`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
                body: {
                    comment: deletedComment
                }
            }).then((res) => res.json())
                .then(async response => {
                    if (response.code === 405 && !alertDuplicated) {
                        setAlertDuplicated(true);
                    }

                    if (parseInt(response.code / 100) === 4) {
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }

                    getInitialPlaceData();
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const getReplacement = (cpmMapPk) => {
        //대체공간 불러오기
        try {
            fetch(`http://34.64.185.40/collection/${collectionData.collection_pk}/place/${cpmMapPk}/replacements`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
            }).then((res) => res.json())
                .then(async response => {
                    if (response.code === 405 && !alertDuplicated) {
                        setAlertDuplicated(true);
                    }

                    if (parseInt(response.code / 100) === 4) {
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }
                    setReplacementData(response.data);
                    setDeletedReplacementData(response.data);
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const setDeletedReplacementData = (data) => {
        var newArr = [];
        for(var i=0;i<data.length;i++) {
            newArr.push(false);
        }
        setIsDeletedReplacement(newArr);
    };

    const postReplacement = (mapPk, placePk, prev) => {
        //대체공간 추가
        try {
            fetch(`http://34.64.185.40/collection/${collectionData.collection_pk}/place/${mapPk}/replacement`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
                body: JSON.stringify({
                    order: replacementData.length+prev+1,
                    placeId: placePk
                })
            }).then((res) => res.json())
                .then(async response => {
                    if (response.code === 405 && !alertDuplicated) {
                        setAlertDuplicated(true);
                    }

                    if (parseInt(response.code / 100) === 4) {
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }

                    // getInitialPlaceData();
                    getReplacement(mapPk);
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const checkDeletedReplacement = () => {
        for(var i=0;i<isDeletedComment.length;i++) {
            if(isDeletedComment[i] !== false) {
                deleteReplacement(placeData[i].cpm_map_pk, isDeletedComment[i]);
            }
        }
    };

    const deleteReplacement = (cpmMapPk, place_pk) => {
        //대체공간 삭제
        try {
            fetch(`http://34.64.185.40/collection/${collectionData.collection_pk}/place/${cpmMapPk}/replacement/${place_pk}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
            }).then((res) => res.json())
                .then(async response => {
                    if (response.code === 405 && !alertDuplicated) {
                        setAlertDuplicated(true);
                    }

                    if (parseInt(response.code / 100) === 4) {
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }

                    getReplacement(cpmMapPk);
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };
    
    const Keyword = props => {
        return (
            <AppText style={{color: colors.gray[2], fontSize: 10, marginEnd: 8}}># {props.keyword}</AppText>
        );
    };

    //공간 삭제
    const [isDeletedOrigin, setIsDeletedOrigin] = useState([]);

    //대체공간 가져오기 : map Pk
    const [isGottenReplacementMapPk, setIsGottenReplacementMapPk] = useState(0);

    //한줄평 삭제, 대체공간 삭제
    const [isDeletedComment, setIsDeletedComment] = useState([]);
    const [isDeletedReplacement, setIsDeletedReplacement] = useState([]);

    const setDeletedData = (data) => {
        var newArr = [];
        for(var i=0;i<data.length;i++) {
            newArr.push(false);
        }
        setIsDeletedOrigin(newArr);
        setIsDeletedComment(newArr);
    };

    const GeneralPage = () => {
        return (
            <>
                <SafeAreaView>
                    <FlatList data={placeData}
                        renderItem={({item, index}) => <ShowPlacesForFree day={-1} item={item} index={index} key={index} isEditPage={isEditPage} navigation={navigation} length={placeLength} curLength={placeLength}
                            private={collectionData.is_creator} pk={collectionData.collection_pk} isDeleted={isDeleted} isDeletedOrigin={isDeletedOrigin} isLimited={isLimited}
                            isReplacementGotten={isReplacementGotten} isGottenReplacementMapPk={isGottenReplacementMapPk}
                            isReplacementDeleted={isReplacementDeleted} isDeletedReplacement={isDeletedReplacement} checkDeletedReplacement={checkDeletedReplacement} setDeletedReplacementData={setDeletedReplacementData}
                            postPlaceComment={postPlaceComment} putPlaceComment={putPlaceComment} deletePlaceComment={deletePlaceComment}
                            postReplacement={postReplacement} getReplacement={getReplacement} getInitialPlaceData={getInitialPlaceData} replacementData={replacementData}
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
    };
    const editData = useSharedValue([]);

    const isEdited = (data, day) => {
        var newObject = [...editData.value];
        newObject[0] = data;
        editData.value = newObject;
        return data;
    };
    
    const EditPage = () => {
        return (
            <SafeAreaView>
                <DragAndDropListForFree data={placeData} isEditPage={isEditPage} isPress={isPress}
                    navigation={navigation} length={placeLength} curLength={placeLength}
                    private={collectionData.is_creator} pk={collectionData.collection_pk} isDeleted={isDeleted} isDeletedOrigin={isDeletedOrigin} isLimited={isLimited}
                    isCommentDeleted={isCommentDeleted} isDeletedComment={isDeletedComment}
                    isReplacementGotten={isReplacementGotten} isGottenReplacementMapPk={isGottenReplacementMapPk}
                    isReplacementDeleted={isReplacementDeleted} isDeletedReplacement={isDeletedReplacement} checkDeletedReplacement={checkDeletedReplacement} setDeletedReplacementData={setDeletedReplacementData}
                    postPlaceComment={postPlaceComment} putPlaceComment={putPlaceComment}
                    postReplacement={postReplacement} getReplacement={getReplacement} getInitialPlaceData={getInitialPlaceData} replacementData={replacementData}
                    isEdited={isEdited}
                />
            </SafeAreaView>
        );
    };
    
    const [deleteMenu, setDeleteMenu] = useState(false);

    const list = [
        { 
            title: '공간 수정',
            containerStyle: { backgroundColor: colors.backgroundColor },
            titleStyle: { color: colors.mainColor, fontSize: 16, fontWeight: '500', lineHeight: 25.6 },
        },
        { 
            title: '보관함 정보수정',
            containerStyle: { backgroundColor: colors.backgroundColor },
            titleStyle: { color: colors.mainColor, fontSize: 16, fontWeight: '500', lineHeight: 25.6 },
        },
        { 
            title: '보관함 공유',
            containerStyle: { backgroundColor: colors.backgroundColor },
            titleStyle: { color: colors.mainColor, fontSize: 16, fontWeight: '500', lineHeight: 25.6 },
        },
        {
            title: '보관함 삭제',
            containerStyle: { backgroundColor: colors.backgroundColor },
            titleStyle: { color: colors.red[3], fontSize: 16, fontWeight: '500', lineHeight: 25.6 },
        },
    ];

    const customerList = [
        { 
            title: '보관함 공유',
            containerStyle: { backgroundColor: colors.backgroundColor },
            titleStyle: { color: colors.mainColor, fontSize: 16, fontWeight: '500', lineHeight: 25.6 },
        },
        {
            title: '보관함 신고',
            containerStyle:{ backgroundColor: colors.backgroundColor },
            titleStyle: { color: colors.red[3], fontSize: 16, fontWeight: '500', lineHeight: 25.6 },
        },
    ];

    const [reportMenu, setReportMenu] = useState(false);
    const [reportConfirmMenu, setReportConfirmMenu] = useState(false);

    const reportReasons = [
        {
            index: 1,
            title: '영리목적/홍보성'
        },
        {
            index: 2,
            title: '욕설/인신공격'
        },
        {
            index: 3,
            title: '음란성/선정성'
        },
        {
            index: 4,
            title: '도배/반복'
        },
        {
            index: 5,
            title: '개인정보노출'
        },
        {
            index: 6,
            title: '기타'
        },
    ];

    const ShowReportReasons = ({item, index}) => {
        const [isPressed, setIsPressed] = useState([
            false,
            false,
            false,
            false,
            false,
            false
        ]);

        return (
            <View style={{justifyContent: 'center', alignItems: 'flex-start', width: 150}}>
                <CheckBox
                    center
                    title={<AppText style={{color: colors.mainColor, padding: 5}}>{item.title}</AppText>}
                    containerStyle={{backgroundColor: colors.backgroundColor, borderWidth: 0, margin: 0, padding: 5, height: 40}}
                    textStyle={{fontSize: 16, lineHeight: 25.6, fontWeight: '400', textAlign: 'left'}}
                    checked={isPressed[index]}
                    onPress={()=>{
                        const newArr = [...isPressed];
                        if (newArr[index]) {
                            newArr[index] = false;
                            setIsPressed(arr => newArr);
                        } else {
                            for (let i = 0; i < newArr.length; i++) {
                                if (i == index) continue;
                                else newArr[i] = false;
                            }
                            newArr[index] = true;
                            setIsPressed(arr => newArr);
                        }
                    }}
                />
            </View>
        );
    };

    const ReportModal  = props => {
        const { type } = props;
        return (
            <RNModal
                transparent={true}
                visible={reportMenu}
                onRequestClose={() => {
                    setReportMenu(!reportMenu);
                    if(type === 'collection') props.refRBSheet.current.close();
                }}
            >
                <View style={styles.centeredView}>
                    <View style={{...styles.modalView, backgroundColor: colors.backgroundColor, height: windowHeight/1.9}}>
                        <AppText style={{...styles.modalText, color: colors.blue[1]}}>신고사유</AppText>
                        <FlatList columnWrapperStyle={{justifyContent: 'space-between'}} numColumns={2}
                            showsVerticalScrollIndicator={false}
                            style={{marginTop: 10}}
                            contentContainerStyle={{height: 120, marginBottom: -20}}
                            data={reportReasons} renderItem={({item, index}) => <ShowReportReasons item={item} index={index} key={index}/>}
                            keyExtractor={(item) => item.index} nestedScrollEnabled
                        />
                        <SafeAreaView>
                            <TextInput
                                style={{padding: 15, backgroundColor: colors.defaultColor, color: colors.mainColor, width: 295, height: 124}}
                                placeholder='기타 사유를 입력해주세요.'
                                placeholderTextColor={colors.gray[5]}
                                textAlignVertical={'top'}
                                autoCapitalize="none"
                                autoCorrect={false}
                                multiline
                            />
                        </SafeAreaView>
                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Pressable
                                style={{...styles.button, backgroundColor: colors.defaultColor, width: 86,
                                    shadowColor: 'rgba(203, 180, 180, 0.3)',
                                    shadowOffset: {
                                        width: 3,
                                        height: 6
                                    },
                                    shadowOpacity: 0.25}}
                                onPress={() => {
                                    setReportMenu(!reportMenu);
                                    if(type === 'collection') props.refRBSheet.current.close();
                                }}
                            >
                                <AppText style={{...styles.textStyle, color: colors.mainColor}}>취소하기</AppText>
                            </Pressable>
                            <Pressable
                                style={{...styles.button, backgroundColor: colors.red[3], width: 201,
                                    shadowColor: 'rgba(203, 180, 180, 0.3)',
                                    shadowOffset: {
                                        width: 3,
                                        height: 6
                                    },
                                    shadowOpacity: 0.25}}
                                onPress={() => {
                                    if(type === 'collection') {
                                        props.refRBSheet.current.close();
                                        reportCollection();
                                    }
                                    else reportComment(props.pk);
                                    setReportMenu(!reportMenu);
                                }}
                            >
                                <AppText style={styles.textStyle}>신고하기</AppText>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </RNModal>
    )};

    const ReportConfirmModal = props => {
        const { type } = props;

        return (
            <RNModal
                transparent={true}
                visible={reportConfirmMenu}
                onRequestClose={() => {
                    setReportConfirmMenu(!reportConfirmMenu);
                    if(type === 'collection') props.refRBSheet.current.close();
                }}
            >
                <View style={styles.centeredView}>
                    <View style={{...styles.modalView, backgroundColor: colors.backgroundColor}}>
                        <AppText style={{...styles.modalText, color: colors.blue[1]}}>신고되었습니다.</AppText>
                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Pressable
                                style={{...styles.button, backgroundColor: colors.mainColor}}
                                onPress={() => {
                                    setReportConfirmMenu(!reportConfirmMenu);
                                    if(type === 'collection') {
                                        props.refRBSheet.current.close();
                                        reportCollection();
                                    }
                                    else reportComment(props.pk);
                                }}
                            >
                                <AppText style={styles.textStyle}>확인</AppText>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </RNModal>
    )};

    const DeleteModal = props => (
        <RNModal
            transparent={true}
            visible={deleteMenu}
            onRequestClose={() => {
                setDeleteMenu(!deleteMenu);
                props.refRBSheet.current.close();
            }}
        >
            <View style={styles.centeredView}>
                <View style={{...styles.modalView, backgroundColor: colors.backgroundColor}}>
                    <AppText style={{...styles.modalText, color: colors.blue[1]}}>보관함을 삭제할까요?</AppText>
                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <Pressable
                            style={{...styles.button, backgroundColor: colors.gray[4]}}
                            onPress={() => {
                                props.refRBSheet.current.close();
                                setDeleteMenu(!deleteMenu);
                            }}
                        >
                            <AppText style={styles.textStyle}>취소하기</AppText>
                        </Pressable>
                        <Pressable
                            style={{...styles.button, backgroundColor: colors.red[3]}}
                            onPress={() => {
                                setDeleteMenu(!deleteMenu);
                                deleteCollection(props.refRBSheet);
                            }}
                        >
                            <AppText style={styles.textStyle}>삭제하기</AppText>
                        </Pressable>
                    </View>
                </View>
            </View>
        </RNModal>
    );


    const [editVisible, setEditVisible] = useState(false);
    const [deleteVisible, setDeleteVisible] = useState(false);

    const EditCommentModal = () => {
        const [changed, setChanged] = useState('');
        return (
            <Modal
            visible={editVisible}
            backdropStyle={styles.backdrop}
            style={{backgroundColor: colors.backgroundColor, maxHeight: '100%', borderRadius: 10, width: '95%'}}
            onBackdropPress={() => setEditVisible(false)}>
            <Card disabled={true}
                style={{borderRadius: 10, backgroundColor: colors.backgroundColor, borderColor: colors.backgroundColor}}
            >
                <View style={{marginTop: 5}}>
                    <AppText style={{color: colors.mainColor, fontSize: 14, lineHeight: 22.4, fontWeight: '700', textAlign: 'center'}}>댓글</AppText>
                </View>
                <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 5}}>
                    <View style={{marginTop: 14}}>
                        <TextInput defaultValue={currentCommentData.collection_comment} onChangeText={(text)=>{
                                setChanged(text);
                            }}
                            style={{
                                color: colors.mainColor,
                                backgroundColor: colors.defaultColor,
                                borderWidth: 1,
                                borderColor: changed ? colors.mainColor : colors.defaultColor,
                                width: 295,
                                height: 95,
                                borderRadius: 10,
                                padding: 8
                            }}
                            placeholder='예) 이 일정대로 여행할때 대체공간도 꼭 보고 가세요'
                            multiline
                            placeholderTextColor={colors.gray[5]}
                            textAlignVertical={'top'}
                            ></TextInput>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, marginBottom: 20}}>
                        <TouchableOpacity onPress={() => {
                            if(changed !== currentCommentData.collection_comment && changed !== '') {
                                putCollectionCommentsData(currentCommentData.cc_pk, changed);
                            }
                            setEditVisible(false);
                        }} activeOpacity={0.8}>
                            <View style={{width: 138, height: 43, borderRadius: 10, backgroundColor: colors.mainColor, justifyContent: 'center', alignItems: 'center', marginHorizontal: 9.5, ...styles.shadowOption}}>
                                <AppText style={{padding: 4, color: colors.defaultColor, fontSize: 14, textAlign: 'center', lineHeight: 22.4, fontWeight: '500'}}>수정하기</AppText>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            setEditVisible(false);
                            setDeleteVisible(true);
                            }} activeOpacity={0.8}>
                            <View style={{width: 138, height: 43, borderRadius: 10, backgroundColor: colors.red[3], justifyContent: 'center', alignItems: 'center', marginHorizontal: 9.5, ...styles.shadowOption}}>
                                <AppText style={{padding: 4, color: colors.defaultColor, fontSize: 14, textAlign: 'center', lineHeight: 22.4, fontWeight: '500'}}>삭제하기</AppText>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Card>
        </Modal>
    )};

    const DeleteCommentModal = () => {
        return (
            <Modal
                visible={deleteVisible}
                backdropStyle={styles.backdrop}
                style={{backgroundColor: colors.backgroundColor, borderRadius: 10, marginTop: 10, width: '95%'}}
                onBackdropPress={() => setDeleteVisible(false)}>
                <Card disabled={true}
                    style={{borderRadius: 10, backgroundColor: colors.backgroundColor, borderColor: colors.backgroundColor, justifyContent: 'center', alignItems: 'center'}}
                >
                    <View style={{marginTop: 55}}>
                        <AppText style={{color: colors.mainColor, fontSize: 14, lineHeight: 22.4, fontWeight: '700', textAlign: 'center'}}>댓글을 삭제할까요?</AppText>
                    </View>
                    <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 49}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
                            <TouchableOpacity onPress={() => {setDeleteVisible(false)}} activeOpacity={0.8}>
                                <View style={{width: 138, height: 43, borderRadius: 10, backgroundColor: colors.defaultColor, justifyContent: 'center', alignItems: 'center', marginHorizontal: 9.5, ...styles.shadowOption}}>
                                    <AppText style={{padding: 4, color: colors.mainColor, fontSize: 14, textAlign: 'center', lineHeight: 22.4, fontWeight: '500'}}>취소하기</AppText>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                setDeleteVisible(false);
                                deleteCollectionCommentsData(currentCommentData.cc_pk)
                            }} activeOpacity={0.8}>
                                <View style={{width: 138, height: 43, borderRadius: 10, backgroundColor: colors.red[3], justifyContent: 'center', alignItems: 'center', marginHorizontal: 9.5, ...styles.shadowOption}}>
                                    <AppText style={{padding: 4, color: colors.defaultColor, fontSize: 14, textAlign: 'center', lineHeight: 22.4, fontWeight: '500'}}>삭제하기</AppText>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Card>
            </Modal>
        )
    };

    const [currentCommentData, setCurrentCommentData] = useState({});

    const ShowComments = props => {
        const { data, idx } = props;
        return (
            <>
                <TouchableOpacity onPress={() => {
                    if(data.is_creator) {
                        setCurrentCommentData(data);
                        setEditVisible(true);
                    }
                    }}
                    activeOpacity={0.8}
                    >
                    <View flexDirection="row" style={{flex: 1, alignItems: 'flex-start'}}>
                    {
                                data.user_img === '' || data.user_img === 'default-user' || data.user_img.startsWith('../') || data.user_img === 'default-img' ?
                                    <View style={{...styles.authorImage}}>
                                        <Image
                                            style={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: 50,
                                                backgroundColor: colors.defaultColor,
                                            }}
                                            source={require('../../assets/images/default-profile.png')}
                                        /></View> :
                                    <View style={{...styles.authorImage}}>
                                        <Image source={{ uri: data.user_img }} style={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: 50,
                                            backgroundColor: colors.defaultColor,
                                        }}/></View>
                            }
                        <View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginBottom: 8,
                                    flexWrap: 'wrap'
                                }}>
                                    <AppText style={{color: colors.mainColor, fontSize: 12}}>{data.user_nickname}</AppText>
                                    <AppText style={{
                                        marginHorizontal: 8,
                                        color: colors.gray[5],
                                        fontSize: 10
                                    }}>|</AppText>
                                    <AppText style={{color: colors.gray[4], fontSize: 12}}>{moment(data.cc_create_time).format('YY.MM.DD')}</AppText>
                                </View>                      
                                <TouchableOpacity onPress={()=>setReportMenu(true)} activeOpacity={0.8} style={data.is_creator && {display: 'none'}}>
                                    <Icon type="ionicon" name={"alert-circle"} color={colors.red[3]} size={16}></Icon>
                                </TouchableOpacity>
                                <ReportModal type={'comment'} pk={data.cc_pk} />
                                <ReportConfirmModal type={'comment'} />
                            </View>
                            <View style={{flex: 1, width: '100%'}}><AppText style={{
                                fontSize: 12,
                                color: colors.mainColor,
                                lineHeight: 16,
                                fontWeight: '700',
                                flexWrap: 'wrap',
                                width: windowWidth - 100
                            }}>{data.collection_comment}
                            </AppText></View>
                        </View>
                    </View>
                </TouchableOpacity>

                <View style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: colors.red_gray[6],
                    zIndex: -1000,
                    marginVertical: 12
                }}></View>

            </>
        );
    };

    const ShowCollectionComments = () => {
        const [comments, setComments] = useState('');
        return (
            <View flex={1} style={{marginVertical: 20, justifyContent: 'flex-end'}}>
                <View flexDirection="row" style={{...styles.comment_box, borderColor: colors.gray[5]}}>
                    <TextInput flex={1} style={{fontSize: 16, color: colors.mainColor}}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="보관함에 댓글을 남겨보세요!"
                        value={comments}
                        placeholderTextColor={colors.gray[5]}
                        onChangeText={(text)=>setComments(text)}
                        onSubmitEditing={()=>{
                            if(comments !== '') {
                                setComments(comments);
                                postCollectionCommentsData(comments);
                            }
                            setComments('');
                        }}
                    />
                    <Pressable style={{marginLeft: 5}} onPress={()=>{
                        if(comments !== '') {
                            setComments(comments);
                            postCollectionCommentsData(comments);
                        }
                        setComments('');
                    }}>
                        <Icon style={{color: colors.gray[5], marginTop: 3, marginRight: 2}} type="ionicon"
                            name={'pencil'} size={16}></Icon>
                    </Pressable>
                </View>
            </View>
        );
    };

    const window = Dimensions.get('window');
    const WIDTH = window.width;
    const HEIGHT = window.height;

    const ASPECT_RATIO = WIDTH / HEIGHT;
    const LATITUDE_DELTA = 0.35;
    const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

    const [lnt, setLnt] = useState(126.9775482762618);
    const [region, setRegion] = useState({
        latitude: 37.56633546113615,
        longitude: 126.9775482762618,
        latitudeDelta: 0.0015,
        longitudeDelta: 0.0015,
    });

    const onMarkerPress = (event) => {
        const { id, coordinate } = event.nativeEvent;
        const newRegion = { ...region };
        newRegion.latitude = coordinate.latitude;
        newRegion.longitude = coordinate.longitude;
    
        setRegion(newRegion);
    };

    const EntireButton = () => {
        return (
            <View style={{position: 'absolute', right: 0, bottom: 0}}>
                <TouchableOpacity activeOpacity={0.8}
                    onPress={()=>navigation.navigate('ShowEntireMap', {title: collectionData.collection_name, placeData: placeData, type: collectionData.collection_type, pk: collectionData.collection_pk})}>
                    <Image source={require('../../assets/images/map/entire-button.png')} style={{width: 40, height: 40}}/>
                </TouchableOpacity>
            </View>
        );
    };

    const ShowMarkers = props => {
        const { data, idx } = props;

        return (
            <Marker coordinate={{
                latitude: Number(parseFloat(data.place_latitude).toFixed(10)),
                longitude: Number(parseFloat(data.place_longitude).toFixed(10))
            }} style={{width: 100, height: 100}}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <CustomMarker />
                    <View style={{position: 'absolute', justifyContent: 'center', alignItems: 'center', top: 2}}>
                        <AppText style={{fontSize: 12, fontWeight: '500', lineHeight: 19.2, color: colors.mainColor}}>{data.cpm_plan_day === -1 ? 1 : data.cpm_plan_day + 1}</AppText>
                    </View>
                    <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: colors.mainColor, borderRadius: 30, height: 22, widht: '100%', marginTop: 4}}>
                        <View style={{justifyContent: 'center', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 1.5}}>
                            <AppText style={{fontSize: 12, lineHeight: 19.2, fontWeight: '500', color: colors.defaultColor}} numberOfLines={1}>
                                {data.place_name}
                            </AppText>
                        </View>
                    </View>
                </View>
            </Marker>
        )
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
                        if(data.now) {
                            if(isEditPage) setIsEditPage(false);
                            else navigation.pop(2);
                        }
                        else {
                            if(isEditPage) setIsEditPage(false);
                            else navigation.goBack();
                        }}} activeOpacity={0.8}>
                        <BackIcon style={{color: colors.mainColor}}/>
                    </TouchableOpacity>
                </View>
                {/* {checkPrivate() ? <> */}
                    {
                        !isEditPage ?
                            <View style={{position: 'absolute', right: 0}}>
                                <TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                                    style={{flex: 1, height: '100%'}} onPress={() => {
                                        refRBSheet.current.open();
                                    }} activeOpacity={0.8}>
                                    <MoreIcon style={{color: colors.mainColor}}/>
                                </TouchableOpacity>
                                <RBSheet
                                    ref={refRBSheet}
                                    closeOnDragDown={true}
                                    closeOnPressMask={true}
                                    height={checkPrivate() ? 250 : 150}
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
                                    }}
                                >
                                    { checkPrivate() ?
                                    list.map((l, i) => (
                                        <TouchableOpacity onPress={()=>{
                                            if(i === 0) {
                                                setIsEditPage(true);
                                            }
                                            if(i === 1) {
                                                refRBSheet.current.close();
                                                navigation.navigate('MakePlanCollection', {data: collectionData, update: true, placeLength: placeLength});
                                            }
                                            if(i === 2) {
                                                onShare();
                                            }
                                            if(i === 3) {
                                                setDeleteMenu(true);
                                            }
                                        }} activeOpacity={0.8}>
                                            <View key={i} style={{marginLeft: 20, marginVertical: 11.5}}>
                                                <AppText style={l.titleStyle}>{l.title}</AppText>
                                            </View>
                                        </TouchableOpacity>
                                    )) :
                                    customerList.map((l, i) => (
                                        <TouchableOpacity onPress={()=>{
                                            if(i === 0) {
                                                onShare();
                                            }
                                            if(i === 1) {
                                                setReportMenu(true);
                                                
                                            }
                                        }} activeOpacity={0.8}>
                                            <View key={i} style={{marginLeft: 20, marginVertical: 11.5}}>
                                                <AppText style={l.titleStyle}>{l.title}</AppText>
                                            </View>
                                        </TouchableOpacity>
                                    ))
                                    }
                                    <DeleteModal refRBSheet={refRBSheet}/>
                                    <ReportModal type={'collection'} refRBSheet={refRBSheet}/>
                                    <ReportConfirmModal type={'collection'} refRBSheet={refRBSheet}/>
                                </RBSheet>
                            </View> :
                            <View style={{position: 'absolute', right: 0}}>
                                <TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} style={{flex: 1, height: '100%'}}
                                    onPress={async () => {
                                        setIsEditPage(false);
                                        isDeleted(isDeletedOrigin);
                                        isCommentDeleted(isDeletedComment);
                                        await updatePlaceData(editData.value, checkDeletedPlace());
                                    }} activeOpacity={0.8}>
                                    <View>
                                        <AppText style={{color: colors.mainColor, fontSize: 16, lineHeight: 19.2, fontWeight: '700'}}>완료</AppText>
                                    </View>
                                </TouchableOpacity>
                            </View>
                    }
                    {/* </> : */}
                    {/* <View style={{position: 'absolute', right: 0}}>
                        <TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                            style={{flex: 1, height: '100%'}} onPress={() => {
                                onShare();
                            }} activeOpacity={0.8}>
                                <Icon type="ionicon" name={'share-social'} color={colors.mainColor} size={26}/>
                        </TouchableOpacity>
                    </View>
                    } */}
            </View>

            <ScrollView flex={1} stickyHeaderIndices={[1]}>
                <ScreenContainerView flex={1}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 8
                    }}>
                        <View
                            style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <View style={[styles.dirType,
                                {
                                    borderColor: colors.defaultColor,
                                    backgroundColor: colors.defaultColor,
                                    shadowColor: colors.red[8]
                                }]}>
                                <AppText style={{...styles.dirFreeText, color: colors.mainColor}}>자유</AppText>
                            </View>
                            {
                                keywords.map((keyword, idx) => (
                                    <Keyword keyword={keyword} key={idx} />
                                ))
                            }
                        </View>
                        <View>
                            {checkTrue() &&
                            <Image source={require('../../assets/images/lock_forDir.png')}
                                style={{width: 22, height: 22}}></Image>}
                        </View>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <View style={{justifyContent: 'center', alignItems: 'flex-start'}}>
                            <AppText style={{
                                fontSize: 22,
                                fontWeight: '700',
                                color: colors.mainColor
                            }}>{collectionData.collection_name}</AppText>
                            <AppText style={{
                                fontSize: 12,
                                fontWeight: '400',
                                color: colors.gray[2],
                                lineHeight: 19.2,
                                marginTop: 12
                            }}>by. {collectionData.created_user_name}</AppText>
                        </View>
                        {
                            userData.user_nickname !== collectionData.created_user_name &&
                           <TouchableOpacity onPress={() => {
                               if (collectionData.like_flag) {
                                   DeleteLikedCollection();
                               } else {
                                   LikeCollection();
                               }
                           }} activeOpacity={0.8}>
                               <View style={{
                                   justifyContent: 'center',
                                   alignItems: 'center',
                                   marginVertical: 5
                               }}>
                                   <Jewel width={26} height={21}
                                       style={collectionData.like_flag ? {color: colors.red[3]} : {color: colors.red_gray[3]}}/>
                                   <AppText style={{
                                       fontSize: 10,
                                       fontWeight: '700',
                                       color: collectionData.like_flag ? colors.red[3] : colors.red_gray[3],
                                       marginTop: 2
                                   }}>{collectionData.like_cnt}</AppText>
                               </View>
                           </TouchableOpacity>
                        }
                    </View>
                </ScreenContainerView>

                <View style={{marginTop: 20}} flex={1}>
                    <View flex={1}>
                        <MapView style={{width: Dimensions.get('window').width, height: 150, flex: 1, alignItems: 'center'}}
                            region={region}
                            moveOnMarkerPress
                            tracksViewChanges={false}
                            onMarkerPress={onMarkerPress}
                        >
                            { placeData.length > 0 &&
                            placeData.map((data, idx) => (
                                <ShowMarkers data={data} idx={idx} key={idx}/>
                            ))
                            }
                        </MapView>
                        {
                            placeData.length > 0 &&
                            <EntireButton />
                        }
                    </View>
                </View>

                <ScreenContainerView flex={1}>
                    {
                        placeLength !== 0 ?
                            <View style={{marginTop: 16}}>
                                <View style={{marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <View>
                                        <AppText style={{color: colors.gray[4]}}>총 <AppText
                                            style={{fontWeight: '700'}}>{placeLength}개</AppText> 공간</AppText>
                                    </View>
                                    <TouchableOpacity onPress={()=>{
                                        navigation.navigate('SearchForAdd', {pk: collectionData.collection_pk, placeData: placeData, day : -1, replace: false});
                                    }} style={(!collectionData.is_creator || isEditPage) && {display: 'none'}} activeOpacity={0.8}>
                                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                            <Icon type="ionicon" name={'add-outline'} size={18} color={colors.mainColor} />
                                            <AppText style={{color: colors.mainColor, fontSize: 14, lineHeight: 22.4, fontWeight: '700'}}>공간 추가하기</AppText>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <SafeAreaView>
                                    <SafeAreaView>
                                        {
                                            !isEditPage ?
                                                <GeneralPage /> :
                                                <EditPage />
                                        }
                                    </SafeAreaView>
                                </SafeAreaView>
                                {placeLength > 5 && !isEditPage && <TouchableOpacity activeOpacity={0.8}>
                                    <View style={{
                                        flexDirection: 'row',
                                        marginVertical: 16,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        {
                                            !isLimited ?
                                                <TouchableOpacity onPress={()=>setIsLimited(true)}
                                                    style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
                                                    activeOpacity={0.8}
                                                >
                                                    <AppText style={{
                                                        fontSize: 14,
                                                        fontWeight: '400',
                                                        color: colors.gray[2]
                                                    }}>전체보기</AppText>
                                                    <Image source={require('../../assets/images/showWhole_forDir.png')}
                                                        style={{
                                                            width: 15,
                                                            height: 15,
                                                            marginLeft: 10,
                                                            marginBottom: 5
                                                        }}></Image>
                                                </TouchableOpacity> :
                                                <TouchableOpacity onPress={()=>setIsLimited(false)}
                                                    style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
                                                    activeOpacity={0.8}
                                                >
                                                    <AppText style={{
                                                        fontSize: 14,
                                                        fontWeight: '400',
                                                        color: colors.gray[2]
                                                    }}>닫기</AppText>
                                                    <Image source={require('../../assets/images/showWhole_forDir.png')}
                                                        style={{
                                                            width: 15,
                                                            height: 15,
                                                            marginLeft: 10,
                                                            marginTop: 7,
                                                            transform: [{rotate: '180deg'}]
                                                        }}></Image>
                                                </TouchableOpacity>
                                        }

                                    </View>
                                </TouchableOpacity>}
                            </View> :
                            <View style={{marginTop: 16}}>
                                <View style={{marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <View>
                                        <AppText style={{color: colors.gray[4]}}>총 <AppText
                                            style={{fontWeight: '700'}}>{placeLength}개</AppText> 공간</AppText>
                                    </View>
                                    <TouchableOpacity onPress={()=>{
                                        navigation.navigate('SearchForAdd', {pk: collectionData.collection_pk, placeData: placeData, day : -1, replace: false});
                                    }} style={ !checkPrivate() && {display:'none'}} activeOpacity={0.8}>
                                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                            <Icon type="ionicon" name={'add-outline'} size={18} color={colors.mainColor} />
                                            <AppText style={{color: colors.mainColor, fontSize: 14, lineHeight: 22.4, fontWeight: '700'}}>공간 추가하기</AppText>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: 40,
                                    marginBottom: 52
                                }}>
                                    <Image source={require('../../assets/images/empty_forDir.png')} style={{
                                        width: 150,
                                        height: 120,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginBottom: 12
                                    }}></Image>
                                    <AppText style={{fontSize: 14, color: colors.red_gray[2], fontWeight: '500', lineHeight: 22.4}}>보관함이 비어있네요.</AppText>
                                    <AppText style={{fontSize: 14, color: colors.red_gray[2], fontWeight: '500', lineHeight: 22.4}}>마음에 드는 공간을 수집해보세요!</AppText>
                                </View>
                            </View>
                    }

                </ScreenContainerView>

                <ScreenDivideLine style={{marginVertical: 16}}/>

                <ScreenContainerView flex={1}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <AppText style={{...styles.titles, color: colors.mainColor}}>댓글</AppText>
                        <AppText style={{
                            color: colors.gray[3],
                            fontSize: 14,
                            marginStart: 11,
                            marginTop: 5
                        }}>총 <AppText style={{fontWeight: '700'}}>{commentsData.length}개</AppText></AppText>
                    </View>
                </ScreenContainerView>

                <KeyboardAvoidingView flex={1} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <ScreenContainerView flex={1}>
                        <ShowCollectionComments />
                        {
                            commentsData.length !== 0 &&
                            <View style={{marginTop: 4}}>{
                                commentsData.map((data, idx) => (
                                    <ShowComments data={data} key={idx} idx={idx}/>
                                ))
                            }</View>
                        }
                        <EditCommentModal />
                        <DeleteCommentModal />
                    </ScreenContainerView>
                </KeyboardAvoidingView>
            </ScrollView>
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
    //modal example
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        height: 150
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
    
    //comment css
    backdrop: {
        backgroundColor: 'rgba(0,0,0,0.5)',
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

export default FreeCollectionScreen;