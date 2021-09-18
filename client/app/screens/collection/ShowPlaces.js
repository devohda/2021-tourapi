import React from 'react';
import {
    TouchableOpacity,
    View,
    Image,
    TouchableHighlight,
} from 'react-native';
import { useTheme } from '@react-navigation/native';

import AppText from '../../components/AppText';
import TipsList from './TipsList';

import Jewel from '../../assets/images/jewel.svg';
import BackIcon from '../../assets/images/back-icon.svg';
import SlideMenu from '../../assets/images/menu_for_edit.svg';

const ShowPlaces = props => {
    const { colors } = useTheme();
    const isPress = props.isPress;

    return (
        <>
            {/* {item.place_pk !== collectionData.places[0].place_pk && <View style={{
                width: '100%',
                height: 1,
                backgroundColor: colors.red_gray[6],
                zIndex: -1000,
                marginVertical: 13
            }}></View>} */}
            {/* pk로 바꾸기 */}
            <TouchableHighlight underlayColor={colors.backgroundColor} style={{backgroundColor: colors.backgroundColor}}>
            <View flex={1}>
                <View style={{flexDirection: 'row', marginTop: 16, marginBottom: 4}}>
                    <TouchableOpacity onPress={() => navigation.navigate('Place', {data: props.item})} disabled={props.isEditPage && true}>
                        <View style={{flexDirection: 'row', width: '90%'}}>
                            {/* <Image source={{uri: item.place_img}} */}
                            <View style={{justifyContent: 'center', alignItems: 'center', marginEnd: 12}}>
                                <View style={{borderRadius: 50, width: 24, height: 24, backgroundColor: colors.mainColor, justifyContent: 'center', alignItems: 'center'}}>
                                    <AppText style={{color: colors.defaultColor, fontSize: 12, lineHeight: 19.2, fontWeight: '500', textAlign: 'center'}}>
                                        {props.item.id}    
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
                                        }}>{checkType(item.place_type)}</AppText> */}
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
                                        }}>{item.place_name}</AppText> */}
                                                                                    <AppText style={{
                                            fontSize: 16,
                                            fontWeight: 'bold',
                                            color: colors.mainColor,
                                            marginVertical: 5,
                                        }}>제목</AppText>
                                    </View>
                                    {/* <AppText
                                        style={{fontSize: 12, color: colors.gray[4]}}>{item.place_addr}</AppText> */}
                                                                                <AppText
                                        style={{fontSize: 12, color: colors.gray[4]}}>서울시 구로구 연동로</AppText>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        {/* {item.like_flag === 0 ?  */}
                        {/* <TouchableOpacity onPress={() => {
                            let newArr = [...isPress];
                            if (newArr[index]) {
                                newArr[index] = false;
                                setIsPress(newArr);
                                deletePlace(item.place_pk);
                            } else {
                                // for(let i=0;i<newArr.length;i++) {
                                //     if(i == index) continue;
                                //     else newArr[i] = false;
                                // }
                                newArr[index] = true;
                                setIsPress(newArr);
                                likePlace(item.place_pk);
                            }
                        }}> */}
                        {
                            !props.isEditPage ?
                            <TouchableOpacity>
                                <Jewel width={26} height={21}
                                    style={{color: isPress[props.index] ? colors.red[3] : colors.red_gray[5]}}/>
                            </TouchableOpacity> :
                            <TouchableOpacity>
                                <SlideMenu width={21} height={21} style={{marginLeft: 2}}/>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
                {
                    props.item.id === 2 ?
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

                    <TipsList data={props.item} idx={props.index} day={props.day}/>

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
                    <TipsList data={props.item} idx={props.index} day={props.day}/>
                    </>
                }
            </View>
            </TouchableHighlight>
            {/* 받은 데이터를 이용해서 같은 성격의 데이터처럼 넣어야할것같음 */}
            {/* {
                props.index === 0 &&
                <View style={{
                    height: 30,
                    paddingVertical: 6,
                    paddingLeft: 6,
                    paddingRight: 15,
                    paddingBottom: 6,
                    paddingTop: 4,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginLeft: 36,
                    backgroundColor: colors.backgroundColor
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
            } */}

        </>
    );
};

export default ShowPlaces;