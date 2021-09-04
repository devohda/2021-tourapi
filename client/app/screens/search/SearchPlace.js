import React, {useState, useEffect, useContext} from "react";
import {Image, Text, TouchableOpacity, View, StyleSheet, SafeAreaView, FlatList} from "react-native";
import {useTheme} from '@react-navigation/native';
import Star from '../../assets/images/search/star.svg'
import Jewel from '../../assets/images/jewel.svg'
import AppText from "../../components/AppText";
import { searchKeyword } from "../../contexts/SearchkeywordContextProvider";

const SearchPlace = (props) => {
    const {colors} = useTheme();
    const [placeList, setPlaceList] = useState([]);
    const [collectionList, setCollectionList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [searchType, setSearchType] = useState('place');
    const [like, setLike] = useState(false);
    const [keyword, setKeyword] = searchKeyword()
    console.log(keyword)

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
    }, []);

    const getResults = () => {
        try {
            fetch(`http://192.168.0.11:3000/search?keyword=${decodeURIComponent(keyword)}&type=${searchType}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            }).then((res) => res.json())
                .then((response) => {
                    setPlaceList(response.data);
                })
                .catch((err) => {
                    console.error(err)
                });

        } catch (err) {
            console.error(err);
        }
    };

    const PlaceContainer = ({item}) => (
        <View flexDirection="row" style={{marginBottom: 8, alignItems: 'center', height: 72, marginTop: 22}}>
            <Image source={require('../../assets/images/mountain.jpeg')} style={{borderRadius: 10, width: 72, height: 72}}/>
            <View flex={1} style={styles.info_container}>
                <View flexDirection="row" style={{alignItems: 'center'}}>
                    {/* <AppText style={{fontSize: 10, color: colors.mainColor}}>{}</AppText> */}
                    <View style={styles.score_line}></View>
                    <Star width={14} height={14}/>
                    <AppText style={{fontSize: 10, color: colors.mainColor, marginLeft: 2}}>4.84</AppText>
                </View>
                {/* <AppText style={{fontSize: 16, fontWeight: '700', color: colors.mainColor}}>{item.place_name}</AppText> */}
                {/* <AppText style={{fontSize: 12, fontWeight: '400', color: colors.gray[4]}}>{item.place_addr}</AppText> */}
            </View>
            <TouchableOpacity onPress={() => setLike(likeState => !likeState)}>
                <Jewel width={26} height={21} style={{color: like ? colors.red[3] : colors.red_gray[5]}}/>
            </TouchableOpacity>
        </View>
    )

        return (
            <View style={{backgroundColor: colors.backgroundColor}}>
                <SafeAreaView>
                    <FlatList data={placeList} renderItem={PlaceContainer} keyExtractor={(item) => item.place_pk.toString()} nestedScrollEnabled/>
                </SafeAreaView>
            </View>
        )
}

export default SearchPlace;
