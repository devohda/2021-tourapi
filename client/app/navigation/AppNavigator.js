import React, {useEffect} from 'react';
import {useIsSignedIn} from '../contexts/SignedInContextProvider';
import {createStackNavigator} from '@react-navigation/stack';

import HomeNavigator from './HomeNavigator';
import AuthenticationNavigator from './AuthenticationNavigator';
import AuthenticationNavigator2 from './AuthenticationNavigator2';
import SearchScreen from '../screens/SearchScreen';
import PlaceScreen from '../screens/PlaceScreen';
import MakePlanCollectionScreen from '../screens/collection/MakePlanCollectionScreen';
import MakeFreeCollectionScreen from '../screens/collection/MakeFreeCollectionScreen';
import PlanCollectionScreen from '../screens/collection/PlanCollectionScreen';
import FreeCollectionScreen from '../screens/collection/FreeCollectionScreen';
import SystemSettingScreen from '../screens/settings/SystemSettingScreen';
import ProfileSettingScreen from '../screens/settings/ProfileSettingScreen';
import {useToken} from '../contexts/TokenContextProvider';
import SearchScreenForPlan from '../screens/collection/SearchScreenForPlan';
import MakeReviewScreen from '../screens/review/MakeReviewScreen';

import * as SecureStore from 'expo-secure-store';
const MainStack = createStackNavigator();


const AppNavigator = () => {
    const [isSignedIn, setIsSignedIn] = useIsSignedIn(false);
    const [token, setToken] = useToken();

    const getTokenAndLogin = async () => {
        const accessToken = await SecureStore.getItemAsync('accessToken');
        // TODO 자동로그인 끄려면 밑의 주석 해제 하세요.
        // await SecureStore.deleteItemAsync('accessToken');
        if(accessToken){
            // 토큰 불러와서 전역 context 에 저장하기.
            setToken(accessToken);
            // 토큰으로 정보 조회해서 로그인 됐으면 main으로 이동 아니면 그대로.
            setIsSignedIn(true);
            return;
        }

        // TODO 건너뛰기 한 경우에도 저장된 정보 불러오기
        //  건너뛰기 주석 풀면 구현은 되나, 권한 처리가 안 되어서 나중에 주석 풀기!
        // const isSignedIn = await SecureStore.getItemAsync('isSignedIn');
        // if(isSignedIn){
        //     setIsSignedIn(true);
        // }
    };

    useEffect(() => {
        // 자동 로그인 기능
        getTokenAndLogin().catch(err => console.log(err));
    }, []);

    return (
        <MainStack.Navigator screenOptions={{headerShown: false}}>
            {!isSignedIn ?
                <MainStack.Screen name="Authentication" component={AuthenticationNavigator}/> :
                <>
                    <MainStack.Screen name="App" children={({navigation}) => <HomeNavigator navigation={navigation}/>}/>
                    <MainStack.Screen name="Search" component={SearchScreen} />
                    <MainStack.Screen name="SearchForPlan" component={SearchScreenForPlan} />
                    <MainStack.Screen name="Place" component={PlaceScreen}/>
                    <MainStack.Screen name="MakeReview" component={MakeReviewScreen} />
                    <MainStack.Screen name="MakePlanCollection" component={MakePlanCollectionScreen} />
                    <MainStack.Screen name="MakeFreeCollection" component={MakeFreeCollectionScreen}/>
                    <MainStack.Screen name="SystemSetting" component={SystemSettingScreen} />
                    <MainStack.Screen name="ProfileSetting" component={ProfileSettingScreen} />
                    <MainStack.Screen name="Authentication2" component={AuthenticationNavigator2}/>
                    <MainStack.Screen name="PlanCollection" component={PlanCollectionScreen} />
                    <MainStack.Screen name="FreeCollection" component={FreeCollectionScreen} />
                </>
            }
        </MainStack.Navigator>
    );
};

export default AppNavigator;