import React, {useState} from "react";
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import SearchCollection from '../screens/search/SearchCollection'
import SearchPlace from '../screens/search/SearchPlace'
import SearchUser from '../screens/search/SearchUser'
import {Dimensions} from "react-native";
import { useTheme } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();

const SearchTabNavigator = (props) => {
    const {colors} = useTheme();
    const [placeList, setPlaceList] = useState([]);
    const [collectionList, setCollectionList] = useState([]);
    const [userList, setUserList] = useState([]);

    return (
        <Tab.Navigator
            swipeEnabled={true}
            tabBarOptions={{
                labelStyle: {
                    fontSize: 16,
                    fontWeight: 'bold',
                    textAlign: 'center',
                },
                indicatorStyle: {
                    backgroundColor: colors.emphasizedColor,
                    height: 2,
                    // width: 50,
                    // marginLeft: Dimensions.get('screen').width/6.2,
                    // marginLeft: Platform.OS === 'ios' ? Dimensions.get('screen').width/6 : Dimensions.get('screen').width/6.2
                    width: Dimensions.get('screen').width/6 * 0.9,
                    marginLeft: Dimensions.get('screen').width/6 * 0.9
                },
                style: {
                    elevation: 0,
                    backgroundColor: colors.backgroundColor,
                    height: 40,
                },
                activeTintColor: colors.mainTextColor,
                inactiveTintColor: colors.textNotClicked,
            }}
            style={{paddingBottom: 15}}
        >
            <Tab.Screen name="Places" component={SearchPlace} options={{tabBarLabel: 'Home'}}/>
            <Tab.Screen name="Collections" component={SearchCollection} options={{tabBarLabel: 'Updates'}}/>
            <Tab.Screen name="Users" component={SearchUser} options={{tabBarLabel: 'Profile'}}/>
        </Tab.Navigator>
    );
};

export default SearchTabNavigator;