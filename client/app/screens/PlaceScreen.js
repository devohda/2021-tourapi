import React, { useEffect, useState } from "react";
import {View, Text, ScrollView, Image, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, Share, Platform, Linking} from "react-native";
import styled, {css} from 'styled-components/native';
import {useTheme} from '@react-navigation/native';
import { Icon } from "react-native-elements";
import MapView, { Marker } from 'react-native-maps';
// import Share from 'react-native-share';
import RNStoryShare from 'react-native-story-share';

import ScreenContainer from "../components/ScreenContainer";
import Star from "../components/Star";
import StarScore from '../components/StarScore';
import NavigationTop from "../components/NavigationTop";

// styled component 사용해봤음.
const Line = styled(View)`
  width: 100%;
  height: 8px;
  backgroundColor: #DCDCDC;
  zIndex: -1000;
`

const Score = (props) => {
    return (
        // <View flexDirection="row" style={{marginVertical: 8, alignItems: 'center'}}>
        <View style={{marginVertical: 8, alignItems: 'center'}}>
            <View width={70}>
                <Text style={{
                    fontWeight: 'bold',
                    fontSize: props.fontSize,
                    color: props.color,
                    textAlign: props.textAlign,
                    marginBottom: props.marginBottom,
                    color: props.textColor,
                }}>{props.name}</Text>
            </View>
            {props.children}
        </View>
    )
}

const Time = (props) => {
    return (
        <View style={{
            borderColor: '#fff',
            backgroundColor: '#fff',
            borderStyle: 'solid',
            borderWidth: 1,
            borderRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 8,
            paddingHorizontal: 10,
            marginRight: 10,
            // 이부분은 placeScreen 보고 받은거라 props로 다시 바꿔도될듯
            flexDirection: 'row',
            width: 60,
        }}><Text style={{fontSize: 14, paddingEnd: 4}}>{props.name}</Text>
        <Icon type="ionicon" name={"sunny"} color={props.iconColor} size={props.iconSize}></Icon>
        </View>
    )
}

const Facility = (props) => {
    return (
        <View style={{
            borderColor: '#fff',
            backgroundColor: '#fff',
            borderStyle: 'solid',
            borderWidth: 1,
            borderRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 4,
            paddingHorizontal: 10,
            marginRight: 10,
        }}>
            <Text style={{fontSize: 14}}>{props.name}</Text>
        </View>
    )
}

