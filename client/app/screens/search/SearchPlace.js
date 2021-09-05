import React, {useState, useEffect, useContext} from "react";
import {Image, Text, TouchableOpacity, View, StyleSheet, SafeAreaView, FlatList, ScrollView} from "react-native";
import {useTheme} from '@react-navigation/native';
import Star from '../../assets/images/search/star.svg'
import Jewel from '../../assets/images/jewel.svg'
import AppText from "../../components/AppText";
import { searchKeyword } from "../../contexts/SearchkeywordContextProvider";
import ShowEmpty from "../../components/ShowEmpty";

const SearchPlace = (props, {navigation}) => {
    const {colors} = useTheme();
    const [placeList, setPlaceList] = useState([]);
    const [searchType, setSearchType] = useState('place');
    const [like, setLike] = useState(false);
    const [keyword, setKeyword] = searchKeyword()

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
            backgroundColor: colors.gray[4],
            marginHorizontal: 4
        }
    })

    useEffect(() => {
        getResults();
    }, [keyword]);

    const getResults = () => {
        try {
            fetch(`http://34.146.140.88:3000/search?keyword=${decodeURIComponent(keyword)}&type=${searchType}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            }).then((res) => res.json())
                .then((response) => {
                    setPlaceList(response.data);
                    console.log(placeList)
                })
                .catch((err) => {
                    console.error(err)
                });

        } catch (err) {
            console.error(err);
        }
    };

    const checkType = (type) => {
        if(type === 12) {
            return '관광지'
        } else if(type === 14) {
            return '문화시설'
        } else if(type === 15) {
            return '축제/공연/행사'
        } else if(type === 28) {
            return '레포츠'
        } else if(type === 32) {
            return '숙박'
        } else if(type === 38) {
            return '쇼핑'
        } else if(type === 39) {
            return '음식'
        } else {
            return '기타'
        }
    }

    const PlaceContainer = ({item}) => (
        <TouchableOpacity onPress={()=>props.navigation.navigate('Place', {data : item})}>
            <View flexDirection="row" style={{marginBottom: 8, alignItems: 'center', height: 72, marginTop: 22}}>
                <Image source={require('../../assets/images/mountain.jpeg')} style={{borderRadius: 10, width: 72, height: 72}}/>
                <View flex={1} style={styles.info_container}>
                    <View flexDirection="row" style={{alignItems: 'center'}}>
                        <AppText style={{fontSize: 10, color: colors.mainColor}}>{checkType(item.place_type)}</AppText>
                        <View style={styles.score_line}></View>
                        <Star width={11} height={11} style={{marginTop: 2}} />
                        <AppText style={{fontSize: 10, color: colors.mainColor, marginLeft: 2}}>{item.star}</AppText>
                    </View>
                    <AppText style={{fontSize: 16, fontWeight: '700', color: colors.mainColor}}>{item.place_name}</AppText>
                    <AppText style={{fontSize: 12, fontWeight: '400', color: colors.gray[4]}}>{item.place_addr}</AppText>
                </View>
                <TouchableOpacity onPress={() => setLike(likeState => !likeState)}>
                    <Jewel width={26} height={21} style={{color: like ? colors.red[3] : colors.red_gray[5]}}/>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )

        return (
            <View style={{backgroundColor: colors.backgroundColor}}>
                <ScrollView scrollEnabled={false}>
                    {
                        placeList.length === 0 ? 
                        <ShowEmpty /> :
                        <SafeAreaView>
                            <FlatList data={placeList} renderItem={PlaceContainer} keyExtractor={(item) => item.place_pk.toString()} nestedScrollEnabled/>
                        </SafeAreaView>
                    }
                </ScrollView>
            </View>
        )
}

export default SearchPlace;
