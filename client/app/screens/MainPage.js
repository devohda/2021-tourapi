import React from 'react';
import {
    Menu,
    Button,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
    SafeAreaView,
    ScrollView,
    ImageBackground,
    Platform
} from 'react-native';
import {Icon} from 'react-native-elements';
import {useIsUserData} from "../contexts/UserDataContextProvider";
// import {KakaoOAuthToken, KakaoProfile, login, logout} from '@react-native-seoul/kakao-login';


export default function MainPage({navigation}) {
    const [userData, setUserData] = useIsUserData()

    return (
        <SafeAreaView style={{backgroundColor: '#FCF6F5'}}>
            <ScrollView>
            <View style={{marginTop: 20, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
                <View><Text style={{color: '#7B9ACC', fontSize: 28, fontWeight: 'bold', marginLeft: 20}}>HERE</Text></View>
                <View>
                    <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                            <Icon type="ionicon"
                                  name={"md-search"}
                                  color="#7B9ACC"
                                  style={{marginEnd: 20}}
                                  size={28}>
                            </Icon>
                    </TouchableOpacity>
                </View>
            </View>
                {/* {Platform.OS !== 'android' &&
                <View style={{backgroundColor: "#FCF6F5", flexDirection: "row", justifyContent: "space-between"}}>
                    <View><Text style={{
                        color: '#7B9ACC',
                        fontWeight: 'bold',
                        fontSize: 28,
                        left: 16,
                    }}>Here.</Text></View>
                    <TouchableOpacity onPress={() => navigation.navigate('search')}>
                        <View style={{flexDirection: 'row'}}>
                            <Icon type="ionicon"
                                  name={"md-search"}
                                  color="#7B9ACC"
                                  style={{marginEnd: 20}}
                                  size={28}>
                            </Icon>
                        </View>
                    </TouchableOpacity>
                </View>
                } */}

                <View>
                    <View style={styles.blackRect}>
                        <View>
                            <Text style={{
                                color: '#7B9ACC',
                                left: 16,
                                top: 50,
                                fontSize: 24,
                                lineHeight: 36,
                            }}>
                                <Text style={{fontWeight:'bold'}}>가장 인기있는{"\n"}보관함</Text>
                            </Text>
                            <TouchableOpacity style={{top: 18, right: 100}}><Icon type="ionicon"
                                                                                  name={"chevron-forward-outline"}
                                                                                  color="#7B9ACC"
                                                                                  size={26}></Icon></TouchableOpacity>
                        </View>
                    </View>
                    <View style={{position: 'absolute'}}>
                        <View style={{flexDirection: 'row', left: 16, top: 145}}>
                            <View style={{paddingEnd: 42}}><TouchableOpacity style={styles.selectedRankings}><Text
                                style={styles.selectedRankingsText}>일간</Text></TouchableOpacity></View>
                            <View style={{paddingEnd: 42}}><TouchableOpacity
                                style={styles.notSelectedRankings}><Text
                                style={styles.notSelectedRankingsText}>주간</Text></TouchableOpacity></View>
                            <View style={{paddingEnd: 42}}><TouchableOpacity
                                style={styles.notSelectedRankings}><Text
                                style={styles.notSelectedRankingsText}>월간</Text></TouchableOpacity></View>
                        </View>
                        {/* 데이터 붙여서(for문?) 들어가게 */}
                        <View style={styles.rankingContainer}>
                            <View style={styles.defaultImage}></View>
                            <View style={{marginLeft: 10}}>
                                <Text style={{marginVertical: 8, fontSize: 16, fontWeight: 'bold', color: '#40516E'}}>하루만에 북촌
                                    정복하기</Text>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={{fontSize: 12, marginEnd: 85, color: '#BDC2CA'}}>meeeeensun</Text>
                                    <Text style={{fontSize: 12, color: '#BDC2CA'}}>1.3k</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{marginTop: 210}}>
                        <Text style={styles.titles}>요즘 뜨는 수집가</Text>
                        <View style={{flexDirection:'row', marginLeft: '2%'}}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            <View style={{alignItems: 'center'}}>
                                    <Image style={styles.authorImage}
                                        source={{uri: 'https://via.placeholder.com/150/92c952'}}></Image>
                                    <Text style={{fontSize: 16, fontWeight: 'bold', color: '#7B9ACC', marginTop: 10}}>K-민선</Text>
                        
                                <View style={{flexDirection: 'row'}}>
                                    {/* 애초에 data를 가져올때 #+'데이터' 형식으로 붙여서 가져오기 */}
                                    <View style={styles.keywordHashTagView}><Text style={styles.keywordHashTag}>#조용한</Text></View>
                                    <View style={styles.keywordHashTagView}><Text style={styles.keywordHashTag}>#따뜻한</Text></View>
                                </View>
                            </View>
                            <View style={{alignItems: 'center'}}>
                                    <Image style={styles.authorImage}
                                        source={{uri: 'https://via.placeholder.com/150/92c952'}}></Image>
                                    <Text style={{fontSize: 16, fontWeight: 'bold', color: '#7B9ACC', marginTop: 10}}>K-민선</Text>
                        
                                <View style={{flexDirection: 'row'}}>
                                    {/* 애초에 data를 가져올때 #+'데이터' 형식으로 붙여서 가져오기 */}
                                    <View style={styles.keywordHashTagView}><Text style={styles.keywordHashTag}>#조용한</Text></View>
                                    <View style={styles.keywordHashTagView}><Text style={styles.keywordHashTag}>#따뜻한</Text></View>
                                </View>
                            </View>
                            <View style={{alignItems: 'center'}}>
                                    <Image style={styles.authorImage}
                                        source={{uri: 'https://via.placeholder.com/150/92c952'}}></Image>
                                    <Text style={{fontSize: 16, fontWeight: 'bold', color: '#7B9ACC', marginTop: 10}}>K-민선</Text>
                        
                                <View style={{flexDirection: 'row'}}>
                                    {/* 애초에 data를 가져올때 #+'데이터' 형식으로 붙여서 가져오기 */}
                                    <View style={styles.keywordHashTagView}><Text style={styles.keywordHashTag}>#조용한</Text></View>
                                    <View style={styles.keywordHashTagView}><Text style={styles.keywordHashTag}>#따뜻한</Text></View>
                                </View>
                            </View>
                        </ScrollView>
                        </View>
                    </View>
                    
                    <View style={{marginTop: 45}}>
                        <Text style={styles.titles}>지역 추천</Text>
                        <View style={{flexDirection: 'row', marginLeft: '5%'}}>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                <ImageBackground source={{uri: 'https://via.placeholder.com/150/56a8c2'}}
                                                 style={styles.regionImage} imageStyle={{borderRadius: 15}}>
                                    <View style={styles.regionText}>
                                        <Text style={{fontSize: 16, fontWeight: 'bold', color: '#FCF6F5'}}>충청북도
                                            단양</Text>
                                        <Text numberOfLines={2} ellipsizeMode='tail' style={{fontSize: 12, marginTop: 7, color: '#FCF6F5'}}>추천하는 이유는 다음과 같습니다</Text>
                                    </View>
                                </ImageBackground>
                                <ImageBackground source={{uri: 'https://via.placeholder.com/150/1ee8a4'}}
                                                 style={styles.regionImage} imageStyle={{borderRadius: 15}}>
                                    <View style={styles.regionText}>
                                        <Text style={{fontSize: 16, fontWeight: 'bold', color: '#FCF6F5'}}>전라남도
                                            여수</Text>
                                        <Text numberOfLines={2} ellipsizeMode='tail' style={{fontSize: 12, marginTop: 7, color: '#FCF6F5'}}>추천하는 이유는 다음과 같습니다. 추천하는 이유는 다음과 같습니다</Text>
                                    </View>
                                </ImageBackground>
                            </ScrollView>
                        </View>
                    </View>
                    <View style={{marginVertical: 45}}>
                        <Text style={styles.titles}>요즘 뜨는 공간</Text>
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
                                        <Text style={{
                                            color: '#7B9ACC',
                                            textAlign: 'center',
                                            fontSize: 10,
                                            fontWeight: 'bold'
                                        }}>음식점</Text>
                                        <Text style={{marginHorizontal:8, color: '#BDC2CA', 
                                            textAlign: 'center',
                                            fontSize: 10,
                                            fontWeight: 'bold'}}>|</Text>
                                        <Image source={require('../assets/images/review_star.png')}
                                       style={{width: 10, height: 10, alignSelf:'center', marginTop: '1%'}}></Image>
                                        <Text style={{
                                            color: '#7B9ACC',
                                            textAlign: 'center',
                                            fontSize: 10,
                                            fontWeight: 'bold',
                                            marginLeft: 2
                                        }}>4.8</Text>
                                    </View>
                                    <Text style={{
                                        fontSize: 16,
                                        fontWeight: 'bold',
                                        color: '#7B9ACC',
                                        marginVertical: 3
                                    }}>경복궁</Text>
                                    <Text style={{fontSize: 12,color:'#BDC2CA'}}>서울시 종로구</Text>
                                </View>
                                <View style={{justifyContent:'center', marginLeft:'45%'}}>
                                    <Image source={require('../assets/images/here_nonclick.png')}></Image>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Place')}>
                        <View style={{flexDirection: 'row', marginLeft: '5%', marginTop: '5%'}}>
                                <Image source={{uri: 'https://via.placeholder.com/150/56acb2'}}
                                       style={{width: 72, height: 72, borderRadius: 15}}></Image>
                                <View style={{marginLeft: 8, marginTop: '2%'}}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={{
                                            color: '#7B9ACC',
                                            textAlign: 'center',
                                            fontSize: 10,
                                            fontWeight: 'bold'
                                        }}>음식점</Text>
                                        <Text style={{marginHorizontal:8, color: '#BDC2CA', 
                                            textAlign: 'center',
                                            fontSize: 10,
                                            fontWeight: 'bold'}}>|</Text>
                                        <Image source={require('../assets/images/review_star.png')}
                                       style={{width: 10, height: 10, alignSelf:'center', marginTop: '1%'}}></Image>
                                        <Text style={{
                                            color: '#7B9ACC',
                                            textAlign: 'center',
                                            fontSize: 10,
                                            fontWeight: 'bold',
                                            marginLeft: 2
                                        }}>4.8</Text>
                                    </View>
                                    <Text style={{
                                        fontSize: 16,
                                        fontWeight: 'bold',
                                        color: '#7B9ACC',
                                        marginVertical: 3
                                    }}>경복궁</Text>
                                    <Text style={{fontSize: 12,color:'#BDC2CA'}}>서울시 종로구</Text>
                                </View>
                                <View style={{justifyContent:'center', marginLeft:'45%'}}>
                                    <Image source={require('../assets/images/here_nonclick.png')}></Image>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Place')}>
                        <View style={{flexDirection: 'row', marginLeft: '5%', marginTop: '5%'}}>
                                <Image source={{uri: 'https://via.placeholder.com/150/56acb2'}}
                                       style={{width: 72, height: 72, borderRadius: 15}}></Image>
                                <View style={{marginLeft: 8, marginTop: '2%'}}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={{
                                            color: '#7B9ACC',
                                            textAlign: 'center',
                                            fontSize: 10,
                                            fontWeight: 'bold'
                                        }}>음식점</Text>
                                        <Text style={{marginHorizontal:8, color: '#BDC2CA', 
                                            textAlign: 'center',
                                            fontSize: 10,
                                            fontWeight: 'bold'}}>|</Text>
                                        <Image source={require('../assets/images/review_star.png')}
                                       style={{width: 10, height: 10, alignSelf:'center', marginTop: '1%'}}></Image>
                                        <Text style={{
                                            color: '#7B9ACC',
                                            textAlign: 'center',
                                            fontSize: 10,
                                            fontWeight: 'bold',
                                            marginLeft: 2
                                        }}>4.8</Text>
                                    </View>
                                    <Text style={{
                                        fontSize: 16,
                                        fontWeight: 'bold',
                                        color: '#7B9ACC',
                                        marginVertical: 3
                                    }}>경복궁</Text>
                                    <Text style={{fontSize: 12,color:'#BDC2CA'}}>서울시 종로구</Text>
                                </View>
                                <View style={{justifyContent:'center', marginLeft:'45%'}}>
                                    <Image source={require('../assets/images/here_click.png')}></Image>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    blackRect: {
        height: 306,
        backgroundColor: '#FCF6F5',
        position: 'relative'
    },
    selectedRankings: {
        borderBottomWidth: 1.5,
        borderBottomColor: '#F07A7A',
        paddingBottom: 2

    },
    notSelectedRankings: {
    },
    selectedRankingsText: {
        color: '#7B9ACC',
        fontSize: 16,
        fontWeight: 'bold'
    },
    notSelectedRankingsText: {
        color: '#7B9ACC',
        fontSize: 16
    },
    rankingContainer: {
        backgroundColor: 'white',
        width: 197,
        height: 282,
        top: 166,
        left: 16,
        borderRadius: 10,
        shadowOffset: {
            width: 4,
            height: 12
        },
        shadowOpacity: 0.25,
        elevation: 6,
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
        color: '#7B9ACC',
        // marginTop: 60,
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
        backgroundColor: '#fff', borderWidth: 1, borderColor: '#EBEBEB', borderRadius: 27, paddingVertical: 5, paddingHorizontal: 10,
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

