import HomeNavigator from "./HomeNavigator";
import AuthenticationNavigator from "./AuthenticationNavigator";
import React, {useState} from "react";
import {useIsSignedIn} from "../contexts/SignedInContextProvider";
import {createStackNavigator} from "@react-navigation/stack";
import SearchScreen from "../screens/SearchScreen";
import PlaceScreen from "../screens/PlaceScreen";
import MakePlanDirectory from "../screens/collection/MakePlanDirectory";
import MakeFreeDirectory from '../screens/collection/MakeFreeDirectory';
import FreeDirectory from "../screens/collection/FreeDirectory";
import SystemSetting from "../screens/settings/SystemSetting";

const MainStack = createStackNavigator()

const AppNavigator = () => {
    const [isSignedIn, setIsSignedIn] = useIsSignedIn()

    return (
        <MainStack.Navigator screenOptions={{headerShown: false}}>
            {!isSignedIn ?
                <MainStack.Screen name="Authentication" component={AuthenticationNavigator}/> :
                <>
                    <MainStack.Screen name="App" children={({navigation}) => <HomeNavigator navigation={navigation}/>}/>
                    <MainStack.Screen name="Search" component={SearchScreen} />
                    <MainStack.Screen name="Place" component={PlaceScreen}/>
                    <MainStack.Screen name="PlanDirectory" component={MakePlanDirectory} />
                    <MainStack.Screen name="FreeDirectory" component={MakeFreeDirectory}/>
                    <MainStack.Screen name="ShowFreeDir" component={FreeDirectory} />
                    <MainStack.Screen name="SystemSetting" component={SystemSetting} />
                </>
            }
        </MainStack.Navigator>
    )
}

export default AppNavigator;