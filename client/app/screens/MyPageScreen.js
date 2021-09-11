import React, {useState} from 'react';
import {Platform, View, Image, StyleSheet, Button, TouchableOpacity} from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import MyPageNavigation from '../navigation/MypageNavigator';
import {useTheme} from '@react-navigation/native';
import AppText from '../components/AppText';
import {useIsUserData} from '../contexts/UserDataContextProvider';
import SettingsIcon from '../assets/images/settings-icon.svg';

const MyPageScreen = ({navigation}) => {
    const {colors} = useTheme();
    const [userData, setUserData] = useIsUserData();
    console.log(userData);

    const styles = StyleSheet.create({
        myPageHashtag: {
            borderWidth: 1,
            borderRadius: 12,
            paddingVertical: 2,
            paddingHorizontal: 5,
            marginRight: 10,
            shadowColor: colors.red[8],
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.1,
            elevation: 1,
        },

        myPageHashtagText: {
            color: colors.gray[2],
            fontSize: 12,
            textAlign: 'center',
        },
    });

    return (
        <ScreenContainer backgroundColor={colors.backgroundColor}>
            <View flexDirection="row" style={{
                height: 24,
                marginBottom: 20,
                marginTop: Platform.OS === 'android' ? 20 : 10,
                marginHorizontal: 20,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <View style={{position: 'absolute', right: 0}}>
                    <TouchableOpacity onPress={() => navigation.navigate('SystemSetting')}>
                        <SettingsIcon width={24} height={24} style={{color: colors.mainColor}}/>
                    </TouchableOpacity>
                </View>
            </View>
            <View
                style={{
                    backgroundColor: colors.backgroundColor
                }}
                className="profile-container"
            >
                <View
                    style={{
                        alignItems: 'center',
                    }}
                >
                    {/* <Button title="시스템 설정" color={colors.mainColor} onPress={()=>navigation.navigate('SystemSetting')}></Button> */}
                    <View
                        className="profile-img-container"
                        style={{justifyContent: 'center', alignItems: 'center'}}
                    >
                        <Image
                            style={{
                                width: 90,
                                height: 90,
                                borderRadius: 60,
                                position: 'absolute',
                                backgroundColor: colors.defaultColor,
                            }}
                            source={require('../assets/images/default_profile.png')}
                        />
                        <Image
                            style={{
                                width: 30,
                                height: 30,
                                marginLeft: '20%',
                                marginBottom: '17.5%',
                            }}
                            source={require('../assets/images/setting.png')}
                        />
                    </View>
                    <View style={Platform.OS === 'ios' && {marginTop: 5}}>
                        <AppText
                            style={{
                                fontSize: 18,
                                fontWeight: 'bold',
                                textAlign: 'center',
                                color: colors.mainColor,
                            }}
                        >
                            {userData.user_nickname}
                        </AppText>
                        <View
                            style={{
                                flexDirection: 'row',
                                marginTop: Platform.OS === 'ios' ? 8 : 3,
                            }}
                        >
                            <View
                                style={[
                                    styles.myPageHashtag,
                                    {
                                        borderColor: colors.defaultColor,
                                        backgroundColor: colors.defaultColor,
                                    },
                                ]}
                            >
                                <AppText style={styles.myPageHashtagText}>#조용한</AppText>
                            </View>
                            <View
                                style={[
                                    styles.myPageHashtag,
                                    {
                                        borderColor: colors.defaultColor,
                                        backgroundColor: colors.defaultColor,
                                    },
                                ]}
                            >
                                <AppText style={styles.myPageHashtagText}>#따뜻한</AppText>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            <MyPageNavigation navigation={navigation}/>
        </ScreenContainer>
    );
};

export default MyPageScreen;
