import React from "react";
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Dimensions} from "react-native";
import { useTheme } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();
import PlaceTab from "../screens/mypage/placeTab";
import CollectionTab from "../screens/mypage/collectionTab";

const MyPageNavigation = () => {
    const { colors } = useTheme();
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarLabelStyle: {
                    fontSize: 16,
                    fontWeight: 'bold',
                    textAlign: 'center',
                },
                tabBarIndicatorStyle: {
                    position: 'absolute',
                    bottom: 10,
                    backgroundColor: colors.red[3],
                    borderRadius : 6,
                    height: 2,
                    width: Dimensions.get('screen').width/6 * 0.8,
                    marginLeft: Dimensions.get('screen').width/6 * 1.1,
                },
                tabBarStyle: {
                    elevation: 0,
                    shadowOpacity: 0,
                    backgroundColor: colors.backgroundColor,
                },
                tabBarActiveTintColor: colors.mainColor,
                tabBarInactiveTintColor: colors.gray[3],
                swipeEnabled : true
            }}
        >
            <Tab.Screen name="공간" component={PlaceTab}/>
            <Tab.Screen name="보관함" component={CollectionTab}/>
        </Tab.Navigator>
    );
}

export default MyPageNavigation;