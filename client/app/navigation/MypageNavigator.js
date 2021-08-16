import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Image, ScrollView, Text, View, FlatList, SafeAreaView, Dimensions, TouchableOpacity} from "react-native";
import {StyleSheet} from "react-native";
import OIcon from 'react-native-vector-icons/Octicons'
import React, {useEffect, useState} from "react";
import { Icon } from 'react-native-elements';

const Tab = createMaterialTopTabNavigator();


function Like() {
    return (
        <View flex={1} backgroundColor="#FCF6F5">
            <View style={{flexDirection: 'row', paddingTop: 12}}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={{color: '#40516E'}}>최근 추가순</Text>
                    <Icon style={{color: '#40516E', paddingTop: 1, paddingLeft: 8}} type="ionicon" name={"chevron-down-outline"} size={16}></Icon>
                </View>
                <View style={{flexDirection: 'row', marginLeft:'40%'}}>
                    <View style={{flexDirection: 'row'}}>
                        <Icon style={{color: '#40516E', marginTop: 3, marginRight: 2}} type="ionicon" name={"funnel"} size={13}></Icon>
                        <Text style={{color: '#40516E'}}>필터</Text>
                    </View>
                    <View style={{marginHorizontal: 10}}><Text>|</Text></View>
                    <View style={{flexDirection: 'row'}}>
                        <Icon style={{color: '#40516E', marginTop: 3, marginRight: 2}} type="ionicon" name={"pencil"} size={13}></Icon>
                        <Text style={{color: '#40516E'}}>편집</Text>
                    </View>
                </View>
            </View>
            {/* <View flexDirection="row" style={{marginVertical: 20}}>
                <View className="keyword" style={styles.keyword_1}>
                    <Text style={{fontWeight: "bold", color: "white"}}>전체</Text>
                </View>
                <View className="keyword" style={styles.keyword_2}>
                    <Text style={{fontWeight: "bold", color: "white"}}>장소</Text>
                </View>
                <View className="keyword" style={styles.keyword_2}>
                    <Text style={{fontWeight: "bold", color: "white"}}>보관함</Text>
                </View>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="place-container"
                      flexDirection="row"
                      style={{
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginVertical: 20,
                          height: 80
                      }}>
                    <View className="place-img">
                        <Image style={{width: 80, height: 80, borderRadius: 10}}
                               source={require('../assets/images/mountain.jpeg')}
                               resizeMode="cover"
                        />
                    </View>
                    <View style={{
                        flex: 1,
                        height: "100%",
                        justifyContent: 'space-around',
                        paddingVertical: 12,
                        marginLeft: 20
                    }}>
                        <Text style={{fontSize: 22, fontWeight: '900'}}>청계산</Text>
                        <Text style={{fontSize: 16}}>뭐가들어가야할가..</Text>
                    </View>
                    <View flexDirection="column" style={{alignItems: "center", marginRight: 20}}>
                        <OIcon name="heart" size={30} color="#000"/>
                        <Text>4.7k</Text>
                    </View>
                </View>
                <View className="place-container"
                      flexDirection="row"
                      style={{
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginVertical: 20,
                          height: 80
                      }}>
                    <View className="place-img">
                        <Image style={{width: 80, height: 80, borderRadius: 10}}
                               source={require('../assets/images/mountain.jpeg')}
                               resizeMode="cover"
                        />
                    </View>
                    <View style={{
                        flex: 1,
                        height: "100%",
                        justifyContent: 'space-around',
                        paddingVertical: 12,
                        marginLeft: 20
                    }}>
                        <Text style={{fontSize: 22, fontWeight: '900'}}>청계산</Text>
                        <Text style={{fontSize: 16}}>뭐가들어가야할가..</Text>
                    </View>
                    <View flexDirection="column" style={{alignItems: "center", marginRight: 20}}>
                        <OIcon name="heart" size={30} color="#000"/>
                        <Text>4.7k</Text>
                    </View>
                </View>
                <View className="place-container"
                      flexDirection="row"
                      style={{
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginVertical: 20,
                          height: 80
                      }}>
                    <View className="place-img">
                        <Image style={{width: 80, height: 80, borderRadius: 10}}
                               source={require('../assets/images/mountain.jpeg')}
                               resizeMode="cover"
                        />
                    </View>
                    <View style={{
                        flex: 1,
                        height: "100%",
                        justifyContent: 'space-around',
                        paddingVertical: 12,
                        marginLeft: 20
                    }}>
                        <Text style={{fontSize: 22, fontWeight: '900'}}>청계산</Text>
                        <Text style={{fontSize: 16}}>뭐가들어가야할가..</Text>
                    </View>
                    <View flexDirection="column" style={{alignItems: "center", marginRight: 20}}>
                        <OIcon name="heart" size={30} color="#000"/>
                        <Text>4.7k</Text>
                    </View>
                </View>
                <View className="place-container"
                      flexDirection="row"
                      style={{
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginVertical: 20,
                          height: 80
                      }}>
                    <View className="place-img">
                        <Image style={{width: 80, height: 80, borderRadius: 10}}
                               source={require('../assets/images/mountain.jpeg')}
                               resizeMode="cover"
                        />
                    </View>
                    <View style={{
                        flex: 1,
                        height: "100%",
                        justifyContent: 'space-around',
                        paddingVertical: 12,
                        marginLeft: 20
                    }}>
                        <Text style={{fontSize: 22, fontWeight: '900'}}>청계산</Text>
                        <Text style={{fontSize: 16}}>뭐가들어가야할가..</Text>
                    </View>
                    <View flexDirection="column" style={{alignItems: "center", marginRight: 20}}>
                        <OIcon name="heart" size={30} color="#000"/>
                        <Text>4.7k</Text>
                    </View>
                </View>
                <View className="place-container"
                      flexDirection="row"
                      style={{
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginVertical: 20,
                          height: 80
                      }}>
                    <View className="place-img">
                        <Image style={{width: 80, height: 80, borderRadius: 10}}
                               source={require('../assets/images/mountain.jpeg')}
                               resizeMode="cover"
                        />
                    </View>
                    <View style={{
                        flex: 1,
                        height: "100%",
                        justifyContent: 'space-around',
                        paddingVertical: 12,
                        marginLeft: 20
                    }}>
                        <Text style={{fontSize: 22, fontWeight: '900'}}>청계산</Text>
                        <Text style={{fontSize: 16}}>뭐가들어가야할가..</Text>
                    </View>
                    <View flexDirection="column" style={{alignItems: "center", marginRight: 20}}>
                        <OIcon name="heart" size={30} color="#000"/>
                        <Text>4.7k</Text>
                    </View>
                </View>
            </ScrollView> */}
        </View>

    );
}

