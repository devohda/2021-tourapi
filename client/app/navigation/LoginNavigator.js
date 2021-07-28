import React from 'react';
import 'react-native-gesture-handler';
import { Button, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Icon } from 'react-native-elements';

import MainAuth from '../screens/MainAuth';
import SubAuth from '../screens/SubAuth';
import MainPage from '../screens/MainPage';
import EmailAuth from '../screens/forSubAuth/EmailAuth';
import PasswordAuth from '../screens/forSubAuth/PasswordAuth';
import NickNameAuth from '../screens/forSubAuth/NicknameAuth';


const Stack = createStackNavigator()

export default class LoginNavigator extends React.Component {
    // constructor(props) {
    //     super(props);
    // }
    render() {
        const {navigation} = this.props;
        return (
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={MainAuth} options={{headerShown: false}}/>
                <Stack.Screen name="SubAuth" component={SubAuth} options={{title: '회원가입', headerStyle: {elevation: 0}, headerTitleStyle: {fontSize: 18, marginStart: 100},
                                                                                            headerLeft: () => <TouchableOpacity style={{left: 16}} ><Icon type="ionicon" name={"chevron-back-outline"} size={28} onPress={()=>navigation.goBack()}></Icon></TouchableOpacity>}}/>
                <Stack.Screen name="MainPage" component={MainPage} options={{title: '', headerStyle: {elevation: 0, backgroundColor:'black'},
                    headerLeft : () => <View><Text style={styles.headerLeft}>Here.</Text></View>,
                    headerRight : ()=>
                        <View style={styles.headerRight}>
                            <Icon type="ionicon" name={"md-search"} color="white" style={{marginEnd: 20}} size={28}></Icon>
                            {/* <Icon type="ionicon" name={"md-menu"} color="white" style={{marginEnd: 20}} size={28} ></Icon> */}
                        </View>
                }}/>
            </Stack.Navigator>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});
