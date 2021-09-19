import React, { memo, useState } from 'react';
import { View, Image, Switch, StyleSheet, Pressable, Modal } from 'react-native';
import { useTheme } from '@react-navigation/native';
import AppText from '../../components/AppText';

import hereIcon from '../../assets/images/appicon.png';
import { TouchableOpacity } from 'react-native-gesture-handler';

const ListItem = props => {
    const {colors} = useTheme();
    const [isEnabled, setIsEnabled] = useState(false);
    const [isLogout, setIsLogout] = useState(false);
    const toggleSwitch = () => {
        setIsEnabled(previousState => !previousState);
    };

    return(
    <>
    {
        props.index === 1 || props.index === 2 ?
            <View style={props.index === 1 ? {...styles.list_style, ...styles.list_style_version1} : {...styles.list_style, ...styles.list_style_version2}}>
                {props.index === 1 && <Image source={hereIcon} style={{width: 24, height: 24, marginEnd: 9}}></Image>}
                <AppText style={{color: colors.mainColor, fontSize: 16, lineHeight: 20}}>{props.data}</AppText>
                {props.index === 2 && <Switch
                        trackColor={{false: colors.gray[6], true: colors.mainColor}}
                        thumbColor={colors.defaultColor}
                        ios_backgroundColor={colors.gray[6]}
                        onChange={toggleSwitch}
                        value={isEnabled}
                    />}
            </View> :
            <View style={{...styles.list_style}}>
                {
                    props.index === 4 ?
                    <>
                        <TouchableOpacity onPress={() => {props.data === '로그아웃' && setIsLogout(true)}}>
                            <AppText style={{color: props.data === '로그아웃' ? colors.gray[4] : colors.red[3], fontSize: 16, lineHeight: 20}}>{props.data}</AppText>
                        </TouchableOpacity>
                        <Modal
                            transparent={true}
                            visible={isLogout}
                            onRequestClose={() => {
                            setIsLogout(!isLogout);
                            }}
                        >
                            <View style={styles.centeredView}>
                            <View style={{...styles.modalView, backgroundColor: colors.backgroundColor}}>
                                <AppText style={{...styles.modalText, color: colors.blue[1]}}>로그아웃 하시겠습니까?</AppText>
                                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                    <Pressable
                                    style={{...styles.button, backgroundColor: colors.gray[4]}}
                                    onPress={() => setIsLogout(!isLogout)}
                                    >
                                        <AppText style={styles.textStyle}>취소하기</AppText>
                                    </Pressable>
                                    <Pressable
                                    style={{...styles.button, backgroundColor: colors.mainColor}}
                                    onPress={() => {
                                        setIsLogout(!isLogout);
                                        //로그아웃 코드
                                    }}
                                    >
                                        <AppText style={styles.textStyle}>로그아웃</AppText>
                                    </Pressable>
                                </View>
                            </View>
                            </View>
                        </Modal>
                    </> :
                    <AppText style={{color: colors.mainColor, fontSize: 16, lineHeight: 20}}>{props.data}</AppText>
                }
            </View>
    }
    </>
)};

const areEqual = (prevProps, nextProps) => {
    const { isSelected } = nextProps;
    const { isSelected: prevIsSelected } = prevProps;
    
    /*if the props are equal, it won't update*/
    const isSelectedEqual = isSelected === prevIsSelected;
  
    return isSelectedEqual;
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
    },

    //modal example
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        backgroundColor: 'rgba(0,0,0,0.5)'
      },
      modalView: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        justifyContent: 'center',
        alignItems: "center",
        height: 150
      },
      button: {
        borderRadius: 10,
        marginHorizontal: 9.5,
        marginTop: 26,
        width: 108,
        height: 38,
        justifyContent: 'center',
        alignItems: 'center'
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 14,
        lineHeight: 22.4,
        fontWeight: '500'
      },
      modalText: {
        textAlign: "center",
        fontSize: 14,
        lineHeight: 22.4,
        fontWeight: '700'
      }
})

export default memo(ListItem, areEqual);