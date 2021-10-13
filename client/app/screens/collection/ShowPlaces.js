import React, {useState} from 'react';
import {
    TouchableOpacity,
    View,
    Image,
    TouchableHighlight, Alert
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Icon } from 'react-native-elements';

import AppText from '../../components/AppText';
import TipsList from './TipsList';
import { useToken } from '../../contexts/TokenContextProvider';

import Jewel from '../../assets/images/jewel.svg';
import SlideMenu from '../../assets/images/menu_for_edit.svg';
import * as SecureStore from 'expo-secure-store';
import {useIsSignedIn} from '../../contexts/SignedInContextProvider';
import AlternativeSpaceList from './AlternativeSpaceList';

const ShowPlaces = props => {
    const { colors } = useTheme();

    const { day, index, isEditPage, isPress, item, length, navigation, pk, originData, isDeleted, isDeletedOrigin, isLimited,
        isCommentPosted, isPostedCommentMapPk, isPostedComment,
        isCommentEdited, isEditedCommentMapPk, isEditedComment,
        isCommentDeleted, isDeletedComment,
        isReplacementGotten, isGottenReplacementMapPk,
        isReplacementDeleted, isDeletedReplacement, checkDeletedReplacement, setDeletedReplacementData,
        postPlaceComment, putPlaceComment,
        postReplacement, getReplacement, replacementData
    } = props;
    const isFree = (typeof day === 'undefined');
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

    const checkDay = (day) => {
        if(day === -1) return 0;
        else return day;
    };

    const checkIndex = () => {
        var prevCount = 0;
        for(var i=0;i<index;i++) {
            if(originData[i].cpm_plan_day !== day || originData[i].place_pk === -1 || originData[i].place_pk === -2) prevCount += 1;
        }
        return (index+1) - prevCount;
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

                    setIsLiked(response.data[index].like_flag);
                    // console.log(response.data)
                    // setIsTrue(userData.user_pk === data.user_pk && collectionData.collection_private === 0);
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

    const checkCurrentDay = () => {
        var length = 0;
        for(var i=0;i<originData.length;i++) {
            if(day === 0) {
                if(originData[i].cpm_plan_day === day || originData[i].cpm_plan_day === -1) length += 1;
            }
            else {
                if(originData[i].cpm_plan_day === day) length += 1;
            }
        }
        return length;
    };
    
    const checkCurrentIndex = (idx) => {
        var length = 0;
        for(var i=0;i<idx;i++) {
            //위에 day제거, 시간대 제거
            if(originData[i].cpm_plan_day !== day || originData[i].place_pk === -1 || originData[i].place_pk === -2) length += 1;
        }
        return idx - length;
    };

    const checkLimit = () => {
        if(!isEditPage && !isLimited && checkCurrentDay() > 5) {
            if(checkCurrentIndex(index) <= 4) return false;
            else return true;
        } else return false;
    };
    return (
        <View style={checkLimit() && {display: 'none'}}>
            { item.place_pk > 0 && checkDay(item.cpm_plan_day) === day?
                <TouchableHighlight underlayColor={colors.backgroundColor} style={{backgroundColor: colors.backgroundColor}}>
                    <View flex={1} style={isDeletedOrigin[index] && {display: 'none'}}>
                        <View style={{flexDirection: 'row', marginTop: 16, marginBottom: 4, justifyContent: 'center', alignItems: 'center'}}>
                            <TouchableOpacity onPress={()=>{
                                let newArr = [...isDeletedOrigin];
                                console.log(newArr);
                                newArr[index] = true;
                                // setIsDeletedOrigin(newArr);
                                isDeleted(newArr);
                            }} style={!isEditPage && {display: 'none'}}>
                                <View style={{flexDirection: 'row', width: !isEditPage ? '100%' : '90%'}}>
                                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                        <Icon type="ionicon" name={'remove-circle'} color={colors.red[3]} size={28}/>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <View style={[{justifyContent: 'center', alignItems: 'center', marginEnd: 12}, isEditPage && {display: 'none'}]}>
                                <View style={{borderRadius: 50, width: 24, height: 24, backgroundColor: colors.mainColor, justifyContent: 'center', alignItems: 'center'}}>
                                    <AppText style={{color: colors.defaultColor, fontSize: 12, lineHeight: 19.2, fontWeight: '500', textAlign: 'center'}}>
                                        {checkIndex()}    
                                    </AppText>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => {
                                countPlaceView(item.place_pk);
                                props.navigation.navigate('Place', {data: item});
                            }} disabled={isEditPage && true}>
                                <View style={{flexDirection: 'row', width: isEditPage ? '98%' : '88%', marginLeft: isEditPage ? 8 : 0, paddingLeft: 6, paddingRight: 5, marginRight: 4,}}>
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
                                </View>
                            </TouchableOpacity>
                            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                {/* {item.like_flag === 0 ?  */}
                                {/* <TouchableOpacity onPress={() => {
                            let newArr = [...isPress];
                            if (newArr[index]) {
                                newArr[index] = false;
                                setIsPress(newArr);
                                deletePlace(item.place_pk);
                            } else {
                                // for(let i=0;i<newArr.length;i++) {
                                //     if(i == index) continue;
                                //     else newArr[i] = false;
                                // }
                                newArr[index] = true;
                                setIsPress(newArr);
                                likePlace(item.place_pk);
                            }
                        }}> */}
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
                        <AlternativeSpaceList data={item} idx={index} day={day} key={index} isEditPage={isEditPage} isFree={isFree} private={props.private} navigation={navigation} pk={pk}
                            isReplacementGotten={isReplacementGotten} isGottenReplacementMapPk={isGottenReplacementMapPk} 
                            isReplacementDeleted={isReplacementDeleted} isDeletedReplacement={isDeletedReplacement} checkDeletedReplacement={checkDeletedReplacement} setDeletedReplacementData={setDeletedReplacementData} postReplacement={postReplacement} getReplacement={getReplacement} getInitialPlaceData={getInitialPlaceData} 
                            replacementData={replacementData}
                        />
                        <TipsList comment={item.comment} data={item} idx={index} day={day} private={props.private} isEditPage={isEditPage} isFree={isFree} postPlaceComment={postPlaceComment} putPlaceComment={putPlaceComment} isCommentDeleted={isCommentDeleted} isDeletedComment={isDeletedComment}/>
                    </View>
                </TouchableHighlight> :
                item.cpm_plan_day === day && length > 0 &&
                <TouchableHighlight underlayColor={colors.backgroundColor} style={{backgroundColor: colors.backgroundColor}}>
                    <View flex={1} style={[{flexDirection: 'row', justifyContent: 'space-between'}, isDeletedOrigin[index] && {display: 'none'}]}>
                        { isEditPage &&
                            <TouchableOpacity onPress={()=>{
                                // console.log(isDeleted);
                                var newArr = [...isDeletedOrigin];
                                newArr[index] = true;
                                // setIsDeletedOrigin(newArr);
                                isDeleted(newArr);
                            }}>
                                <View style={{justifyContent: 'center', alignItems: 'center', marginEnd: 12}}>
                                    <Icon type="ionicon" name={'remove-circle'} color={colors.red[3]} size={28}/>
                                </View>
                            </TouchableOpacity>
                        }
                        <View style={{
                            height: 30,
                            paddingVertical: 6,
                            paddingRight: 15,
                            paddingBottom: 6,
                            paddingTop: 4,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: colors.backgroundColor
                        }}>
                            <View style={{
                                width: !isEditPage ? '90%' : '70%',
                                borderStyle: 'dotted',
                                borderRadius: 1,
                                borderWidth: 1,
                                borderColor: colors.gray[4],
                                zIndex: -1000,
                                    
                            }}></View>
                            <View style={{marginStart: 6}}>
                                <AppText style={{color: colors.gray[4], fontSize: 12, lineHeight: 19.2, fontWeight: '400'}}>
                                    {item.place_pk === -1 ? '12PM' : '18PM'}
                                </AppText>
                            </View>
                            {
                                isEditPage &&
                                <TouchableOpacity style={{marginStart: 12}}>
                                    <SlideMenu width={21} height={21} style={{marginLeft: 2}}/>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                </TouchableHighlight>
            }

        </View>
    );
};

export default ShowPlaces;