import React, { memo, useState } from 'react';
import { View, Image, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import AppText from '../../components/AppText';
import {Modal, Card} from '@ui-kitten/components';

import { tipsList } from '../../contexts/TipsListContextProvider';

const ShowPlace = props => {
    const { data, idx, day} = props;
    const {colors} = useTheme();
    const [visible, setVisible] = useState(false);
    const [changedTip, setChangedTip] = useState('');
    const [tmpData, setTmpData] = tipsList();
    const isFree = (typeof props.day === 'undefined');

    return(
        <>
        <View flex={1}>
        <TouchableOpacity onPress={() => setVisible(true)}>
            <View style={isFree ? {...styles.freeContainer, backgroundColor: colors.defaultColor} : {...styles.planContainer, backgroundColor: colors.defaultColor}}>
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <Image source={require('../../assets/images/tipIcon.png')}
                        style={{width: 12, height: 12, marginEnd: 8}}></Image>
                    <AppText style={{color: colors.blue[1], fontSize: 14}}>{isFree ? tmpData[idx].tip : data.tip}</AppText>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <Image style={{width: 28, height: 28}}
                        source={require('../../assets/images/default_profile_2.png')}></Image>
                </View>
            </View>
        </TouchableOpacity>
        <Modal
        visible={visible}
        backdropStyle={styles.backdrop}
        style={{backgroundColor: colors.backgroundColor, maxHeight: '100%', borderRadius: 10}}
        onBackdropPress={() => setVisible(false)}>
            <Card disabled={true}
                style={{borderRadius: 10, borderColor: colors.defaultColor, backgroundColor: colors.backgroundColor}}
            >
                <View style={{marginTop: 5}}>
                    <AppText style={{color: colors.mainColor, fontSize: 14, lineHeight: 22.4, fontWeight: '700', textAlign: 'center'}}>한줄팁 수정</AppText>
                </View>
                <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 24}}>
                    <TextInput defaultValue={isFree ? tmpData[idx].tip : data.tip} onChangeText={(text)=>{
                            setChangedTip(text);

                        }}
                        style={{
                            color: colors.defaultDarkColor,
                            borderBottomWidth: 1,
                            borderBottomColor: colors.mainColor,
                            paddingBottom: 6
                        }}
                        placeholderTextColor={colors.defaultDarkColor}
                        ></TextInput>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 36, marginBottom: 15}}>
                        <TouchableOpacity onPress={() => {setVisible(false)}}>
                            <View style={{width: 138, height: 43, borderRadius: 10, backgroundColor: colors.gray[6], justifyContent: 'center', alignItems: 'center', marginHorizontal: 9.5}}>
                                <AppText style={{padding: 4, color: colors.defaultColor, fontSize: 14, textAlign: 'center', lineHeight: 22.4, fontWeight: '500'}}>취소하기</AppText>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            const newArr = [...tmpData];
                            if(isFree) newArr[idx].tip = changedTip;
                            else newArr[day].places[idx].tip = changedTip;
                            setTmpData(newArr);
                            console.log(tmpData)
                            setVisible(false);
                        }}>
                            <View style={{width: 138, height: 43, borderRadius: 10, backgroundColor: colors.mainColor, justifyContent: 'center', alignItems: 'center', marginHorizontal: 9.5}}>
                                <AppText style={{padding: 4, color: colors.defaultColor, fontSize: 14, textAlign: 'center', lineHeight: 22.4, fontWeight: '500'}}>수정하기</AppText>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
        </Card>
      </Modal>
      </View>
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
    backdrop: {
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    planContainer : {
        height: 30,
        paddingVertical: 6,
        paddingLeft: 6,
        paddingRight: 5,
        marginBottom: 6,
        marginRight: 10,
        marginTop: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 36
    },
    freeContainer: {
        height: 30,
        paddingVertical: 6,
        paddingLeft: 6,
        paddingRight: 5,
        marginBottom: 6,
        marginRight: 10,
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
});

export default memo(ShowPlace, areEqual);