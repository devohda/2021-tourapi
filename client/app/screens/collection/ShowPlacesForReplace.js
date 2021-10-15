import React, {useState} from 'react';
import {
    TouchableOpacity,
    View,
    Image,
    TouchableHighlight, Alert,
} from 'react-native';
import { useTheme } from '@react-navigation/native';

import AppText from '../../components/AppText';
import AlternativeSpaceList from './AlternativeSpaceList';
import TipsList from './TipsList';

import Jewel from '../../assets/images/jewel.svg';
import SlideMenu from '../../assets/images/menu_for_edit.svg';
import { setUpdated } from '../../contexts/SetUpdateContextProviders';
import { useToken } from '../../contexts/TokenContextProvider';
import * as SecureStore from 'expo-secure-store';
import {useIsSignedIn} from '../../contexts/SignedInContextProvider';
import { Icon } from 'react-native-elements';

const ShowPlacesForReplace = props => {
    const { colors } = useTheme();
    const { data, index, isEditPage, item, navigation, likeFlag, isLimited, getInitialReplacementData, getInitialData, isReplacementDeleted, isDeletedReplacement} = props;
    const [update, setUpdate] = setUpdated();
    const [token, setToken] = useToken();
    const [isSignedIn, setIsSignedIn] = useIsSignedIn();
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

                    getInitialReplacementData();
                    getInitialData();
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

                    getInitialReplacementData();
                    getInitialData();
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
        }
    };
    return (
        <View style={isDeletedReplacement[index] && {display: 'none'}}>
            {/* {item.place_pk !== collectionData.places[0].place_pk && <View style={{
                width: '100%',
                height: 1,
                backgroundColor: colors.red_gray[6],
                zIndex: -1000,
                marginVertical: 13
            }}></View>} */}
            <TouchableHighlight underlayColor={colors.backgroundColor} style={{backgroundColor: colors.backgroundColor}}>
                <View flex={1}>
                    <View style={{flexDirection: 'row', marginTop: 16, marginBottom: 4, justifyContent: 'space-between', alignItems: 'center'}}>
                        <TouchableOpacity onPress={() => {
                            countPlaceView(item.place_pk);
                            navigation.navigate('Place', {data: item});
                        }} disabled={isEditPage && true}>
                            <View style={{flexDirection: 'row', width: !isEditPage ? '100%' : '90%', alignItems: 'center'}}>
                                { isEditPage &&
                                    <TouchableOpacity onPress={()=>{
                                        let newArr = [...isDeletedReplacement];
                                        newArr[index] = true;
                                        isReplacementDeleted(newArr);
                                        console.log(newArr);
                                    }}>
                                        <View style={{justifyContent: 'center', alignItems: 'center', marginEnd: 12}}>
                                            <Icon type="ionicon" name={'remove-circle'} color={colors.red[3]} size={28}/>
                                        </View>
                                    </TouchableOpacity>
                                }
                                {
                                    item.place_img ?
                                        <Image source={{uri: item.place_img}}
                                            style={{borderRadius: 10, width: 72, height: 72}}/> :
                                        <Image source={require('../../assets/images/here_default.png')}
                                            style={{borderRadius: 10, width: 72, height: 72}}/> 
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
                                            }}>{checkType(item.place_type)}</AppText>
                                            <AppText style={{
                                                marginHorizontal: 4, color: colors.gray[7],
                                                textAlign: 'center',
                                                fontSize: 10,
                                                fontWeight: 'bold',
                                                display: parseInt(item.review_score) == -1 && 'none'
                                            }}>|</AppText>
                                            <Image source={require('../../assets/images/review_star.png')}
                                                style={{
                                                    width: 10,
                                                    height: 10,
                                                    alignSelf: 'center',
                                                    marginTop: '1%',
                                                    display: parseInt(item.review_score) == -1 && 'none'
                                                }}></Image>
                                            <AppText style={{
                                                color: colors.gray[3],
                                                textAlign: 'center',
                                                fontSize: 10,
                                                fontWeight: 'bold',
                                                marginLeft: 2,
                                                display: parseInt(item.review_score) == -1 && 'none'
                                            }}>{parseFloat(item.review_score).toFixed(2)}</AppText>
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
                        </TouchableOpacity>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            {
                                !isEditPage ?
                                    <TouchableOpacity onPress={() => {
                                        if (likeFlag) {
                                            DeleteLikedPlace(item.place_pk);
                                        } else {
                                            LikePlace(item.place_pk);
                                        }
                                    }}>
                                        <Jewel width={26} height={21}
                                            style={{color: likeFlag ? colors.red[3] : colors.red_gray[5]}}/>
                                    </TouchableOpacity> :
                                    <TouchableOpacity>
                                        <SlideMenu width={21} height={21} style={{marginLeft: 2}}/>
                                    </TouchableOpacity>
                            }
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        </View>
    );
};

export default ShowPlacesForReplace;