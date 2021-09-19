import React, {useState, useEffect} from 'react';
import {Image, Text, View, ScrollView, FlatList, SafeAreaView, Dimensions, TouchableOpacity} from 'react-native';
import {useTheme} from '@react-navigation/native';
import AppText from '../../components/AppText';
import {Icon} from 'react-native-elements';
import {useSearchKeyword} from '../../contexts/SearchkeywordContextProvider';
import ShowEmpty from '../../components/ShowEmpty';
import {useToken} from '../../contexts/TokenContextProvider';

const SearchCollection = ({navigation}) => {
    const {colors} = useTheme();
    const [collectionList, setCollectionList] = useState([]);
    const [like, setLike] = useState(false);
    const [searchKeyword, setSearchKeyword] = useSearchKeyword();

    const [token, setToken] = useToken();

    useEffect(() => {
        getResults();
    }, [searchKeyword]);

    const getResults = () => {
        try {
            fetch(`http://34.146.140.88/search?keyword=${decodeURIComponent(searchKeyword)}&type=collection`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
            }).then((res) => res.json())
                .then((response) => {
                    setCollectionList(response.data);
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const CollectionContainer = ({item}) => {
        const collectionMargin = (Dimensions.get('screen').width - 162 * 2) / 9;
        return (
            <TouchableOpacity onPress={() => navigation.navigate('FreeCollection', {data: item})}>
                <View style={{
                    width: 162,
                    height: 249,
                    shadowColor: colors.shadowColor,
                    shadowOffset: {width: 0, height: 0},
                    shadowOpacity: 0.27,
                    shadowRadius: 1,
                    marginBottom: 12,
                    marginHorizontal: collectionMargin,
                    borderRadius: 10,
                }} key={item.collection_pk}>
                    <View flexDirection="row" style={{
                        flexWrap: 'wrap',
                        width: 162,
                        height: 162,
                    }}>
                        <Image source={require('../../assets/images/flower.jpeg')}
                            style={{width: '50%', height: 81, borderTopLeftRadius: 10}}/>
                        <Image source={require('../../assets/images/mountain.jpeg')}
                            style={{width: '50%', height: 81, borderTopRightRadius: 10}}/>
                        <Image source={require('../../assets/images/autumn.jpeg')} style={{width: '50%', height: 81}}/>
                        <Image source={require('../../assets/images/sea.jpeg')} style={{width: '50%', height: 81}}/>
                    </View>
                    <View flex={1} style={{backgroundColor: colors.defaultColor, padding: 8}}>
                        <View style={{paddingBottom: 10}}>
                            <AppText style={{color: colors.mainColor, fontSize: 14, fontWeight: '700'}}>
                                {item.collection_name}
                            </AppText>
                            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
                                {item.keywords.length != 0 &&
                                item.keywords.map((k) => {
                                    return <View style={{marginEnd: 3}}><AppText
                                        style={{fontSize: 10, color: colors.gray[5]}}># {k}</AppText></View>;
                                })}
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', paddingBottom: 6}}>
                            <AppText style={{
                                fontSize: 8,
                                width: '60%',
                                color: colors.gray[5]
                            }}>by {item.created_user_name}</AppText>
                            <View style={{marginRight: 8, flexDirection: 'row'}}>
                                <Image source={require('../../assets/images/here_icon.png')}
                                    style={{width: 8, height: 8, marginVertical: 1.5, marginHorizontal: 2}}></Image>
                                <AppText style={{fontSize: 8, color: colors.gray[5], fontWeight: 'bold'}}>1.2k</AppText>
                            </View>
                            <View style={{marginRight: 8, flexDirection: 'row'}}>
                                <Icon type="ionicon" name={'location'} size={8} color={colors.hashTagColor}
                                    style={{marginVertical: 1, marginHorizontal: 2}}></Icon>
                                <AppText style={{fontSize: 8, color: colors.gray[5], fontWeight: 'bold'}}>9</AppText>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View>
            <View flexDirection="row" style={{
                marginBottom: 8,
                alignItems: 'center',
                marginTop: 22,
                width: '100%'
            }, collectionList.length === 0 && {justifyContent: 'center'}}>
                {
                    collectionList.length === 0 ?
                        <ShowEmpty/> :
                        <SafeAreaView>
                            <FlatList contentContainerStyle={{justifyContent: 'space-between'}} numColumns={2}
                                data={collectionList} renderItem={CollectionContainer}
                                keyExtractor={(item) => item.collection_pk.toString()} nestedScrollEnabled/>
                        </SafeAreaView>
                }

            </View>
        </View>
    );
};

export default SearchCollection;