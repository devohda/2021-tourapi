import React, {useState, useEffect, useContext} from 'react';
import {Image, Text, TouchableOpacity, View, StyleSheet, SafeAreaView, FlatList, ScrollView, Alert} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Star from '../../assets/images/search/star.svg';
import Jewel from '../../assets/images/jewel.svg';
import AppText from '../../components/AppText';
import { useSearchKeyword } from '../../contexts/search/SearchkeywordContextProvider';
import ShowEmpty from '../../components/ShowEmpty';
import {useToken} from '../../contexts/TokenContextProvider';
import * as SecureStore from 'expo-secure-store';
import {useIsSignedIn} from '../../contexts/SignedInContextProvider';

const SearchPlaceForAdd = (props, {route, navigation}) => {
    const {colors} = useTheme();
    const { pk, placeData, day, replace} = props;
    const [placeList, setPlaceList] = useState([]);
    const [searchType, setSearchType] = useState('place');
    const [like, setLike] = useState(false);
    const [searchKeyword, setSearchKeyword] = useSearchKeyword();

    const [token, setToken] = useToken();
    const [isSignedIn, setIsSignedIn] = useIsSignedIn();

    const addPlace = (place_pk) => {
        var prevLength = isPress.filter(element => (element === true)).length;

        try {
            fetch(`http://34.64.185.40/collection/${pk}/place`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
                body: JSON.stringify({
                    planDay: day,
                    order: placeData.length+prevLength+1,
                    placeId: place_pk,
                })
            }).then(res => res.json())
            .then(response => {
                    // if(response.code === 401 || response.code === 403 || response.code === 419){
                    //     // Alert.alert('','로그인이 필요합니다');
                    //     await SecureStore.deleteItemAsync('accessToken');
                    //     setToken(null);
                    //     setIsSignedIn(false);
                    //     return;
                    // }
                    console.log(response)

                    Alert.alert('', '추가되었습니다.');
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const countPlaceView = (place_pk) => {
        try {
            fetch(`http://34.64.185.40/view/place/${place_pk}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
            }).then((res) => {
                res.json();
            })
                .then((response) => {
                    // if(response.code === 401 || response.code === 403 || response.code === 419){
                    //     // Alert.alert('','로그인이 필요합니다');
                    //     await SecureStore.deleteItemAsync('accessToken');
                    //     setToken(null);
                    //     setIsSignedIn(false);
                    //     return;
                    // }
                    console.log(response)
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getResults();
    }, [searchKeyword]);

    const getResults = () => {
        try {
            fetch(`http://34.64.185.40/place/list?keyword=${decodeURIComponent(searchKeyword)}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
            }).then((res) => res.json())
                .then(async (response) => {
                    if(response.code === 401 || response.code === 403 || response.code === 419){
                        // Alert.alert('','로그인이 필요합니다');
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }

                    setPlaceList(response.data);
                    setFalse();
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

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

    const [isPress, setIsPress] = useState([]);
    const setFalse = () => {
        var pressed = [];
        for (let i = 0; i < placeList.length; i++) {
            pressed.push(false);
        }
        setIsPress(pressed);
    };

    const PlaceContainer = ({item, index}) => ( 
        <TouchableOpacity onPress={()=>{
            countPlaceView(item.place_pk);
            props.navigation.navigate('Place', {data : item});
        }}>
            <View style={{marginBottom: 8, alignItems: 'center', height: 72, marginTop: 22, flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row', width: '85%'}}>
                    {
                        item.place_img ?
                            <Image source={{uri: item.place_img}}
                                style={{borderRadius: 10, width: 72, height: 72, marginTop: 2}}/> :
                            <Image source={require('../../assets/images/here_default.png')}
                                style={{borderRadius: 10, width: 72, height: 72, marginTop: 2}}/> 
                    }
                    <View flex={1} style={styles.info_container}>
                        <View flexDirection="row" style={{alignItems: 'center'}}>
                            <AppText style={{fontSize: 10, color: colors.mainColor}}>{checkType(item.place_type)}</AppText>
                            <View style={{...styles.score_line, backgroundColor: colors.gray[4], display: parseInt(item.review_score) == -1 && 'none'}}></View>
                            <Star width={11} height={11} style={{marginTop: 2, display: parseInt(item.review_score) == -1 && 'none'}} />
                            <AppText style={{fontSize: 10, color: colors.mainColor, marginLeft: 2, display: parseInt(item.review_score) == -1 && 'none'}}>{parseFloat(item.review_score).toFixed(2)}</AppText>
                        </View>
                        <AppText style={{fontSize: 16, fontWeight: '700', color: colors.mainColor}}>{item.place_name}</AppText>
                        <AppText style={{fontSize: 12, fontWeight: '400', color: colors.gray[4]}}>{item.place_addr}</AppText>
                    </View>
                </View>
                <TouchableOpacity onPress={() =>{
                    let newArr = [...isPress];
                    if(newArr[index]) {
                        newArr[index] = false;
                        setIsPress(newArr);
                        // deletePlace(item.place_pk)
                    } else {
                        newArr[index] = true;
                        setIsPress(newArr);
                        if(replace) {
                            const postReplacement = props.postReplacement;
                            var prevLength = isPress.filter(element => (element === true)).length;
                            postReplacement(pk, item.place_pk, prevLength);
                        }
                        else addPlace(item.place_pk);
                    }
                }}
                style={{width: '15%'}}
                disabled={isPress[index] && true}
                >
                    <View style={[{height: 28, borderRadius: 10, justifyContent: 'center', alignItems: 'center'}, isPress[index] ? {backgroundColor: colors.gray[6]} : {backgroundColor: colors.mainColor}]}>
                        <View style={{paddingVertical: 4.5, paddingHorizontal: 4.5}}>
                            {
                                isPress[index] ?
                                    <AppText style={{color: colors.backgroundColor, fontSize: 12, lineHeight: 19.2, fontWeight: '500'}}>추가완료</AppText> :
                                    <AppText style={{color: colors.backgroundColor, fontSize: 12, lineHeight: 19.2, fontWeight: '500'}}>추가하기</AppText>
                            }
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={{backgroundColor: colors.backgroundColor}}>
            <ScrollView>
                {
                    placeList.length === 0 ? 
                        <ShowEmpty /> :
                        <SafeAreaView>
                            <FlatList data={placeList} renderItem={PlaceContainer} keyExtractor={(item, index) => item.place_pk.toString()} key={(item, index) => item.place_pk.toString()}nestedScrollEnabled/>
                        </SafeAreaView>
                }
            </ScrollView>
        </View>
    );
};


const styles = StyleSheet.create({
    info_container : {
        marginLeft: 8,
        paddingVertical : 1.5,
        justifyContent: 'space-between',
        height: '100%'
    },
    score_line : {
        width: 1,
        height: '80%',
        marginHorizontal: 4
    }
});

export default SearchPlaceForAdd;
