import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Image,
    ScrollView,
    ImageBackground, Platform,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {Icon} from 'react-native-elements';
import AppText from '../components/AppText';
import ScreenContainer from '../components/ScreenContainer';

export default function MainPageScreen({navigation}) {
    const {colors} = useTheme();

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
                        fontWeight: 'bold',
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
                <View>
                    <View style={styles.blackRect}>
                        <View>
                            <AppText style={{
                                color: colors.mainColor,
                                left: 16,
                                top: 40,
                                fontSize: 24,
                                lineHeight: 36,
                                fontWeight: 'bold'
                            }}>가장 인기있는</AppText>
                            <View style={{flexDirection: 'row'}}>
                                <AppText style={{
                                    color: colors.mainColor,
                                    left: 16,
                                    top: 40,
                                    fontSize: 24,
                                    lineHeight: 36,
                                    fontWeight: 'bold'
                                }}>보관함</AppText>
                                <TouchableOpacity style={{top: 44.5, left: 16}}><Icon
                                    type="ionicon"
                                    name={'chevron-forward-outline'}
                                    color={colors.mainColor}
                                    size={26}></Icon></TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={{position: 'absolute'}}>
                        <View style={{flexDirection: 'row', left: 16, top: 145}}>
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
                        {/* 데이터 붙여서(for문?) 들어가게 */}
                        <View style={styles.rankingContainer}>
                            <View style={styles.defaultImage}></View>
                            <View style={{marginLeft: 10}}>
                                <AppText style={{
                                    marginVertical: 8,
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    color: colors.mainColor
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
                    <View style={{marginTop: 210}}>
                        <AppText style={{...styles.titles, color: colors.mainColor}}>요즘 뜨는 수집가</AppText>
                        <View style={{flexDirection: 'row', marginLeft: '2%'}}>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                <View style={{alignItems: 'center'}}>
                                    <Image style={styles.authorImage}
                                        source={{uri: 'https://via.placeholder.com/150/92c952'}}></Image>
                                    <AppText style={{
                                        fontSize: 16,
                                        fontWeight: 'bold',
                                        color: colors.mainColor,
                                        marginTop: 10
                                    }}>K-민선</AppText>

                                    <View style={{flexDirection: 'row'}}>
                                        {/* 애초에 data를 가져올때 #+'데이터' 형식으로 붙여서 가져오기 */}
                                        <View
                                            style={{
                                                ...styles.keywordHashTagView,
                                                backgroundColor: colors.defaultColor
                                            }}><AppText
                                                style={styles.keywordHashTag}>#조용한</AppText></View>
                                        <View
                                            style={{
                                                ...styles.keywordHashTagView,
                                                backgroundColor: colors.defaultColor
                                            }}><AppText
                                                style={styles.keywordHashTag}>#따뜻한</AppText></View>
                                    </View>
                                </View>
                                <View style={{alignItems: 'center'}}>
                                    <Image style={styles.authorImage}
                                        source={{uri: 'https://via.placeholder.com/150/92c952'}}></Image>
                                    <AppText style={{
                                        fontSize: 16,
                                        fontWeight: 'bold',
                                        color: colors.mainColor,
                                        marginTop: 10
                                    }}>K-민선</AppText>

                                    <View style={{flexDirection: 'row'}}>
                                        {/* 애초에 data를 가져올때 #+'데이터' 형식으로 붙여서 가져오기 */}
                                        <View style={{
                                            ...styles.keywordHashTagView,
                                            backgroundColor: colors.defaultColor
                                        }}><AppText style={styles.keywordHashTag}>#조용한</AppText></View>
                                        <View style={{
                                            ...styles.keywordHashTagView,
                                            backgroundColor: colors.defaultColor
                                        }}><AppText style={styles.keywordHashTag}>#따뜻한</AppText></View>
                                    </View>
                                </View>
                                <View style={{alignItems: 'center'}}>
                                    <Image style={styles.authorImage}
                                        source={{uri: 'https://via.placeholder.com/150/92c952'}}></Image>
                                    <AppText style={{
                                        fontSize: 16,
                                        fontWeight: 'bold',
                                        color: colors.mainColor,
                                        marginTop: 10
                                    }}>K-민선</AppText>

                                    <View style={{flexDirection: 'row'}}>
                                        {/* 애초에 data를 가져올때 #+'데이터' 형식으로 붙여서 가져오기 */}
                                        <View style={{
                                            ...styles.keywordHashTagView,
                                            backgroundColor: colors.defaultColor
                                        }}><AppText style={styles.keywordHashTag}>#조용한</AppText></View>
                                        <View style={{
                                            ...styles.keywordHashTagView,
                                            backgroundColor: colors.defaultColor
                                        }}><AppText style={styles.keywordHashTag}>#따뜻한</AppText></View>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    </View>

                    <View style={{marginTop: 45}}>
                        <AppText style={{...styles.titles, color: colors.mainColor}}>지역 추천</AppText>
                        <View style={{flexDirection: 'row', marginLeft: '5%'}}>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                <ImageBackground source={{uri: 'https://via.placeholder.com/150/56a8c2'}}
                                    style={styles.regionImage} imageStyle={{borderRadius: 15}}>
                                    <View style={styles.regionText}>
                                        <AppText
                                            style={{fontSize: 16, fontWeight: 'bold', color: colors.backgroundColor}}>충청북도
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
                                            style={{fontSize: 16, fontWeight: 'bold', color: colors.backgroundColor}}>전라남도
                                            여수</AppText>
                                        <AppText numberOfLines={2} ellipsizeMode='tail'
                                            style={{fontSize: 12, marginTop: 7, color: colors.backgroundColor}}>추천하는
                                            이유는 다음과 같습니다. 추천하는 이유는 다음과 같습니다</AppText>
                                    </View>
                                </ImageBackground>
                            </ScrollView>
                        </View>
                    </View>
                    <View style={{marginVertical: 45}}>
                        <AppText style={{...styles.titles, color: colors.mainColor}}>요즘 뜨는 공간</AppText>
                        <TouchableOpacity onPress={() => navigation.navigate('Place')}>
                            <View style={{flexDirection: 'row', marginLeft: '5%', marginTop: '5%'}}>
                                <Image source={{uri: 'https://via.placeholder.com/150/56acb2'}}
                                    style={{width: 72, height: 72, borderRadius: 15}}></Image>
                                {/* <View style={{flexDirection: 'row', top: 10, left: 22}}>
                                    <Icon type="ionicon" name={"star"} size={12}></Icon>
                                    <Icon type="ionicon" name={"star"} size={12}></Icon>
                                    <Icon type="ionicon" name={"star"} size={12}></Icon>
                                    <Icon type="ionicon" name={"star-half-outline"} size={12}></Icon>
                                    <Icon type="ionicon" name={"star-outline"} size={12}></Icon>
                                </View> */}
                                <View style={{marginLeft: 8, marginTop: '2%'}}>
                                    <View style={{flexDirection: 'row'}}>
                                        <AppText style={{
                                            color: colors.gray[3],
                                            textAlign: 'center',
                                            fontSize: 10,
                                            fontWeight: 'bold'
                                        }}>음식점</AppText>
                                        <AppText style={{
                                            marginHorizontal: 8, color: colors.gray[7],
                                            textAlign: 'center',
                                            fontSize: 10,
                                            fontWeight: 'bold'
                                        }}>|</AppText>
                                        <Image source={require('../assets/images/review_star.png')}
                                            style={{
                                                width: 10,
                                                height: 10,
                                                alignSelf: 'center',
                                                marginTop: '1%'
                                            }}></Image>
                                        <AppText style={{
                                            color: colors.gray[3],
                                            textAlign: 'center',
                                            fontSize: 10,
                                            fontWeight: 'bold',
                                            marginLeft: 2
                                        }}>4.8</AppText>
                                    </View>
                                    <AppText style={{
                                        fontSize: 16,
                                        fontWeight: 'bold',
                                        color: colors.mainColor,
                                        marginVertical: 3
                                    }}>경복궁</AppText>
                                    <AppText style={{fontSize: 12, color: colors.gray[4]}}>서울시 종로구</AppText>
                                </View>
                                <View style={{justifyContent: 'center', marginLeft: '45%'}}>
                                    <Image source={require('../assets/images/here_nonclick.png')}
                                        style={{width: 26, height: 21}}></Image>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Place')}>
                            <View style={{flexDirection: 'row', marginLeft: '5%', marginTop: '5%'}}>
                                <Image source={{uri: 'https://via.placeholder.com/150/56acb2'}}
                                    style={{width: 72, height: 72, borderRadius: 15}}></Image>
                                {/* <View style={{flexDirection: 'row', top: 10, left: 22}}>
                                    <Icon type="ionicon" name={"star"} size={12}></Icon>
                                    <Icon type="ionicon" name={"star"} size={12}></Icon>
                                    <Icon type="ionicon" name={"star"} size={12}></Icon>
                                    <Icon type="ionicon" name={"star-half-outline"} size={12}></Icon>
                                    <Icon type="ionicon" name={"star-outline"} size={12}></Icon>
                                </View> */}
                                <View style={{marginLeft: 8, marginTop: '2%'}}>
                                    <View style={{flexDirection: 'row'}}>
                                        <AppText style={{
                                            color: colors.gray[3],
                                            textAlign: 'center',
                                            fontSize: 10,
                                            fontWeight: 'bold'
                                        }}>음식점</AppText>
                                        <AppText style={{
                                            marginHorizontal: 8, color: colors.gray[7],
                                            textAlign: 'center',
                                            fontSize: 10,
                                            fontWeight: 'bold'
                                        }}>|</AppText>
                                        <Image source={require('../assets/images/review_star.png')}
                                            style={{
                                                width: 10,
                                                height: 10,
                                                alignSelf: 'center',
                                                marginTop: '1%'
                                            }}></Image>
                                        <AppText style={{
                                            color: colors.gray[3],
                                            textAlign: 'center',
                                            fontSize: 10,
                                            fontWeight: 'bold',
                                            marginLeft: 2
                                        }}>4.8</AppText>
                                    </View>
                                    <AppText style={{
                                        fontSize: 16,
                                        fontWeight: 'bold',
                                        color: colors.mainColor,
                                        marginVertical: 3
                                    }}>경복궁</AppText>
                                    <AppText style={{fontSize: 12, color: colors.gray[4]}}>서울시 종로구</AppText>
                                </View>
                                <View style={{justifyContent: 'center', marginLeft: '45%'}}>
                                    <Image source={require('../assets/images/here_nonclick.png')}
                                        style={{width: 26, height: 21}}></Image>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Place')}>
                            <View style={{flexDirection: 'row', marginLeft: '5%', marginTop: '5%'}}>
                                <Image source={{uri: 'https://via.placeholder.com/150/56acb2'}}
                                    style={{width: 72, height: 72, borderRadius: 15}}></Image>
                                {/* <View style={{flexDirection: 'row', top: 10, left: 22}}>
                                    <Icon type="ionicon" name={"star"} size={12}></Icon>
                                    <Icon type="ionicon" name={"star"} size={12}></Icon>
                                    <Icon type="ionicon" name={"star"} size={12}></Icon>
                                    <Icon type="ionicon" name={"star-half-outline"} size={12}></Icon>
                                    <Icon type="ionicon" name={"star-outline"} size={12}></Icon>
                                </View> */}
                                <View style={{marginLeft: 8, marginTop: '2%'}}>
                                    <View style={{flexDirection: 'row'}}>
                                        <AppText style={{
                                            color: colors.gray[3],
                                            textAlign: 'center',
                                            fontSize: 10,
                                            fontWeight: 'bold'
                                        }}>음식점</AppText>
                                        <AppText style={{
                                            marginHorizontal: 8, color: colors.gray[7],
                                            textAlign: 'center',
                                            fontSize: 10,
                                            fontWeight: 'bold'
                                        }}>|</AppText>
                                        <Image source={require('../assets/images/review_star.png')}
                                            style={{
                                                width: 10,
                                                height: 10,
                                                alignSelf: 'center',
                                                marginTop: '1%'
                                            }}></Image>
                                        <AppText style={{
                                            color: colors.gray[3],
                                            textAlign: 'center',
                                            fontSize: 10,
                                            fontWeight: 'bold',
                                            marginLeft: 2
                                        }}>4.8</AppText>
                                    </View>
                                    <AppText style={{
                                        fontSize: 16,
                                        fontWeight: 'bold',
                                        color: colors.mainColor,
                                        marginVertical: 3
                                    }}>경복궁</AppText>
                                    <AppText style={{fontSize: 12, color: colors.gray[4]}}>서울시 종로구</AppText>
                                </View>
                                <View style={{justifyContent: 'center', marginLeft: '45%'}}>
                                    <Image source={require('../assets/images/here_click.png')}
                                        style={{width: 26, height: 21}}></Image>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </ScreenContainer>
    );
}


const styles = StyleSheet.create({
    blackRect: {
        height: 306,
    },
    selectedRankings: {
        borderBottomWidth: 1.5,
        paddingBottom: 2

    },
    notSelectedRankings: {},
    selectedRankingsText: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    rankingContainer: {
        backgroundColor: 'white',
        width: 197,
        height: 282,
        top: 166,
        left: 16,
        borderRadius: 10,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        elevation: 3,
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
        marginLeft: '5%',
        fontWeight: 'bold'
    },
    authorImage: {
        width: 88,
        height: 88,
        backgroundColor: '#c4c4c4',
        borderRadius: 50,
        marginTop: 20,
        // left: 28
    },
    authorDesc: {
        marginTop: 10,
        // left: 50
    },
    keywordHashTagView: {
        color: '#BDC2CA',
        borderWidth: 1, borderColor: '#EBEBEB', borderRadius: 27, paddingVertical: 5, paddingHorizontal: 10,
        shadowColor: 'rgba(0,0,0,0.11)',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        elevation: 1,
        marginLeft: 5,
        marginTop: 5
    },
    keywordHashTag: {
        color: '#BDC2CA',
        elevation: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    regionImage: {
        width: 237,
        height: 163,
        marginTop: 20,
        marginEnd: 28,
        borderRadius: 10,
        paddingHorizontal: 10
    },
    regionText: {
        position: 'absolute',
        bottom: 10,
        left: 16,

    }
});

