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
} from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenContainerView from '../../components/ScreenContainerView';
import NavigationTop from '../../components/NavigationTop';
import {useTheme} from '@react-navigation/native';
import CustomTextInput from '../../components/CustomTextInput';
import ScreenDivideLine from '../../components/ScreenDivideLine';
import AppText from '../../components/AppText';
import {useToken} from '../../contexts/TokenContextProvider';
import * as SecureStore from 'expo-secure-store';
import {useIsSignedIn} from '../../contexts/SignedInContextProvider';

export const navigationRef = React.createRef();

const MakeFreeCollectionScreen = ({navigation}) => {

    const [token, setToken] = useToken();
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
            color: colors.defaultColor,
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

    //자유보관함이므로 type === 0
    const toastRef = useRef();
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
    const [isSignedIn, setIsSignedIn] = useIsSignedIn();

    // TODO 배열에 선택된 키워드 pk 값 넣어서 insert 하기.
    const postCollections = () => {
        var datas = [];
        var showDatas = [];
        for (let i = 0; i < keywordData.length; i++) {
            if (isPress[i] === true) {
                datas.push(keywordData[i].keyword_pk);
                showDatas.push(keywordData[i].keyword_title);
            }
        }

        try {
            fetch('http://34.64.185.40/collection/free', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
                body: JSON.stringify({
                    collectionData: {
                        name: collectionName,
                        isPrivate: isEnabled,
                        description: null,
                    },
                    keywords: datas
                })
            }).then((res) => {
                res.json();
            })
                .then(async (response) => {
                    if(response.code === 401 || response.code === 403 || response.code === 419){
                        Alert.alert('','로그인이 필요합니다');
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }
                    
                    const item = {
                        'collection_name': collectionName,
                        'collection_private': isEnabled,
                        'collection_type': 0,
                        'keywords': showDatas,
                    };
                    Alert.alert('', '자유보관함이 생성되었습니다');
                    navigation.navigate('FreeCollection', {
                        data: item
                    });
                })
                .catch((err) => {
                    console.error(err);
                    Alert.alert('', '자유보관함 생성에 실패했습니다');
                });

        } catch (err) {
            console.error(err);
        }
    };

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
            fetch('http://34.64.185.40/keyword/list', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            }).then((res) => res.json())
                .then(async (response) => {
                    setKeywordData(response.data);
                    setFalse();
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    }, []);

    const setFalse = () => {
        var pressed = [];
        for (let i = 0; i < keywordData.length; i++) {
            pressed.push(false);
        }
        setIsPress(pressed);
    };

    return (
        <ScreenContainer backgroundColor={colors.backgroundColor}>
            <NavigationTop navigation={navigation} title="자유보관함 만들기"/>
            <KeyboardAvoidingView flex={1} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScreenContainerView>
                    <View style={{marginTop: 26}}>
                        <CustomTextInput
                            style={[collectionName ? {
                                color: colors.mainColor,
                                fontSize: 20,
                                fontWeight: 'bold'
                            } : {fontSize: 20}]}
                            placeholder={'보관함 이름을 입력해주세요 (2~25자)'}
                            onChangeText={(name) => setCollectionName(name)}>
                        </CustomTextInput>
                    </View>
                </ScreenContainerView>
                <ScreenDivideLine/>
                <ScreenContainerView flex={1}>
                    <View style={{marginTop: 24}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <AppText style={{fontSize: 16, fontWeight: '500', color: colors.mainColor}}>보관함
                                키워드</AppText>
                            <AppText style={{fontSize: 12, color: colors.gray[5], alignSelf: 'center', marginLeft: 9}}>*
                                최대
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
                                        <Keyword keyword={keyword} key={idx}/>
                                    ))
                                }
                                {/* <FlatList data={keywordData} renderItem={showKeywords} keyExtractor={(item) => item.id} contentContainerStyle={{ paddingBottom: 20 }} horizontal={true} nestedScrollEnabled/> */}
                            </View>
                        </View>
                    </View>
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
                    <View flex={1} style={{marginBottom: 20, justifyContent: 'flex-end'}}>
                        <TouchableOpacity
                            testID="completed"
                            style={{
                                backgroundColor: DATA.collection_name.length >= 2 ? colors.mainColor : colors.gray[5],
                                height: 48,
                                borderRadius: 10
                            }}
                            onPress={() => {
                                // if ((DATA.collection_name.length >= 2) && (isPress.filter((value) => value === true).length > 0 && isPress.filter((value) => value === true).length <= 3)) {
                                postCollections();
                                navigation.setOptions({tabBarVisible: true});
                                navigation.goBack(null);
                                // }
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
                            >보관함 만들기</AppText>
                        </TouchableOpacity>
                    </View>
                </ScreenContainerView>
            </KeyboardAvoidingView>
        </ScreenContainer>
    );

};

export default MakeFreeCollectionScreen;