import React, {useEffect, useState} from "react";
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import SearchCollection from '../screens/search/SearchCollection'
import SearchPlace from '../screens/search/SearchPlace'
import SearchUser from '../screens/search/SearchUser'
import {Dimensions, TouchableOpacity, View, Text} from "react-native";
import {useTheme} from '@react-navigation/native';
import Animated from 'react-native-reanimated';

const Tab = createMaterialTopTabNavigator();
const totalWidth = Dimensions.get("screen").width;

const SearchTabNavigator = (props) => {
    const {colors} = useTheme();
    const [placeList, setPlaceList] = useState([]);
    const [collectionList, setCollectionList] = useState([]);
    const [userList, setUserList] = useState([]);

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
                    tabBarActiveTintColor: colors.blue[2],
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
            <Tab.Screen name={`공간 ${placeList.length}`} component={SearchPlace} />
            <Tab.Screen name={`보관함 ${collectionList.length}`} component={SearchCollection}/>
            <Tab.Screen name={`유저 ${userList.length}`} component={SearchUser}/>
        </Tab.Navigator>
    );
};

export default SearchTabNavigator;