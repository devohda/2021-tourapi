import React, { memo, useState } from 'react';
import { View, Image, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import AppText from '../../components/AppText';
import {Modal, Card} from '@ui-kitten/components';
import ScreenDivideLine from '../../components/ScreenDivideLine';
import BackIcon from '../../assets/images/back-icon.svg';
import AlternativeSpaceScreen from './AlternativeSpaceScreen';

const AlternativeSpaceList = props => {
    const { data, idx, day, isEditPage, navigation, pk,
        isReplacementDeleted, isDeletedReplacement, checkDeletedReplacement,
        postReplacement, getReplacement, getInitialPlaceData, replacementData
    } = props;
    const {colors} = useTheme();
    const [visible, setVisible] = useState(false);
    const [changedTip, setChangedTip] = useState('');
    const isFree = (day === -1);

    const checkNone = () => {
        //내가 만든거일때
        if(props.private === 1) {
            //수정페이지에서 이미 완성된 한줄평일때만
            if(isEditPage) {
                if(data.replacement_cnt) return false;
                else return true;
            }
            //일반 페이지에서는 모두 보여준다
            else {
                return false;
            }
        }
        //내가 만든게 아닐때
        else {
            //이미 완성된 한줄평일때만
            if(data.replacement_cnt) return false;
            else return true;
        }
    };

    
    return(
        <TouchableOpacity onPress={()=>{
            if(data.replacement_cnt) {
                navigation.navigate('AlternativeSpace', {data: data, day: day, private: props.private, pk: pk});
                getReplacement(data.cpm_map_pk);
            }
            else navigation.navigate('SearchForAdd', {pk: pk, placeData: data, day : day, replace: true});
        }}>
            <View flex={1} style={{flexDirection: 'row'}}>
                <View style={[{
                    ...styles.spaceContainer,
                    backgroundColor: colors.defaultColor
                }, checkNone() && {display: 'none'}, isFree && !isEditPage && {width: '100%', marginLeft: 0}]}>
                    <View style={{flexDirection: 'row', alignItems: 'center', paddingLeft: 10, width: isFree && !isEditPage ? '90%' : '95%'}}>
                        {   !data.replacement_cnt &&
                            <Icon type="ionicon" name={"add"} size={16} color={colors.gray[4]}/>
                        }
                        <AppText style={{color: !data.replacement_cnt ? colors.gray[4] : colors.blue[1], fontSize: 14, marginLeft: 5}}>{data.replacement_cnt !== 0 ? `대체 공간 ${data.replacement_cnt}` : '대체공간 추가하기'}</AppText>
                    </View>
                    <View style={{paddingRight: 8}}>
                        <BackIcon width={10} height={14} style={[{color: colors.mainColor, transform: [{rotate: '180deg'}], width: 4, height: 8}, !data.replacement_cnt && {display: 'none'}]}/>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
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
        paddingRight: 5,
        marginBottom: 6,
        marginRight: 10,
        marginTop: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    freeContainer: {
        height: 30,
        paddingVertical: 6,
        paddingLeft: 6,
        paddingRight: 5,
        marginBottom: 6,
        marginRight: 4,
        marginTop: 8,
        marginLeft: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    spaceContainer: {
        height: 30,
        paddingVertical: 6,
        marginBottom: 6,
        marginRight: 10,
        marginTop: 4,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginLeft: 36,
        borderRadius: 20,
        width: '88%',
        shadowOffset: {
            width: 6,
            height: 6
        },
        shadowOpacity: 0.25,
        elevation: 1,
        shadowColor: 'rgba(203, 180, 180, 0.3)',
    }
});

export default memo(AlternativeSpaceList, areEqual);