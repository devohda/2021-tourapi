import React, { useState } from "react";
import { View, Image, SectionList, StyleSheet, Switch } from "react-native";
import { useTheme } from "@react-navigation/native";
import appJson from '../../../app.json';

import AppText from "../../components/AppText";
import ScreenContainer from "../../components/ScreenContainer";
import NavigationTop from "../../components/NavigationTop";
import ScreenContainerView from "../../components/ScreenContainerView";
import { useIsUserData } from "../../contexts/UserDataContextProvider";
import hereIcon from '../../assets/images/appicon.png';

const SystemSetting = ({navigation}) => {
    const { colors } = useTheme();
    const [userData, setUserData] = useIsUserData();
    //enable 다시
    const [isEnabled, setIsEnabled] = useState([
        [false],
        [false],
        [false]
    ]);

    const toggleSwitch = () => {
        setIsEnabled(previousState => !previousState);
    }
    const switchIndividually = (data, dataIndex) => {
        console.log(dataIndex)
        // if(data === '위치 서비스') {
        //     return 0;
        // } else if(data === '알림') {
        //     return 1;
        // } else if(data === '마케팅 수신 동의') {
        //     return 2;
        // }
    }

    const systemMenu = [
        {
            index: 1,
            title: "연결된 계정",
            data: [{index: 1, name: userData.user_email}]
        },
        {
            index: 2,
            title: "서비스 설정",
            data: [{index: 1, name: "위치 서비스"}, {index: 2, name: "알림"}, {index: 3, name: "마케팅 수신 동의"}]
        },
        {
            index: 3,
            data: [{index: 1, name: "문의하기"}, {index: 2, name: "새로운 소식"}, {index: 3, name: "버전 정보 "+appJson.expo.version}]
        },
        {
            index: 4,
            data: [{index: 1, name: "로그아웃"}, {index: 2, name: "회원 탈퇴하기"}]
        }
    ]

    const HeaderItem = ({title, index}) => (
        <View style={typeof title !== 'undefined' && {marginBottom: 16}}>
            <AppText style={{...styles.header_text, color: colors.gray[4]}}>
                {title}
            </AppText>
        </View>
    )

    const ListItem = ({data, index, dataIndex}) => {
        return(
        <>
        {
            index === 1 || index === 2 ?
                <View style={index === 1 ? {...styles.list_style, ...styles.list_style_version1} : {...styles.list_style, ...styles.list_style_version2}}>
                    {index === 1 && <Image source={hereIcon} style={{width: 24, height: 24, marginEnd: 9}}></Image>}
                    <AppText style={{color: colors.mainColor, fontSize: 16, lineHeight: 20}}>{data}</AppText>
                    {index === 2 && <Switch
                            trackColor={{false: colors.gray[6], true: colors.mainColor}}
                            thumbColor={colors.defaultColor}
                            ios_backgroundColor={colors.gray[6]}
                            onValueChange={toggleSwitch}
                            onChange={()=>{
                                console.log(isEnabled[0])
                                // if (isEnabled[dataIndex]) {
                                //     newArr[dataIndex-1] = false;
                                //     setIsEnabled(newArr);
                                // } else {
                                //     newArr[dataIndex-1] = true;
                                //     setIsEnabled(newArr);
                                // }
                            }}
                            value={isEnabled}
                        />}
                </View> :
                <View style={{...styles.list_style}}>
                    {
                        index === 4 ?
                        <AppText style={{color: data === '로그아웃' ? colors.gray[5] : colors.red[3], fontSize: 16, lineHeight: 20}}>{data}</AppText> :
                        <AppText style={{color: colors.mainColor, fontSize: 16, lineHeight: 20}}>{data}</AppText>
                    }
                </View>
        }
        </>
    )}

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
    )

    return (
        <ScreenContainer backgroundColor={colors.backgroundColor}>
            <NavigationTop title="설정" />

            <ScreenContainerView>
                <SectionList sections={systemMenu}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({item, section: {index}}) => <ListItem data={item.name} index={index} dataIndex={item.index}/>}
                    renderSectionHeader={({section: {title, index}}) => <HeaderItem title={title} index={index}/>}
                    renderSectionFooter={({section: {index}})=> <FooterItem index={index}/>}
                    stickySectionHeadersEnabled={false}
                />
            </ScreenContainerView>
        </ScreenContainer>
    )
}

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
})

export default SystemSetting;