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
    const { day, index, isEditPage, isPress, item, length} = props;
    const isFree = (typeof day === 'undefined');
    
    const checkType = (type) => {
        if(type === 12) {
            return '관광지';
        } else if(type === 14) {
            return '문화시설';
        } else if(type === 15) {
            return '축제/공연/행사';
        } else if(type === 28) {
            return '레포츠';
        } else if(type === 32) {
            return '숙박';
        } else if(type === 38) {
            return '쇼핑';
        } else if(type === 39) {
            return '음식';
        } else {
            return '기타';
        }
    };

    return (
        <>
            { item.place_pk > 0 ?
            <TouchableHighlight underlayColor={colors.backgroundColor} style={{backgroundColor: colors.backgroundColor}}>
            <View flex={1}>
                <View style={{flexDirection: 'row', marginTop: 16, marginBottom: 4, justifyContent: 'center', alignItems: 'center'}}>
                    <TouchableOpacity onPress={() => props.navigation.navigate('Place', {data: item})} disabled={isEditPage && true}>
                        <View style={{flexDirection: 'row', width: isFree ? '100%' : '90%'}}>
                            {
                                !isFree &&
                                <View style={{justifyContent: 'center', alignItems: 'center', marginEnd: 12}}>
                                    <View style={{borderRadius: 50, width: 24, height: 24, backgroundColor: colors.mainColor, justifyContent: 'center', alignItems: 'center'}}>
                                        <AppText style={{color: colors.defaultColor, fontSize: 12, lineHeight: 19.2, fontWeight: '500', textAlign: 'center'}}>
                                            {index + 1}    
                                        </AppText>
                                    </View>
                                </View>
                            }
                            {
                                item.place_img ?
                                <Image source={{uri: item.place_img}}
                                style={{borderRadius: 10, width: 72, height: 72, marginTop: 2}}/> :
                                <Image source={require('../../assets/images/here_default.png')}
                                style={{borderRadius: 10, width: 72, height: 72, marginTop: 2}}/> 
                            }
                            <View style={{
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexDirection: 'row',
                                width: '67%'
                            }}>
                                <View style={{marginLeft: 8, marginTop: '2%'}}>
                                    <View style={{flexDirection: 'row'}}>
                                        <AppText style={{
                                            color: colors.gray[3],
                                            textAlign: 'center',
                                            fontSize: 10,
                                            fontWeight: 'bold'
                                        }}>{checkType(item.place_type)}</AppText>
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
                                        <AppText style={{
                                            fontSize: 16,
                                            fontWeight: 'bold',
                                            color: colors.mainColor,
                                            marginVertical: 5,
                                        }}>{item.place_name}</AppText>
                                    </View>
                                    <AppText
                                        style={{fontSize: 12, color: colors.gray[4]}}>{item.place_addr}</AppText>
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
                            !isEditPage ?
                            <TouchableOpacity>
                                <Jewel width={26} height={21}
                                    style={{color: isPress[index] ? colors.red[3] : colors.red_gray[5]}}/>
                            </TouchableOpacity> :
                            <TouchableOpacity>
                                <SlideMenu width={21} height={21} style={{marginLeft: 2}}/>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
                {
                    isFree ?
                    <>
                    <TipsList data={item} idx={index} day={day} length={length}/>
                    </> :
                    <>
                        {/* <View style={{
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
                    </View> */}

                    <TipsList data={item} idx={index} day={day} length={length}/>
                    </>
                }
            </View>
            </TouchableHighlight> :
            <TouchableHighlight underlayColor={colors.backgroundColor} style={{backgroundColor: colors.backgroundColor}}>
                <View flex={1}>
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
                                width: !isEditPage ? '90%' : '80%',
                                borderStyle: 'dotted',
                                borderRadius: 1,
                                borderWidth: 1,
                                borderColor: colors.gray[4],
                                zIndex: -1000,
                                
                            }}></View>
                            <View style={{marginStart: 6}}>
                                <AppText style={{color: colors.gray[4], fontSize: 12, lineHeight: 19.2, fontWeight: '400'}}>
                                    {item.place_pk === -1 ? '12PM' : '18PM'}
                                </AppText>
                        </View>
                        {
                            isEditPage &&
                            <TouchableOpacity style={{marginStart: 12}}>
                                <SlideMenu width={21} height={21} style={{marginLeft: 2}}/>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
            </TouchableHighlight>
            }

        </>
    );
};

export default ShowPlaces;