import React, {useState, useEffect} from 'react';
import {Alert, Dimensions} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {useTheme} from '@react-navigation/native';
const Tab = createMaterialTopTabNavigator();
const totalWidth = Dimensions.get('screen').width;

import SearchPlace from '../screens/search/SearchPlace';
import SearchCollection from '../screens/search/SearchCollection';
import SearchUser from '../screens/search/SearchUser';

import { useToken } from '../contexts/TokenContextProvider';
import {useIsSignedIn} from '../contexts/SignedInContextProvider';
import * as SecureStore from 'expo-secure-store';


const SearchTabNavigator = ({navigation}) => {
    const {colors} = useTheme();
    const [token, setToken] = useToken();
    const [userData, setUserData] = useState({});
    const [searchPlace, setSearchPlace] = useState(0);
    const [searchCollection, setSearchCollection] = useState(0);
    const [searchUser, setSearchUser] = useState(0);
    const [userNickname, setUserNickname] = useState('');
    const [isSignedIn, setIsSignedIn] = useIsSignedIn();
    const [alertDuplicated, setAlertDuplicated] = useState(false);

    useEffect(() => {
        getUserData();
    },[]);

    const countPlace = (length) => {
        setSearchPlace(length);
    };

    const countCollection = (length) => {
        setSearchCollection(length);
    };
    const countUser = (length) => {
        setSearchUser(length);
    };

    const getUserData = () => {
        try {
            fetch('http://34.64.185.40/user', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
            }).then((res) => res.json())
                .then(async (response) => {
                    if (response.code === 405 && !alertDuplicated) {
                        Alert.alert('', '다른 기기에서 로그인했습니다.');
                        setAlertDuplicated(true);
                    }

                    if (parseInt(response.code / 100) === 4) {
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }

                    await setUserData(response.data);
                    await setUserNickname(response.data.user_nickname);
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

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
                });
            }}
        >
            <Tab.Screen name={`공간 ${searchPlace}`} children={() => <SearchPlace navigation={navigation} countPlace={countPlace}/>}/>
            <Tab.Screen name={`보관함 ${searchCollection}`} children={() => <SearchCollection navigation={navigation} user={userNickname} countCollection={countCollection}/>}/>
            <Tab.Screen name={`유저 ${searchUser}`} children={() => <SearchUser navigation={navigation} countUser={countUser}/>}/>
        </Tab.Navigator>
    );
};

export default SearchTabNavigator;