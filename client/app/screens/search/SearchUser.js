import React, {useEffect, useState} from 'react';
import {View, ScrollView, Image, StyleSheet, SafeAreaView, FlatList, Dimensions} from 'react-native';
import AppText from '../../components/AppText';
import {useTheme} from '@react-navigation/native';
import {useSearchKeyword} from '../../contexts/search/SearchkeywordContextProvider';
import ShowEmpty from '../../components/ShowEmpty';
import {useToken} from '../../contexts/TokenContextProvider';
import {searchResult} from '../../contexts/search/SearchResultContextProvider';
import {searchUserResult} from '../../contexts/search/SearchUserContextProvider';
import {useIsFocused} from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import {useIsSignedIn} from '../../contexts/SignedInContextProvider';

const SearchUser = () => {
    const {colors} = useTheme();
    const [userList, setUserList] = useState([]);
    const [like, setLike] = useState(false);
    const [searchKeyword, setSearchKeyword] = useSearchKeyword();
    const [searchLength, setSearchLength] = searchUserResult();
    const [token, setToken] = useToken();
    const [isSignedIn, setIsSignedIn] = useIsSignedIn();
    const isFocused = useIsFocused();

    useEffect(() => {
        getResults();
    }, [searchKeyword, isFocused]);

    const getResults = () => {
        try {
            fetch(`http://34.64.185.40/user/list?keyword=${decodeURIComponent(searchKeyword)}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
            }).then((res) => res.json())
                .then(async (response) => {
                    if (response.code === 401 || response.code === 403 || response.code === 419){
                        // Alert.alert('','로그인이 필요합니다');
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }
                    // console.log(response.data)
                    setSearchLength(response.data.length);
                    setUserList(response.data);
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const collectionMargin = (Dimensions.get('screen').width - 88 * 2) / 5;

    const styles = StyleSheet.create({
        authorImage: {
            width: 88,
            height: 88,
            backgroundColor: '#c4c4c4',
            borderRadius: 50,
            position: 'absolute'
        },
        keywordHashTagView: {
            marginHorizontal: 4
        },
        keywordHashTag: {
            color: colors.detailSubTextColor,
            fontSize: 12,
            justifyContent: 'center',
            alignItems: 'center',
            lineHeight: 19.2
        },
    });

    const UserContainer = ({item}) => {
        return (
            <View style={{alignItems: 'center', paddingBottom: 20, marginHorizontal: collectionMargin}}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Image style={styles.authorImage}
                        source={require('../../assets/images/here_default.png')}></Image>
                    <View style={{
                        backgroundColor: colors.red_gray[2],
                        borderRadius: 50,
                        borderWidth: 5,
                        borderColor: colors.backgroundColor,
                        width: 32,
                        height: 32,
                        marginBottom: 64,
                        marginLeft: 61,
                        padding: 2,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}><AppText style={{color: colors.defaultColor, textAlign: 'center', fontSize: 12, fontWeight: '500', lineHeight: 19.2}}>{item.madeCollectionCnt}</AppText></View>
                </View>
                <AppText style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: colors.mainColor,
                    marginTop: 8
                }}>{item.user_nickname}</AppText>

                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
                    {item.keywords.length != 0 &&
                    item.keywords.map((k) => {
                        return <View style={{marginHorizontal: 3}}><AppText
                            style={{fontSize: 12, color: colors.gray[4]}}># {k}</AppText></View>;
                    })}
                </View>
            </View>
        );

    };

    return (
        <View flexDirection="row" style={{marginBottom: 8, alignItems: 'center', marginTop: 22}
        , userList.length === 0 && {justifyContent: 'center'}
        }>
            {
                userList.length === 0 ?
                    <ShowEmpty/> :
                    <SafeAreaView>
                        <FlatList contentContainerStyle={{justifyContent: 'space-between'}} numColumns={2}
                            data={userList} renderItem={UserContainer}
                            keyExtractor={(item) => item.user_pk.toString()} nestedScrollEnabled/>
                    </SafeAreaView>
            }
        </View>
    );
};


export default SearchUser;