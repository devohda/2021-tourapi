import React, {useEffect, useState, createContext} from "react";
import { StyleSheet, Image, View, TouchableOpacity, Dimensions, SafeAreaView, FlatList } from "react-native";
import AppText from "../components/AppText";
import Star from "../assets/images/search/star.svg";
import Jewel from '../assets/images/jewel.svg'
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import SearchCollection from '../screens/search/SearchCollection'
// import SearchPlace from '../screens/search/SearchPlace'
import SearchUser from '../screens/search/SearchUser'
import {useTheme} from '@react-navigation/native';
import { searchKeyword } from '../contexts/SearchkeywordContextProvider';
const Tab = createMaterialTopTabNavigator();
const totalWidth = Dimensions.get("screen").width;

var placeListLength = 0;

const SearchPlace = (props) => {
    const {colors} = useTheme();
    const [placeList, setPlaceList] = useState([]);
    const [collectionList, setCollectionList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [searchType, setSearchType] = useState('place');
    const [like, setLike] = useState(false);
    const [keyword, setKeyword] = searchKeyword()
    console.log(keyword)

    const styles = StyleSheet.create({
        info_container : {
            marginLeft: 8,
            paddingVertical : 1.5,
            justifyContent: 'space-between',
            height: '100%'
        },
        score_line : {
            width: 1,
            height: '80%',
            backgroundColor: colors.gray[4],
            marginHorizontal: 4
        }
    })

    useEffect(() => {
        getResults();
    }, []);

    const getResults = () => {
        try {
            fetch(`http://192.168.0.11:3000/search?keyword=${decodeURIComponent(keyword)}&type=${searchType}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            }).then((res) => res.json())
                .then((response) => {
                    setPlaceList(response.data);
                })
                .catch((err) => {
                    console.error(err)
                });

        } catch (err) {
            console.error(err);
        }
    };

    const PlaceContainer = ({item}) => (
        <View flexDirection="row" style={{marginBottom: 8, alignItems: 'center', height: 72, marginTop: 22}}>
            <Image source={require('../assets/images/mountain.jpeg')} style={{borderRadius: 10, width: 72, height: 72}}/>
            <View flex={1} style={styles.info_container}>
                <View flexDirection="row" style={{alignItems: 'center'}}>
                    {/* <AppText style={{fontSize: 10, color: colors.mainColor}}>{}</AppText> */}
                    <View style={styles.score_line}></View>
                    <Star width={14} height={14}/>
                    <AppText style={{fontSize: 10, color: colors.mainColor, marginLeft: 2}}>4.84</AppText>
                </View>
                <AppText style={{fontSize: 16, fontWeight: '700', color: colors.mainColor}}>{item.place_name}</AppText>
                <AppText style={{fontSize: 12, fontWeight: '400', color: colors.gray[4]}}>{item.place_addr}</AppText>
            </View>
            <TouchableOpacity onPress={() => setLike(likeState => !likeState)}>
                <Jewel width={26} height={21} style={{color: like ? colors.red[3] : colors.red_gray[5]}}/>
            </TouchableOpacity>
        </View>
    )

        return (
            <View style={{backgroundColor: colors.backgroundColor}}>
                <SafeAreaView>
                    <FlatList data={placeList} renderItem={PlaceContainer} keyExtractor={(item) => item.place_pk.toString()} nestedScrollEnabled/>
                </SafeAreaView>
            </View>
        )
}

const SearchTabNavigator = (props, {route}) => {
    const {colors} = useTheme();
    // const keyword = props.keyword
    const [keyword, setKeyword] = searchKeyword()
    console.log(keyword)

    return (
        <Tab.Navigator
            sceneContainerStyle={{
                backgroundColor: colors.backgroundColor,
                //만약 검색 결과가 존재하지 않으면 '검색 결과가 존재하지 않습니다' 띄우면 될것
                // height: 72 * placeList.length
            }}
            screenOptions={({route}) => {
                const tabWidth = (totalWidth - 40) / 3;
                const textWidth = route.name.length * 12 + 5;
                

                return ({
                    tabBarActiveTintColor: colors.mainColor,
                    tabBarInactiveTintColor: colors.gray[5],
                    tabBarLabelStyle: {fontSize: 16, fontWeight: '700'},
                    tabBarStyle: {
                        backgroundColor: colors.backgroundColor,
                        elevation: 0,
                        shadowOpacity: 0,
                        justifyContent : 'center',
                        height : 56
                    },
                    
                    tabBarIndicatorStyle: {
                        position: 'absolute',
                        bottom: 14,
                        left: (tabWidth - textWidth) / 2,
                        width: textWidth,
                        backgroundColor: colors.red[3],
                        borderRadius: 6,
                        height: 2
                    },
                })
            }}
        >
            <Tab.Screen name={`공간 ${placeListLength}`} component={SearchPlace}/>
            <Tab.Screen name={`보관함`} component={SearchCollection}/>
            <Tab.Screen name={`유저`} component={SearchUser}/>
        </Tab.Navigator>
    );
};

export default SearchTabNavigator;