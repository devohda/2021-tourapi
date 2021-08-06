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
// import {KakaoOAuthToken, KakaoProfile, login, logout} from '@react-native-seoul/kakao-login';


export default function MainPage({navigation}) {

    return (
        <SafeAreaView>
            <ScrollView>
                {Platform.OS !== 'android' &&
                <View style={{backgroundColor: "black", flexDirection: "row", justifyContent: "space-between"}}>
                    <View><Text style={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: 28,
                        left: 16,
                    }}>Here.</Text></View>
                    <TouchableOpacity onPress={() => navigation.navigate('search')}>
                        <View style={{flexDirection: 'row'}}>
                            <Icon type="ionicon"
                                  name={"md-search"}
                                  color="white"
                                  style={{marginEnd: 20}}
                                  size={28}>
                            </Icon>
                        </View>
                    </TouchableOpacity>
                </View>
                }

                <View>
                    <View style={styles.blackRect}>
                        <View>
                            <Text style={{
                                color: 'white',
                                left: 16,
                                top: 50,
                                fontSize: 24,
                                lineHeight: 36,
                                fontWeight: 'bold'
                            }}>
                                <Text>가장 인기있는{"\n"}</Text>
                                <Text>보관함</Text>
                            </Text>
                            <TouchableOpacity style={{top: 18, right: 100}}><Icon type="ionicon"
                                                                                  name={"chevron-forward-outline"}
                                                                                  color="white"
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
                                <Text style={{marginVertical: 8, fontSize: 16, fontWeight: 'bold'}}>하루만에 북촌
                                    정복하기</Text>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={{fontSize: 12, marginEnd: 65}}>meeeeensun</Text>
                                    <Icon type="ionicon" name={"eye"} size={12} color="#929292"
                                          style={{marginHorizontal: 3, marginVertical: 2}}></Icon>
                                    <Text style={{fontSize: 12, color: '#929292', fontWeight: 'bold'}}>1.3k</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{marginTop: 210}}>
                        <Text style={styles.titles}>요즘 뜨는 수집가</Text>
                        <View style={{flexDirection: 'row'}}>
                            <Image style={styles.authorImage}
                                   source={{uri: 'https://via.placeholder.com/150/92c952'}}></Image>
                            <Text style={styles.authorDesc}>
                                <Text style={{fontSize: 16, fontWeight: 'bold'}}>K-민선{"\n"}</Text>
                                {/* 애초에 data를 가져올때 #+'데이터' 형식으로 붙여서 가져오기 */}
                                <Text>
                                    <Text>#밝은</Text>
                                </Text>
                            </Text>
                        </View>
                    </View>
                    <View style={{marginTop: 45}}>
                        <Text style={styles.titles}>지역 추천</Text>
                        <View style={{flexDirection: 'row', paddingLeft: 28}}>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                {/* 보여주기 식으로 두개 dp 했을 뿐이고 실제론 하나로 돌릴 예정 */}
                                <ImageBackground source={{uri: 'https://via.placeholder.com/150/56a8c2'}}
                                                 style={styles.regionImage} imageStyle={{borderRadius: 15}}>
                                    <View style={styles.regionText}>
                                        <Text style={{fontSize: 16, fontWeight: 'bold', color: '#fff'}}>충청북도
                                            단양</Text>
                                    </View>
                                </ImageBackground>
                                <ImageBackground source={{uri: 'https://via.placeholder.com/150/1ee8a4'}}
                                                 style={styles.regionImage} imageStyle={{borderRadius: 15}}>
                                    <View style={styles.regionText}>
                                        <Text style={{fontSize: 16, fontWeight: 'bold', color: '#fff'}}>전라남도
                                            여수</Text>
                                    </View>
                                </ImageBackground>
                            </ScrollView>
                        </View>
                    </View>
                    <View style={{marginVertical: 45}}>
                        <Text style={styles.titles}>요즘 뜨는 공간</Text>

                        <TouchableOpacity onPress={() => navigation.navigate('place')}>
                            <View style={{flexDirection: 'row', paddingLeft: 28, marginTop: 20}}>
                                <Image source={{uri: 'https://via.placeholder.com/150/56acb2'}}
                                       style={{width: 150, height: 100, borderRadius: 15}}></Image>
                                <View style={{
                                    width: 25,
                                    height: 15,
                                    backgroundColor: 'black',
                                    borderRadius: 70,
                                    left: 18,
                                    top: 10
                                }}><Text style={{
                                    color: 'white',
                                    textAlign: 'center',
                                    fontSize: 10,
                                    fontWeight: 'bold'
                                }}>4.8</Text></View>
                                <View style={{flexDirection: 'row', top: 10, left: 22}}>
                                    <Icon type="ionicon" name={"star"} size={12}></Icon>
                                    <Icon type="ionicon" name={"star"} size={12}></Icon>
                                    <Icon type="ionicon" name={"star"} size={12}></Icon>
                                    <Icon type="ionicon" name={"star-half-outline"} size={12}></Icon>
                                    <Icon type="ionicon" name={"star-outline"} size={12}></Icon>
                                </View>
                                <Text style={{top: 40, right: 66}}>
                                    <Text style={{
                                        fontSize: 17,
                                        fontWeight: 'bold',
                                        flexDirection: 'column'
                                    }}>경복궁{"\n"}</Text>
                                    <Text></Text>
                                    <Text>서울시 종로구</Text>
                                </Text>

                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('place')}>
                            <View style={{flexDirection: 'row', paddingLeft: 28, marginTop: 20}}>
                                <Image source={{uri: 'https://via.placeholder.com/150/56acb2'}}
                                       style={{width: 150, height: 100, borderRadius: 15}}></Image>
                                <View style={{
                                    width: 25,
                                    height: 15,
                                    backgroundColor: 'black',
                                    borderRadius: 70,
                                    left: 18,
                                    top: 10
                                }}><Text style={{
                                    color: 'white',
                                    textAlign: 'center',
                                    fontSize: 10,
                                    fontWeight: 'bold'
                                }}>4.8</Text></View>
                                <View style={{flexDirection: 'row', top: 10, left: 22}}>
                                    <Icon type="ionicon" name={"star"} size={12}></Icon>
                                    <Icon type="ionicon" name={"star"} size={12}></Icon>
                                    <Icon type="ionicon" name={"star"} size={12}></Icon>
                                    <Icon type="ionicon" name={"star-half-outline"} size={12}></Icon>
                                    <Icon type="ionicon" name={"star-outline"} size={12}></Icon>
                                </View>
                                <Text style={{top: 40, right: 66}}>
                                    <Text style={{
                                        fontSize: 17,
                                        fontWeight: 'bold',
                                        flexDirection: 'column'
                                    }}>경복궁{"\n"}</Text>
                                    <Text></Text>
                                    <Text>서울시 종로구</Text>
                                </Text>

                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('place')}>
                            <View style={{flexDirection: 'row', paddingLeft: 28, marginTop: 20}}>
                                <Image source={{uri: 'https://via.placeholder.com/150/56acb2'}}
                                       style={{width: 150, height: 100, borderRadius: 15}}></Image>
                                <View style={{
                                    width: 25,
                                    height: 15,
                                    backgroundColor: 'black',
                                    borderRadius: 70,
                                    left: 18,
                                    top: 10
                                }}><Text style={{
                                    color: 'white',
                                    textAlign: 'center',
                                    fontSize: 10,
                                    fontWeight: 'bold'
                                }}>4.8</Text></View>
                                <View style={{flexDirection: 'row', top: 10, left: 22}}>
                                    <Icon type="ionicon" name={"star"} size={12}></Icon>
                                    <Icon type="ionicon" name={"star"} size={12}></Icon>
                                    <Icon type="ionicon" name={"star"} size={12}></Icon>
                                    <Icon type="ionicon" name={"star-half-outline"} size={12}></Icon>
                                    <Icon type="ionicon" name={"star-outline"} size={12}></Icon>
                                </View>
                                <Text style={{top: 40, right: 66}}>
                                    <Text style={{
                                        fontSize: 17,
                                        fontWeight: 'bold',
                                        flexDirection: 'column'
                                    }}>경복궁{"\n"}</Text>
                                    <Text></Text>
                                    <Text>서울시 종로구</Text>
                                </Text>

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
        backgroundColor: 'black',
        position: 'relative'
    },
    selectedRankings: {
        backgroundColor: 'black',
        borderBottomWidth: 1.5,
        borderBottomColor: '#fff0b4',
        paddingBottom: 2

    },
    notSelectedRankings: {
        backgroundColor: 'black',
    },
    selectedRankingsText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    notSelectedRankingsText: {
        color: '#fff',
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
        color: 'black',
        // marginTop: 60,
        fontSize: 22,
        left: 18,
        fontWeight: 'bold'
    },
    authorImage: {
        width: 65,
        height: 65,
        backgroundColor: '#c4c4c4',
        borderRadius: 50,
        marginTop: 20,
        left: 28
    },
    authorDesc: {
        marginTop: 28,
        left: 48
    },
    regionImage: {
        width: 300,
        height: 120,
        marginTop: 20,
        marginEnd: 28,
        borderRadius: 10
    },
    regionText: {
        position: 'absolute',
        bottom: 10,
        left: 16,

    }
});