const PlaceScreen = ({navigation}) => {
    const { colors } = useTheme();
    //데이터 받아서 다시해야함
    const [ placeTitle, setPlaceTitle ] = useState('주왕산 주산지');

    const onShare = async () => {
        try {
          const result = await Share.share({
            message:
              placeTitle,
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
          alert(error.message);
        }
      };

    return (
        <>
        <View style={{paddingHorizontal: 20, paddingVertical: 25, backgroundColor: colors.backgroundColor}}>
            <NavigationTop navigation={navigation} title=""/>
        </View>
            <SafeAreaView style={{
                flex: 1,
                backgroundColor: colors.backgroundColor,
                width: "100%",
            }}>
                <ScrollView style={{width: "100%"}}>
                    <View>
                        <Image style={{width: "100%", height: 200}}
                            source={require('../assets/images/mountain.jpeg')}
                            resizeMode="center"
                        />
                        <View style={{
                            alignItems: 'center'
                        }}>
                            <View style={{width: '90%', paddingTop: 20, justifyContent: "space-between", flexDirection: 'row'}}>
                                <Text style={{fontSize: 22, fontWeight: "bold", color: colors.mainColor}}>{placeTitle}</Text>
                                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                    <View style={[styles.categoryBorder, {borderColor: colors.detailColor, backgroundColor: colors.detailColor}]}>
                                        <Text style={[styles.categoryText, {color : colors.detailTextColor}]}>음식점</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{width: '90%', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4.5}}>
                            <View style={{flexDirection: 'row'}}>
                                <Icon type="ionicon" name={"location"} size={14} color={colors.mainColor} style={{marginTop: 3}}></Icon>
                                <View style={{marginLeft: 5}}>
                                    <Text style={{color: colors.detailTextColor, fontSize: 14, marginBottom: 1, lineHeight: 22.4}}>서울 광진구 능동로 216 (우)04991</Text>
                                    <Text style={{color: colors.detailSubTextColor, fontSize: 14, lineHeight: 22.4}}>지번 : 능동 259-1</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{width: '90%', paddingHorizontal: 20, paddingVertical: 4.5}}>
                            <View style={{flexDirection: 'row'}}>
                                <Icon type="ionicon" name={"globe-outline"} size={14} color={colors.mainColor}></Icon>
                                <View style={{marginLeft: 5}}>
                                    {/* 하이퍼링크 하도록 */}
                                    <Text style={{color: colors.linkColor, fontSize: 12}}>http://childrenpark.net</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{width: '90%', paddingHorizontal: 20, paddingVertical: 4.5}}>
                            <View style={{flexDirection: 'row'}}>
                                <Icon type="ionicon" name={"call"} size={14} color={colors.mainColor}></Icon>
                                <View style={{marginLeft: 5}}>
                                    <Text style={{color: colors.linkColor, fontSize: 12}}>02-450-9311</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', paddingVertical: 32, justifyContent: 'center', alignItems: 'center'}}>
                            {/* 이 부분도 유저 정보에 따라 바뀔수 있도록 하기 */}
                            <Image source={require('../assets/images/here_icon_nonclicked.png')}></Image>
                            <View style={{borderWidth: 0.5, transform: [{rotate: '90deg'}], width: 42, borderColor: colors.detailColor, marginHorizontal: 30}}></View>
                            <Icon type="ionicon" name={"add"} color={colors.detailColor} size={28}></Icon>
                            <View style={{borderWidth: 0.5, transform: [{rotate: '90deg'}], width: 42, borderColor: colors.detailColor, marginHorizontal: 30}}></View>
                            <TouchableOpacity onPress={onShare}>
                                <Icon type="ionicon" name={"share-social"} color={colors.detailColor} size={28}></Icon>
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    <View style={{width: '100%', height: 8, backgroundColor: colors.detailColor, zIndex: -1000}}></View>
                    
                    <View style={{alignItems: 'center', paddingVertical: 22}}>
                        <View flex={1} style={{alignItems: 'center', justifyContent: 'center'}}>
                            <View flex={1} flexDirection="row" style={{marginTop: 3, alignItems: 'center'}}>
                                <Image style={{width: 30, height: 26, marginTop: 3}} source={require('../assets/images/here_icon_nonclicked.png')}></Image>
                                <View style={{marginLeft: 6, marginRight: 4}}><Text
                                    style={{fontSize: 22, fontWeight: 'bold', marginRight: 5, color: colors.mainColor}}>0.00점</Text></View>
                                <View><Text style={{color: colors.subColor}}>(0명)</Text></View>
                            </View>
                        </View>
                        <View style={{width: '90%', marginVertical: 16, paddingHorizontal: 26}}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Score name="쾌적성" color={colors.mainColor} marginBottom={5} fontSize={12} textAlign={'center'}><StarScore score={3.8} starSize={12}/></Score>
                                <Score name="접근성" color={colors.mainColor} marginBottom={5} fontSize={12} textAlign={'center'}><StarScore score={3.8} starSize={12}/></Score>
                                <Score name="주변상권" color={colors.mainColor} marginBottom={5} fontSize={12} textAlign={'center'}><StarScore score={3.8} starSize={12}/></Score>
                            </View>
                        </View>
                    
                        <View style={{width: '100%', height: 8, backgroundColor: colors.detailColor, zIndex: -1000}}></View>
                    
                    </View>
                    <View style={{marginBottom: 32}}>
                        <View style={{width: '90%', alignItems:'flex-start', paddingBottom: 10.5, paddingLeft: 20}}>
                            <Score name="혼잡한 시간" textColor={colors.mainColor} fontSize={14} textAlign={'left'}/>
                            <View style={{flexDirection: 'row'}}>
                                <Time name="오전" iconColor={colors.notClicked} iconSize={12}/>
                                <Time name="오후" iconColor={colors.notClicked} iconSize={12}/>
                                <Time name="밤" iconColor={colors.notClicked} iconSize={12}/>
                            </View>
                        </View>
                        <View style={{width: '90%', alignItems:'flex-start', paddingLeft: 20}}>
                            <Score name="주변시설" textColor={colors.mainColor} fontSize={14} textAlign={'left'}/>
                            <View style={{flexDirection: 'row'}}>
                                <Facility name="편의점" />
                                <Facility name="약국" />
                                <Facility name="화장실" />
                                <Facility name="쓰레기통" />
                                <Facility name="주차장" />
                            </View>
                        </View>
                    </View>
                    <View style={{marginBottom: 24}}>
                        {/* user_nickname, 만약 해당 장소에 리뷰를 남겼다면 뜨지 않도록 하기 */}
                        <View style={{width: '100%', height: 70, backgroundColor: '#F39191', paddingTop: 10, paddingLeft: 16, paddingBottom: 8}}>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{color: colors.defaultColor, fontWeight: 'bold', fontSize: 16, lineHeight: 25.6}}>minsun</Text>
                                <Text style={{color: colors.defaultColor, fontSize: 16, lineHeight: 25.6}}> 님은</Text>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <View><Text style={{color: colors.defaultColor, fontSize: 16, lineHeight: 25.6}}>어떤 경험을 하셨나요?</Text></View>
                                <View style={{flexDirection: 'row', marginRight: 20}}>
                                    <Text style={{color: colors.defaultColor, fontWeight: 'bold', fontSize: 16, lineHeight: 25.6}}>평점남기기</Text>
                                    <TouchableOpacity style={{alignItems: 'center', justifyContent: 'center'}}>
                                        <Icon type="ionicon" name={"chevron-forward"} size={16} color={colors.defaultColor}></Icon>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        {/* TODO 카카오 지도 api 가져오기 */}
                        <View>
                            {/* 여기에 위도, 경도 받아온 값 넣으면 될듯 */}
                            <MapView style={{width: Dimensions.get('window').width, height: 200}}
                                initialRegion={{
                                    latitude: 37.56633546113615,
                                    longitude: 126.9779482762618,
                                    latitudeDelta: 0.0015,
                                    longitudeDelta: 0.0015,
                                }}
                            ><Marker coordinate={{latitude: 37.56633546113615, 
                                    longitude: 126.9779482762618}}
                                    title="서울시청"
                                    description="기본값입니다" />
                            </MapView>
                        </View>
                    </View>

                    <View>
                        <View style={{
                            alignItems: 'center'
                        }}>
                            <View style={{width: '90%', flexDirection: 'row', paddingBottom: 12}}>
                                <Text style={{fontSize: 20, fontWeight: "bold", color: colors.mainColor, lineHeight: 32}}>보관함에서 모아온 한줄 TIP!</Text>
                                <TouchableOpacity style={{alignItems: 'center', justifyContent: 'center'}}>
                                    <Icon type="ionicon" name={"chevron-forward"} size={20} color={colors.mainColor}></Icon>
                                </TouchableOpacity>
                            </View>
                            <View style={{width: '90%', marginBottom: 29}}>
                                {/* count data 여야 */}
                                <View style={{marginBottom: 6}}><Text style={{color: '#9DA2AB', fontSize: 14, lineHeight: 20.72, fontWeight: 'bold'}}>총 20개</Text></View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 100}}>
                                    <View><Image style={styles.reviewImage}
                                        source={{uri: 'https://via.placeholder.com/150/92c952'}}></Image></View>
                                    <View style={{marginLeft: 12, marginRight: 20}}>
                                        <View><Text style={{fontSize: 16, fontWeight: 'bold', color: colors.mainColor, marginTop: 10, width: 271}}>
                                            종로 25년 토박종로 25년 토박이가 알려주는 종로 사진스팟
                                        </Text></View>
                                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: 271, marginTop: 2}}>
                                            <View style={{flexDirection: 'row'}}>
                                                <Text style={{color: '#9DA2AB', fontWeight: 'bold', fontSize: 12}}>by. </Text>
                                                <Text style={{color: '#9DA2AB', fontSize: 12}}>minsun</Text>
                                            </View>
                                            <View>
                                                <Text style={{color: '#9DA2AB', fontSize: 12}}>21.06.24</Text>
                                            </View>
                                        </View>
                                        <View style={{backgroundColor: colors.defaultColor, width: 267, height: 27, paddingVertical: 4, paddingLeft: 6, paddingRight: 61, marginVertical: 8,
                                                    justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row'}}>
                                            <Icon type="ionicon" name={"chatbox-ellipses-outline"} size={12} color={'#3E557D'} ></Icon>
                                            <Text style={{color: '#3E557D', lineHeight: 19.2, paddingLeft: 4, fontSize: 12}}>근처에 xxx파전 맛집에서 막걸리 한잔 캬</Text>
                                        </View>
                                    </View>
                                </View>
                                
                                <View style={{width: '100%', height: 1, backgroundColor: colors.detailColor, zIndex: -1000, marginVertical: 16}}></View>
                                
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 100}}>
                                    <View><Image style={styles.reviewImage}
                                        source={{uri: 'https://via.placeholder.com/150/92c952'}}></Image></View>
                                    <View style={{marginLeft: 12, marginRight: 20}}>
                                        <View><Text style={{fontSize: 16, fontWeight: 'bold', color: colors.mainColor, marginTop: 10, width: 271}}>
                                            종로 25년 토박종로 25년 토박이가 알려주는 종로 사진스팟
                                        </Text></View>
                                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: 271, marginTop: 2}}>
                                            <View style={{flexDirection: 'row'}}>
                                                <Text style={{color: '#9DA2AB', fontWeight: 'bold', fontSize: 12}}>by. </Text>
                                                <Text style={{color: '#9DA2AB', fontSize: 12}}>minsun</Text>
                                            </View>
                                            <View>
                                                <Text style={{color: '#9DA2AB', fontSize: 12}}>21.06.24</Text>
                                            </View>
                                        </View>
                                        <View style={{backgroundColor: colors.defaultColor, width: 267, height: 27, paddingVertical: 4, paddingLeft: 6, paddingRight: 61, marginVertical: 8,
                                                    justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row'}}>
                                            <Icon type="ionicon" name={"chatbox-ellipses-outline"} size={12} color={'#3E557D'} ></Icon>
                                            <Text style={{color: '#3E557D', lineHeight: 19.2, paddingLeft: 4, fontSize: 12}}>근처에 xxx파전 맛집에서 막걸리 한잔 캬</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={{width: '100%', height: 1, backgroundColor: colors.detailColor, zIndex: -1000, marginVertical: 16}}></View>

                                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 100}}>
                                    <View><Image style={styles.reviewImage}
                                        source={{uri: 'https://via.placeholder.com/150/92c952'}}></Image></View>
                                    <View style={{marginLeft: 12, marginRight: 20}}>
                                        <View><Text style={{fontSize: 16, fontWeight: 'bold', color: colors.mainColor, marginTop: 10, width: 271}}>
                                            종로 25년 토박종로 25년 토박이가 알려주는 종로 사진스팟
                                        </Text></View>
                                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: 271, marginTop: 2}}>
                                            <View style={{flexDirection: 'row'}}>
                                                <Text style={{color: '#9DA2AB', fontWeight: 'bold', fontSize: 12}}>by. </Text>
                                                <Text style={{color: '#9DA2AB', fontSize: 12}}>minsun</Text>
                                            </View>
                                            <View>
                                                <Text style={{color: '#9DA2AB', fontSize: 12}}>21.06.24</Text>
                                            </View>
                                        </View>
                                        <View style={{backgroundColor: colors.defaultColor, width: 267, height: 27, paddingVertical: 4, paddingLeft: 6, paddingRight: 61, marginVertical: 8,
                                                    justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row'}}>
                                            <Icon type="ionicon" name={"chatbox-ellipses-outline"} size={12} color={'#3E557D'} ></Icon>
                                            <Text style={{color: '#3E557D', lineHeight: 19.2, paddingLeft: 4, fontSize: 12}}>근처에 xxx파전 맛집에서 막걸리 한잔 캬</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{width: '100%', height: 8, backgroundColor: colors.detailColor, zIndex: -1000}}></View>
                        <View>
                            <View style={{
                                alignItems: 'center'
                            }}>
                                <View style={{width: '90%', paddingTop: 24, paddingBottom: 24}}>
                                    <Text style={{fontSize: 20, fontWeight: "bold", color: colors.mainColor, lineHeight: 28}}>근처 여긴 어때요?</Text>
                                </View>
                                
                                <View style={{marginBottom: 92, flexDirection: 'row', marginHorizontal: 20}}>
                                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                        <View style={{marginEnd: 8}}>
                                            <View><Image source={{uri: 'https://via.placeholder.com/150/56acb2'}}
                                            style={{width: 141, height: 101, borderRadius: 10}}></Image></View>
                                            <View style={{flexDirection: 'row', marginTop: 8}}>
                                                <Text style={{color: '#9DA2AB', fontSize: 10}}>음식점</Text>
                                                <Text style={{color: '#9DA2AB', fontSize: 10, marginHorizontal: 6}}>|</Text>
                                                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2}}>
                                                    <Image source={require('../assets/images/here_icon.png')} style={{width: 11.36, height: 9.23, marginTop: 2, marginRight: 3.24}}></Image>
                                                    <Text style={{color: '#9DA2AB', fontSize: 10}}>4.84</Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={{color: '#3E557D', fontSize: 18, fontWeight: 'bold', lineHeight: 28.8}}>경복궁</Text>
                                            </View>
                                            <View>
                                                <Text style={{color: colors.detailSubTextColor, fontSize: 12, lineHeight: 19.2}}>서울시 종로구</Text>
                                            </View>
                                        </View>

                                        <View style={{marginEnd: 8}}>
                                            <View><Image source={{uri: 'https://via.placeholder.com/150/56acb2'}}
                                            style={{width: 141, height: 101, borderRadius: 10}}></Image></View>
                                            <View style={{flexDirection: 'row', marginTop: 8}}>
                                                <Text style={{color: '#9DA2AB', fontSize: 10}}>음식점</Text>
                                                <Text style={{color: '#9DA2AB', fontSize: 10, marginHorizontal: 6}}>|</Text>
                                                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2}}>
                                                    <Image source={require('../assets/images/here_icon.png')} style={{width: 11.36, height: 9.23, marginTop: 2, marginRight: 3.24}}></Image>
                                                    <Text style={{color: '#9DA2AB', fontSize: 10}}>4.84</Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={{color: '#3E557D', fontSize: 18, fontWeight: 'bold', lineHeight: 28.8}}>경복궁</Text>
                                            </View>
                                            <View>
                                                <Text style={{color: colors.detailSubTextColor, fontSize: 12, lineHeight: 19.2}}>서울시 종로구</Text>
                                            </View>
                                        </View>

                                        <View style={{marginEnd: 8}}>
                                            <View><Image source={{uri: 'https://via.placeholder.com/150/56acb2'}}
                                            style={{width: 141, height: 101, borderRadius: 10}}></Image></View>
                                            <View style={{flexDirection: 'row', marginTop: 8}}>
                                                <Text style={{color: '#9DA2AB', fontSize: 10}}>음식점</Text>
                                                <Text style={{color: '#9DA2AB', fontSize: 10, marginHorizontal: 6}}>|</Text>
                                                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2}}>
                                                    <Image source={require('../assets/images/here_icon.png')} style={{width: 11.36, height: 9.23, marginTop: 2, marginRight: 3.24}}></Image>
                                                    <Text style={{color: '#9DA2AB', fontSize: 10}}>4.84</Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={{color: '#3E557D', fontSize: 18, fontWeight: 'bold', lineHeight: 28.8}}>경복궁</Text>
                                            </View>
                                            <View>
                                                <Text style={{color: colors.detailSubTextColor, fontSize: 12, lineHeight: 19.2}}>서울시 종로구</Text>
                                            </View>
                                        </View>
                                    </ScrollView>
                                </View>
                            </View>
                        </View>
                </ScrollView>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    categoryBorder: {
        borderWidth: 1,
        borderRadius: 14,
        height: 19,
        justifyContent: 'center',
        alignItems: 'center',
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
        marginBottom: 30,
    },
})
export default PlaceScreen;