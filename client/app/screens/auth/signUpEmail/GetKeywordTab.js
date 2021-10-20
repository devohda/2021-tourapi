import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, TextInput, TouchableOpacity, View, Alert} from 'react-native';
import styled from 'styled-components/native';
import AppText from '../../../components/AppText';
import { useTheme } from '@react-navigation/native';
import CustomTextInput from '../../../components/CustomTextInput';

const ProgressBar = styled(View)`
  flexDirection: row;
  width: 100%;
  justify-content: flex-end;
  height: 8px;
`;

const Form = styled(View)`
  margin-top: 63px;
`;

const signUp = async (form) => {
    try {

        let url = 'http://34.64.185.40/auth/account';
        let options = {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify({
                userInfo: form
            })
        };
        const result = await fetch(url, options)
            .then(res => res.json())
            .then(response => {
                return response.code === 200;
            })
            .catch(error => console.log(error));

        return result;
    } catch (e) {
        console.log(e.toString());
    }
};

const GetKeywordTab = ({route, authNavigation}) => {
    const {email, password, nickname} = route.params;
    const [isValid, setIsValid] = useState(false);
    const [keywordData, setKeywordData] = useState([]);
    const { colors } = useTheme();
    const [color, setColor] = useState(colors.gray[5]);
    const [isPress, setIsPress] = useState([]);
    const patterns = /[~!@#$%^&*()_+|<>?:{}]/;

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
                .then((response) => {
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

    const checkIsValid = async (isKeywordEmpty) => {
        var datas = [];

        if(!isKeywordEmpty) {
            for (let i = 0; i < keywordData.length; i++) {
                if (isPress[i] === true) {
                    datas.push(keywordData[i].keyword_pk);
                }
            }
        }

        var form = {
            email: email,
            password: password,
            nickname: nickname,
            keywords: datas
        }
        const result = await signUp(form);
        if (result) {
            authNavigation.navigate('SignInEmail');
        }
    };

    const styles = StyleSheet.create({
        progress: {
            height: 8,
            borderRadius: 6,
            top: 0,
            marginLeft: 12,
        },
        progress_active: {
            width: 28,
            backgroundColor: colors.mainColor
        },
        progress_inactive: {
            width: 8,
            backgroundColor: colors.gray[5]
        },
        title_text: {
            fontSize: 30,
            color: colors.mainColor,
            lineHeight: 44,
        },
        later_btn: {
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 18
        },
        continue_btn: {
            backgroundColor: isPress.filter(element => element === true).length > 0 && isPress.filter(element => element === true).length <= 3 ? colors.mainColor : colors.gray[6],
            height: 48,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center'
        },
        selectIcon: {
            borderWidth: 1,
            paddingVertical: 1,
            paddingHorizontal: 8,
            borderRadius: 14,
            height: 19,
            marginBottom: 10,
            flexDirection: 'row',
            zIndex: 10000,
            justifyContent: 'center',
            alignItems: 'center',
        },
        selectIconText: {
            fontSize: 12,
            fontWeight: 'bold',
        },
        selectType: {
            borderWidth: 1,
            paddingVertical: 1,
            paddingHorizontal: 16,
            borderRadius: 12,
            marginVertical: 5,
            marginRight: 10,
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.1,
            // width: 58,
            height: 28,
            alignItems: 'center',
            justifyContent: 'center'
        },
        selectTypeClicked: {
            borderWidth: 1,
            paddingVertical: 1,
            paddingHorizontal: 16,
            borderRadius: 12,
            marginVertical: 5,
            marginRight: 10,
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.1,
            // width: 58,
            height: 28,
            alignItems: 'center',
            justifyContent: 'center'
        },
        selectTypeTextClicked: {
            fontSize: 14,
            textAlign: 'center',
            textAlignVertical: 'center',
            fontWeight: '400',
            marginVertical: 2
        },
        selectTypeText: {
            fontSize: 14,
            textAlign: 'center',
            textAlignVertical: 'center',
            fontWeight: '400',
            marginVertical: 2
        },
    });

    const Keyword = ({keyword, idx}) => {
        return (
            <View key={idx}
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <TouchableOpacity onPress={() => {
                    if (isPress[keyword.keyword_pk - 1]) {
                        let newArr = [...isPress];
                        newArr[keyword.keyword_pk - 1] = false;
                        setIsPress(newArr);
                    } else {
                        let newArr = [...isPress];
                        newArr[keyword.keyword_pk - 1] = true;
                        setIsPress(newArr);
                    }
                }} style={isPress[keyword.keyword_pk - 1] ? [styles.selectTypeClicked, {
                    borderColor: colors.mainColor,
                    backgroundColor: colors.mainColor,
                    shadowColor: colors.red[8]
                }] : [styles.selectType, {
                    borderColor: colors.defaultColor,
                    backgroundColor: colors.defaultColor,
                    shadowColor: colors.red[8]
                }]} activeOpacity={0.8}>
                    <AppText
                        style={isPress[keyword.keyword_pk - 1] ? {
                            ...styles.selectTypeTextClicked,
                            color: colors.defaultColor
                        } : {...styles.selectTypeText, color: colors.gray[3]}}>{keyword.keyword_title}</AppText>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <>
            <View flex={1}>
                <ProgressBar>
                    <View style={{...styles.progress, ...styles.progress_inactive}}></View>
                    <View style={{...styles.progress, ...styles.progress_inactive}}></View>
                    <View style={{...styles.progress, ...styles.progress_inactive}}></View>
                    <View style={{...styles.progress, ...styles.progress_active}}></View>
                </ProgressBar>
                <Form>
                    <View style={{width: '12%'}}>
                        <View style={[styles.selectIcon, {
                            borderColor: colors.gray[5],
                            backgroundColor: colors.gray[5]
                        }]}>
                            <AppText
                                style={{
                                    ...styles.selectIconText,
                                    color: colors.defaultColor
                                }}>선택</AppText>
                        </View>
                    </View>
                    <View style={{marginBottom: 43}}>
                        <AppText style={styles.title_text}><AppText
                            style={{fontWeight: 'bold'}}>관심있는 공간 키워드</AppText><AppText>를</AppText></AppText>
                        <AppText style={styles.title_text}>선택해주세요</AppText>
                        <AppText style={{fontSize: 14, color: colors.gray[3], fontWeight: '400', lineHeight: 22.4, marginTop: 8}}>* 최대 3개까지 선택 가능합니다.</AppText>
                    </View>
                    <><View style={{flexDirection: 'row', width: '100%'}}>
                        {
                            keywordData.map((keyword, idx) => (
                                <>{0 <= idx && idx <= 3 &&
                                <Keyword keyword={keyword} key={idx + '0000'} idx={idx + '0000'}/>}</>
                            ))
                        }
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        {
                            keywordData.map((keyword, idx) => (
                                <>{4 <= idx && idx <= 6 &&
                                    <Keyword keyword={keyword} key={idx + '1111'} idx={idx + '1111'}/>}</>
                            ))
                        }
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        {
                            keywordData.map((keyword, idx) => (
                                <>{7 <= idx && idx <= 10 &&
                                    <Keyword keyword={keyword} key={idx + '2222'} idx={idx + '2222'}/>}</>
                            ))
                        }
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        {
                            keywordData.map((keyword, idx) => (
                                <>{11 <= idx && idx <= 13 &&
                                    <Keyword keyword={keyword} key={idx + '3333'} idx={idx + '3333'}/>}</>
                            ))
                        }
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        {
                            keywordData.map((keyword, idx) => (
                                <>{14 <= idx && idx <= 17 &&
                                    <Keyword keyword={keyword} key={idx + '4444'} idx={idx + '4444'}/>}</>
                            ))
                        }
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        {
                            keywordData.map((keyword, idx) => (
                                <>{18 <= idx && idx <= 19 &&
                                    <Keyword keyword={keyword} key={idx + '5555'} idx={idx + '5555'}/>}</>
                            ))
                        }
                    </View>
                    </>
                </Form>
            </View>
            <View style={{marginBottom: 20}}>
                <TouchableOpacity
                    style={styles.later_btn}
                    onPress={() => checkIsValid(true)}
                    activeOpacity={0.8}
                >
                    <AppText style={{color: colors.gray[4], fontSize: 12, fontWeight: '400', lineHeight: 16.8, width: 150, textAlign: 'center'}}>나중에 선택할게요</AppText>
                    <View style={{borderWidth: 0.5, width: 86, borderColor: colors.gray[4]}}></View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.continue_btn}
                    onPress={() => checkIsValid(false)}
                    disabled={isPress.filter(element => element === true).length > 0 && isPress.filter(element => element === true).length <= 3 ? false : true}
                    activeOpacity={0.8}
                >
                    <AppText style={{color: colors.defaultColor, fontSize: 16, fontWeight: 'bold'}}>시작하기</AppText>
                </TouchableOpacity>
            </View>
        </>
    );
};

export default GetKeywordTab;