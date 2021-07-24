import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Text, View} from "react-native";
import * as React from "react";

const Tab = createMaterialTopTabNavigator();


function Like() {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Home!</Text>
        </View>
    );
}

function Temporary() {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Home!</Text>
        </View>
    );
}

function Collection() {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Home!</Text>
        </View>
    );
}

const MypageNavigation = () => {
    return (
        <Tab.Navigator
            swipeEnabled={true}
            tabBarOptions={{
                labelStyle: {
                    fontSize: 16,
                    fontWeight : 'bold'
                },
                indicatorStyle: {
                    backgroundColor : "black",
                    height : 3,
                },
                height : 100,
                style:{
                    paddingBottom : 4,
                    elevation: 0
                }
            }}
            style={{height : 10}}
        >
            <Tab.Screen name="찜" component={Like} Options={{
                title : "hello",
                tabBarLabel: {
                    focused: true,
                    color: "pink"
                }
            }}/>
            <Tab.Screen name="임시보관함" component={Temporary}/>
            <Tab.Screen name="디렉토리" component={Collection}/>
        </Tab.Navigator>
    );
}

export default MypageNavigation;