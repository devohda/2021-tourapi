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
    ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {useTheme} from '@react-navigation/native';
import {Icon} from 'react-native-elements';
import {Layout, NativeDateService, RangeCalendar} from '@ui-kitten/components';
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
import DefaultThumbnail from '../../assets/images/profile_default.svg';

import CalendarTexts from './CalendarTexts';
import * as SecureStore from 'expo-secure-store';
import {useIsSignedIn} from '../../contexts/SignedInContextProvider';

import SearchIcon from '../../assets/images/search-icon.svg';
import {useAlertDuplicated} from '../../contexts/LoginContextProvider';

export const navigationRef = React.createRef();

const MakePlanCollectionScreen = ({route, navigation}) => {
    const [token, setToken] = useToken();
    const [isSignedIn, setIsSignedIn] = useIsSignedIn();
    const {colors} = useTheme();
    const toastRef = useRef();
    const refCalendarRBSheet = useRef();
    const refKeywordRBSheet = useRef();
    const {data, update} = route.params;
    const showCopyToast = useCallback(() => {
        toastRef.current.show('비어있는 필드가 있습니다.', 2000);
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

    const [alertDuplicated, setAlertDuplicated] = useAlertDuplicated(false);
    const [defaultThumbnailList, setDefaultThumbnailList] = useState([
        {
            id: 1,
            name: 'default-red',
            color: colors.red[3]
        },
        {
            id: 2,
            name: 'default-yellow',
            color: '#FFC36A'
        },
        {
            id: 3,
            name: 'default-green',
            color: '#639A94'
        },
        {
            id: 4,
            name: 'default-blue',
            color: '#637DA9'
        },
        {
            id: 5,
            name: 'default-purple',
            color: '#8F6DA4'
        },
        {
            id: 6,
            name: 'default-red',
            color: colors.defaultColor
        },
    ]);
    const [selectedIndex, setSelectedIndex] = useState(0);
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

    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const DATA = {
        collection_name: collectionName,
        collection_private: (isEnabled === true) ? 1 : 0,
        collection_keywords: putKeywords,
        collection_type: 1,
    };

    useEffect(() => {
        getKeywords();
        if (update) {
            setCollectionName(data.collection_name);
            if (data.collection_private) {
                setIsEnabled(true);
            }

            if (data.collection_thumbnail === defaultThumbnailList[0].name) setSelectedIndex(0);
            else if (data.collection_thumbnail === defaultThumbnailList[1].name) setSelectedIndex(1);
            else if (data.collection_thumbnail === defaultThumbnailList[2].name) setSelectedIndex(2);
            else if (data.collection_thumbnail === defaultThumbnailList[3].name) setSelectedIndex(3);
            else if (data.collection_thumbnail === defaultThumbnailList[4].name) setSelectedIndex(4);
            else {
                var newArr = [...defaultThumbnailList];
                newArr[5].name = data.collection_thumbnail;
                setDefaultThumbnailList(newArr);
                setImage(data.collection_thumbnail);
            }
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
                    if (update) {
                        setFalseUpdated(response.data);
                    } else setFalse();
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
        let form = new FormData();
        var forPostData = {};

        if (image) {
            forPostData = {
                name: collectionName,
                isPrivate: forPostEnable,
                startDate: startDate,
                endDate: endDate,
                keywords: datas,
            };
            let file = {
                uri: image,
                type: 'multipart/form-data',
                name: 'image.jpg',
            };
            form.append('img', file);

        } else {
            forPostData = {
                name: collectionName,
                isPrivate: forPostEnable,
                keywords: datas,
                startDate: startDate,
                endDate: endDate,
                img: defaultThumbnailList[selectedIndex].name,
            };
        }
        form.append('collectionData', JSON.stringify(forPostData));

        try {
            fetch('http://34.64.185.40/collection/plan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-access-token': token
                },
                body: form
            }).then(res => res.json())
                .then(async response => {
                    if (response.code === 405 && !alertDuplicated) {
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
                        'now': true,
                    };
                    if (response.code === 200) {
                        Alert.alert('', '일정보관함이 생성되었습니다', [
                            {
                                text: 'OK', onPress: () => {
                                    navigation.navigate('PlanCollection', {data: item});
                                    navigation.setOptions({tabBarVisible: true});
                                }
                            }]);
                    } else {
                        Alert.alert('', '일정보관함 생성에 실패했습니다. 다시 시도해주세요.');
                    }
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
        let form = new FormData();
        var forPostData = {};

        if (image) {
            forPostData = {
                name: collectionName,
                isPrivate: forPostEnable,
                keywords: datas,
                startDate: startDate,
                endDate: endDate,
            };
            let file = {
                uri: image,
                type: 'multipart/form-data',
                name: 'image.jpg',
            };
            form.append('img', file);

        } else {
            forPostData = {
                name: collectionName,
                isPrivate: forPostEnable,
                keywords: datas,
                startDate: startDate,
                endDate: endDate,
                img: defaultThumbnailList[selectedIndex].name,
            };
        }
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
                        'now': true,
                    };
                    Alert.alert('', '일정보관함이 수정되었습니다', [
                        {
                            text: 'OK', onPress: () => {
                                navigation.navigate('PlanCollection', {data: item});
                                navigation.setOptions({tabBarVisible: true});
                            }
                        }]);
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
            if (data.keywords.indexOf(keywords[i].keyword_title) !== -1) pressed.push(true);
            else pressed.push(false);
        }
        setIsPress(pressed);
    };

    const ShowCalendar = () => {
        const [date, setDate] = useState({
            startDate: update ? originStartDate : new Date(),
            endDate: update ? originEndDate : new Date
        });
        const [textColor, setTextColor] = useState(colors.mainColor);

        return (
            <TouchableOpacity onPress={() => {
                refCalendarRBSheet.current.open();
                setDate({
                    startDate: update ? originStartDate : new Date(),
                    endDate: update ? originEndDate : new Date
                });
            }}><AppText style={{
                color: colors.mainColor,
                fontSize: 14,
                fontWeight: '400',
                lineHeight: 22.4
            }}>{moment(range.startDate).format('YY. MM. DD (dd)')} - {moment(range.endDate).format('YY. MM. DD (dd)')}</AppText>
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
                            <AppText
                                style={{color: colors.mainColor}}>{date.startDate ? moment(date.startDate).locale('ko').format('YY. MM. DD (dd)') : moment().format('YY. MM. DD (dd)')} - {date.endDate ? moment(date.endDate).locale('ko').format('YY. MM. DD (dd)') : moment().format('YY. MM. DD (dd)')}</AppText>
                        </View>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <RangeCalendar
                                range={date}
                                onSelect={(nextRange) => {
                                    setDate(nextRange);
                                }}
                                dateService={formatDateService}
                                style={{color: colors.mainColor, marginVertical: 20, borderColor: 'transparent'}}
                                renderDay={(Date) => {
                                    return (
                                        <View>
                                            <AppText style={{
                                                color: Date.date >= date.startDate && Date.date <= date.endDate ? colors.backgroundColor : colors.mainColor,
                                                fontSize: 12,
                                                lineHeight: 24,
                                                fontWeight: '500',
                                                justifyContent: 'center',
                                                textAlign: 'center',
                                                paddingTop: 10
                                            }}>
                                                {Platform.OS === 'ios' ?
                                                    Date.date.toLocaleDateString().split('.')[2]
                                                    : Date.date.toLocaleDateString().split('/')[1]}
                                            </AppText>
                                        </View>
                                    );
                                }}
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
                    }] : [styles.selectType, {
                        borderColor: colors.defaultColor,
                        backgroundColor: colors.defaultColor,
                        shadowColor: colors.red[8]
                    }]}>
                        <AppText
                            style={pressed[keyword.keyword_pk - 1] ? {
                                ...styles.selectTypeTextClicked,
                                color: colors.defaultColor
                            } : {...styles.selectTypeText, color: colors.gray[3]}}>{keyword.keyword_title}</AppText>
                    </TouchableOpacity>
                </View>
            );
        };


        return (
            <>
                <TouchableOpacity onPress={() => refKeywordRBSheet.current.open()}>
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
                                <AppText
                                    style={{fontSize: 12, color: colors.gray[5], alignSelf: 'center', marginLeft: 9}}>*
                                    최대 3개</AppText>
                            </View>
                            <><View style={{flexDirection: 'row'}}>
                                {
                                    keywordData.map((keyword, idx) => (
                                        <>{0 <= idx && idx <= 3 &&
                                        <Keyword keyword={keyword} key={idx + '0000'}/>}</>
                                    ))
                                }
                            </View>
                                <View style={{flexDirection: 'row'}}>
                                    {
                                        keywordData.map((keyword, idx) => (
                                            <>{4 <= idx && idx <= 6 &&
                                            <Keyword keyword={keyword} key={idx + '1111'}/>}</>
                                        ))
                                    }
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    {
                                        keywordData.map((keyword, idx) => (
                                            <>{7 <= idx && idx <= 10 &&
                                            <Keyword keyword={keyword} key={idx + '2222'}/>}</>
                                        ))
                                    }
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    {
                                        keywordData.map((keyword, idx) => (
                                            <>{11 <= idx && idx <= 13 &&
                                            <Keyword keyword={keyword} key={idx + '3333'}/>}</>
                                        ))
                                    }
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    {
                                        keywordData.map((keyword, idx) => (
                                            <>{14 <= idx && idx <= 17 &&
                                            <Keyword keyword={keyword} key={idx + '4444'}/>}</>
                                        ))
                                    }
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    {
                                        keywordData.map((keyword, idx) => (
                                            <>{18 <= idx && idx <= 19 &&
                                            <Keyword keyword={keyword} key={idx + '5555'}/>}</>
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
            <View key={idx + 'selected'}
                  style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center'
                  }}
            >
                <TouchableOpacity style={[styles.selectType, {
                    borderColor: colors.defaultColor,
                    backgroundColor: colors.defaultColor,
                    shadowColor: colors.red[8]
                }]}
                                  disabled={true}
                >
                    <AppText
                        style={{...styles.selectTypeText, color: colors.mainColor}}>{keyword.keyword_title}</AppText>
                </TouchableOpacity>
            </View>
        );
    };

    const setBGColor = (idx) => {
        return defaultThumbnailList[idx].color;
    };

    const [image, setImage] = useState(null);
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
    
        var newArr =[...defaultThumbnailList];
    
        if (!result.cancelled) {
            setImage(result.uri);
            newArr[5].name = result.uri;
        } else {
            newArr[5].name = 'default-red';
            setDefaultThumbnailList(newArr);
        }
        setDefaultThumbnailList(newArr);

    };

    const SelectProfile = () => {
        return (
            <View style={{alignItems: 'center'}}>
                {image ?
                    <Image source={{uri: image}} style={{...styles.selectedImage}}/> :
                    <View style={{
                        ...styles.selectedImage,
                        backgroundColor: selectedIndex === 5 && !image ? colors.red[3] : setBGColor(selectedIndex)
                    }}>
                        <DefaultThumbnail width={83} height={60.2}/>
                    </View>
                }
                <FlatList data={defaultThumbnailList} horizontal
                          renderItem={({item, index}) =>
                              <TouchableOpacity onPress={() => {
                                  if (index === 5) {
                                      (async () => {
                                          if (Platform.OS !== 'web') {
                                              const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
                                              if (status !== 'granted') {
                                                  alert('Sorry, we need camera roll permissions to make this work!');
                                              }
                                          }
                                      })();
                                      pickImage();
                                  } else {
                                      setImage('');
                                  }
                                  setSelectedIndex(index);
                              }}>
                                  <View style={{
                                      backgroundColor: item.color,
                                      width: 28,
                                      height: 28,
                                      borderRadius: 10,
                                      marginHorizontal: 5,
                                      marginTop: 17
                                  }}>
                                      <Icon type="ionicon" name={"camera"} style={[index !== 5 && {display: 'none'}, {
                                          shadowOffset: {
                                              width: 2,
                                              height: 2
                                          },
                                          shadowOpacity: 0.25,
                                          shadowColor: 'rgba(0, 0, 0, 0.25)',
                                      }]} color={colors.gray[6]}></Icon>
                                  </View>
                              </TouchableOpacity>
                          }
                          keyExtractor={(item, idx) => {
                              idx.toString();
                          }}
                          key={(item, idx) => {
                              idx.toString();
                          }}
                          nestedScrollEnabled/>
            </View>
        );
    };

    return (
        <ScreenContainer backgroundColor={colors.backgroundColor}>
            <NavigationTop navigation={navigation} title={update ? '일정보관함 수정' : '일정보관함 만들기'}/>
            <ScrollView>
                <ScreenContainerView flex={1}>
                    <SelectProfile/>
                    <View style={{marginTop: 25}}>
                        <CustomTextInput
                            style={{
                                color: colors.mainColor,
                                fontSize: 20,
                                fontWeight: '700'
                            }}
                            placeholder={'보관함 이름을 입력해주세요 (2~25자)'}
                            placeholderTextColor={colors.gray[5]}
                            onChangeText={(name) => setCollectionName(name)}
                            value={collectionName}
                        >
                        </CustomTextInput>
                    </View>
                </ScreenContainerView>
                <ScreenDivideLine/>
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
                                <SelectKeyword/>
                                {
                                    keywordData.map((keyword, idx) => (
                                        <>{isPress[idx] === true &&
                                        <SelectedKeyword keyword={keyword} key={idx + 'selected'}
                                                         idx={idx + 'selected'}/>}</>
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
                    <View style={[{
                        marginTop: 24,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }, update && {display: 'none'}]}>
                        <AppText style={{fontSize: 16, fontWeight: '500', color: colors.mainColor}}>날짜 선택</AppText>
                        <ShowCalendar/>
                    </View>
                </ScreenContainerView>
            </ScrollView>
            <KeyboardAvoidingView flex={1} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScreenContainerView flex={1}>
                    <View flex={1} style={{bottom: 20, justifyContent: 'flex-end'}}>
                        <TouchableOpacity
                            testID="completed"
                            style={{
                                backgroundColor: DATA.collection_name.length >= 2 ? colors.mainColor : colors.gray[5],
                                height: 48,
                                borderRadius: 10
                            }}
                            onPress={() => {
                                if (update) updateCollections();
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

    //profile
    selectedImage: {
        width: 108,
        height: 108,
        borderRadius: 10,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default MakePlanCollectionScreen;