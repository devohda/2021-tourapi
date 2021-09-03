import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Image, ScrollView, Text, View, FlatList, SafeAreaView, Dimensions, TouchableOpacity, Platform} from "react-native";
import {StyleSheet} from "react-native";
import OIcon from 'react-native-vector-icons/Octicons'
import React, {useEffect, useState, useContext} from "react";
import { Icon } from 'react-native-elements';
import { useTheme } from '@react-navigation/native';
import AppText from '../components/AppText';

const Tab = createMaterialTopTabNavigator();

function Like() {
    const { colors } = useTheme();

    const styles = StyleSheet.create({
        directoryContainer: {
            marginEnd: Dimensions.get('screen').width/14,
            marginTop: 11,
            width: 162,
            height: 249,
        },
        likesContainer: {
            width: Dimensions.get('screen').width/2.25,
            marginTop: 16,
        },
        dirType: {
            borderWidth: 1,
            paddingVertical: 1,
            paddingHorizontal: 8,
            borderRadius: 14,
            elevation: 1,
            width: 43,
            height: 22,
            marginLeft: 9,
            marginTop: 8,
            flexDirection: 'row',
            zIndex: 10000,
            justifyContent: 'center',
            alignItems: 'center',
        },
        dirFreeText: {
            color: colors.mainColor,
            fontSize: 12,
            fontWeight: 'bold',
        },
        dirPlanText: {
            color: colors.red[3],
            fontSize: 12,
            fontWeight: 'bold'
        },
        defaultImage: {
            width: '100%',
            height: 162,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            position: 'absolute',
        },
        selectType: {
            borderColor: colors.defaultColor, backgroundColor: colors.defaultColor, shadowColor: colors.red[7],
            borderWidth: 1,
            paddingVertical: 1,
            paddingHorizontal: 8.5,
            borderRadius: 12,
            marginRight: 10,
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.1,
            elevation: 1,
            height: 28,
            justifyContent: 'center',
            alignItems: 'center'
        },
        selectTypeClicked: {
            borderColor: colors.mainColor, backgroundColor: colors.mainColor, shadowColor: colors.red[7],
            borderWidth: 1,
            paddingVertical: 1,
            paddingHorizontal: 8.5,
            borderRadius: 12,
            marginRight: 10,
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.1,
            elevation: 1,
            height: 28,
            justifyContent: 'center',
            alignItems: 'center'
        },
        selectTypeTextClicked: {
            color : colors.defaultColor,
            fontSize: 14,
            textAlign: 'center',
            textAlignVertical: 'center',
            fontWeight: 'bold',
            marginVertical: 2
        },
        selectTypeText: {
            color : colors.subColor,
            fontSize: 14,
            textAlign: 'center',
            textAlignVertical: 'center',
            marginVertical: 2
        },
    })
    
    const [likedData, setLikedData] = useState({});

    useEffect(() => {
        getLikesFromUsers();
    }, [])

    const getLikesFromUsers = () => {
        try {
            fetch('http://192.168.0.11:3000/like/likes', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            }).then((res) => res.json())
                .then((responsedata) => {
                    // console.log(responsedata);
                    setLikedData(responsedata)
                })
                .catch((err) => {
                    console.error(err)
                });
    
        } catch (err) {
            console.error(err);
        }
    }

    const showLikes = ({item}) => (
        <View style={styles.likesContainer}>
                <View style={{alignItems: 'center'}}>
                    <View style={{marginEnd: 8}}>
                        <View><Image source={{uri: 'https://via.placeholder.com/150/56acb2'}}
                                    style={{width: 163, height: 113, borderRadius: 10}}></Image></View>
                        <View style={{flexDirection: 'row', marginTop: 8}}>
                        {/* //TODO 리스트화 할필요 있음 */}
                            <AppText style={{color: colors.mainColor, fontSize: 10, marginTop: 2}}>{item.like_type ===0 && '음식점'}</AppText>
                            <AppText style={{color: colors.mainColor, fontSize: 11, marginHorizontal: 6,}}>|</AppText>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Image source={require('../assets/images/here_icon.png')} style={{width: 11.36, height: 9.23, marginTop: 2, marginRight: 3.24}}></Image>
                                <AppText style={{color: colors.mainColor, fontSize: 10}}>{item.like_score}</AppText>
                            </View>
                        </View>
                        <View>
                            <AppText style={{color: colors.mainColor, fontSize: 16, fontWeight: 'bold', lineHeight: 28.8}}>{item.like_title}</AppText>
                        </View>
                        <View>
                            <AppText style={{color: colors.gray[4], fontSize: 12, lineHeight: 19.2}}>{item.like_location}</AppText>
                        </View>
                    </View>
                </View>
        </View>

    )

    return (
        <View flex={1} backgroundColor={colors.backgroundColor}>
            <View style={{flexDirection: 'row', width: '90%', justifyContent: 'space-between', marginTop: 16, paddingBottom: 17}}>
                <View style={{flexDirection: 'row'}}>
                    <AppText style={{color: colors.mainColor}}>최근 추가순</AppText>
                    <Icon style={{color: colors.mainColor, paddingTop: 1, paddingLeft: 8}} type="ionicon" name={"chevron-down-outline"} size={16}></Icon>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <View style={{flexDirection: 'row'}}>
                        <Icon style={{color: colors.mainColor, marginTop: 3, marginRight: 2}} type="ionicon" name={"funnel"} size={13}></Icon>
                        <AppText style={{color: colors.mainColor}}>필터</AppText>
                    </View>
                    <View style={{marginHorizontal: 10}}><AppText style={{color: colors.gray[5]}}>|</AppText></View>
                    <View style={{flexDirection: 'row'}}>
                        <Icon style={{color: colors.mainColor, marginTop: 3, marginRight: 2}} type="ionicon" name={"pencil"} size={13}></Icon>
                        <AppText style={{color: colors.mainColor}}>편집</AppText>
                    </View>
                </View>
            </View>
            <ScrollView horizontal={true} scrollEnabled={false}>
                <SafeAreaView>
                    <FlatList contentContainerStyle={{justifyContent: 'space-between'}} numColumns={2} data={likedData} renderItem={showLikes} keyExtractor={(item) => item.like_pk.toString()} nestedScrollEnabled/>
                </SafeAreaView>
            </ScrollView>
        </View>

    );
}

