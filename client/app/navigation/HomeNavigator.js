import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from 'react-native-elements';
import {useTheme} from '@react-navigation/native';

import MyPageScreen from '../screens/MyPageScreen';
import MakeCollectionBtn from '../screens/collection/MakeCollectionBtn';
import MainPage from '../screens/MainPageScreen';

const Tab = createBottomTabNavigator();

export default function HomeNavigator({navigation}) {
    const {colors} = useTheme();
    return (
        <Tab.Navigator tabBarOptions={{keyboardHidesTabBar: true}}>
            <Tab.Screen name="main" children={() => <MainPage navigation={navigation}/>} options={{
                tabBarIcon: ({focused}) => (
                    <Icon type="ionicon" name={focused ? 'home-sharp' : 'home-outline'} size={26}
                        color={colors.mainColor}></Icon>),
                tabBarLabel: () => {
                    return null;
                }
            }}/>
            <Tab.Screen name="directory" component={MakeCollectionBtn} options={{
                title: '', tabBarButton: () => (
                    MakeCollectionBtn({navigation})),
            }}/>
            <Tab.Screen name="mypage" children={() => <MyPageScreen navigation={navigation}/>} options={{
                title: '마이페이지',
                tabBarIcon: ({focused}) => (
                    <Icon type="ionicon" name={focused ? 'person' : 'person-outline'} size={26}
                        color={colors.mainColor}></Icon>),
                tabBarLabel: () => {
                    return null;
                }
            }}/>
        </Tab.Navigator>
    );
}