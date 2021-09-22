import React from "react";
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Dimensions} from "react-native";
import { useTheme } from '@react-navigation/native';

const totalWidth = Dimensions.get('screen').width;
const Tab = createMaterialTopTabNavigator();
import PlaceTab from "../screens/mypage/placeTab";
import CollectionTab from "../screens/mypage/collectionTab";

const MyPageNavigation = ({navigation}) => {
    const { colors } = useTheme();
    return (
        <Tab.Navigator
        screenOptions={({route}) => {
            const tabWidth = (totalWidth - 3) / 2;
            const textWidth = route.name.length * 14 + 5;

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
            });
        }}
        >
            <Tab.Screen name="찜" children={() => <PlaceTab navigation={navigation} />}/>
            <Tab.Screen name="내 보관함" children={() => <CollectionTab navigation={navigation}/>}/>
        </Tab.Navigator>
    );
}

export default MyPageNavigation;