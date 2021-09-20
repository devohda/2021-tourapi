import React, {useEffect, useState} from 'react';
import {View, ScrollView, Image, StyleSheet, SafeAreaView, FlatList, Dimensions} from 'react-native';
import AppText from '../../components/AppText';
import { useTheme } from '@react-navigation/native';
import { useSearchKeyword } from '../../contexts/SearchkeywordContextProvider';
import ShowEmpty from '../../components/ShowEmpty';
import {useToken} from '../../contexts/TokenContextProvider';

const SearchUser = () => {
    const {colors} = useTheme();
    const [userList, setUserList] = useState([]);
    const [like, setLike] = useState(false);
    const [searchKeyword, setSearchKeyword] = useSearchKeyword();

    const [token, setToken] = useToken();

    useEffect(() => {
        getResults();
    }, [searchKeyword]);

    const getResults = () => {
        try {
            fetch(`http://34.146.140.88/search?keyword=${decodeURIComponent(searchKeyword)}&type=user`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token' : token
                },
            }).then((res) => res.json())
                .then((response) => {
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
        return(
            <View style={{alignItems: 'center', paddingBottom: 20, marginHorizontal: collectionMargin}}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Image style={styles.authorImage}
                        source={{uri: 'https://via.placeholder.com/150/92c952'}}></Image>
                    <View style={{backgroundColor: colors.defaultColor, borderRadius: 50, borderWidth: 5, borderColor: colors.backgroundColor,
                        width: 32, height: 32, marginBottom: 64, marginLeft: 61, padding: 2,
                        justifyContent: 'center', alignItems: 'center'
                    }}><AppText style={{color: colors.blue[1], textAlign: 'center', fontSize: 12}}>31</AppText></View>
                </View>
                <AppText style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: colors.mainColor,
                    marginTop: 8
                }}>{item.user_nickname}</AppText>

                <View style={{flexDirection : 'row', alignItems: 'center', marginTop: 4}}>
                    {item.keywords.length != 0 &&
                                item.keywords.map((k) => {
                                    return <View style={{marginEnd: 3}}><AppText style={{fontSize : 12, color : colors.gray[4]}}># {k}</AppText></View>;
                                })}
                </View>
            </View>
        );

    };

    return (
        <View flexDirection="row" style={{marginBottom: 8, alignItems: 'center', marginTop: 22}
        // , userList.length === 0 && {justifyContent: 'center'}
        }>
            {/* {
                userList.length === 0 ?
                    <ShowEmpty /> :
                    <SafeAreaView>
                        <FlatList contentContainerStyle={{justifyContent: 'space-between'}} numColumns={2} data={userList} renderItem={UserContainer} keyExtractor={(item) => item.user_pk.toString()} nestedScrollEnabled />
                    </SafeAreaView>
            } */}
                    <SafeAreaView>
                        <FlatList contentContainerStyle={{justifyContent: 'space-between'}} numColumns={2} data={userList} renderItem={UserContainer} keyExtractor={(item) => item.user_pk.toString()} nestedScrollEnabled />
                    </SafeAreaView>
        </View>
    );
};


export default SearchUser;