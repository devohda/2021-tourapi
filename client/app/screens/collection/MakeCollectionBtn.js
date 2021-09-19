import * as React from 'react';
import {useState, useRef} from 'react';
import {Platform, View, TouchableOpacity, Image} from 'react-native';
import {Icon} from 'react-native-elements';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useTheme} from '@react-navigation/native';
import AppText from '../../components/AppText';

export default function MakeCollectionBtn({navigation}) {
    const refRBSheet = useRef();
    const [clicked, setClicked] = useState(false);
    const {colors} = useTheme();

    return (
        <>
            <TouchableOpacity style={{height: 50, marginHorizontal: '15%', justifyContent: 'center', alignItems: 'center', marginBottom: 3}} onPress={() => {
                refRBSheet.current.open();
                setClicked(true);
            }}>
                <Icon type="ionicon" name={'add-circle-outline'} size={38} color={colors.mainColor}></Icon>
            </TouchableOpacity>
            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={true}
                customStyles={{
                    wrapper: {
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    },
                    draggableIcon: {
                        backgroundColor: colors.defaultDarkColor,
                        display: 'none'
                    },
                    container: {
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        backgroundColor: colors.backgroundColor
                    }
                }}
            >
                <View style={{paddingTop: '5%', backgroundColor: colors.yellow[7]}}>
                    <View style={{flexDirection: 'row'}}>
                        <AppText style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            marginLeft: '5%',
                            marginTop: '1%',
                            color: colors.mainColor
                        }}>보관함 만들기</AppText>
                        <TouchableOpacity onPress={() => {
                            refRBSheet.current.close();
                        }} style={{marginLeft: '58%', color: colors.mainColor}}><Icon type="ionicon"
                                name={'close'}></Icon></TouchableOpacity>
                    </View>
                    <View style={{alignItems: 'center', justifyContent: 'center', marginTop: '1%'}}>
                        <TouchableOpacity style={{
                            backgroundColor: colors.blue[3],
                            width: '90%',
                            height: 72,
                            borderRadius: 10,
                            margin: 10
                        }}>
                            <AppText style={{
                                textAlign: 'center',
                                paddingTop: 13,
                                fontSize: 18,
                                fontWeight: 'bold',
                                color: colors.backgroundColor
                            }}>일정 보관함</AppText>
                            <AppText style={{
                                textAlign: 'center',
                                paddingTop: 5,
                                paddingBottom: 15,
                                fontSize: 12,
                                fontWeight: 'bold',
                                color: colors.backgroundColor
                            }}>공간을 시간 순서대로 보관할 수 있어요</AppText>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            backgroundColor: colors.blue[3],
                            width: '90%',
                            height: 72,
                            borderRadius: 10,
                            margin: 10
                        }} onPress={() => {
                            refRBSheet.current.close();
                            navigation.navigate('MakeFreeCollection');
                            navigation.setOptions({tabBarVisible: false});
                        }}>
                            <AppText style={{
                                textAlign: 'center',
                                paddingTop: 13,
                                fontSize: 18,
                                fontWeight: 'bold',
                                color: colors.backgroundColor
                            }}>자유 보관함</AppText>
                            <AppText style={{
                                textAlign: 'center',
                                paddingTop: 5,
                                paddingBottom: 15,
                                fontSize: 12,
                                fontWeight: 'bold',
                                color: colors.backgroundColor
                            }}>순서 상관없이 자유롭게 공간을 보관할 수 있어요</AppText>
                        </TouchableOpacity>
                    </View>
                </View>
            </RBSheet>
        </>
    );
}