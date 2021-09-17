import HomeNavigator from './HomeNavigator';
import AuthenticationNavigator from './AuthenticationNavigator';
import React, {useState} from 'react';
import {useIsSignedIn} from '../contexts/SignedInContextProvider';
import {createStackNavigator} from '@react-navigation/stack';
import SearchScreen from '../screens/SearchScreen';
import PlaceScreen from '../screens/PlaceScreen';
import MakePlanCollectionScreen from '../screens/collection/MakePlanCollectionScreen';
import MakeFreeCollectionScreen from '../screens/collection/MakeFreeCollectionScreen';
import PlanCollectionScreen from '../screens/collection/PlanCollectionScreen';
import FreeCollectionScreen from '../screens/collection/FreeCollectionScreen';
import SystemSetting from '../screens/settings/SystemSetting';
import SearchScreenForPlan from '../screens/collection/SearchScreenForPlan';

const MainStack = createStackNavigator();

const AppNavigator = () => {
    const [isSignedIn, setIsSignedIn] = useIsSignedIn();

    return (
        <MainStack.Navigator screenOptions={{headerShown: false}}>
            {!isSignedIn ?
                <MainStack.Screen name="Authentication" component={AuthenticationNavigator}/> :
                <>
                    <MainStack.Screen name="App" children={({navigation}) => <HomeNavigator navigation={navigation}/>}/>
                    <MainStack.Screen name="Search" component={SearchScreen} />
                    <MainStack.Screen name="SearchForPlan" component={SearchScreenForPlan} />
                    <MainStack.Screen name="Place" component={PlaceScreen}/>
                    <MainStack.Screen name="PlanCollection" component={MakePlanCollectionScreen} />
                    <MainStack.Screen name="FreeCollection" component={MakeFreeCollectionScreen}/>
                    <MainStack.Screen name="ShowPlanDir" component={PlanCollectionScreen} />
                    <MainStack.Screen name="ShowFreeDir" component={FreeCollectionScreen} />
                    <MainStack.Screen name="SystemSetting" component={SystemSetting} />
                </>
            }
        </MainStack.Navigator>
    );
};

export default AppNavigator;