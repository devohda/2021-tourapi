import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Icon } from 'react-native-elements';

import MainAuth from './screens/MainAuth';
import SubAuth from './screens/SubAuth';
import MainPage from './screens/MainPage';

const Stack = createStackNavigator();

const NavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent'
  },
};

export default function App({navigation}) {
  return (
    <NavigationContainer theme={NavigationTheme}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={MainAuth} options={{headerShown: false}}/>
        {/* 회원가입 back button 모양 수정 */}
        <Stack.Screen name="SubAuth" component={SubAuth} options={{title: '회원가입', headerStyle: {elevation: 0}, headerTitleStyle: {fontSize: 18, marginStart: 100}}}/>
        <Stack.Screen name="MainPage" component={MainPage} options={{title: '', headerStyle: {elevation: 0, backgroundColor:'black'},
                                                                                    headerLeft : () => <View><Text style={styles.headerLeft}>Here.</Text></View>,
                                                                                    headerRight : ()=>
                                                                                      <View style={styles.headerRight}>
                                                                                        <Icon type="ionicon" name={"md-search"} color="white" style={{marginEnd: 20}} size={28}></Icon>
                                                                                        <Icon type="ionicon" name={"md-menu"} color="white" style={{marginEnd: 20}} size={28} ></Icon>
                                                                                      </View>
                                                                                      }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLeft : {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 28,
    left: 16,
  },
  headerRight: {
    flexDirection: 'row',
  }
});
