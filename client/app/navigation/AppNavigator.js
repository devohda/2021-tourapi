import React, {useEffect, useState} from 'react';
import {useIsSignedIn} from '../contexts/SignedInContextProvider';
import {createStackNavigator} from '@react-navigation/stack';

import HomeNavigator from './HomeNavigator';
import AuthenticationNavigator from './AuthenticationNavigator';
import AuthenticationNavigator2 from './AuthenticationNavigator2';
import SearchScreen from '../screens/SearchScreen';
import PlaceScreen from '../screens/PlaceScreen';
import MakeFreeCollectionScreen from '../screens/collection/MakeFreeCollectionScreen';
import FreeCollectionScreen from '../screens/collection/FreeCollectionScreen';
import SystemSettingScreen from '../screens/settings/SystemSettingScreen';

import SecureStore from 'expo-secure-store';

const MainStack = createStackNavigator();


const AppNavigator = () => {
    const [isSignedIn, setIsSignedIn] = useIsSignedIn(false);

    const getTokenAndLogin = async () => {

        const tokens = await SecureStore.getItemAsync('tokens');
        if(tokens){

            // 토큰으로 정보 조회해서 로그인 됐으면 main으로 이동 아니면 그대로.
            setIsSignedIn(true);
        }
    };

    useEffect(() => {
        // 자동 로그인 기능

        // 저장된 토큰 꺼내기
        getTokenAndLogin().catch(err => console.log(err));
    }, [isSignedIn]);

    return (
        <MainStack.Navigator screenOptions={{headerShown: false}}>
            {!isSignedIn ?
                <MainStack.Screen name="Authentication" component={AuthenticationNavigator}/> :
                <>
                    <MainStack.Screen name="App" children={({navigation}) => <HomeNavigator navigation={navigation}/>}/>
                    <MainStack.Screen name="Search" component={SearchScreen} />
                    <MainStack.Screen name="Place" component={PlaceScreen}/>
                    <MainStack.Screen name="MakeFreeCollection" component={MakeFreeCollectionScreen}/>
                    <MainStack.Screen name="FreeCollection" component={FreeCollectionScreen} />
                    <MainStack.Screen name="SystemSetting" component={SystemSettingScreen} />
                    <MainStack.Screen name="Authentication" component={AuthenticationNavigator2}/>
                </>
            }
        </MainStack.Navigator>
    );
};

export default AppNavigator;