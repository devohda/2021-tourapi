import React, { memo, useState } from 'react';
import { View, Image, TouchableOpacity, TextInput } from 'react-native';
import { useTheme } from '@react-navigation/native';
import AppText from '../../components/AppText';
import {Modal, Card} from '@ui-kitten/components';

import hereIcon from '../../assets/images/appicon.png';
import { tipsList } from '../../contexts/TipsListContextProvider';

const ShowPlace = props => {
    const {colors} = useTheme();
    const [visible, setVisible] = useState(false);
    const [changedTip, setChangedTip] = useState({
        index: 0,
        tip : ''
    });
    const [tmpData, setTmpData] = tipsList();

    return(
        <>
                        {/* {props.item.place_pk !== collectionData.places[0].place_pk && <View style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: colors.red_gray[6],
                    zIndex: -1000,
                    marginVertical: 13
                }}></View>} */}
                {/* pk로 바꾸기 */}

                <View>
                    <View style={{flexDirection: 'row', marginTop: 16, marginBottom: 4}}>
                        <TouchableOpacity onPress={() => navigation.navigate('Place', {data: props.item})}>
                            <View style={{flexDirection: 'row', width: '90%'}}>
                                {/* <Image source={{uri: props.item.place_img}} */}
                                <View style={{justifyContent: 'center', alignItems: 'center', marginEnd: 12}}>
                                    <View style={{borderRadius: 50, width: 24, height: 24, backgroundColor: colors.mainColor, justifyContent: 'center', alignItems: 'center'}}>
                                        <AppText style={{color: colors.defaultColor, fontSize: 12, lineHeight: 19.2, fontWeight: '500', textAlign: 'center'}}>
                                            {props.id}    
                                        </AppText>
                                    </View>
                                </View>
                                <Image source={require('../../assets/images/flower.jpeg')}
                                    style={{width: 72, height: 72, borderRadius: 15}}></Image>
                                <View style={{
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    width: '67%'
                                }}>
                                    <View style={{marginLeft: 8, marginTop: '2%'}}>
                                        <View style={{flexDirection: 'row'}}>
                                            {/* <AppText style={{
                                                color: colors.gray[3],
                                                textAlign: 'center',
                                                fontSize: 10,
                                                fontWeight: 'bold'
                                            }}>{checkType(props.item.place_type)}</AppText> */}
                                            <AppText style={{
                                                marginHorizontal: 4, color: colors.gray[7],
                                                textAlign: 'center',
                                                fontSize: 10,
                                                fontWeight: 'bold'
                                            }}>|</AppText>
                                            <Image source={require('../../assets/images/review_star.png')}
                                                style={{
                                                    width: 10,
                                                    height: 10,
                                                    alignSelf: 'center',
                                                    marginTop: '1%'
                                                }}></Image>
                                            <AppText style={{
                                                color: colors.gray[3],
                                                textAlign: 'center',
                                                fontSize: 10,
                                                fontWeight: 'bold',
                                                marginLeft: 2
                                            }}>4.8</AppText>
                                        </View>
                                        <View style={{width: '100%'}}>
                                            {/* <AppText style={{
                                                fontSize: 16,
                                                fontWeight: 'bold',
                                                color: colors.mainColor,
                                                marginVertical: 5,
                                            }}>{props.item.place_name}</AppText> */}
                                                                                        <AppText style={{
                                                fontSize: 16,
                                                fontWeight: 'bold',
                                                color: colors.mainColor,
                                                marginVertical: 5,
                                            }}>제목</AppText>
                                        </View>
                                        {/* <AppText
                                            style={{fontSize: 12, color: colors.gray[4]}}>{props.item.place_addr}</AppText> */}
                                                                                    <AppText
                                            style={{fontSize: 12, color: colors.gray[4]}}>서울시 구로구 연동로</AppText>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            {/* {props.item.like_flag === 0 ?  */}
                            {/* <TouchableOpacity onPress={() => {
                                let newArr = [...isPress];
                                if (newArr[index]) {
                                    newArr[index] = false;
                                    setIsPress(newArr);
                                    deletePlace(props.item.place_pk);
                                } else {
                                    // for(let i=0;i<newArr.length;i++) {
                                    //     if(i == index) continue;
                                    //     else newArr[i] = false;
                                    // }
                                    newArr[index] = true;
                                    setIsPress(newArr);
                                    likePlace(props.item.place_pk);
                                }
                            }}> */}
                            <TouchableOpacity>
                                <Jewel width={26} height={21}
                                    style={{color: isPress[index] ? colors.red[3] : colors.red_gray[5]}}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {
                        item.id === 2 ?
                        <>
                        <View style={{
                            backgroundColor: colors.defaultColor,
                            height: 30,
                            paddingVertical: 6,
                            paddingHorizontal: 8,
                            marginBottom: 6,
                            marginRight: 10,
                            marginTop: 4,
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexDirection: 'row',
                            marginLeft: 36,
                            borderRadius: 10,
                        }}>
                            <View>
                                <AppText style={{color: colors.blue[1], fontSize: 14, textAlign: 'left'}}>대체 공간 2</AppText>
                            </View>
                            <View>
                                <BackIcon width={10} height={14} style={{color: colors.mainColor, transform: [{rotate: '180deg'}], width: 4, height: 8}}/>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => setVisible(true)}>
            <View style={{
                backgroundColor: colors.defaultColor,
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
            }}>
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <Image source={require('../../assets/images/tipIcon.png')}
                        style={{width: 12, height: 12, marginEnd: 8}}></Image>
                    <AppText style={{color: colors.blue[1], fontSize: 14}}>{props.item.tip}</AppText>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <Image style={{width: 28, height: 28}}
                        source={require('../../assets/images/default_profile_2.png')}></Image>
                </View>
            </View>
        </TouchableOpacity>
        <Modal
            visible={visible}
            backdropStyle={{backgroundColor: 'rbga(0,0,0,0.5)'}}
            style={{backgroundColor: colors.defaultColor, borderWidth: 0, width: '30%'}}
            onBackdropPress={() => setVisible(false)}
        >
            <Card disabled={true}>
                <TextInput placeholder={props.item.tip} onChangeText={(text)=>{
                    const newArr = [...changedTip];
                    newArr.index = index;
                    newArr.tip = text;
                    setChangedTip(newArr);
                }}></TextInput>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <TouchableOpacity onPress={() => {setVisible(false)}}>
                        <View style={{height: 20, borderRadius: 10, backgroundColor: colors.gray[6]}}>
                            <AppText style={{padding: 4, color: colors.defaultColor, fontSize: 12}}>취소</AppText>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        const newArr = [...tmpData];
                        newArr[changedTip.index].tip = changedTip.tip;
                        setTmpData(newArr);
                        setVisible(false)}}>
                        <View style={{height: 20, borderRadius: 10, backgroundColor: colors.mainColor}}>
                            <AppText style={{padding: 4, color: colors.defaultColor, fontSize: 12}}>확인</AppText>
                        </View>
                    </TouchableOpacity>
                </View>
            </Card>
        </Modal>
                        <TouchableOpacity onPress={() => {
                                    // if(isLimited) setIsLimited(false);
                                    // else setIsLimited(true);
                                    // console.log(isLimited)
                                }}>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Image source={require('../../assets/images/showWhole_forDir.png')}
                                            style={{
                                                width: 15,
                                                height: 15,
                                                marginLeft: 10,
                                                marginBottom: 5
                                            }}></Image>
                                    </View>
                        </TouchableOpacity>
                        </> :
                        <>
                        <View style={{
                            backgroundColor: colors.defaultColor,
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
                        }}>
                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                <Image source={require('../../assets/images/tipIcon.png')}
                                    style={{width: 12, height: 12, marginEnd: 8}}></Image>
                                <AppText style={{color: colors.blue[1], fontSize: 14}}>근처에 xxx파전 맛집에서 막걸리 한잔 캬</AppText>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                <Image style={{width: 28, height: 28}}
                                    source={require('../../assets/images/default_profile_2.png')}></Image>
                            </View>
                        </View>
                        <View style={{
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
                        }}>
                            <View style={{
                                width: '90%',
                                borderStyle: 'dotted',
                                borderRadius: 1,
                                borderWidth: 1,
                                borderColor: colors.gray[4],
                                zIndex: -1000
                                }}></View>
                            <View style={{marginStart: 6}}>
                                <AppText style={{color: colors.gray[4], fontSize: 12, lineHeight: 19.2, fontWeight: '400'}}>12PM</AppText>
                            </View>
                        </View>
                        </>
                    }
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

export default memo(ShowPlace, areEqual);