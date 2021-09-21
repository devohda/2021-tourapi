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
    FlatList
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
import CalendarTexts from './CalendarTexts';

export const navigationRef = React.createRef();

const MakePlanCollectionScreen = ({navigation}) => {

    const {colors} = useTheme();
    const styles = StyleSheet.create({
        plusComplete: {
            marginBottom: '5%'
        },
        selectType: {
            borderWidth: 1,
            paddingVertical: 1,
            paddingHorizontal: 8.5,
            borderRadius: 12,
            marginRight: 10,
            shadowColor: colors.red[8],
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.1,
            elevation: 1,
            width: 58, height: 28,
            alignItems: 'center',
            justifyContent: 'center'
        },
        selectTypeClicked: {
            borderWidth: 1,
            paddingVertical: 1,
            paddingHorizontal: 8.5,
            borderRadius: 12,
            marginRight: 10,
            shadowColor: colors.red[8],
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.1,
            elevation: 1,
            width: 58, height: 28,
            alignItems: 'center',
            justifyContent: 'center'
        },
        selectTypeTextClicked: {
            color : colors.defaultColor,
            fontSize: 14,
            textAlign: 'center',
            textAlignVertical: 'center',
            fontWeight: 'bold',
            marginVertical: 2
        },
        selectTypeText: {
            color: colors.gray[6],
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
        }
    });

    const toastRef = useRef();
    const refRBSheet = useRef();

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
                    backgroundColor: colors.mainColor
                }] : [styles.selectType, {borderColor: colors.defaultColor, backgroundColor: colors.defaultColor}]}>
                    <AppText
                        style={isPress[keyword.keyword_pk - 1] ? styles.selectTypeTextClicked : styles.selectTypeText}>{keyword.keyword_title}</AppText>
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
    }, []);

    const getKeywords = useCallback(() => {
        try {

            fetch('http://localhost:3000/keyword/list', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            }).then((res) => res.json())
                .then((response) => {
                    setKeywordData(response.data);
                    setFalse();
                    console.log(keywordData);
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    }, []);

    //TODO 추가한 키워드들 화면 안쪽으로 쌓일 수 있도록 css 수정
    //TODO 임의로 사진 넣어준거고 실제로는 유저의 프로필 사진?? 넣어야함
    const users = [
        {
            id: '1',
            image: '../assets/images/image1',
        },
        {
            id: '2',
            key: '../assets/images/image2',
        },
        {
            id: '3',
            key: '../assets/images/image3',
        }
    ];

    const showUsers = ({item}) => (
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 1}}>
            {/* <TouchableOpacity style={styles.selectType}><Image style={styles.selectTypeText} source={item.key}></Image></TouchableOpacity> */}
        </View>
    );
    
    const setFalse = () => {
        var pressed = [];
        for (let i = 0; i < keywordData.length; i++) {
            pressed.push(false);
        }
        setIsPress(pressed);
    };

    const ShowCalendar = () => {
        const [date, setDate] = useState({
            startDate: new Date(),
            endDate: new Date()
        });
        const [textColor, setTextColor] = useState(colors.mainColor);

        return (
            <TouchableOpacity onPress={()=>{
                refRBSheet.current.open(); 
                setDate({
                    startDate: new Date(),
                    endDate: new Date
                });
            }}><AppText style={{color: colors.mainColor, fontSize: 14, fontWeight: '400', lineHeight: 22.4}}>{moment(range.startDate).format('YY. MM. DD (dd)')} - {moment(range.endDate).format('YY. MM. DD (dd)')}</AppText>
                <RBSheet
                    ref={refRBSheet}
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
                                    refRBSheet.current.close();
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

    return (
        <ScreenContainer backgroundColor={colors.backgroundColor}>
            <NavigationTop navigation={navigation} title="일정보관함 만들기"/>
            <KeyboardAvoidingView flex={1} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScreenContainerView>
                    <View style={{marginTop: 26}}>
                        <CustomTextInput
                            style={[collectionName ? {color: colors.mainColor, fontSize: 20, fontWeight: 'bold'} : {fontSize: 20}]}
                            placeholder={'보관함 이름을 입력해주세요 (2~25자)'}
                            onChangeText={(name) => setCollectionName(name)}>
                        </CustomTextInput>
                    </View>
                </ScreenContainerView>
                <ScreenDivideLine />
                <ScreenContainerView flex={1}>
                    <View style={{marginTop: 24}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <AppText style={{fontSize: 16, fontWeight: '500', color: colors.mainColor}}>보관함 키워드</AppText>
                            <AppText style={{fontSize: 12, color: colors.gray[5], alignSelf: 'center', marginLeft: 9}}>* 최대
                                3개</AppText>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            marginTop: 16
                        }}>

                            <View flexDirection="row">
                                <Image source={require('../../assets/images/add_keyword.png')}
                                    style={{width: 32, height: 32, marginEnd: 8.5}}></Image>
                                {
                                    keywordData.map((keyword, idx) => (
                                        <Keyword keyword={keyword} key={idx} />
                                    ))
                                }
                                {/* <FlatList data={keywordData} renderItem={showKeywords} keyExtractor={(item) => item.id} contentContainerStyle={{ paddingBottom: 20 }} horizontal={true} nestedScrollEnabled/> */}
                            </View>
                        </View>
                    </View>
                    {/* <View style={{marginTop: 37, left: 24}}>
                        <AppText style={{marginVertical: 8, fontSize: 20, fontWeight: 'bold'}}>공동 작성자</AppText>
                        <View style={{flexDirection: 'row', marginTop: 16}}>
                            <SafeAreaView>
                                <FlatList data={users} renderItem={showUsers} keyExtractor={(item) => item.id}
                                          contentContainerStyle={{paddingBottom: 20}} horizontal={true}
                                          nestedScrollEnabled/>
                            </SafeAreaView>
                        </View>
                    </View> */}
                    {/* marginBottom은 일단 퍼블리싱때문에 */}
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
                                backgroundColor: ((DATA.collection_name.length >= 2) && (isPress.filter((value) => value === true).length > 0 && isPress.filter((value) => value === true).length <= 3)) ? colors.mainColor : colors.gray[5],
                                height: 48,
                                borderRadius: 10
                            }}
                            onPress={() => {
                                // if ((DATA.collection_name.length >= 2) && (isPress.filter((value) => value === true).length > 0 && isPress.filter((value) => value === true).length <= 3)) {
                                // postCollections();
                                navigation.setOptions({tabBarVisible: true});
                                // navigation.goBack(null);
                                navigation.navigate('PlanCollection');
                                // }
                            }}
                            // disabled={DATA.collection_name.length < 2 && (isPress.filter((value) => value === true).length == 0 || isPress.filter((value) => value === true).length > 3) ? true : false}
                        ><AppText
                                style={{
                                    textAlign: 'center',
                                    padding: 14,
                                    fontSize: 16,
                                    color: colors.defaultColor,
                                    fontWeight: 'bold'
                                }}
                            >보관함 만들기</AppText>
                        </TouchableOpacity>
                    </View>
                </ScreenContainerView>
            </KeyboardAvoidingView>
        </ScreenContainer>
    );

};

export default MakePlanCollectionScreen;