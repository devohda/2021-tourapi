import React, { useState, useRef } from "react";
import {View, Text, ScrollView, Image, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, Share, Platform, Linking} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { useTheme } from '@react-navigation/native';
import { Icon } from "react-native-elements";
import MapView, { Marker, UrlTile } from 'react-native-maps';
import StarScore from '../components/StarScore';
import NavigationTop from "../components/NavigationTop";
import Score from "../components/Score";
import Time from "../components/Time";
import Facility from "../components/Facility";
import styled, {css} from 'styled-components/native';

import ScreenContainer from "../components/ScreenContainer";
import Star from "../components/Star";
import ScreenContainerView from "../components/ScreenContainerView";
import ScreenDivideLine from "../components/ScreenDivideLine";
import AppText from "../components/AppText";

import LocationIcon from "../assets/images/place/location-icon.svg"
import PhoneIcon from "../assets/images/place/phone-icon.svg"
import TimeIcon from "../assets/images/place/time-icon.svg"
import WebsiteIcon from "../assets/images/place/website-icon.svg"

const PlaceScreen = ({navigation}) => {
    const refRBSheet = useRef();
    const { colors } = useTheme();
    //TODO 유저의 보관함 안에 이 place_pk가 있는지 확인하는 작업 필요
    const [ isLiked, setIsLiked ] = useState(false);
    //데이터 받아서 다시해야함
    const [ placeTitle, setPlaceTitle ] = useState('주왕산 주산지');
    const [ placeLocation, setPlaceLocation ] = useState('서울시 광진구 능동로 216 (우)04991');
    const [ placeScore, setPlaceScore ] = useState('4.84');
    const [ clicked, setClicked ] = useState(false);

    const postLikes = async () => {
        try {
            fetch('http://192.168.0.11:3000/like/likes', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    //임의로 음식점이라서 0으로 넣음
                    like_type: 0,
                    like_title: placeTitle,
                    like_location: placeLocation.split(' ')[0] + ' ' + placeLocation.split(' ')[1],
                    //이것도 불러와야 함
                    like_score: parseFloat(placeScore).toFixed(1),
                })
            }).then((res) => res.text())
                .then((responsedata) => {
                    console.log(responsedata);
                })
                .catch((err) => {
                    console.error(err)
                });

        } catch (err) {
            console.error(err);
        }
        setIsLiked(true)
    }

    const deleteLikes = async () => {
        try {
            fetch('http://192.168.0.11:3000/like/likes/'+ 32, {
                method: 'DELETE',
                body: {
                    like_type: 0,
                    like_pk: 34
                }
            }).then((res) => res.text())
                .then((responsedata) => {
                    console.log(responsedata);
                })
                .catch((err) => {
                    console.error(err)
                });

        } catch (err) {
            console.error(err);
        }
        setIsLiked(false)
    };

    const ShowDirectories = () => {
        return (
            <TouchableOpacity onPress={() => {refRBSheet.current.open(); setClicked(true)}}>
                <Icon type="ionicon" name={"add"} color={colors.red_gray[6]} size={28}></Icon>
                <RBSheet
                    ref={refRBSheet}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    height={448}
                    customStyles={{
                    wrapper: {
                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                    },
                    draggableIcon: {
                        backgroundColor: colors.gray[4],
                        width: 110
                    },
                    container: {
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        backgroundColor: colors.yellow[7]
                    }
                    }}
                    >
                        {/* 데이터가 많아질 수 있으므로 스크롤뷰를 넣는것이 좋을듯 */}
                        {/* 클릭했을 때 bordercolor 바뀌는건 makefreeDirectory 참고해서 데이터 들어온 다음에 바꾸기 */}
                        <View style={{marginTop: 16, backgroundColor: colors.backgroundColor, marginHorizontal: 20}}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: '1%', color: colors.mainColor}}>보관함에 추가하기</Text>
                                <Image source={require('../assets/images/folder.png')} style={{width: 32, height: 32}}></Image>
                            </View>
                            <View style={{alignItems : "center", justifyContent : "center", marginTop: 12}}>
                                <View style={{width: '100%', backgroundColor: colors.defaultColor, borderRadius: 5}}>
                                    <View style={{paddingLeft: 10, paddingTop: 12}}>
                                        <View style={{paddingRight: 8, flexDirection: 'row'}}>
                                            <Icon type="ionicon" name={"location"} size={10} color={colors.mainColor}
                                                style={{marginVertical: 2, marginRight: 2}}></Icon>
                                            <Text style={{fontSize: 12, color: colors.mainColor}}>9</Text>
                                        </View>
                                    </View>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 11}}>
                                        <View style={{flexDirection: 'row', marginLeft: 10, justifyContent: 'center', alignItems: 'center'}}>
                                            <Text numberOfLines={2} style={{color: colors.mainColor, lineHeight: 28.8, fontSize: 18, fontWeight: '500', width: 236}}>하루만에 북촌 정복하기</Text>
                                            <Image style={{width: 18, height: 18, marginLeft: 2}} source={require('../assets/images/lock_outline.png')}></Image>
                                        </View>
                                        <View style={{marginRight: '15%'}}>
                                            <View style={{flexDirection: 'row', position: 'relative', alignItems: 'center'}} flex={1}>
                                                {/* 여기에는 받은 유저 프로필만 넣고, +2 부분에는 전체 인원수-3명으로 퉁 치기 */}
                                                <View style={{zIndex: 0, flex: 1, position:'absolute'}}><Image style={{width: 24, height: 24}} source={require('../assets/images/default_profile_1.png')}></Image></View>
                                                <View style={{zIndex: 1, flex: 1, position:'absolute', marginLeft: 10}}><Image style={{width: 24, height: 24}} source={require('../assets/images/default_profile_2.png')}></Image></View>
                                                <View style={{zIndex: 2, flex: 1, position:'absolute', marginLeft: 20}}><Image style={{width: 24, height: 24}} source={require('../assets/images/default_profile_3.png')}></Image></View>
                                                <View style={{zIndex: 3, flex: 1, position:'absolute', marginLeft: 24.5, backgroundColor: 'rgba(0, 0, 0, 0.37);',
                                                            width: 15, height: 15, borderRadius: 50,
                                                            alignItems: 'center', justifyContent: 'center'
                                                        }}><Text style={{color: colors.defaultColor, fontSize: 10, textAlign: 'center'}}>+2</Text></View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View style={{alignItems : "center", justifyContent : "center", marginTop: 12}}>
                                <View style={{width: '100%', backgroundColor: colors.defaultColor, borderRadius: 5}}>
                                    <View style={{paddingLeft: 10, paddingTop: 12}}>
                                        <View style={{paddingRight: 8, flexDirection: 'row'}}>
                                            <Icon type="ionicon" name={"location"} size={10} color={colors.mainColor}
                                                style={{marginVertical: 2, marginRight: 2}}></Icon>
                                            <Text style={{fontSize: 12, color: colors.mainColor}}>9</Text>
                                        </View>
                                    </View>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 11}}>
                                        <View style={{flexDirection: 'row', marginLeft: 10, justifyContent: 'center', alignItems: 'center'}}>
                                            <Text numberOfLines={2} style={{color: colors.mainColor, lineHeight: 28.8, fontSize: 18, fontWeight: '500', width: 236}}>종로 25년 토박이가 알려주는 종로 사진스팟</Text>
                                            <Image style={{width: 18, height: 18, marginLeft: 2}} source={require('../assets/images/lock_outline.png')}></Image>
                                        </View>
                                        <View style={{marginRight: '15%'}}>
                                            <View style={{flexDirection: 'row', position: 'relative', alignItems: 'center'}} flex={1}>
                                                {/* 여기에는 받은 유저 프로필만 넣고, +2 부분에는 전체 인원수-3명으로 퉁 치기 */}
                                                <View style={{zIndex: 0, flex: 1, position:'absolute'}}><Image style={{width: 24, height: 24}} source={require('../assets/images/default_profile_1.png')}></Image></View>
                                                <View style={{zIndex: 1, flex: 1, position:'absolute', marginLeft: 10}}><Image style={{width: 24, height: 24}} source={require('../assets/images/default_profile_2.png')}></Image></View>
                                                <View style={{zIndex: 2, flex: 1, position:'absolute', marginLeft: 20}}><Image style={{width: 24, height: 24}} source={require('../assets/images/default_profile_3.png')}></Image></View>
                                                <View style={{zIndex: 3, flex: 1, position:'absolute', marginLeft: 24.5, backgroundColor: 'rgba(0, 0, 0, 0.37);',
                                                            width: 15, height: 15, borderRadius: 50,
                                                            alignItems: 'center', justifyContent: 'center'
                                                        }}><Text style={{color: colors.defaultColor, fontSize: 10, textAlign: 'center'}}>+2</Text></View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View style={{alignItems : "center", justifyContent : "center", marginTop: 12}}>
                                <View style={{width: '100%', backgroundColor: colors.defaultColor, borderRadius: 5}}>
                                    <View style={{paddingLeft: 10, paddingTop: 12}}>
                                        <View style={{paddingRight: 8, flexDirection: 'row'}}>
                                            <Icon type="ionicon" name={"location"} size={10} color={colors.mainColor}
                                                style={{marginVertical: 2, marginRight: 2}}></Icon>
                                            <Text style={{fontSize: 12, color: colors.mainColor}}>9</Text>
                                        </View>
                                    </View>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 11}}>
                                        <View style={{flexDirection: 'row', marginLeft: 10, justifyContent: 'center', alignItems: 'center'}}>
                                            <Text numberOfLines={2} style={{color: colors.mainColor, lineHeight: 28.8, fontSize: 18, fontWeight: '500', width: 236}}>종로 25년 토박이가 알려주는 종로 사진스팟</Text>
                                        </View>
                                        <View style={{marginRight: '15%'}}>
                                            <View style={{flexDirection: 'row', position: 'relative', alignItems: 'center'}} flex={1}>
                                                {/* 여기에는 받은 유저 프로필만 넣고, +2 부분에는 전체 인원수-3명으로 퉁 치기 */}
                                                <View style={{zIndex: 0, flex: 1, position:'absolute'}}><Image style={{width: 24, height: 24}} source={require('../assets/images/default_profile_1.png')}></Image></View>
                                                <View style={{zIndex: 1, flex: 1, position:'absolute', marginLeft: 10}}><Image style={{width: 24, height: 24}} source={require('../assets/images/default_profile_2.png')}></Image></View>
                                                <View style={{zIndex: 2, flex: 1, position:'absolute', marginLeft: 20}}><Image style={{width: 24, height: 24}} source={require('../assets/images/default_profile_3.png')}></Image></View>
                                                <View style={{zIndex: 3, flex: 1, position:'absolute', marginLeft: 24.5, backgroundColor: 'rgba(0, 0, 0, 0.37);',
                                                            width: 15, height: 15, borderRadius: 50,
                                                            alignItems: 'center', justifyContent: 'center'
                                                        }}><Text style={{color: colors.defaultColor, fontSize: 10, textAlign: 'center'}}>+2</Text></View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={{marginTop: 22}}>
                                <TouchableOpacity
                                    style={{
                                        // 들어왔을때 length를 이용하여 바꿀 필요있음
                                        // backgroundColor: ((DATA.collection_name.length >= 2) && (isPress.filter((value) => value === true).length > 0 && isPress.filter((value) => value === true).length <= 3)) ? colors.mainColor : colors.gray[5],
                                        backgroundColor: colors.gray[6],
                                        height: 48,
                                        borderRadius: 10
                                    }}
                                ><Text
                                    style={{
                                        textAlign: 'center',
                                        padding: 14,
                                        fontSize: 16,
                                        color: colors.defaultColor,
                                        fontWeight: 'bold'
                                    }}
                                >보관함에 추가하기</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                </RBSheet>
            </TouchableOpacity>

        )
    }

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
                        <View style={{flexDirection: 'row'}}>
                            <Image style={{width: "50%", height: 200}}
                                source={require('../assets/images/mountain.jpeg')}
                                resizeMode="cover"
                            />
                            <View style={{width: '50%', height: 200}}>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <Image style={{width: "50%", height: 100}}
                                        source={require('../assets/images/mountain.jpeg')}
                                        resizeMode="cover"
                                    />
                                    <Image style={{width: "50%", height: 100}}
                                        source={require('../assets/images/mountain.jpeg')}
                                        resizeMode="cover"
                                    />
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <Image style={{width: "50%", height: 100}}
                                        source={require('../assets/images/mountain.jpeg')}
                                        resizeMode="cover"
                                    />
                                    <Image style={{width: "50%", height: 100}}
                                        source={require('../assets/images/mountain.jpeg')}
                                        resizeMode="cover"
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={{
                            alignItems: 'center'
                        }}>
                            <View style={{width: '90%', paddingTop: 20, justifyContent: "space-between", flexDirection: 'row'}}>
                                <Text style={{fontSize: 22, fontWeight: "bold", color: colors.mainColor}}>{placeTitle}</Text>
                                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                    <View style={[styles.categoryBorder, {borderColor: colors.red_gray[6], backgroundColor: colors.red_gray[6]}]}>
                                        <Text style={[styles.categoryText, {color : colors.gray[1]}]}>음식점</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{width: '90%', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4.5}}>
                            <View style={{flexDirection: 'row'}}>
                                <Icon type="ionicon" name={"location"} size={14} color={colors.mainColor} style={{marginTop: 3}}></Icon>
                                <View style={{marginLeft: 5}}>
                                    <Text style={{color: colors.gray[1], fontSize: 14, marginBottom: 1, lineHeight: 22.4}}>{placeLocation}</Text>
                                    <Text style={{color: colors.gray[4], fontSize: 14, lineHeight: 22.4}}>지번 : 능동 259-1</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{width: '90%', paddingHorizontal: 20, paddingVertical: 4.5}}>
                            <View style={{flexDirection: 'row'}}>
                                <Icon type="ionicon" name={"globe-outline"} size={14} color={colors.mainColor}></Icon>
                                <View style={{marginLeft: 5}}>
                                    {/* 하이퍼링크 하도록 */}
                                    <Text style={{color: colors.blue[3], fontSize: 12}}>http://childrenpark.net</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{width: '90%', paddingHorizontal: 20, paddingVertical: 4.5}}>
                            <View style={{flexDirection: 'row'}}>
                                <Icon type="ionicon" name={"time-outline"} size={14} color={colors.mainColor}></Icon>
                                <View style={{marginLeft: 5}}>
                                    <Text style={{color: colors.blue[3], fontSize: 12}}>매일 11:00~17:00</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{width: '90%', paddingHorizontal: 20, paddingVertical: 4.5}}>
                            <View style={{flexDirection: 'row'}}>
                                <Icon type="ionicon" name={"call"} size={14} color={colors.mainColor}></Icon>
                                <View style={{marginLeft: 5}}>
                                    <Text style={{color: colors.blue[3], fontSize: 12}}>02-450-9311</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', paddingVertical: 32, justifyContent: 'center', alignItems: 'center'}}>
                            {/* 이 부분도 유저 정보에 따라 바뀔수 있도록 하기 */}
                            <TouchableOpacity onPress={() => {isLiked ? deleteLikes() : postLikes()}}>
                                <Image style={{width: 26, height: 21}} source={isLiked ?  require('../assets/images/here_icon.png') : require('../assets/images/here_icon_nonclicked.png') }></Image>
                            </TouchableOpacity>
                            <View style={{borderWidth: 0.5, transform: [{rotate: '90deg'}], width: 42, borderColor: colors.red_gray[6], marginHorizontal: 30}}></View>
                            <ShowDirectories />
                            <View style={{borderWidth: 0.5, transform: [{rotate: '90deg'}], width: 42, borderColor: colors.red_gray[6], marginHorizontal: 30}}></View>
                            <TouchableOpacity onPress={onShare}>
                                <Icon type="ionicon" name={"share-social"} color={colors.red_gray[6]} size={28}></Icon>
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    <View style={{width: '100%', height: 8, backgroundColor: colors.red_gray[6], zIndex: -1000}}></View>
                    
                    <View style={{alignItems: 'center', paddingVertical: 22}}>
                        <View flex={1} style={{alignItems: 'center', justifyContent: 'center'}}>
                            <View flex={1} flexDirection="row" style={{marginTop: 3, alignItems: 'center'}}>
                                <Image style={{width: 30, height: 26, marginTop: 3}} source={require('../assets/images/here_icon_nonclicked.png')}></Image>
                                <View style={{marginLeft: 6, marginRight: 4}}><Text
                                    style={{fontSize: 22, fontWeight: 'bold', marginRight: 5, color: colors.mainColor}}>{placeScore}점</Text></View>
                                <View><Text style={{color: colors.gray[5]}}>(0명)</Text></View>
                            </View>
                        </View>
                        <View style={{width: '90%', marginVertical: 16, paddingHorizontal: 26}}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Score name="쾌적성" color={colors.mainColor} marginBottom={5} fontSize={12} textAlign={'center'}><StarScore score={3.8} starSize={12}/></Score>
                                <Score name="접근성" color={colors.mainColor} marginBottom={5} fontSize={12} textAlign={'center'}><StarScore score={3.8} starSize={12}/></Score>
                                <Score name="주변상권" color={colors.mainColor} marginBottom={5} fontSize={12} textAlign={'center'}><StarScore score={3.8} starSize={12}/></Score>
                            </View>
                        </View>
                        {/* 만약 해당 장소에 리뷰를 남겼다면 뜨지 않도록 하기 */}
                        <View style={{width: '100%', height: 38, alignItems: 'center', marginBottom: 20}}>
                            <TouchableOpacity style={{flexDirection: 'row', backgroundColor: colors.red[3], width: '90%', height: 38, alignItems: 'center', justifyContent: 'center',
                                                    borderRadius: 35, paddingVertical: 6}}>
                                <Image style={{width: 20.82, height: 27, marginTop: 3}} source={require('../assets/images/write_review_icon.png')}></Image>
                                <Text style={{color: colors.backgroundColor, fontWeight: 'bold', marginStart: 4}}>평점 남기기</Text>
                            </TouchableOpacity>
                        </View>
                        
                    
                        <View style={{width: '100%', height: 8, backgroundColor: colors.red_gray[6], zIndex: -1000}}></View>
                    
                    </View>
                    <View style={{marginBottom: 32}}>
                        <View style={{width: '90%', alignItems:'flex-start', paddingBottom: 10.5, paddingLeft: 20}}>
                            <Score name="혼잡한 시간" textColor={colors.mainColor} fontSize={14} textAlign={'left'}/>
                            <View style={{flexDirection: 'row'}}>
                                <Time name="오전" iconColor={colors.gray[6]} iconSize={12}/>
                                <Time name="오후" iconColor={colors.gray[6]} iconSize={12}/>
                                <Time name="밤" iconColor={colors.gray[6]} iconSize={12}/>
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
                            <View style={{width: '90%', paddingBottom: 12}}>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={{fontSize: 20, fontWeight: "bold", color: colors.mainColor, lineHeight: 32}}>한줄 TIP</Text>
                                    <TouchableOpacity style={{alignItems: 'center', justifyContent: 'center'}}>
                                        <Icon type="ionicon" name={"chevron-forward"} size={20} color={colors.mainColor}></Icon>
                                    </TouchableOpacity>
                                </View>
                                <Text style={{color: colors.gray[3], fontSize: 12}}>한줄팁은 보관함에 공유된 소중한 리뷰입니다</Text>
                            </View>
                            <View style={{width: '90%', marginBottom: 29}}>
                                {/* count data 여야 */}
                                <View style={{marginBottom: 6}}><Text style={{color: colors.gray[3], fontSize: 14, lineHeight: 20.72, fontWeight: 'bold'}}>총 20개</Text></View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <View><Image style={styles.reviewImage}
                                        source={{uri: 'https://via.placeholder.com/150/92c952'}}></Image></View>
                                    <View style={{marginLeft: 12, marginRight: 20}}>
                                        <View style={{backgroundColor: colors.defaultColor, width: 267, height: 27, paddingVertical: 6, paddingLeft: 6, paddingRight: 61, marginBottom: 6,
                                                    justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row'}}>
                                            <Icon type="ionicon" name={"chatbox-ellipses-outline"} size={12} color={colors.blue[1]} style={{paddingTop: 2}}></Icon>
                                            <Text style={{color: colors.blue[1], paddingLeft: 4, fontSize: 12}}>근처에 xxx파전 맛집에서 막걸리 한잔 캬</Text>
                                        </View>
                                        <View><Text style={{fontSize: 12, color: colors.mainColor, width: 267, lineHeight: 16}}>
                                            종로 25년 토박종로 25년 토박이가 알려주는 종로 사진스팟
                                        </Text></View>
                                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: 267, marginTop: 4}}>
                                            <View style={{flexDirection: 'row'}}>
                                                <Text style={{color: colors.gray[3], fontWeight: 'bold', fontSize: 12}}>by. </Text>
                                                <Text style={{color: colors.gray[3], fontSize: 12}}>minsun</Text>
                                            </View>
                                            <View>
                                                <Text style={{color: colors.gray[3], fontSize: 12}}>21.06.24</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                
                                <View style={{width: '100%', height: 1, backgroundColor: colors.red_gray[6], zIndex: -1000, marginVertical: 18}}></View>
                                
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <View><Image style={styles.reviewImage}
                                        source={{uri: 'https://via.placeholder.com/150/92c952'}}></Image></View>
                                    <View style={{marginLeft: 12, marginRight: 20}}>
                                        <View style={{backgroundColor: colors.defaultColor, width: 267, height: 27, paddingVertical: 6, paddingLeft: 6, paddingRight: 61, marginBottom: 6,
                                                    justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row'}}>
                                            <Icon type="ionicon" name={"chatbox-ellipses-outline"} size={12} color={colors.blue[1]} style={{paddingTop: 2}}></Icon>
                                            <Text style={{color: colors.blue[1], paddingLeft: 4, fontSize: 12}}>근처에 xxx파전 맛집에서 막걸리 한잔 캬</Text>
                                        </View>
                                        <View><Text style={{fontSize: 12, color: colors.mainColor, width: 267, lineHeight: 16}}>
                                            종로 25년 토박종로 25년 토박이가 알려주는 종로 사진스팟
                                        </Text></View>
                                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: 267, marginTop: 4}}>
                                            <View style={{flexDirection: 'row'}}>
                                                <Text style={{color: colors.gray[3], fontWeight: 'bold', fontSize: 12}}>by. </Text>
                                                <Text style={{color: colors.gray[3], fontSize: 12}}>minsun</Text>
                                            </View>
                                            <View>
                                                <Text style={{color: colors.gray[3], fontSize: 12}}>21.06.24</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <View style={{width: '100%', height: 1, backgroundColor: colors.red_gray[6], zIndex: -1000, marginVertical: 18}}></View>

                                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <View><Image style={styles.reviewImage}
                                        source={{uri: 'https://via.placeholder.com/150/92c952'}}></Image></View>
                                    <View style={{marginLeft: 12, marginRight: 20}}>
                                        <View style={{backgroundColor: colors.defaultColor, width: 267, height: 27, paddingVertical: 6, paddingLeft: 6, paddingRight: 61, marginBottom: 6,
                                                    justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row'}}>
                                            <Icon type="ionicon" name={"chatbox-ellipses-outline"} size={12} color={colors.blue[1]} style={{paddingTop: 2}}></Icon>
                                            <Text style={{color: colors.blue[1], paddingLeft: 4, fontSize: 12}}>근처에 xxx파전 맛집에서 막걸리 한잔 캬</Text>
                                        </View>
                                        <View><Text style={{fontSize: 12, color: colors.mainColor, width: 267, lineHeight: 16}}>
                                            종로 25년 토박종로 25년 토박이가 알려주는 종로 사진스팟
                                        </Text></View>
                                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: 267, marginTop: 4}}>
                                            <View style={{flexDirection: 'row'}}>
                                                <Text style={{color: colors.gray[3], fontWeight: 'bold', fontSize: 12}}>by. </Text>
                                                <Text style={{color: colors.gray[3], fontSize: 12}}>minsun</Text>
                                            </View>
                                            <View>
                                                <Text style={{color: colors.gray[3], fontSize: 12}}>21.06.24</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{width: '100%', height: 8, backgroundColor: colors.red_gray[6], zIndex: -1000}}></View>
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
                                                <Text style={{color: colors.gray[3], fontSize: 10}}>음식점</Text>
                                                <Text style={{color: colors.gray[3], fontSize: 10, marginHorizontal: 6}}>|</Text>
                                                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2}}>
                                                    <Image source={require('../assets/images/here_icon.png')} style={{width: 11.36, height: 9.23, marginTop: 2, marginRight: 3.24}}></Image>
                                                    <Text style={{color: colors.gray[3], fontSize: 10}}>4.84</Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={{color: colors.blue[1], fontSize: 18, fontWeight: 'bold', lineHeight: 28.8}}>경복궁</Text>
                                            </View>
                                            <View>
                                                <Text style={{color: colors.gray[4], fontSize: 12, lineHeight: 19.2}}>서울시 종로구</Text>
                                            </View>
                                        </View>

                                        <View style={{marginEnd: 8}}>
                                            <View><Image source={{uri: 'https://via.placeholder.com/150/56acb2'}}
                                            style={{width: 141, height: 101, borderRadius: 10}}></Image></View>
                                            <View style={{flexDirection: 'row', marginTop: 8}}>
                                                <Text style={{color: colors.gray[3], fontSize: 10}}>음식점</Text>
                                                <Text style={{color: colors.gray[3], fontSize: 10, marginHorizontal: 6}}>|</Text>
                                                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2}}>
                                                    <Image source={require('../assets/images/here_icon.png')} style={{width: 11.36, height: 9.23, marginTop: 2, marginRight: 3.24}}></Image>
                                                    <Text style={{color: colors.gray[3], fontSize: 10}}>4.84</Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={{color: colors.blue[1], fontSize: 18, fontWeight: 'bold', lineHeight: 28.8}}>경복궁</Text>
                                            </View>
                                            <View>
                                                <Text style={{color: colors.gray[4], fontSize: 12, lineHeight: 19.2}}>서울시 종로구</Text>
                                            </View>
                                        </View>

                                        <View style={{marginEnd: 8}}>
                                            <View><Image source={{uri: 'https://via.placeholder.com/150/56acb2'}}
                                            style={{width: 141, height: 101, borderRadius: 10}}></Image></View>
                                            <View style={{flexDirection: 'row', marginTop: 8}}>
                                                <Text style={{color: colors.gray[3], fontSize: 10}}>음식점</Text>
                                                <Text style={{color: colors.gray[3], fontSize: 10, marginHorizontal: 6}}>|</Text>
                                                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2}}>
                                                    <Image source={require('../assets/images/here_icon.png')} style={{width: 11.36, height: 9.23, marginTop: 2, marginRight: 3.24}}></Image>
                                                    <Text style={{color: colors.gray[3], fontSize: 10}}>4.84</Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={{color: colors.blue[1], fontSize: 18, fontWeight: 'bold', lineHeight: 28.8}}>경복궁</Text>
                                            </View>
                                            <View>
                                                <Text style={{color: colors.gray[4], fontSize: 12, lineHeight: 19.2}}>서울시 종로구</Text>
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

    },
})
export default PlaceScreen;