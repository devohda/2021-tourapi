import React, {useState, useEffect} from 'react';
import { View, ScrollView, Image, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, Share, Alert, FlatList } from 'react-native';
import {useTheme} from '@react-navigation/native';
import {Icon, AirbnbRating, Rating} from 'react-native-elements';
import {useToken} from '../../contexts/TokenContextProvider';

import ScreenContainer from '../../components/ScreenContainer';
import ScreenContainerView from '../../components/ScreenContainerView';
import ScreenDivideLine from '../../components/ScreenDivideLine';
import NavigationTop from '../../components/NavigationTop';
import AppText from '../../components/AppText';
import * as SecureStore from 'expo-secure-store';
import {useIsSignedIn} from '../../contexts/SignedInContextProvider';

const MakeReviewScreen = ({route, navigation}) => {
    const { colors } = useTheme();
    const [token, setToken] = useToken();
    const [isSignedIn, setIsSignedIn] = useIsSignedIn();
    const { placeName } = route.params;
    const [isOpened, setIsOpened] = useState(false);
    const [reviews, setReviews] = useState([
        '많이 아쉬워요', '아쉬워요', '괜찮아요', '마음에 들어요!', '다시 방문하고 싶어요!'
    ]);
    const [ratedScore, setRatedScore] = useState(0);
    const [userData, setUserData] = useState({});
    const [busyTimeData, setBusyTimeData] = useState([
        {
            id : 1,
            data: '오전'
        },
        {
            id: 2,
            data: '오후'
        },
        {
            id: 3,
            data: '저녁'
        },
        {
            id: 4,
            data: '밤'
        }]);

    const [facilityData, setFacilityData] = useState([
        {
            id : 1,
            data: '편의점'
        },
        {
            id: 2,
            data: '화장실'
        },
        {
            id: 3,
            data: '쓰레기통'
        },
        {
            id: 4,
            data: '주차장'
        },
        {
            id: 5,
            data: '약국'
        },
        {
            id: 6,
            data: '고객지원센터'
        },
        {
            id: 7,
            data: '유아놀이방'
        },
        {
            id: 8,
            data: '고객안내센터'
        },
        {
            id: 9,
            data: '휴게실'
        },
        {
            id: 10,
            data: '수유시설'
        },
        {
            id: 11,
            data: '물품보관함'
        },
        {
            id: 12,
            data: '자전거보관소'
        },
        {
            id: 13,
            data: '간이음수대'
        },
        {
            id: 14,
            data: '체육시설'
        },
        {
            id: 15,
            data: '교통약자용키트'
        },
        {
            id: 16,
            data: '어린이놀이터'
        },
    ]);
    const [isBusyTimePress, setIsBusyTimePress] = useState([]);
    const [isFacilityPress, setIsFacilityPress] = useState([]);

    useEffect(() => {
        getUserData();
        setFalse();
    },[]);

    const getUserData = () => {
        try {
            fetch('http://localhost:3000/user', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
            }).then((res) => res.json())
                .then(async (response) => {
                    if(response.code === 401 || response.code === 403 || response.code === 419){
                        Alert.alert('','로그인이 필요합니다');
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

    const setFalse = () => {
        var pressed = [];
        for (let i = 0; i < busyTimeData.length; i++) {
            pressed.push(false);
        }
        setIsBusyTimePress(pressed);

        pressed = [];
        for (let i = 0; i < facilityData.length; i++) {
            pressed.push(false);
        }
        setIsFacilityPress(pressed);
    };

    //받침에 따른 은/는 구분 위한 메서드
    const isEndWithConsonant = (korStr) => {
        const finalChrCode = korStr.charCodeAt(korStr.length - 1);
        // 0 = 받침 없음, 그 외 = 받침 있음
        const finalConsonantCode = (finalChrCode - 44032) % 28;
        return finalConsonantCode !== 0;
    };

    const getRating = (rating) => {
        setRatedScore(rating);
    };

    const BusyTime = ({keyword, idx}) => {
        return (
            <View key={idx}
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}

            >
                <TouchableOpacity onPress={() => {
                    let newArr = [...isBusyTimePress];
                    if (isBusyTimePress[keyword.id - 1]) {
                        newArr[keyword.id - 1] = false;
                        setIsBusyTimePress(newArr);
                    } else {
                        newArr[keyword.id - 1] = true;
                        setIsBusyTimePress(newArr);
                    }
                }} style={isBusyTimePress[keyword.id - 1] ? [styles.selectTypeClicked, {
                    borderColor: colors.mainColor,
                    backgroundColor: colors.mainColor,
                    shadowColor: colors.red[8]
                }] : [styles.selectType, {borderColor: colors.defaultColor, backgroundColor: colors.defaultColor, shadowColor: colors.red[8]}]}>
                    <AppText
                        style={isBusyTimePress[keyword.id - 1] ? {...styles.selectTypeTextClicked, color: colors.defaultColor} : {...styles.selectTypeText, color: colors.gray[6]}}>{keyword.data}</AppText>
                </TouchableOpacity>
            </View>
        );
    };

    const AroundFacility = ({keyword, idx}) => {
        return (
            <View key={idx}
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 8
                }}
            >
                <TouchableOpacity onPress={() => {
                    let newArr = [...isFacilityPress];
                    if (isFacilityPress[keyword.id - 1]) {
                        newArr[keyword.id - 1] = false;
                        setIsFacilityPress(newArr);
                    } else {
                        newArr[keyword.id - 1] = true;
                        setIsFacilityPress(newArr);
                    }
                }} style={isFacilityPress[keyword.id - 1] ? [styles.selectTypeClicked, {
                    borderColor: colors.mainColor,
                    backgroundColor: colors.mainColor,
                    shadowColor: colors.red[8],
                }] : [styles.selectType, {borderColor: colors.defaultColor, backgroundColor: colors.defaultColor, shadowColor: colors.red[8]}]}>
                    <AppText
                        style={isFacilityPress[keyword.id - 1] ? {...styles.selectTypeTextClicked, color: colors.defaultColor} : {...styles.selectTypeText, color: colors.gray[6]}}>{keyword.data}</AppText>
                </TouchableOpacity>
            </View>
        );
    };

    const FacilityLineBreak = () => (
        <View style={{width: '85%'}}>
            <View style={{flexDirection: 'row'}}>
                {
                    facilityData.map((keyword, idx) => (
                        <>{idx <= 3 &&
                        <AroundFacility keyword={keyword} key={idx+'0'}/>}</>
                    ))
                }
            </View>
            { isOpened &&
                <><View style={{flexDirection: 'row'}}>
                    {
                        facilityData.map((keyword, idx) => (
                            <>{4 <= idx && idx <= 6 &&
                            <AroundFacility keyword={keyword} key={idx+'1'}/>}</>
                        ))
                    }
                </View>
                <View style={{flexDirection: 'row'}}>
                    {
                        facilityData.map((keyword, idx) => (
                            <>{7 <= idx && idx <= 10 &&
                            <AroundFacility keyword={keyword} key={idx+'2'}/>}</>
                        ))
                    }
                </View>
                <View style={{flexDirection: 'row'}}>
                    {
                        facilityData.map((keyword, idx) => (
                            <>{11 <= idx && idx <= 13 &&
                            <AroundFacility keyword={keyword} key={idx+'3'}/>}</>
                        ))
                    }
                </View>
                <View style={{flexDirection: 'row'}}>
                    {
                        facilityData.map((keyword, idx) => (
                            <>{14 <= idx  &&
                            <AroundFacility keyword={keyword} key={idx+'4'}/>}</>
                        ))
                    }
                </View></>
            }
        </View>
    );

    return (
        <ScreenContainer backgroundColor={colors.backgroundColor}>
            <NavigationTop navigation={navigation} title=""/>
            <ScrollView>
                <ScreenContainerView>
                    <View style={{marginTop: 18}}>
                        <View style={{justifyContent: 'space-between', marginBottom: 8}}>
                            <View style={{marginBottom: 37}}>
                                <View style={{flexDirection: 'row'}}>
                                    <AppText style={{...styles.placeName, color: colors.mainColor, fontWeight: '700'}}>{placeName}</AppText>
                                    <AppText style={{...styles.placeName, color: colors.mainColor, fontWeight: '400'}}>{isEndWithConsonant(placeName) ? '은' : '는'}</AppText>
                                </View>
                                <AppText style={{...styles.placeName, color: colors.mainColor, fontWeight: '400'}}>어떤 공간이었나요?</AppText>
                            </View>
                            <Rating
                                type='custom'
                                ratingCount={5}
                                imageSize={40}
                                startingValue={0}
                                fractions={0}
                                onFinishRating={getRating}
                                ratingColor={colors.mainColor}
                                tintColor={colors.backgroundColor}
                                ratingBackgroundColor={colors.gray[4]}
                            />
                        
                            {ratedScore !== 0 && <AppText style={{...styles.scoreText, color: colors.mainColor}}>{reviews[ratedScore-1]}</AppText>}
                        </View>
                    </View>
                </ScreenContainerView>
                <ScreenDivideLine />
                <ScreenContainerView>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View>
                            <AppText style={{...styles.reviewTitle, color: colors.mainColor}}>
                                { userData.user_nickname}님의 경험을
                            </AppText>
                            <AppText style={{...styles.reviewTitle, color: colors.mainColor}}>
                            조금 더 들려주세요 :)
                            </AppText>
                        </View>
                        <View style={{
                            ...styles.categoryBorder,
                            borderColor: colors.gray[6],
                            backgroundColor: colors.gray[6],
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <AppText style={{...styles.categoryText, color: colors.backgroundColor}}>선택</AppText>
                        </View>
                    </View>

                    <View style={{marginTop: 30}}>
                        <View style={{flexDirection: 'row', marginBottom: 26}}>
                            <View style={{width: '20%'}}>
                                <AppText style={{...styles.rateStandard, color: colors.mainColor}}>쾌적성</AppText>
                            </View>
                            <View style={{marginLeft: 80}}>
                                <Rating
                                    type='custom'
                                    ratingCount={5}
                                    imageSize={17}
                                    startingValue={0}
                                    fractions={0}
                                    style={{backgroundColor: colors.backgroundColor}}
                                    ratingColor={colors.mainColor}
                                    tintColor={colors.backgroundColor}
                                    ratingBackgroundColor={colors.gray[4]}
                                />
                            </View>
                        </View>

                        <View style={{flexDirection: 'row', marginBottom: 26}}>
                            <View style={{width: '20%'}}>
                                <AppText style={{...styles.rateStandard, color: colors.mainColor}}>접근성</AppText>
                            </View>
                            <View style={{marginLeft: 80}}>
                                <Rating
                                    type='custom'
                                    ratingCount={5}
                                    imageSize={17}
                                    startingValue={0}
                                    fractions={0}
                                    style={{backgroundColor: colors.backgroundColor}}
                                    ratingColor={colors.mainColor}
                                    tintColor={colors.backgroundColor}
                                    ratingBackgroundColor={colors.gray[4]}
                                />
                            </View>
                        </View>

                        <View style={{flexDirection: 'row', marginBottom: 26}}>
                            <View style={{width: '20%'}}>
                                <AppText style={{...styles.rateStandard, color: colors.mainColor}}>주변상권</AppText>
                            </View>
                            <View style={{marginLeft: 80}}>
                                <Rating
                                    type='custom'
                                    ratingCount={5}
                                    imageSize={17}
                                    startingValue={0}
                                    fractions={0}
                                    style={{backgroundColor: colors.backgroundColor}}
                                    ratingColor={colors.mainColor}
                                    tintColor={colors.backgroundColor}
                                    ratingBackgroundColor={colors.gray[4]}
                                />
                            </View>
                        </View>

                        <View style={{marginBottom: 26}}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <AppText style={{...styles.rateStandard, color: colors.mainColor}}>혼잡한 시간대</AppText>
                                <AppText style={{fontSize: 12, fontWeight: '400', lineHeight: 19.2, color: colors.gray[4], marginLeft: 8, marginTop: 2}}>복수선택가능</AppText>
                            </View>
                            {/* TODO 아이콘 추가 */}
                            <View style={{flexDirection: 'row', marginTop: 6}}>
                                {
                                    busyTimeData.map((keyword, idx) => (
                                        <BusyTime keyword={keyword} key={idx}/>
                                    ))
                                }
                            </View>
                        </View>

                        <View style={{marginBottom: 26}}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <AppText style={{...styles.rateStandard, color: colors.mainColor}}>주변시설</AppText>
                                <AppText style={{fontSize: 12, fontWeight: '400', lineHeight: 19.2, color: colors.gray[4], marginLeft: 8, marginTop: 2}}>복수선택가능</AppText>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 6}}>
                                <FacilityLineBreak />
                                <TouchableOpacity onPress={()=>setIsOpened(!isOpened)}>
                                    <View>
                                        { isOpened ?
                                            <Image source={require('../../assets/images/showWhole_forDir.png')}
                                                style={{
                                                    width: 15,
                                                    height: 15,
                                                    marginTop: 5,
                                                    transform: [{rotate: '180deg'}],
                                                }}></Image> :
                                            <Image source={require('../../assets/images/showWhole_forDir.png')}
                                                style={{
                                                    width: 15,
                                                    height: 15,
                                                }}></Image>
                                        }
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style={{marginBottom: 26}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 14}}>
                            <AppText style={{...styles.rateStandard, color: colors.mainColor}}>사진추가</AppText>
                            <AppText style={{fontSize: 12, fontWeight: '400', lineHeight: 19.2, color: colors.gray[4], marginLeft: 8, marginTop: 2}}>최대 5장</AppText>
                        </View>
                        <TouchableOpacity>
                            <View style={{...styles.addPicture, backgroundColor: colors.backgroundColor}}>
                                <Icon type="ionicon" name={'add-sharp'} size={20} color={colors.mainColor}></Icon>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScreenContainerView>
            </ScrollView>
            
            <ScreenContainerView>
                <TouchableOpacity
                    style={{
                        backgroundColor: ratedScore > 0 ? colors.mainColor : colors.gray[5],
                        height: 48,
                        borderRadius: 10,
                        bottom: 10,
                    }}
                    disabled={ratedScore > 0 ? false : true}
                >
                    <AppText
                        style={{
                            textAlign: 'center',
                            padding: 14,
                            fontSize: 16,
                            color: colors.defaultColor,
                            fontWeight: 'bold'
                        }}
                    >리뷰 등록하기</AppText>
                </TouchableOpacity>
            </ScreenContainerView>
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    categoryBorder: {
        borderWidth: 1,
        borderRadius: 14,
        height: 19,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    categoryText: {
        fontSize: 10,
        textAlign: 'center',
        textAlignVertical: 'center',
        paddingVertical: 2,
        paddingHorizontal: 8
    },
    reviewImage: {
        width: 56,
        height: 56,
        backgroundColor: '#c4c4c4',
        borderRadius: 50,
    },
    placeName: {
        fontSize: 22,
    },
    iconTabContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    location: {
        fontSize: 14,
        marginBottom: 1
    },
    scoreText: {
        fontSize: 12,
        fontWeight: '400',
        lineHeight: 19.2,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        marginTop: 15
    },
    reviewTitle: {
        fontSize: 20,
        fontWeight: '400',
        lineHeight: 32
    },
    rateStandard: {
        fontSize: 14,
        fontWeight: '700',
        lineHeight: 22.4
    },
    plusComplete: {
        marginBottom: '5%'
    },
    selectType: {
        borderWidth: 1,
        paddingVertical: 1,
        paddingHorizontal: 8.5,
        borderRadius: 12,
        marginRight: 10,
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        elevation: 1,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center'
    },
    selectTypeClicked: {
        borderWidth: 1,
        paddingVertical: 1,
        paddingHorizontal: 8.5,
        borderRadius: 12,
        marginRight: 10,
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        elevation: 1,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center'
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
        fontWeight: 'bold',
        marginVertical: 2
    },
    selectTypeIcon: {
        backgroundColor: 'rgb(141, 141, 141)',
        borderColor: 'black',
        borderWidth: 1,
        paddingVertical: 1,
        paddingHorizontal: 8.5,
        borderRadius: 12
    },
    selectTypeIconDetail: {
        paddingVertical: 1,
        borderRadius: 12
    },
    defaultImage: {
        backgroundColor: '#c4c4c4',
        width: 287,
        height: 243,
    },
    addPicture: {
        width: 128,
        height: 128,
        borderRadius: 10,
        shadowColor: 'rgba(203, 180, 180, 0.3)',
        shadowOffset: {width: 1, height: 2},
        shadowOpacity: 1,
        elevation: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default MakeReviewScreen;