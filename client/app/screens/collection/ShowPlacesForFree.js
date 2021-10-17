import React, {useState} from 'react';
import {
    TouchableOpacity,
    View,
    Image,
    TouchableHighlight,
    Alert,
    StyleSheet
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import {Modal, Card} from '@ui-kitten/components';

import AppText from '../../components/AppText';
import TipsList from './TipsList';
import { useToken } from '../../contexts/TokenContextProvider';

import Jewel from '../../assets/images/jewel.svg';
import SlideMenu from '../../assets/images/menu_for_edit.svg';
import { setUpdated } from '../../contexts/SetUpdateContextProviders';
import * as SecureStore from 'expo-secure-store';
import {useIsSignedIn} from '../../contexts/SignedInContextProvider';
import AlternativeSpaceList from './AlternativeSpaceList';


const ShowPlacesForFree = props => {
    const { colors } = useTheme();
    const { day, index, isEditPage, item, length, curLength, navigation, pk, isDeleted, isDeletedOrigin, isLimited,
        isReplacementDeleted, isDeletedReplacement, checkDeletedReplacement, setDeletedReplacementData,
        postPlaceComment, putPlaceComment, deletePlaceComment,
        postReplacement, getReplacement, replacementData
    } = props;
    const isFree = (day === -1);
    const [update, setUpdate] = setUpdated();
    const [token, setToken] = useToken();
    const [isSignedIn, setIsSignedIn] = useIsSignedIn();
    const [isLiked, setIsLiked] = useState(item.like_flag);
    const [alertDuplicated, setAlertDuplicated] = useState(false);

    const checkType = (type) => {
        if(type === 12) {
            return '관광지';
        } else if(type === 14) {
            return '문화시설';
        } else if(type === 15) {
            return '축제/공연/행사';
        } else if(type === 28) {
            return '레포츠';
        } else if(type === 32) {
            return '숙박';
        } else if(type === 38) {
            return '쇼핑';
        } else if(type === 39) {
            return '음식';
        } else {
            return '기타';
        }
    };

    const getInitialPlaceData = () => {
        try {
            fetch(`http://34.64.185.40/collection/${pk}/places`, {
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

                    setIsLiked(response.data.placeList[index].like_flag);
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

                    getInitialPlaceData();
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

                    getInitialPlaceData();
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

    const checkLimit = () => {
        if(!isEditPage && !isLimited) {
            if(index <= 4) return false;
            else return true;
        } else return false;
    };

    
    const [deleteVisible, setDeleteVisible] = useState(false);

    const DeleteModal = () => {
        return (
            <Modal
                visible={deleteVisible}
                backdropStyle={styles.backdrop}
                style={{backgroundColor: colors.backgroundColor, borderRadius: 10, marginTop: 10, width: '95%'}}
                onBackdropPress={() => setDeleteVisible(false)}>
                <Card disabled={true}
                    style={{borderRadius: 10, backgroundColor: colors.backgroundColor, borderColor: colors.backgroundColor, justifyContent: 'center', alignItems: 'center'}}
                >
                    <View style={{marginTop: 35}}>
                        <AppText style={{color: colors.mainColor, fontSize: 14, lineHeight: 22.4, fontWeight: '700', textAlign: 'center'}}>공간을 삭제할까요?</AppText>
                    </View>
                    <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 49}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
                            <TouchableOpacity onPress={() => {setDeleteVisible(false)}}>
                                <View style={{width: 138, height: 43, borderRadius: 10, backgroundColor: colors.defaultColor, justifyContent: 'center', alignItems: 'center', marginHorizontal: 9.5, ...styles.shadowOption}}>
                                    <AppText style={{padding: 4, color: colors.mainColor, fontSize: 14, textAlign: 'center', lineHeight: 22.4, fontWeight: '500'}}>취소하기</AppText>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                let newArr = [...isDeletedOrigin];
                                newArr[index] = true;
                                isDeleted(newArr);
                                setDeleteVisible(false);
                            }}>
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

    return (
        <View style={checkLimit() && {display: 'none'}}>
            <TouchableHighlight underlayColor={colors.backgroundColor} style={{backgroundColor: colors.backgroundColor}}>
                <View flex={1} style={isDeletedOrigin[index] && {display: 'none'}}>
                <View style={{flexDirection: 'row', marginVertical: 6, justifyContent: 'center', alignItems: 'center'}}>
                            <TouchableOpacity onPress={()=>{
                                setDeleteVisible(true);
                            }} style={!isEditPage && {display: 'none'}}>
                                <View style={{flexDirection: 'row', width: !isEditPage ? '100%' : '90%'}}>
                                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                        <Icon type="ionicon" name={'remove-circle'} color={colors.red[3]} size={28}/>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <DeleteModal />
                        <TouchableOpacity onPress={() => {
                            countPlaceView(item.place_pk);
                            const data = {
                                'place_pk': item.place_pk,
                            };
                            props.navigation.navigate('Place', {data: data});
                        }} disabled={isEditPage && true}>
                            <View style={{flexDirection: 'row', width: isEditPage ? '98%' : '100%', marginLeft: isEditPage ? 8 : 0, paddingLeft: 6, paddingRight: 5, marginRight: 4,}}>
                                <View style={{flexDirection: 'row', alignItems: 'center', width: !isEditPage ? '90%' : '82.7%'}}>
                                {
                                    item.place_img ?
                                        <Image source={{uri: item.place_img}}
                                        style={{borderRadius: 10, width: 72, height: 72, marginTop: 2,}}/> :
                                        <Image source={require('../../assets/images/here_default.png')}
                                        style={{borderRadius: 10, width: 72, height: 72, marginTop: 2}}/>
                                }
                                <View style={{
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    width: '80%'
                                }}>
                                    <View style={{marginLeft: 8, marginTop: '2%'}}>
                                        <View style={{flexDirection: 'row'}}>
                                            <AppText style={{
                                                color: colors.gray[3],
                                                textAlign: 'center',
                                                fontSize: 10,
                                                fontWeight: 'bold'
                                            }}>{checkType(item.place_type)}</AppText>
                                            <View style={[{flexDirection: 'row'}, parseInt(item.review_score) == -1 && {display: 'none'}]}>
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
                                            }}>{parseFloat(item.review_score).toFixed(2)}</AppText>
                                            </View>
                                        </View>
                                        <View style={{width: '100%'}}>
                                            <AppText style={{
                                                fontSize: 14,
                                                fontWeight: 'bold',
                                                color: colors.mainColor,
                                                marginVertical: 5,
                                            }}>{item.place_name}</AppText>
                                        </View>
                                        <AppText
                                            style={{fontSize: 12, color: colors.gray[4]}}>{item.place_addr}</AppText>
                                    </View>
                                </View>
                            </View>
                        </View>
                        </TouchableOpacity>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            {
                                !isEditPage ?
                                    <TouchableOpacity onPress={() => {
                                        if (isLiked) {
                                            DeleteLikedPlace(item.place_pk);
                                        } else {
                                            LikePlace(item.place_pk);
                                        }
                                    }}>
                                        <Jewel width={26} height={21}
                                            style={{color: isLiked ? colors.red[3] : colors.red_gray[5]}}/>
                                    </TouchableOpacity> :
                                    <TouchableOpacity>
                                        <SlideMenu width={21} height={21} style={{marginLeft: 2}}/>
                                    </TouchableOpacity>
                            }
                        </View>
                    </View>
                    {!isEditPage && <AlternativeSpaceList data={item} idx={index} day={day} key={index} isEditPage={isEditPage} private={props.private} navigation={navigation} pk={pk}
                            isReplacementDeleted={isReplacementDeleted} isDeletedReplacement={isDeletedReplacement} checkDeletedReplacement={checkDeletedReplacement}
                            postReplacement={postReplacement} getReplacement={getReplacement} getInitialPlaceData={getInitialPlaceData} 
                            replacementData={replacementData}
                        />}
                    {!isEditPage && <TipsList comment={item.comment} data={item} idx={index} day={day} private={props.private} isEditPage={isEditPage} isFree={isFree} postPlaceComment={postPlaceComment} putPlaceComment={putPlaceComment} deletePlaceComment={deletePlaceComment}/>}
                </View>
            </TouchableHighlight>
        </View>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    shadowOption: {
        shadowOffset: {
            width: 6,
            height: 6
        },
        shadowOpacity: 0.25,
        elevation: 1,
        shadowColor: 'rgba(203, 180, 180, 0.3)',
    }
});

export default ShowPlacesForFree;