function Collection() {
    useEffect(() => {
        getCollectionsFromUsers(1);
    }, [])
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
    const [HashTag, setHashTag] = useState([]);
    const getCollectionsFromUsers = (type) => {
        try {
            fetch('http://172.30.1.38:3000/collections/collections_free', {
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
        <View style={styles.rankingContainer}>
            <View style={{height: '68%'}}>
                <View style={styles.dirType}>
                    <View><Text style={item.collection_type==1 ? styles.dirFreeText : styles.dirPlanText}>{item.collection_type===1 ? '자유' : '일정'}</Text></View>
                    {item.collection_private === 1 && <View><Image style={{width: 20, height: 20}} source={require('../assets/images/lock.png')}></Image></View>}
                </View>
                <Image style={styles.defaultImage} source={require('../assets/images/mountain.jpeg')}></Image>
            </View>
            <View style={{marginLeft: 10}}>
                <Text style={{marginVertical: 4, fontSize: 14, fontWeight: 'bold'}}>{item.collection_name}</Text>
                <View style={{flexDirection: 'row', marginBottom: 18}}>
                    {item.collection_keywords.split(',').map((word, idx) =>(
                        (idx <= word.length) && <Text key={idx} style={{color: '#9DA2AB', fontSize: 10, marginEnd: 6.21}}># {word}</Text>
                    ))}
                </View>
                <View style={{flexDirection: 'row'}}>
                    <Text style={{fontSize: 8, width: '60%'}}>by minsun</Text>
                    <View style={{marginRight: 8, flexDirection: 'row'}}>
                        <Image source={require('../assets/images/here_icon.png')} style={{width: 8, height: 8, margin: 2}}></Image>
                        <Text style={{fontSize: 8, color: '#929292', fontWeight: 'bold'}}>1.2k</Text>
                    </View>
                    <View style={{marginRight: 8, flexDirection: 'row'}}>
                        <Icon type="ionicon" name={"location"} size={8} color="#929292"
                            style={{margin: 2}}></Icon>
                        <Text style={{fontSize: 8, color: '#929292', fontWeight: 'bold'}}>9</Text>
                    </View>
                </View>
            </View>
    </View>

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
                            <Text style={directoryType[type.id-1].pressed ? styles.selectTypeTextClicked : styles.selectTypeText}>{type.name}</Text>
                </TouchableOpacity>                     
            </View>
        )
    }
    const [selectedDirType, setSelectedDirType] = useState(directoryType[0].name)
    return (
        <View flex={1} >
            <View backgroundColor="#FCF6F5" style={{alignItems: 'center', justifyContent: 'center'}}>
                <View flexDirection="row" style={{marginVertical: 20}}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        {directoryType.map((name, idx) => (
                            <Keyword type={name} key={idx}/>
                        ))}
                    </ScrollView>
                </View>
                </View>
            
                <View style={{flexDirection: 'row', width: '100%'}}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{color: '#40516E'}}>최근 추가순</Text>
                        <Icon style={{color: '#40516E', paddingTop: 1, paddingLeft: 8}} type="ionicon" name={"chevron-down-outline"} size={16}></Icon>
                    </View>
                    <View style={{flexDirection: 'row', marginLeft:'47.5%'}}>
                        <View style={{flexDirection: 'row'}}>
                            <Icon style={{color: '#40516E', marginTop: 3, marginRight: 2}} type="ionicon" name={"funnel"} size={13}></Icon>
                            <Text style={{color: '#40516E'}}>필터</Text>
                        </View>
                        <View style={{marginHorizontal: 10}}><Text>|</Text></View>
                        <View style={{flexDirection: 'row'}}>
                            <Icon style={{color: '#40516E', marginTop: 3, marginRight: 2}} type="ionicon" name={"pencil"} size={13}></Icon>
                            <Text style={{color: '#40516E'}}>편집</Text>
                        </View>
                    </View>
                </View>
            <View style={{marginBottom: '2.5%'}}>
                <Text style={{color: '#7B9ACC', fontSize: 18, fontWeight: 'bold', marginTop: '5%'}}>{selectedDirType}</Text>
            </View>
            <ScrollView horizontal={true} scrollEnabled={false}>
                <SafeAreaView style={{justifyContent: 'space-between', alignItems: 'center'}}>
                    <FlatList numColumns={2} data={directoryData} renderItem={showDirectories} keyExtractor={(item) => item.collection_pk.toString()} nestedScrollEnabled/>
                </SafeAreaView>
            </ScrollView>
        </View>
    );
}

const MypageNavigation = () => {
    return (
        <Tab.Navigator
            swipeEnabled={true}
            tabBarOptions={{
                labelStyle: {
                    fontSize: 16,
                    fontWeight: 'bold',
                    textAlign: 'center'
                },
                indicatorStyle: {
                    backgroundColor: "#F07A7A",
                    height: 2,
                    width: 50,
                    marginLeft: Dimensions.get('screen').width/6.2,
                },
                style: {
                    elevation: 0,
                    backgroundColor: '#FCF6F5',
                    height: 40
                },
                activeTintColor: '#40516E',
                inactiveTintColor: '#9DA2AB'
            }}
            style={{paddingBottom: 15}}
        >
            <Tab.Screen name="공간" component={Like} Options={{
                tabBarLabel: {
                    focused: true
                }
            }}/>
            <Tab.Screen name="보관함" component={Collection}/>
        </Tab.Navigator>
    );
}


const styles = StyleSheet.create({
    keyword_1 : {
        backgroundColor: "black",
        paddingVertical: 5,
        paddingHorizontal: "3%",
        borderRadius: 14,
        alignItems: "center",
        flexDirection: "row",
        marginRight: "3%"
    },
    keyword_2 : {
        backgroundColor : "#bbb",
        paddingVertical: 5,
        paddingHorizontal: "3%",
        borderRadius: 14,
        alignItems: "center",
        flexDirection: "row",
        marginRight: "3%"
    },
    rankingContainer: {
        backgroundColor: 'white',
        marginEnd: Dimensions.get('screen').width/15,
        marginTop: 11,
        width: 162,
        height: 249,
        // borderRadius: 10,
        // alignItems: 'center',
        // justifyContent: 'space-between'
    },
    dirType: {
        borderColor: '#FCF6F5',
        borderWidth: 1,
        paddingVertical: 1,
        paddingHorizontal: 8.5,
        borderRadius: 14,
        elevation: 1,
        backgroundColor: '#FCF6F5',
        width: 43,
        height: 22,
        marginLeft: 9,
        marginTop: 8,
        flexDirection: 'row',
        zIndex: 10000,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    dirFreeText: {
        color: '#7B9ACC',
        fontSize: 12,
        textAlign: 'center',
        textAlignVertical: 'center',
        marginVertical: 2
    },
    dirPlanText: {
        color: '#F07A7A',
        fontSize: 12,
        textAlign: 'center',
        textAlignVertical: 'center',
        // fontWeight: 'bold',
        marginVertical: 2
    },
    defaultImage: {
        width: '100%',
        height: 162,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        position: 'absolute',
    },
    selectType: {
        borderColor: '#fff',
        borderWidth: 1,
        paddingVertical: 1,
        paddingHorizontal: 8.5,
        borderRadius: 12,
        marginRight: 10,
        shadowColor: '#470000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        elevation: 1,
        backgroundColor: '#fff',
        height: 28,
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectTypeClicked: {
        borderColor: '#7B9ACC',
        borderWidth: 1,
        paddingVertical: 1,
        paddingHorizontal: 8.5,
        borderRadius: 12,
        marginRight: 10,
        shadowColor: '#470000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        elevation: 1,
        backgroundColor: '#7B9ACC',
        height: 28,
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectTypeTextClicked: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontWeight: 'bold',
        marginVertical: 2
    },
    selectTypeText: {
        color: '#BDC2CA',
        fontSize: 14,
        textAlign: 'center',
        textAlignVertical: 'center',
        // fontWeight: 'bold',
        marginVertical: 2
    },
})
export default MypageNavigation;