const Collection = props => {
    useEffect(() => {
        getCollectionsFromUsers(1);
    }, [])

    const { colors } = useTheme();

    const styles = StyleSheet.create({
        directoryContainer: {
            marginEnd: Dimensions.get('screen').width/14,
            marginTop: 11,
            width: 162,
            height: 249,
        },
        likesContainer: {
            width: Dimensions.get('screen').width/2.25,
            marginTop: 16,
        },
        dirType: {
            borderWidth: 1,
            paddingVertical: 1,
            paddingHorizontal: 8,
            borderRadius: 14,
            elevation: 1,
            width: 43,
            height: 22,
            marginLeft: 9,
            marginTop: 8,
            flexDirection: 'row',
            zIndex: 10000,
            justifyContent: 'center',
            alignItems: 'center',
        },
        dirFreeText: {
            color: colors.mainColor,
            fontSize: 12,
            fontWeight: 'bold',
        },
        dirPlanText: {
            color: colors.red[3],
            fontSize: 12,
            fontWeight: 'bold'
        },
        defaultImage: {
            width: '100%',
            height: 162,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            position: 'absolute',
        },
        selectType: {
            borderColor: colors.defaultColor, backgroundColor: colors.defaultColor, shadowColor: colors.red[7],
            borderWidth: 1,
            paddingVertical: 1,
            paddingHorizontal: 8.5,
            borderRadius: 12,
            marginRight: 10,
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.1,
            elevation: 1,
            height: 28,
            justifyContent: 'center',
            alignItems: 'center'
        },
        selectTypeClicked: {
            borderColor: colors.mainColor, backgroundColor: colors.mainColor, shadowColor: colors.red[7],
            borderWidth: 1,
            paddingVertical: 1,
            paddingHorizontal: 8.5,
            borderRadius: 12,
            marginRight: 10,
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.1,
            elevation: 1,
            height: 28,
            justifyContent: 'center',
            alignItems: 'center'
        },
        selectTypeTextClicked: {
            color : colors.defaultColor,
            fontSize: 14,
            textAlign: 'center',
            textAlignVertical: 'center',
            fontWeight: 'bold',
            marginVertical: 2
        },
        selectTypeText: {
            color : colors.subColor,
            fontSize: 14,
            textAlign: 'center',
            textAlignVertical: 'center',
            marginVertical: 2
        },
    })

    const [directoryData, setDirectoryData] = useState({});
    const [directoryType, setDirectoryType] = useState([
        {
            id: 1,
            name: '전체',
            pressed : true,
        },
        {
            id: 2,
            name: '내 보관함',
            pressed : false,
        },
        {
            id: 3,
            name: '수집한 보관함',
            pressed : false,
        },
        {
            id: 4,
            name: '일정보관함',
            pressed : false,
        },
        {
            id: 5,
            name: '자유보관함',
            pressed : false,
        }
    ])
    const [selectedDirType, setSelectedDirType] = useState(directoryType[0].name);

    const [HashTag, setHashTag] = useState([]);
    const getCollectionsFromUsers = (type) => {
        try {
            fetch('http://34.146.140.88/collections/collections_free', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            }).then((res) => res.json())
                .then((responsedata) => {
                    if(type===1) {
                        //전체
                        setDirectoryData(responsedata.sort(responsedata.collection_pk).reverse())
                    } else if(type===2) {
                        //내 보관함
                        //todo 다른 사용자의 보관함 가져올때 필터링 필요
                        setDirectoryData(responsedata.sort(responsedata.collection_pk).reverse())
                    } else if(type===3) {
                        //todo 일단 수집한게 없으니까 비워둠 ... 다시 해야지
                        setDirectoryData([])
                    } else if(type===4) {
                        setDirectoryData(responsedata.filter(responsedata => responsedata.collection_type == 0))
                    } else if(type===5) {
                        setDirectoryData(responsedata.filter(responsedata => responsedata.collection_type == 1))
                    }
                })
                .catch((err) => {
                    console.error(err)
                });
    
        } catch (err) {
            console.error(err);
        }
    }

    const showDirectories = ({item}) => (
        <TouchableOpacity onPress={()=>props.navigation.navigate('ShowFreeDir')}>
            <View style={styles.directoryContainer}>
                <View style={{height: '68%'}}>
                    <View style={[{zIndex: 10000, flexDirection: 'row', justifyContent: 'space-between'}]}>
                        <View style={[styles.dirType, {borderColor: colors.backgroundColor, backgroundColor: colors.backgroundColor}]}><AppText style={item.collection_type==1 ? styles.dirFreeText : styles.dirPlanText}>{item.collection_type===1 ? '자유' : '일정'}</AppText></View>
                        {item.collection_private === 1 && <View style={{marginRight: 9, marginTop: 8}}><Image style={{width: 20, height: 20}} source={require('../assets/images/lock_outline.png')}></Image></View>}
                    </View>
                    <Image style={styles.defaultImage} source={require('../assets/images/mountain.jpeg')}/>
                </View>
                <View style={{marginLeft: 10}}>
                    <AppText style={{marginVertical: 4, fontSize: 14, fontWeight: 'bold'}}>{item.collection_name}</AppText>
                    <AppText>{item.collection_keywords}</AppText>
                    {/* <View style={{flexDirection: 'row', marginBottom: 18}}>
                        {item.collection_keywords.split(',').map((word, idx) =>(
                            (idx <= word.length) && <AppText key={idx} style={{color: colors.hashTagColor, fontSize: 10, marginEnd: 6.21}}># {word}</AppText>
                        ))}
                    </View> */}
                    <View style={{flexDirection: 'row'}}>
                        <AppText style={{fontSize: 8, width: '60%'}}>by minsun</AppText>
                        <View style={{marginRight: 8, flexDirection: 'row'}}>
                            <Image source={require('../assets/images/here_icon.png')} style={{width: 8, height: 8, margin: 2}}></Image>
                            <AppText style={{fontSize: 8, color: colors.hashTagColor, fontWeight: 'bold'}}>1.2k</AppText>
                        </View>
                        <View style={{marginRight: 8, flexDirection: 'row'}}>
                            <Icon type="ionicon" name={"location"} size={8} color={colors.gray[2]}
                                style={{margin: 2}}></Icon>
                            <AppText style={{fontSize: 8, color: colors.hashTagColor, fontWeight: 'bold'}}>9</AppText>
                        </View>
                    </View>
                </View>
        </View>
    </TouchableOpacity>
    )

    const Keyword = ({type, idx}) => {
        return (
            <View key={idx}
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginVertical: 2
                }}
            >
                <TouchableOpacity onPress={()=>{
                    //todo 야매로 전체 눌렀을때만 새로고침 가능하도록 만들었는데... 하 어떻게 해야할지 고민을 조금더 해봐야할듯
                            let newArr = [...directoryType];
                            if(newArr[type.id-1].pressed) {
                                if(type.id != 1) newArr[type.id-1].pressed = false;
                                setDirectoryType(newArr);
                                getCollectionsFromUsers(type.id)
                            } else {
                                for(let i=0;i<newArr.length;i++) {
                                    if(i == type.id-1) continue;
                                    else newArr[i].pressed = false;
                                }
                                newArr[type.id-1].pressed = true;
                                setDirectoryType(newArr);
                                setSelectedDirType(newArr[type.id-1].name)
                                getCollectionsFromUsers(type.id)
                            }
                            }} style={directoryType[type.id-1].pressed ? styles.selectTypeClicked : styles.selectType}
                            disabled={directoryType[type.id-1].pressed && type.id != 1 ? true : false}
                            >
                            <AppText style={directoryType[type.id-1].pressed ? styles.selectTypeTextClicked : styles.selectTypeText}>{type.name}</AppText>
                </TouchableOpacity>                     
            </View>
        )
    }
    return (
        <View flex={1} style={{backgroundColor: colors.backgroundColor}}>
            <View style={{alignItems: 'center', justifyContent: 'center', backgroundColor: colors.backgroundColor}}>
                <View flexDirection="row" style={{marginVertical: 20}}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        {directoryType.map((name, idx) => (
                            <Keyword type={name} key={idx}/>
                        ))}
                    </ScrollView>
                </View>
                </View>

                <View style={{flexDirection: 'row', width: '90%', justifyContent: 'space-between'}}>
                    <View style={{flexDirection: 'row'}}>
                        <AppText style={{color: colors.mainColor}}>최근 추가순</AppText>
                        <Icon style={{color: colors.mainColor, paddingTop: 1, paddingLeft: 8}} type="ionicon" name={"chevron-down-outline"} size={16}></Icon>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flexDirection: 'row'}}>
                            <Icon style={{color: colors.mainColor, marginTop: 3, marginRight: 2}} type="ionicon" name={"funnel"} size={13}></Icon>
                            <AppText style={{color: colors.mainColor}}>필터</AppText>
                        </View>
                        <View style={{marginHorizontal: 10}}><AppText style={{color: colors.subColor}}>|</AppText></View>
                        <View style={{flexDirection: 'row'}}>
                            <Icon style={{color: colors.mainColor, marginTop: 3, marginRight: 2}} type="ionicon" name={"pencil"} size={13}></Icon>
                            <AppText style={{color: colors.mainColor}}>편집</AppText>
                        </View>
                    </View>
                </View>
            <View style={{marginVertical: '2.5%'}}>
                <AppText style={{color: colors.mainColor, fontSize: 18, fontWeight: 'bold', marginTop: 5}}>{selectedDirType}</AppText>
            </View>
            <ScrollView horizontal={true} scrollEnabled={false}>
                <SafeAreaView>
                    <FlatList contentContainerStyle={{justifyContent: 'space-between'}} numColumns={2} data={directoryData} renderItem={showDirectories} keyExtractor={(item) => item.collection_pk.toString()} nestedScrollEnabled/>
                </SafeAreaView>
            </ScrollView>
        </View>
    );
}

const MypageNavigation = props => {
    const { colors } = useTheme();
    return (
        <Tab.Navigator
            screenOptions={{
                swipeEnabled: true,
                tabBarLabelStyle: {
                    fontSize: 16,
                    fontWeight: 'bold',
                    textAlign: 'center',
                },
                tabBarIndicatorStyle: {
                    backgroundColor: colors.red[3],
                    height: 2,
                    width: Dimensions.get('screen').width/6 * 0.9,
                    marginLeft: Dimensions.get('screen').width/6 * 0.9
                },
                tabBarStyle: {
                    elevation: 0,
                    backgroundColor: colors.backgroundColor,
                    height: 40,
                },
                tabBarActiveTintColor: colors.mainColor,
                tabBarInactiveTintColor: colors.gray[3],
            }}
            style={{paddingBottom: 15, paddingHorizontal: 20}}
        >
            <Tab.Screen name="공간" component={Like} Options={{
                tabBarLabel: {
                    focused: true
                }
            }}/>
            <Tab.Screen name="보관함" component={Collection} navigation={props.navigation}/>
        </Tab.Navigator>
    );
}

export default MypageNavigation;