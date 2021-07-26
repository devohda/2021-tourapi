import React from 'react';
import { Menu, Button, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, SafeAreaView, ScrollView, ImageBackground } from 'react-native';
import { Icon } from 'react-native-elements';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import SideMenu from 'react-native-side-menu';

import MyPage from './MyPage';
import SubAuth from './SubAuth';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    );
}

function forMainPage({navigation}) {
    return (
        <>
            <SafeAreaView>
                <ScrollView>
                <Drawer.Navigator initialRouteName="MyPage">
                    <Drawer.Screen name="MyPage" component={MyPage} />
                    <Drawer.Screen name="SubAuth" component={SubAuth} />
                    </Drawer.Navigator>
                    <View>
                        <View style={styles.blackRect}>
                            <Text style={{color: 'white', left: 16, top: 45, fontSize: 24, fontWeight: 'bold'}}>
                                <Text>가장 인기있는{"\n"}</Text>
                                <Text>보관함</Text>
                            </Text>
                        </View>
                        <View style={{position: 'absolute'}}>
                            <View style={{flexDirection: 'row', left: 16, top: 140}}>
                                <TouchableOpacity style={styles.selectedRankings}><Text style={styles.selectedRankingsText}>일간</Text></TouchableOpacity>
                                <TouchableOpacity style={styles.notSelectedRankings}><Text style={styles.notSelectedRankingsText}>주간</Text></TouchableOpacity>
                                <TouchableOpacity style={styles.notSelectedRankings}><Text style={styles.notSelectedRankingsText}>월간</Text></TouchableOpacity>
                            </View>
                            {/* 데이터 붙여서(for문?) 들어가게 */}
                            <View style={styles.rankingContainer}>
                                <View style={styles.defaultImage}></View>
                                <View style={{marginLeft: 10}}>
                                    <Text style={{marginVertical: 8, fontSize: 16, fontWeight: 'bold'}}>하루만에 북촌 정복하기</Text>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={{fontSize: 12, marginEnd: 65}}>meeeeensun</Text>
                                        <Icon type="ionicon" name={"eye"} size={12} color="#929292" style={{marginHorizontal: 3,marginVertical: 2}}></Icon>
                                        <Text style={{fontSize: 12, color: '#929292', fontWeight: 'bold'}}>1.3k</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{marginTop: 110}}>
                            <Text style={styles.titles}>요즘 뜨는 수집가</Text>
                            <View style={{flexDirection: 'row'}}>
                                <Image style={styles.authorImage} source={{uri:'https://via.placeholder.com/150/92c952'}}></Image>
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
                                <ScrollView horizontal>
                                    {/* 보여주기 식으로 두개 dp 했을 뿐이고 실제론 하나로 돌릴 예정 */}
                                    <ImageBackground source={{uri: 'https://via.placeholder.com/150/56a8c2'}} style={styles.regionImage} imageStyle={{borderRadius: 15}}>
                                        <View style={styles.regionText}>
                                            <Text style={{fontSize: 16, fontWeight: 'bold', color: '#fff'}}>충청북도 단양</Text>
                                        </View>
                                    </ImageBackground>
                                    <ImageBackground source={{uri: 'https://via.placeholder.com/150/1ee8a4'}} style={styles.regionImage} imageStyle={{borderRadius: 15}}>
                                        <View style={styles.regionText}>
                                            <Text style={{fontSize: 16, fontWeight: 'bold', color: '#fff'}}>전라남도 여수</Text>
                                        </View>
                                    </ImageBackground>
                                </ScrollView>
                            </View>
                        </View>
                        <View style={{marginVertical: 45}}>
                            <Text style={styles.titles}>요즘 뜨는 공간</Text>
                            <View style={{flexDirection: 'row', paddingLeft: 28, marginTop: 20}}>
                                <Image source={{uri:'https://via.placeholder.com/150/56acb2'}} style={{width: 150, height: 100, borderRadius: 15}}></Image>
                                <View style={{width: 25, height: 15, backgroundColor: 'black', borderRadius: 70, left: 18, top: 10}}><Text style={{color:'white', textAlign: 'center', fontSize: 10, fontWeight: 'bold'}}>4.8</Text></View>
                                <View style={{flexDirection: 'row', top: 10, left: 22}}>
                                    <Icon type="ionicon" name={"star"} size={12}></Icon>
                                    <Icon type="ionicon" name={"star"} size={12}></Icon>
                                    <Icon type="ionicon" name={"star"} size={12}></Icon>
                                    <Icon type="ionicon" name={"star-half-outline"} size={12}></Icon>
                                    <Icon type="ionicon" name={"star-outline"} size={12}></Icon>
                                </View>
                                <Text style={{top: 40, right: 66}}>
                                    <Text style={{fontSize: 17, fontWeight: 'bold', flexDirection: 'column'}}>경복궁{"\n"}</Text>
                                    <Text></Text>
                                    <Text>서울시 종로구</Text>
                                </Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
      );

}

export default function MainPage({navigation}) {
    return (
    //   <NavigationContainer>
        <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}>
          <Drawer.Screen name="MainPage" component={forMainPage} />
          <Drawer.Screen name="MyPage" component={MyPage} />
        </Drawer.Navigator>
    //   </NavigationContainer>
    )
  }



const styles = StyleSheet.create({
    blackRect : {
        height: 398,
        backgroundColor: 'black',
        position: 'relative'
    },
    selectedRankings : {
        backgroundColor : '#FFF0B4',
        borderRadius: 10,
        marginEnd: 16

    },
    notSelectedRankings : {
        backgroundColor : 'black',
        borderRadius: 10,
        marginEnd: 16

    },
    selectedRankingsText : {
        color: 'black',
        fontWeight: 'bold',
        paddingHorizontal: 16,
        paddingVertical: 2,
        fontSize: 13
    },
    notSelectedRankingsText : {
        color: 'white',
        fontWeight: 'bold',
        paddingHorizontal: 16,
        paddingVertical: 2,
        fontSize: 13
    },
    rankingContainer: {
        backgroundColor: 'white',
        width: 197,
        height: 282,
        top: 160,
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
    titles : {
        color:'black',
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
    regionImage : {
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