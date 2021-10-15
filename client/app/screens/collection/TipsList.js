import React, { memo, useState} from 'react';
import { View, Image, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import {Modal, Card} from '@ui-kitten/components';

import AppText from '../../components/AppText';

import { tipsList } from '../../contexts/TipsListContextProvider';

const TipsList = props => {
    const { comment, data, idx, day, isEditPage, postPlaceComment, putPlaceComment, isCommentDeleted, isDeletedComment} = props;
    const {colors} = useTheme();
    const [addVisible, setAddVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [changedTip, setChangedTip] = useState('');
    const [tmpData, setTmpData] = tipsList();
    const isFree = (typeof props.day === 'undefined');

    const AddModal = () => {
        const [changed, setChanged] = useState('');
        return (
        <Modal
            visible={addVisible}
            backdropStyle={styles.backdrop}
            style={{backgroundColor: colors.backgroundColor, maxHeight: '100%', borderRadius: 10, width: '95%'}}
            onBackdropPress={() => setAddVisible(false)}>
            <Card disabled={true}
                style={{borderRadius: 10, backgroundColor: colors.backgroundColor, borderColor: colors.backgroundColor}}
            >
                <View style={{marginTop: 5}}>
                    <AppText style={{color: colors.mainColor, fontSize: 14, lineHeight: 22.4, fontWeight: '700', textAlign: 'center'}}>한줄팁 추가</AppText>
                </View>
                <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 5}}>
                    <View style={{width: '95%', justifyContent: 'center', alignItems: 'center'}}>
                        <AppText style={{color: colors.gray[3], fontSize: 12, fontWeight: '500', lineHeight: 19.2, textAlign: 'center'}}>{data.place_name}을 위한 팁을 공유해주세요!</AppText>
                    </View>
                    <View style={{marginTop: 14}}>
                        <TextInput onChangeText={(text)=>{
                            setChanged(text);
                            
                            }}
                            style={{
                                color: colors.mainColor,
                                borderWidth: 1,
                                borderColor: changed ? colors.mainColor : colors.defaultColor,
                                width: 295,
                                height: 95,
                                borderRadius: 10,
                                padding: 8
                            }}
                            placeholder='예) 경복궁 야관특별관람에 한복 입고 가면 예매 없이 무료로 입장 가능해요'
                            multiline
                            placeholderTextColor={colors.gray[5]}
                            textAlignVertical={'top'}
                        ></TextInput>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, marginBottom: 20}}>
                        <TouchableOpacity onPress={() => {setAddVisible(false)}}>
                            <View style={{width: 86, height: 43, borderRadius: 10, backgroundColor: colors.defaultColor, justifyContent: 'center', alignItems: 'center', marginHorizontal: 9.5, ...styles.shadowOption}}>
                                <AppText style={{padding: 4, color: colors.mainColor, fontSize: 14, textAlign: 'center', lineHeight: 22.4, fontWeight: '500'}}>취소하기</AppText>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            if(changed !== '') {
                                postPlaceComment(data.cpm_map_pk, changed);
                                setChangedTip(changed);
                            }
                            setAddVisible(false);
                        }}>
                            <View style={{width: 201, height: 43, borderRadius: 10, backgroundColor: colors.mainColor, justifyContent: 'center', alignItems: 'center', marginHorizontal: 9.5, ...styles.shadowOption}}>
                                <AppText style={{padding: 4, color: colors.defaultColor, fontSize: 14, textAlign: 'center', lineHeight: 22.4, fontWeight: '500'}}>추가하기</AppText>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Card>
        </Modal>
    )};

    const EditModal = () => {
        const [changed, setChanged] = useState('');
        return (
        <Modal
            visible={editVisible}
            backdropStyle={styles.backdrop}
            style={{backgroundColor: colors.backgroundColor, maxHeight: '100%', borderRadius: 10, width: '95%'}}
            onBackdropPress={() => setEditVisible(false)}>
            <Card disabled={true}
                style={{borderRadius: 10, backgroundColor: colors.backgroundColor, borderColor: colors.backgroundColor}}
            >
                <View style={{marginTop: 5}}>
                    <AppText style={{color: colors.mainColor, fontSize: 14, lineHeight: 22.4, fontWeight: '700', textAlign: 'center'}}>한줄팁 수정</AppText>
                </View>
                <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 5}}>
                    <View style={{width: '95%', justifyContent: 'center', alignItems: 'center'}}>
                        <AppText style={{color: colors.gray[3], fontSize: 12, fontWeight: '500', lineHeight: 19.2, textAlign: 'center'}}>{data.place_name}을 위한 팁을 공유해주세요!</AppText>
                    </View>
                    <View style={{marginTop: 14}}>
                        <TextInput defaultValue={comment} onChangeText={(text)=>{
                                setChanged(text);
                            }}
                            style={{
                                color: colors.mainColor,
                                borderWidth: 1,
                                borderColor: changed ? colors.mainColor : colors.defaultColor,
                                width: 295,
                                height: 95,
                                borderRadius: 10,
                                padding: 8
                            }}
                            placeholder='예) 경복궁 야관특별관람에 한복 입고 가면 예매 없이 무료로 입장 가능해요'
                            multiline
                            placeholderTextColor={colors.gray[5]}
                            textAlignVertical={'top'}
                            ></TextInput>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, marginBottom: 20}}>
                        <TouchableOpacity onPress={() => {setEditVisible(false)}}>
                            <View style={{width: 86, height: 43, borderRadius: 10, backgroundColor: colors.defaultColor, justifyContent: 'center', alignItems: 'center', marginHorizontal: 9.5, ...styles.shadowOption}}>
                                <AppText style={{padding: 4, color: colors.mainColor, fontSize: 14, textAlign: 'center', lineHeight: 22.4, fontWeight: '500'}}>취소하기</AppText>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            if(changed !== comment && changed !== '') {
                                putPlaceComment(data.cpm_map_pk, changed);
                                setChangedTip(changed);
                            }
                            setEditVisible(false);
                        }}>
                            <View style={{width: 201, height: 43, borderRadius: 10, backgroundColor: colors.mainColor, justifyContent: 'center', alignItems: 'center', marginHorizontal: 9.5, ...styles.shadowOption}}>
                                <AppText style={{padding: 4, color: colors.defaultColor, fontSize: 14, textAlign: 'center', lineHeight: 22.4, fontWeight: '500'}}>수정하기</AppText>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Card>
        </Modal>
    )};

    const DeleteModal = () => {
        return (
            <Modal
                visible={deleteVisible}
                backdropStyle={styles.backdrop}
                style={{backgroundColor: colors.backgroundColor, borderRadius: 10, marginTop: 10, width: '95%'}}
                onBackdropPress={() => setDeleteVisible(false)}>
                <Card disabled={true}
                    style={{borderRadius: 10, backgroundColor: colors.backgroundColor, borderColor: colors.backgroundColor, justifyContent: 'center', alignItems: 'center'}}
                >
                    <View style={{marginTop: 55}}>
                        <AppText style={{color: colors.mainColor, fontSize: 14, lineHeight: 22.4, fontWeight: '700', textAlign: 'center'}}>한줄팁을 삭제할까요?</AppText>
                    </View>
                    <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 49}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
                            <TouchableOpacity onPress={() => {setDeleteVisible(false)}}>
                                <View style={{width: 138, height: 43, borderRadius: 10, backgroundColor: colors.defaultColor, justifyContent: 'center', alignItems: 'center', marginHorizontal: 9.5, ...styles.shadowOption}}>
                                    <AppText style={{padding: 4, color: colors.mainColor, fontSize: 14, textAlign: 'center', lineHeight: 22.4, fontWeight: '500'}}>취소하기</AppText>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                let newArr = [...isDeletedComment];
                                newArr[idx] = true;
                                isCommentDeleted(newArr);
                                setDeleteVisible(false);
                            }}>
                                <View style={{width: 138, height: 43, borderRadius: 10, backgroundColor: colors.red[3], justifyContent: 'center', alignItems: 'center', marginHorizontal: 9.5, ...styles.shadowOption}}>
                                    <AppText style={{padding: 4, color: colors.defaultColor, fontSize: 14, textAlign: 'center', lineHeight: 22.4, fontWeight: '500'}}>삭제하기</AppText>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Card>
            </Modal>
        )
    };

    const checkNone = () => {
        //내가 만든거일때
        if(props.private === 1) {
            //수정페이지에서 이미 완성된 한줄평일때만
            if(isEditPage) {
                if(comment) return false;
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
            if(comment) return false;
            else return true;
        }
    }

    return(
        <View flex={1}>
        <View style={[{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}, isDeletedComment[idx] && comment && {display: 'none'}]}>
            { isEditPage && comment &&
            <TouchableOpacity onPress={()=>{
                if(props.private) setDeleteVisible(true);
            }} disabled={props.private === 1 ? false : true}>
                <View style={{flexDirection: 'row', width: !isEditPage ? '100%' : '90%'}}>
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <Icon type="ionicon" name={"remove-circle"} color={colors.red[3]} size={28}/>
                    </View>
                </View>
            </TouchableOpacity>
            }
            <View style={[isFree ? {...styles.freeContainer, backgroundColor: colors.defaultColor, marginLeft: comment || !isEditPage ? 8 : 36} : {...styles.planContainer, backgroundColor: colors.defaultColor, marginLeft: comment && isEditPage ? 8 : 36}, checkNone() && {display: 'none'}, isFree && !isEditPage && {width: '100%'}]}>
                <TouchableOpacity onPress={() => {
                    if(comment) {
                        if(props.private) setEditVisible(true);
                    }
                    else {
                        if(props.private) setAddVisible(true);
                    }
                    }}
                    >
                    <View style={{flexDirection: 'row', alignItems: 'center', paddingLeft: 6, width: '95%'}}>
                        {   comment ?
                            <Image source={require('../../assets/images/tipIcon.png')}
                            style={{width: 12, height: 12, marginEnd: 8}}></Image> :
                            <Image source={require('../../assets/images/tipIconGray.png')}
                            style={{width: 12, height: 12, marginEnd: 8}}></Image>
                        }
                        {
                            isFree ?
                            <AppText style={{color: comment ? colors.blue[1] : colors.gray[4], fontSize: 14}}>{comment ? comment : '한줄팁 추가하기'}</AppText> :
                            <AppText style={{color: comment ? colors.blue[1] : colors.gray[4], fontSize: 14}}>{comment ? comment : '한줄팁 추가하기'}</AppText>
                        }
                    </View>
                </TouchableOpacity>
            </View>
        {/* {idx < length-1 &&
            <View style={{
                width: '100%',
                height: 1,
                backgroundColor: colors.red_gray[6],
                zIndex: -1000,
                marginVertical: 12
            }}></View>} */}

            <AddModal />
            <EditModal />
            <DeleteModal />
      </View>
    </View>
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
        // height: 30,
        paddingVertical: 6,
        paddingLeft: 6,
        paddingRight: 5,
        marginBottom: 6,
        marginRight: 4,
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '88%'
    },
    freeContainer: {
        // height: 30,
        paddingVertical: 6,
        paddingLeft: 6,
        paddingRight: 5,
        marginBottom: 6,
        marginRight: 4,
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '88%'
    },
    shadowOption: {
        shadowOffset: {
            width: 6,
            height: 6
        },
        shadowOpacity: 0.25,
        elevation: 1,
        shadowColor: 'rgba(203, 180, 180, 0.3)',
    }
});

export default memo(TipsList, areEqual);