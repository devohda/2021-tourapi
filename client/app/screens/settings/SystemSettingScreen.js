import React, {useState, useEffect} from 'react';
import {View, Image, SectionList, StyleSheet, Switch, Alert} from 'react-native';
import {useTheme} from '@react-navigation/native';
import appJson from '../../../app.json';

import AppText from '../../components/AppText';
import ScreenContainer from '../../components/ScreenContainer';
import NavigationTop from '../../components/NavigationTop';
import ScreenContainerView from '../../components/ScreenContainerView';
import ListItem from './ListItem';
import { useToken } from '../../contexts/TokenContextProvider';
import * as SecureStore from 'expo-secure-store';
import {useIsSignedIn} from '../../contexts/SignedInContextProvider';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import {useAlertDuplicated} from '../../contexts/LoginContextProvider';

const SystemSettingScreen = ({navigation}) => {
    const {colors} = useTheme();

    const [token, setToken] = useToken();
    const [userData, setUserData] = useState({});
    const [isSignedIn, setIsSignedIn] = useIsSignedIn();
    const [alertDuplicated, setAlertDuplicated] = useAlertDuplicated(false);

    useEffect(() => {
        getUserData();
    },[]);

    const getUserData = () => {
        try {
            fetch('http://34.64.71.103/user', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
            }).then((res) => res.json())
                .then(async (response) => {
                    if (response.code === 405 && !alertDuplicated) {
                        setAlertDuplicated(true);
                    }

                    if (parseInt(response.code / 100) === 4) {
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }

                    setUserData(response.data);
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const systemMenu = [
        {
            index: 1,
            title: '연결된 계정',
            data: [{index: 1, name: userData.user_email}]
        },
        {
            index: 2,
            data: [{index: 1, name: '문의하기'}, {index: 2, name: '신고하기'},
                {
                    index: 3,
                    name: '버전 정보 ' + appJson.expo.version
                }]
        },
        {
            index: 3,
            data: [{index: 1, name: '로그아웃'}, {index: 2, name: '회원 탈퇴하기'}]
        }
    ];

    const HeaderItem = ({title, index}) => (
        <View style={typeof title !== 'undefined' && {marginBottom: 16}}>
            <AppText style={{...styles.header_text, color: colors.gray[4]}}>{title}</AppText>
        </View>
    );

    const SettingListItem = ({data, index}) => {
        const isSelected = data;
        return (
            <ListItem data={data} index={index} isSelected={isSelected}/>
        );
    };

    const FooterItem = ({index}) => (
        <>
            {index !== systemMenu.length &&
            <View style={{
                width: '100%',
                height: 1,
                backgroundColor: colors.red_gray[6],
                zIndex: -1000,
            }}></View>
            }
        </>
    );

    return (
        <ScreenContainer backgroundColor={colors.backgroundColor}>
            <NavigationTop title="설정" navigation={navigation}/>

            <ScreenContainerView flex={1}>
                <SectionList sections={systemMenu}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({item, section: {index}}) => <SettingListItem data={item.name} index={index}/>}
                    renderSectionHeader={({section: {title, index}}) => <HeaderItem title={title} index={index}/>}
                    renderSectionFooter={({section: {index}}) => <FooterItem index={index}/>}
                    stickySectionHeadersEnabled={false}
                    showsVerticalScrollIndicator={false}
                />
            </ScreenContainerView>
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    header_text: {
        fontSize: 12,
        fontWeight: '500',
        lineHeight: 19.2,
        marginTop: 16
    },
    list_style: {
        marginBottom: 32
    },
    list_style_version1: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    list_style_version2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});

export default SystemSettingScreen;