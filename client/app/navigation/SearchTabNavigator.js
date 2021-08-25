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


const MyTabBar = ({state, descriptors, navigation, position, colors}) => {

    const Indicator = () => {

        return (
            <Animated.View
                style={{
                    height: 4,
                    width: '100%',
                    backgroundColor: colors.red[3],
                    borderRadius: 6,
                }}>
            </Animated.View>
        )
    }
    return (
        <View style={{marginVertical: 16}}>
            <View flexDirection="row" style={{marginBottom: 5}}>
                {state.routes.map((route, index) => {
                    const {options} = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.name;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                        });

                        // 클릭 시 해당 스크린으로 이동
                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    // modify inputRange for custom behavior
                    const inputRange = state.routes.map((_, i) => i);
                    const opacity = Animated.interpolateNode(position, {
                        inputRange,
                        outputRange: inputRange.map((i) => (i === index ? 1 : 0)),
                    });

                    return (
                        <TouchableOpacity
                            accessibilityRole="button"
                            accessibilityState={isFocused ? {selected: true} : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={{
                                flex: 1,
                                alignItems: 'center'
                            }}
                            key={index}
                        >
                            <Text style={{
                                fontSize: 16,
                                fontWeight: '700',
                                color: isFocused ? colors.blue[2] : colors.gray[5],
                            }}>
                                {label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
            <Indicator/>
        </View>
    )
}

const SearchTabNavigator = (props) => {
    const {colors} = useTheme();
    const [placeList, setPlaceList] = useState([]);
    const [collectionList, setCollectionList] = useState([]);
    const [userList, setUserList] = useState([]);

    return (
        <Tab.Navigator
            // tabBar={(props) => <MyTabBar {...{...props, colors: colors}} />}
            screenOptions={({route}) => {
                const tabWidth = (totalWidth - 40) / 3;
                const textWidth = 30 + 10 * 5;

                return ({
                    tabBarActiveTintColor: colors.blue[2],
                    tabBarInactiveTintColor: colors.gray[5],
                    tabBarLabelStyle: { fontSize: 16, fontWeight : '700' },
                    tabBarStyle: { backgroundColor: colors.backgroundColor },
                    tabBarIndicatorStyle : {
                        position : 'absolute',
                        bottom : 10,
                        left : (tabWidth - textWidth) / 2,
                        width : textWidth,
                        backgroundColor : colors.red[3],
                        borderRadius : 6,
                        height : 2
                    }
                })
            }}
        >
            <Tab.Screen name="Places" component={SearchPlace} options={{title: `공간 102`}}/>
            <Tab.Screen name="Collections" component={SearchCollection}
                        options={{title: `보관함 0`}}/>
            <Tab.Screen name="Users" component={SearchUser} options={{title: `유저 12`}}/>
        </Tab.Navigator>
    );
};

export default SearchTabNavigator;