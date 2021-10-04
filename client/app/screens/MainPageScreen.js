import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Image,
    ScrollView,
    ImageBackground, Platform,
} from 'react-native';
import { useTheme, useIsFocused } from '@react-navigation/native';
import { Icon } from 'react-native-elements';

import AppText from '../components/AppText';
import ScreenContainer from '../components/ScreenContainer';
import ScreenContainerView from '../components/ScreenContainerView';
import { useToken } from '../contexts/TokenContextProvider';

import Jewel from '../assets/images/jewel.svg';
import DefaultProfile from '../assets/images/profile_default.svg';

export default function MainPageScreen({navigation}) {
    const {colors} = useTheme();
    const [ popularUser, setPopularUser] = useState([]);
    const [token, setToken] = useToken();
    const isFocused = useIsFocused();

    useEffect(() => {
        getPopularUserData();
    }, [isFocused]);

    const getPopularUserData = () => {
        try {
            fetch('http://34.64.185.40/user/list?popular=true', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
            }).then((res) => res.json())
                .then(async (response) => {
                    if(response.code === 401 || response.code === 403 || response.code === 419){
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }
                    setPopularUser(response.data);
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };


    const [backgroundColor, setBackgroundColor] = useState(colors.red[3]);

    const setBGColor = (idx) => {
        if (idx === 0 || idx === 2) {
            return colors.red[3];
        } else if (idx === 1 || idx === 6) {
            return '#FFC36A';
        } else if (idx === 3 || idx === 8) {
            return '#639A94';
        } else if (idx === 4 || idx === 5) {
            return colors.blue[2];
        } else {
            return '#8F6DA4';
        }
    }

    const ShowPopularUser = props => {
        const { user_nickname } = props.data;
        const { keyword, idx } = props;

        return (
            <View style={{alignItems: 'center'}}>
                <View style={{...styles.authorImage, backgroundColor: setBGColor(idx)}}>
                    <DefaultProfile width={75} height={75}/>
                </View>
                <AppText style={{
                    fontSize: 14,
                    fontWeight: '700',
                    color: colors.mainColor,
                    marginTop: 8
                }}>{user_nickname}</AppText>
                {
                    keyword.length !== 0 &&
                    <View style={{flexDirection: 'row', marginTop: 4}}>{
                        keyword.map((data, idx) => (
                            <UserKeyword data={data} key={idx+'user'}/>
                        ))
                    }</View>
                }
            </View>
        )
    }

    const UserKeyword = props => {
        const { data } = props;
        return (
            <View
                style={{
                    ...styles.keywordHashTagView,
                    backgroundColor: colors.backgroundColor,
                    borderColor: colors.backgroundColor,
            }}><AppText
                style={{...styles.keywordHashTag, color: colors.gray[4]}}>#{data}</AppText></View>
        )
    }

    return (
        <ScreenContainer backgroundColor={colors.backgroundColor}>
            <View flexDirection="row" style={{
                height: 24,
                marginBottom: 20,
                marginTop: Platform.OS === 'android' ? 20 : 10,
                marginHorizontal: 20,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <View style={{position: 'absolute', left: 0}}>
                    <AppText style={{
                        color: colors.mainColor,
                        fontSize: 28,
                        fontWeight: '700',
                        lineHeight: 41.44
                    }}>Here.</AppText>
                </View>
                <View style={{position: 'absolute', right: 0}}>
                    <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                        <Icon
                            type="ionicon"
                            name={'md-search'}
                            color={colors.mainColor}
                            size={28}>
                        </Icon>
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView>
                <ScreenContainerView>
                    <View>
                        <View style={{marginTop: 31}}>
                            <AppText style={{
                                color: colors.mainColor,
                                fontSize: 24,
                                lineHeight: 36,
                                fontWeight: '700'
                            }}>가장 인기있는</AppText>
                            <View style={{flexDirection: 'row'}}>
                                <AppText style={{
                                    color: colors.mainColor,
                                    fontSize: 24,
                                    lineHeight: 36,
                                    fontWeight: '700'
                                }}>보관함</AppText>
                                <TouchableOpacity style={Platform.OS === 'ios' ? {marginTop: 5} : {marginTop: 4}}><Icon
                                    type="ionicon"
                                    name={'chevron-forward-outline'}
                                    color={colors.mainColor}
                                    size={26}></Icon></TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View>
                        <View style={{flexDirection: 'row', marginTop: 28}}>
                            <View style={{paddingEnd: 42}}><TouchableOpacity
                                style={[styles.selectedRankings, {borderBottomColor: colors.red[3]}]}><AppText
                                    style={{
                                        ...styles.selectedRankingsText,
                                        color: colors.mainColor
                                    }}>일간</AppText></TouchableOpacity></View>
                            <View style={{paddingEnd: 42}}><TouchableOpacity
                                style={styles.notSelectedRankings}><AppText
                                    style={{
                                        ...styles.selectedRankingsText,
                                        color: colors.gray[6]
                                    }}>주간</AppText></TouchableOpacity></View>
                            <View style={{paddingEnd: 42}}><TouchableOpacity
                                style={styles.notSelectedRankings}><AppText
                                    style={{
                                        ...styles.selectedRankingsText,
                                        color: colors.gray[6]
                                    }}>월간</AppText></TouchableOpacity></View>
                        </View>
                        <View style={styles.rankingContainer}>
                            <View style={styles.defaultImage}></View>
                            <View style={{marginLeft: 10}}>
                                <AppText style={{
                                    marginVertical: 8,
                                    fontSize: 16,
                                    fontWeight: '700',
                                    color: colors.blue[1]
                                }}>하루만에 북촌
                                    정복하기</AppText>
                                <View style={{flexDirection: 'row'}}>
                                    <AppText style={{
                                        fontSize: 12,
                                        marginEnd: 85,
                                        color: colors.gray[4]
                                    }}>meeeeensun</AppText>
                                    <AppText style={{fontSize: 12, color: colors.gray[4]}}>1.3k</AppText>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{marginTop: 48}}>
                        <AppText style={{...styles.titles, color: colors.mainColor}}>요즘 뜨는 수집가</AppText>
                        <View style={{flexDirection: 'row'}}>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                {
                                    popularUser.map((data, idx) => {
                                        return (
                                        <ShowPopularUser data={data} key={idx} idx={idx} keyword={data.keywords}/>)
                                    })
                                }
                            </ScrollView>
                        </View>
                    </View>

                    <View style={{marginTop: 38}}>
                        <AppText style={{...styles.titles, color: colors.mainColor}}>지역추천</AppText>
                        <View style={{flexDirection: 'row', marginTop: 18}}>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                <ImageBackground source={{uri: 'https://via.placeholder.com/150/56a8c2'}}
                                    style={styles.regionImage} imageStyle={{borderRadius: 15}}>
                                    <View style={styles.regionText}>
                                        <AppText
                                            style={{fontSize: 16, fontWeight: '700', color: colors.backgroundColor}}>충청북도
                                            단양</AppText>
                                        <AppText numberOfLines={2} ellipsizeMode='tail'
                                            style={{fontSize: 12, marginTop: 7, color: colors.backgroundColor}}>추천하는
                                            이유는 다음과 같습니다</AppText>
                                    </View>
                                </ImageBackground>
                                <ImageBackground source={{uri: 'https://via.placeholder.com/150/1ee8a4'}}
                                    style={styles.regionImage} imageStyle={{borderRadius: 15}}>
                                    <View style={styles.regionText}>
                                        <AppText
                                            style={{fontSize: 16, fontWeight: '700', color: colors.backgroundColor}}>전라남도
                                            여수</AppText>
                                        <AppText numberOfLines={2} ellipsizeMode='tail'
                                            style={{fontSize: 12, marginTop: 7, color: colors.backgroundColor}}>추천하는
                                            이유는 다음과 같습니다. 추천하는 이유는 다음과 같습니다</AppText>
                                    </View>
                                </ImageBackground>
                            </ScrollView>
                        </View>
                    </View>
                    <View style={{marginTop: 45, marginBottom: 72}}>
                        <AppText style={{...styles.titles, color: colors.mainColor}}>요즘 뜨는 공간</AppText>
                        <TouchableOpacity onPress={() => navigation.navigate('Place')}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 14}}>
                                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                    <Image source={{uri: 'https://via.placeholder.com/150/56acb2'}}
                                        style={{width: 72, height: 72, borderRadius: 15}}></Image>
                                    <View style={{marginLeft: 8}}>
                                        <View style={{flexDirection: 'row'}}>
                                            <AppText style={{
                                                color: colors.gray[3],
                                                textAlign: 'center',
                                                fontSize: 10,
                                                fontWeight: '700'
                                            }}>음식점</AppText>
                                            <AppText style={{
                                                marginHorizontal: 8, color: colors.gray[4],
                                                textAlign: 'center',
                                                fontSize: 10,
                                                fontWeight: '700'
                                            }}>|</AppText>
                                            <Image source={require('../assets/images/review_star.png')}
                                                style={{
                                                    width: 10,
                                                    height: 10,
                                                    alignSelf: 'center',
                                                }}></Image>
                                            <AppText style={{
                                                color: colors.gray[3],
                                                textAlign: 'center',
                                                fontSize: 10,
                                                fontWeight: '700',
                                                marginLeft: 2
                                            }}>4.8</AppText>
                                        </View>
                                        <AppText style={{
                                            fontSize: 16,
                                            fontWeight: '700',
                                            color: colors.mainColor,
                                            marginVertical: 3
                                        }}>경복궁</AppText>
                                        <AppText style={{fontSize: 12, color: colors.gray[4]}}>서울시 종로구</AppText>
                                    </View>
                                </View>
                                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                    <View style={{justifyContent: 'center'}}>
                                    <Jewel width={26} height={21}
                                            style={{color: colors.red_gray[5]}}/>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Place')}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 18}}>
                                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                    <Image source={{uri: 'https://via.placeholder.com/150/56acb2'}}
                                        style={{width: 72, height: 72, borderRadius: 15}}></Image>
                                    <View style={{marginLeft: 8}}>
                                        <View style={{flexDirection: 'row'}}>
                                            <AppText style={{
                                                color: colors.gray[3],
                                                textAlign: 'center',
                                                fontSize: 10,
                                                fontWeight: '700'
                                            }}>음식점</AppText>
                                            <AppText style={{
                                                marginHorizontal: 8, color: colors.gray[4],
                                                textAlign: 'center',
                                                fontSize: 10,
                                                fontWeight: '700'
                                            }}>|</AppText>
                                            <Image source={require('../assets/images/review_star.png')}
                                                style={{
                                                    width: 10,
                                                    height: 10,
                                                    alignSelf: 'center',
                                                }}></Image>
                                            <AppText style={{
                                                color: colors.gray[3],
                                                textAlign: 'center',
                                                fontSize: 10,
                                                fontWeight: '700',
                                                marginLeft: 2
                                            }}>4.8</AppText>
                                        </View>
                                        <AppText style={{
                                            fontSize: 16,
                                            fontWeight: '700',
                                            color: colors.mainColor,
                                            marginVertical: 3
                                        }}>경복궁</AppText>
                                        <AppText style={{fontSize: 12, color: colors.gray[4]}}>서울시 종로구</AppText>
                                    </View>
                                </View>
                                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                    <View style={{justifyContent: 'center'}}>
                                    <Jewel width={26} height={21}
                                            style={{color: colors.red[3]}}/>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScreenContainerView>
            </ScrollView>
        </ScreenContainer>
    );
}


const styles = StyleSheet.create({
    selectedRankings: {
        borderBottomWidth: 1.5,
        paddingBottom: 2

    },
    notSelectedRankings: {},
    selectedRankingsText: {
        fontSize: 16,
        fontWeight: '700'
    },
    rankingContainer: {
        backgroundColor: 'white',
        width: 197,
        height: 282,
        marginTop: 10,
        borderRadius: 10,
        shadowOffset: {
            width: 8,
            height: 8
        },
        shadowOpacity: 0.25,
        elevation: 3,
        shadowColor: 'rgba(132, 92, 92, 0.14)',
    },
    defaultImage: {
        backgroundColor: '#c4c4c4',
        width: 197,
        height: 215,
        borderRadius: 10,
        borderBottomStartRadius: 0,
        borderBottomEndRadius: 0
    },
    titles: {
        fontSize: 22,
        fontWeight: '700'
    },
    authorImage: {
        width: 88,
        height: 88,
        borderRadius: 50,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 21,
    },
    authorDesc: {
        marginTop: 10
    },
    keywordHashTagView: {
        borderWidth: 1,
        borderRadius: 27,
        paddingHorizontal: 7,
        marginLeft: 5,
    },
    keywordHashTag: {
        elevation: 1,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 12
    },
    regionImage: {
        width: 237,
        height: 163,
        marginEnd: 20,
        borderRadius: 10,
        paddingHorizontal: 10
    },
    regionText: {
        position: 'absolute',
        bottom: 10,
        marginLeft: 16,
    }
});

