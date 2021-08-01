import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Image, ScrollView, Text, View} from "react-native";
import {StyleSheet} from "react-native";
import OIcon from 'react-native-vector-icons/Octicons'
import React from "react";

const Tab = createMaterialTopTabNavigator();


function Like() {
    return (
        <View flex={1} backgroundColor="#fff">
            <View flexDirection="row" style={{marginVertical: 20}}>
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
            </ScrollView>
        </View>

    );
}

function Temporary() {
    return (
        <View flex={1} backgroundColor="#fff">
            <View flexDirection="row" style={{marginVertical: 20}}>
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
            </ScrollView>
        </View>

    );
}

function Collection() {
    return (
        <View flex={1} backgroundColor="#fff">
            <View flexDirection="row" style={{marginVertical: 20}}>
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
                    fontSize: 19,
                    fontWeight: '800'
                },
                indicatorStyle: {
                    backgroundColor: "black",
                    height: 3,
                },
                height: 100,
                style: {
                    paddingBottom: 4,
                    elevation: 0
                }
            }}
            style={{height: 10}}
        >
            <Tab.Screen name="찜" component={Like} Options={{
                title: "hello",
                tabBarLabel: {
                    focused: true,
                    color: "pink"
                }
            }}/>
            <Tab.Screen name="임시보관함" component={Temporary}/>
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
    }
})
export default MypageNavigation;