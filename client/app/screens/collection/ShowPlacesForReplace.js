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
import {Modal, Card} from '@ui-kitten/components';

import AppText from '../../components/AppText';
import AlternativeSpaceList from './AlternativeSpaceList';

import Jewel from '../../assets/images/jewel.svg';
import SlideMenu from '../../assets/images/menu_for_edit.svg';
import { useToken } from '../../contexts/TokenContextProvider';
import * as SecureStore from 'expo-secure-store';
import {useIsSignedIn} from '../../contexts/SignedInContextProvider';
import { Icon } from 'react-native-elements';
import {useAlertDuplicated} from '../../contexts/LoginContextProvider';

const ShowPlacesForReplace = props => {
    const { colors } = useTheme();
    const { item, index, isEditPage, navigation, likeFlag, getInitialReplacementData, getInitialData, isReplacementDeleted, isDeletedReplacement} = props;
    const [token, setToken] = useToken();
    const [isSignedIn, setIsSignedIn] = useIsSignedIn();
    const [alertDuplicated, setAlertDuplicated] = useAlertDuplicated(false);

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

    const [deleteMenu, setDeleteMenu] = useState(false);

    const DeleteModal = props => (
        <Modal
            visible={deleteMenu}
            backdropStyle={styles.backdrop}
            style={{backgroundColor: colors.backgroundColor, borderRadius: 10, marginTop: 10, width: '95%'}}
            onBackdropPress={() => setDeleteMenu(false)}>
            <Card disabled={true}
                style={{borderRadius: 10, backgroundColor: colors.backgroundColor, borderColor: colors.backgroundColor, justifyContent: 'center', alignItems: 'center'}}
            >
                <View style={{marginTop: 55}}>
                    <AppText style={{color: colors.mainColor, fontSize: 14, lineHeight: 22.4, fontWeight: '700', textAlign: 'center'}}>대체공간을 삭제할까요?</AppText>
                </View>
                <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 49}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
                        <TouchableOpacity onPress={() => {setDeleteVisible(false);}}>
                            <View style={{width: 138, height: 43, borderRadius: 10, backgroundColor: colors.defaultColor, justifyContent: 'center', alignItems: 'center', marginHorizontal: 9.5, ...styles.shadowOption}}>
                                <AppText style={{padding: 4, color: colors.mainColor, fontSize: 14, textAlign: 'center', lineHeight: 22.4, fontWeight: '500'}}>취소하기</AppText>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            let newArr = [...isDeletedReplacement];
                            newArr[index] = true;
                            isReplacementDeleted(newArr);
                            console.log(newArr);
                            setDeleteMenu(false);
                        }}>
                            <View style={{width: 138, height: 43, borderRadius: 10, backgroundColor: colors.red[3], justifyContent: 'center', alignItems: 'center', marginHorizontal: 9.5, ...styles.shadowOption}}>
                                <AppText style={{padding: 4, color: colors.defaultColor, fontSize: 14, textAlign: 'center', lineHeight: 22.4, fontWeight: '500'}}>삭제하기</AppText>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Card>
        </Modal>
    );

    return (
        <View style={isDeletedReplacement[index] && {display: 'none'}}>
            <TouchableHighlight underlayColor={colors.backgroundColor} style={{backgroundColor: colors.backgroundColor}}>
                <View flex={1}>
                    <DeleteModal />
                    <View style={{flexDirection: 'row', marginTop: 16, marginBottom: 4, justifyContent: 'space-between', alignItems: 'center'}}>
                        <TouchableOpacity onPress={() => {
                            countPlaceView(item.place_pk);
                            const data = {
                                'place_pk': item.place_pk,
                            };
                            navigation.navigate('Place', {data: data});
                        }} disabled={isEditPage ? true : false}>
                            <View style={{flexDirection: 'row', width: !isEditPage ? '100%' : '90%', alignItems: 'center'}}>
                                { isEditPage &&
                                    <TouchableOpacity onPress={()=>{
                                        setDeleteMenu(true);
                                    }}>
                                        <View style={{justifyContent: 'center', alignItems: 'center', marginEnd: 12}}>
                                            <Icon type="ionicon" name={'remove-circle'} color={colors.red[3]} size={28}/>
                                        </View>
                                    </TouchableOpacity>
                                }
                                {
                                    item.place_img ?
                                        <Image source={{uri: item.place_img}}
                                            style={{borderRadius: 10, width: 72, height: 72, marginTop: 2,}}/> :
                                            item.place_thumbnail ?
                                            <Image source={{uri: item.place_thumbnail}}
                                            style={{borderRadius: 10, width: 72, height: 72, marginTop: 2,}}/> :
                                                item.review_img ?
                                                <Image source={{uri: item.review_img}}
                                                style={{borderRadius: 10, width: 72, height: 72, marginTop: 2,}}/> :
                                                <Image source={require('../../assets/images/here_default.png')}
                                                    style={{borderRadius: 10, width: 72, height: 72, marginTop: 2}}/> 
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
                                            <View style={[parseInt(item.review_score) == -1 && {display: 'none'}, {flexDirection: 'row'}]}>
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

const styles = StyleSheet.create({
    backdrop: {
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    planContainer : {
        height: 30,
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
        height: 30,
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

export default ShowPlacesForReplace;