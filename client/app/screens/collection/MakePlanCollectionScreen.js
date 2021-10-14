import React, {useEffect, useState, useRef, useCallback, useContext} from 'react';
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Switch,
    Alert,
    KeyboardAvoidingView,
    Platform,
    FlatList,
    Pressable,
    TextInput,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import { Layout, NativeDateService, RangeCalendar } from '@ui-kitten/components';
import RBSheet from 'react-native-raw-bottom-sheet';
import moment from 'moment';
import 'moment/locale/ko';

import ScreenContainer from '../../components/ScreenContainer';
import ScreenContainerView from '../../components/ScreenContainerView';
import NavigationTop from '../../components/NavigationTop';
import CustomTextInput from '../../components/CustomTextInput';
import ScreenDivideLine from '../../components/ScreenDivideLine';
import AppText from '../../components/AppText';
import {useToken} from '../../contexts/TokenContextProvider';

import CalendarTexts from './CalendarTexts';
import * as SecureStore from 'expo-secure-store';
import {useIsSignedIn} from '../../contexts/SignedInContextProvider';

import SearchIcon from '../../assets/images/search-icon.svg';

export const navigationRef = React.createRef();

const MakePlanCollectionScreen = ({route, navigation}) => {
    const [token, setToken] = useToken();
    const [isSignedIn, setIsSignedIn] = useIsSignedIn();
    const {colors} = useTheme();
    const toastRef = useRef();
    const refCalendarRBSheet = useRef();
    const refKeywordRBSheet = useRef();
    const { data, update } = route.params;

    const showCopyToast = useCallback(() => {
        toastRef.current.show('비어있는 필드가 있습니다.', 2000);
        console.log('완료');
    }, []);
    const [isEnabled, setIsEnabled] = useState(false);
    const [collectionName, setCollectionName] = useState('');
    const [keywordData, setKeywordData] = useState([]);
    //키워드 수 만큼 press 여부를 만든다
    const [isPress, setIsPress] = useState([]);
    const [putKeywords, setPutKeywords] = useState('');
    const [range, setRange] = useState({
        startDate: new Date(),
        endDate: new Date()
    });
    const [originStartDate, setOriginStartDate] = useState(new Date());
    const [originEndDate, setOriginEndDate] = useState(new Date());

    const [alertDuplicated, setAlertDuplicated] = useState(false);

    const i18n = {
        dayNames: {
            short: ['일', '월', '화', '수', '목', '금', '토'],
            long: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
        },
        monthNames: {
            short: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
            long: [
                '1월',
                '2월',
                '3월',
                '4월',
                '5월',
                '6월',
                '7월',
                '8월',
                '9월',
                '10월',
                '11월',
                '12월',
            ],
        },
    };
    const formatDateService = new NativeDateService('ko', {i18n, format: 'YY. MM. DD'});

    const Keyword = ({keyword, idx}) => {
        return (
            <View key={idx}
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}

            >
                {/* <TouchableOpacity style={styles.selectType} onPress={pressFunc}> */}
                <TouchableOpacity onPress={() => {
                    let newArr = [...isPress];
                    if (isPress[keyword.keyword_pk - 1]) {
                        newArr[keyword.keyword_pk - 1] = false;
                        setIsPress(newArr);
                    } else {
                        newArr[keyword.keyword_pk - 1] = true;
                        setIsPress(newArr);
                    }
                }} style={isPress[keyword.keyword_pk - 1] ? [styles.selectTypeClicked, {
                    borderColor: colors.mainColor,
                    backgroundColor: colors.mainColor,
                    shadowColor: colors.red[8]
                }] : [styles.selectType, {borderColor: colors.defaultColor, backgroundColor: colors.defaultColor, shadowColor: colors.red[8]}]}>
                    <AppText
                        style={isPress[keyword.keyword_pk - 1] ? {...styles.selectTypeTextClicked, color: colors.defaultColor} : {...styles.selectTypeText, color: colors.gray[6]}}>{keyword.keyword_title}</AppText>
                </TouchableOpacity>
            </View>
        );
    };
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const DATA = {
        collection_name: collectionName,
        collection_private: (isEnabled === true) ? 1 : 0,
        collection_keywords: putKeywords,
        collection_type: 1,
    };

    useEffect(() => {
        getKeywords();
        if(update) {
            setCollectionName(data.collection_name);
            if(data.collection_private) {
                setIsEnabled(true);
            }
            console.log(range);
            var newArr = {
                startDate: data.collection_start_date,
                endDate: data.collection_end_date,
            };
            // newArr.startDate = data.collection_start_date;
            // newArr.endDate = data.collection_end_date;
            setRange(newArr);
        }
    }, []);

    const getKeywords = useCallback(() => {
        try {

            fetch('http://34.64.185.40/keyword/list', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            }).then((res) => res.json())
                .then((response) => {
                    setKeywordData(response.data);
                    if(update) {
                        setFalseUpdated(response.data);
                    }
                    else setFalse();
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    }, []);

    const postCollections = () => {
        var datas = [];
        var showDatas = [];
        for (let i = 0; i < keywordData.length; i++) {
            if (isPress[i] === true) {
                datas.push(keywordData[i].keyword_pk);
                showDatas.push(keywordData[i].keyword_title);
            }
        }

        const startDate = moment(range.startDate).format('YYYY-MM-DD');
        const endDate = moment(range.endDate).format('YYYY-MM-DD');

        var forPostEnable = 0;
        if (isEnabled === true) forPostEnable = 1;

        var forPostData = {};

        if(datas.length === 0) {
            forPostData = {
                name: collectionName,
                isPrivate: forPostEnable,
                startDate: startDate,
                endDate: endDate,
                keywords: []
            };
        } else {
            forPostData = {
                name: collectionName,
                isPrivate : forPostEnable,
                startDate: startDate,
                endDate: endDate,
                keywords: datas
            };
        }

        let form = new FormData();
        form.append('collectionData', JSON.stringify(forPostData));
        form.append('img', 'default-red');
        try {
            fetch('http://34.64.185.40/collection/plan', {
                method: 'POST',
                headers: {
                    'x-access-token': token
                },
                body: form
            }).then(res => res.json())
                .then(async response => {
                    if (response.code === 405 && !alertDuplicated) {
                        Alert.alert('', '다른 기기에서 로그인했습니다.');
                        setAlertDuplicated(true);
                    }

                    if (parseInt(response.code / 100) === 4) {
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }

                    const item = {
                        'collection_pk': response.collectionId,
                        'now': true
                    };
                    Alert.alert('', '일정보관함이 생성되었습니다', [
                        {text : 'OK', onPress: () => {
                            navigation.navigate('PlanCollection', {
                                data: item
                            });
                            navigation.setOptions({tabBarVisible: true});
                        }}]);   
                })
                .catch((err) => {
                    console.error(err);
                    Alert.alert('', '일정보관함 생성에 실패했습니다. 다시 시도해주세요.');
                });
        } catch (err) {
            console.error(err);
        }
    };

    const updateCollections = () => {
        var datas = [];
        var showDatas = [];
        for (let i = 0; i < keywordData.length; i++) {
            if (isPress[i] === true) {
                datas.push(keywordData[i].keyword_pk);
                showDatas.push(keywordData[i].keyword_title);
            }
        }

        const startDate = moment(range.startDate).format('YYYY-MM-DD');
        const endDate = moment(range.endDate).format('YYYY-MM-DD');

        var forPostEnable = 0;
        if (isEnabled === true) forPostEnable = 1;

        var forPostData = {};

        //사진 추가 필요
        if(datas.length === 0) {
            forPostData = {
                name: collectionName,
                isPrivate: forPostEnable,
                startDate: startDate,
                endDate: endDate,
                keywords: [],
                img: 'default-red',
            };
        } else {
            forPostData = {
                name: collectionName,
                isPrivate : forPostEnable,
                startDate: startDate,
                endDate: endDate,
                keywords: datas,
                img: 'default-red',
            };
        }

        let form = new FormData();
        form.append('collectionData', JSON.stringify(forPostData));

        try {
            fetch(`http://34.64.185.40/collection/${data.collection_pk}/info`, {
                method: 'PUT',
                headers: {
                    'x-access-token': token
                },
                body: form
            }).then(res => res.json())
                .then(async response => {
                    if (response.code === 405 && !alertDuplicated) {
                        Alert.alert('', '다른 기기에서 로그인했습니다.');
                        setAlertDuplicated(true);
                    }

                    if (parseInt(response.code / 100) === 4) {
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }

                    const item = {
                        'collection_pk': data.collection_pk,
                        'now': true
                    };
                    Alert.alert('', '일정보관함이 수정되었습니다', [
                        {text : 'OK', onPress: () => {
                            navigation.navigate('PlanCollection', {data: item});
                            navigation.setOptions({tabBarVisible: true});
                        }}]);   
                })
                .catch((err) => {
                    console.error(err);
                    Alert.alert('', '일정보관함 수정에 실패했습니다. 다시 시도해주세요.');
                });
        } catch (err) {
            console.error(err);
        }
    };
    
    const setFalse = () => {
        var pressed = [];
        for (let i = 0; i < keywordData.length; i++) {
            pressed.push(false);
        }
        setIsPress(pressed);
    };

    const setFalseUpdated = (keywords) => {
        var pressed = [];
        for (let i = 0; i < keywords.length; i++) {
            if(data.keywords.indexOf(keywords[i].keyword_title) !== -1) pressed.push(true);
            else pressed.push(false);
        }
        setIsPress(pressed);
    };
    
    const ShowCalendar = () => {
        const [date, setDate] = useState({
            startDate: update? originStartDate : new Date(),
            endDate: update? originEndDate : new Date
        });
        const [textColor, setTextColor] = useState(colors.mainColor);

        return (
            <TouchableOpacity onPress={()=>{
                refCalendarRBSheet.current.open(); 
                setDate({
                    startDate: update? originStartDate : new Date(),
                    endDate: update? originEndDate : new Date
                });
            }}><AppText style={{color: colors.mainColor, fontSize: 14, fontWeight: '400', lineHeight: 22.4}}>{moment(range.startDate).format('YY. MM. DD (dd)')} - {moment(range.endDate).format('YY. MM. DD (dd)')}</AppText>
                <RBSheet
                    ref={refCalendarRBSheet}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    height={600}
                    customStyles={{
                        wrapper: {
                            backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        },
                        draggableIcon: {
                            backgroundColor: colors.gray[4],
                            width: 110
                        },
                        container: {
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10,
                            backgroundColor: colors.yellow[7]
                        }
                    }}
                >
                    <ScreenContainerView>
                        <View style={{
                            marginTop: 24,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <AppText style={{fontSize: 16, fontWeight: '500', color: colors.mainColor}}>날짜 선택</AppText>
                            <AppText style={{color: colors.mainColor}}>{date.startDate ? moment(date.startDate).locale('ko').format('YY. MM. DD (dd)') : moment().format('YY. MM. DD (dd)')} - {date.endDate ? moment(date.endDate).locale('ko').format('YY. MM. DD (dd)') : moment().format('YY. MM. DD (dd)')}</AppText>
                        </View>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <RangeCalendar
                                range={date}
                                onSelect={(nextRange) => {
                                    setDate(nextRange);
                                }}
                                dateService={formatDateService}
                                style={{color: colors.mainColor, marginVertical: 20, borderColor: 'transparent'}}
                                renderDay={(Date)=>{
                                    return(
                                        <View>
                                            <AppText style={{color: Date.date >= date.startDate && Date.date <= date.endDate ? colors.backgroundColor : colors.mainColor,
                                                fontSize: 12, lineHeight: 24, fontWeight: '500', justifyContent: 'center', textAlign: 'center', paddingTop: 10}}>
                                                {Platform.OS === 'ios' ?
                                                    Date.date.toLocaleDateString().split('.')[2]
                                                    : Date.date.toLocaleDateString().split('/')[1]}
                                            </AppText>
                                        </View>
                                    );}}
                            />
                        </View>
                        <View flex={1} style={{marginBottom: 20}}>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: (date.startDate && date.endDate && moment(date.startDate).format('YY. MM. DD (dd)') !== moment(date.endDate).format('YY. MM. DD (dd)')) ? colors.mainColor : colors.gray[5],
                                    height: 48,
                                    borderRadius: 10
                                }}
                                onPress={() => {
                                    refCalendarRBSheet.current.close();
                                    setRange(date);
                                }}
                            ><AppText
                                    style={{
                                        textAlign: 'center',
                                        padding: 14,
                                        fontSize: 16,
                                        color: colors.defaultColor,
                                        fontWeight: 'bold'
                                    }}
                                >선택완료</AppText>
                            </TouchableOpacity>
                        </View>
                    </ScreenContainerView>
                </RBSheet>
            </TouchableOpacity>
        );
    };

    const SelectKeyword = () => {
        const setF = () => {
            var pressed = [];
            for (let i = 0; i < keywordData.length; i++) {
                pressed.push(false);
            }
            return pressed;
        };

        const [pressed, setPressed] = useState(setF());

        const Keyword = ({keyword, idx}) => {
            return (
                <View key={idx}
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <TouchableOpacity onPress={() => {
                        if (pressed[keyword.keyword_pk - 1]) {
                            let newArr = [...pressed];
                            newArr[keyword.keyword_pk - 1] = false;
                            setPressed(newArr);
                        } else {
                            let newArr = [...pressed];
                            newArr[keyword.keyword_pk - 1] = true;
                            setPressed(newArr);
                        }
                    }} style={pressed[keyword.keyword_pk - 1] ? [styles.selectTypeClicked, {
                        borderColor: colors.mainColor,
                        backgroundColor: colors.mainColor,
                        shadowColor: colors.red[8]
                    }] : [styles.selectType, {borderColor: colors.defaultColor, backgroundColor: colors.defaultColor, shadowColor: colors.red[8]}]}>
                        <AppText
                            style={pressed[keyword.keyword_pk - 1] ? {...styles.selectTypeTextClicked, color: colors.defaultColor} : {...styles.selectTypeText, color: colors.gray[3]}}>{keyword.keyword_title}</AppText>
                    </TouchableOpacity>
                </View>
            );
        };


        return (
            <>
                <TouchableOpacity onPress={()=>refKeywordRBSheet.current.open()}>
                    <Image source={require('../../assets/images/add_keyword.png')}
                        style={{width: 32, height: 32, marginEnd: 8.5}}></Image>
                </TouchableOpacity>
                <RBSheet
                    ref={refKeywordRBSheet}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    height={450}
                    customStyles={{
                        wrapper: {
                            backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        },
                        draggableIcon: {
                            backgroundColor: colors.gray[4],
                            width: 110
                        },
                        container: {
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10,
                            backgroundColor: colors.yellow[7],
                        }
                    }}
                >
                    <View style={{backgroundColor: colors.backgroundColor}}>
                        <ScreenContainerView>
                            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 19, marginBottom: 17}}>
                                <AppText style={{fontSize: 16, fontWeight: '500', color: colors.mainColor}}>보관함
                                해시태그</AppText>
                                <AppText style={{fontSize: 12, color: colors.gray[5], alignSelf: 'center', marginLeft: 9}}>* 최대 3개</AppText>
                            </View>
                            <><View style={{flexDirection: 'row'}}>
                                {
                                    keywordData.map((keyword, idx) => (
                                        <>{0 <= idx && idx <= 3 &&
                                        <Keyword keyword={keyword} key={idx+'0000'}/>}</>
                                    ))
                                }
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                {
                                    keywordData.map((keyword, idx) => (
                                        <>{4 <= idx && idx <= 6 &&
                                        <Keyword keyword={keyword} key={idx+'1111'}/>}</>
                                    ))
                                }
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                {
                                    keywordData.map((keyword, idx) => (
                                        <>{7 <= idx && idx <= 10 &&
                                        <Keyword keyword={keyword} key={idx+'2222'}/>}</>
                                    ))
                                }
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                {
                                    keywordData.map((keyword, idx) => (
                                        <>{11 <= idx && idx <= 13 &&
                                        <Keyword keyword={keyword} key={idx+'3333'}/>}</>
                                    ))
                                }
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                {
                                    keywordData.map((keyword, idx) => (
                                        <>{14 <= idx && idx <= 17 &&
                                        <Keyword keyword={keyword} key={idx+'4444'}/>}</>
                                    ))
                                }
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                {
                                    keywordData.map((keyword, idx) => (
                                        <>{18 <= idx && idx <= 19 &&
                                        <Keyword keyword={keyword} key={idx+'5555'}/>}</>
                                    ))
                                }
                            </View>
                            </>
                            <View style={{marginTop: 30, marginBottom: 20, bottom: 0}}>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: pressed.filter(element => element === true).length > 0 && pressed.filter(element => element === true).length <= 3 ? colors.mainColor : colors.gray[5],
                                        height: 48,
                                        borderRadius: 10
                                    }}
                                    onPress={() => {
                                        setIsPress(pressed);
                                    }}
                                    disabled={pressed.filter(element => element === true).length > 0 && pressed.filter(element => element === true).length <= 3 ? false : true}
                                ><AppText
                                        style={{
                                            textAlign: 'center',
                                            padding: 14,
                                            fontSize: 16,
                                            color: colors.defaultColor,
                                            fontWeight: 'bold'
                                        }}
                                    >선택완료</AppText>
                                </TouchableOpacity>
                            </View>
                        </ScreenContainerView>
                    </View>
                </RBSheet>
            </>
        );
    };

    const SelectedKeyword = ({keyword, idx}) => {
        return (
            <View key={idx+'selected'}
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <TouchableOpacity style={[styles.selectType, {borderColor: colors.defaultColor, backgroundColor: colors.defaultColor, shadowColor: colors.red[8]}]}
                    disabled={true}
                >
                    <AppText
                        style={{...styles.selectTypeText, color: colors.mainColor}}>{keyword.keyword_title}</AppText>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <ScreenContainer backgroundColor={colors.backgroundColor}>
            <NavigationTop navigation={navigation} title={update ? '일정보관함 수정' : '일정보관함 만들기'}/>
            <KeyboardAvoidingView flex={1} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScreenContainerView>
                    <View style={{marginTop: 26}}>
                        <CustomTextInput
                            style={{
                                color: colors.mainColor,
                                fontSize: 20,
                                fontWeight: 'bold'
                            }}
                            placeholder={'보관함 이름을 입력해주세요 (2~25자)'}
                            onChangeText={(name) => setCollectionName(name)}
                            value={collectionName}
                        >
                        </CustomTextInput>
                    </View>
                </ScreenContainerView>
                <ScreenDivideLine />
                <ScreenContainerView flex={1}>
                    <View style={{marginTop: 24}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <AppText style={{fontSize: 16, fontWeight: '500', color: colors.mainColor}}>보관함
                                해시태그</AppText>
                            <AppText style={{fontSize: 12, color: colors.gray[5], alignSelf: 'center', marginLeft: 9}}>*
                                최대
                                3개</AppText>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            marginTop: 16
                        }}>

                            <View flexDirection="row">
                                <SelectKeyword />
                                {
                                    keywordData.map((keyword, idx) => (
                                        <>{isPress[idx] === true &&
                                                <SelectedKeyword keyword={keyword} key={idx+'selected'} idx={idx+'selected'}/>}</>
                                    ))
                                }
                            </View>
                        </View>
                    </View>
                    <View style={{
                        marginTop: 24,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <AppText style={{fontSize: 16, fontWeight: '500', color: colors.mainColor}}>비공개 설정</AppText>
                        <Switch
                            trackColor={{false: colors.gray[6], true: colors.mainColor}}
                            thumbColor={colors.defaultColor}
                            ios_backgroundColor={colors.gray[6]}
                            onValueChange={toggleSwitch}
                            value={isEnabled}
                        />
                    </View>
                    <View style={{
                        marginTop: 24,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <AppText style={{fontSize: 16, fontWeight: '500', color: colors.mainColor}}>날짜 선택</AppText>
                        <ShowCalendar />
                    </View>
                    <View flex={1} style={{marginBottom: 20, justifyContent: 'flex-end'}}>
                        <TouchableOpacity
                            testID="completed"
                            style={{
                                backgroundColor: DATA.collection_name.length >= 2 ? colors.mainColor : colors.gray[5],
                                height: 48,
                                borderRadius: 10
                            }}
                            onPress={() => {
                                if(update) updateCollections();
                                else postCollections();
                            }}
                            disabled={DATA.collection_name.length < 2 ? true : false}
                        ><AppText
                                style={{
                                    textAlign: 'center',
                                    padding: 14,
                                    fontSize: 16,
                                    color: colors.defaultColor,
                                    fontWeight: 'bold'
                                }}
                            >{update ? '보관함 수정' : '보관함 만들기'}</AppText>
                        </TouchableOpacity>
                    </View>
                </ScreenContainerView>
            </KeyboardAvoidingView>
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    plusComplete: {
        marginBottom: '5%'
    },
    selectType: {
        borderWidth: 1,
        paddingVertical: 1,
        paddingHorizontal: 8.5,
        borderRadius: 12,
        marginVertical: 5,
        marginRight: 10,
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        elevation: 1,
        // width: 58,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center'
    },
    selectTypeClicked: {
        borderWidth: 1,
        paddingVertical: 1,
        paddingHorizontal: 8.5,
        borderRadius: 12,
        marginVertical: 5,
        marginRight: 10,
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        elevation: 1,
        // width: 58,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center'
    },
    selectTypeTextClicked: {
        fontSize: 14,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontWeight: 'bold',
        marginVertical: 2
    },
    selectTypeText: {
        fontSize: 14,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontWeight: 'bold',
        marginVertical: 2
    },
    selectTypeIcon: {
        backgroundColor: 'rgb(141, 141, 141)',
        borderColor: 'black',
        borderWidth: 1,
        paddingVertical: 1,
        paddingHorizontal: 8.5,
        borderRadius: 12
    },
    selectTypeIconDetail: {
        paddingVertical: 1,
        borderRadius: 12
    },
    defaultImage: {
        backgroundColor: '#c4c4c4',
        width: 287,
        height: 243,
    },
    bottomSheetBack: {
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    search_box: {
        borderBottomWidth: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 18
    },
});

export default MakePlanCollectionScreen;