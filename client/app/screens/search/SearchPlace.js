import React, {useState} from "react";
import {Image, Text, TouchableOpacity, View, StyleSheet} from "react-native";
import {useTheme} from '@react-navigation/native';
import Star from '../../assets/images/search/star.svg'
import Jewel from '../../assets/images/jewel.svg'
import AppText from "../../components/AppText";

const SearchPlace = (props) => {
    const {colors} = useTheme();

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

    const PlaceContainer = (props) => {
        const [like, setLike] = useState(false);

        return (
            <View flexDirection="row" style={{marginVertical: 8, alignItems: 'center', height: 72}}>
                <Image source={require('../../assets/images/mountain.jpeg')} style={{borderRadius: 10, width: 72, height: 72}}/>
                <View flex={1} style={styles.info_container}>
                    <View flexDirection="row" style={{alignItems: 'center'}}>
                        <AppText style={{fontSize: 10, color: colors.mainColor}}>음식점</AppText>
                        <View style={styles.score_line}></View>
                        <Star width={14} height={14}/>
                        <AppText style={{fontSize: 10, color: colors.mainColor, marginLeft: 2}}>4.84</AppText>
                    </View>
                    <AppText style={{fontSize: 16, fontWeight: '700', color: colors.mainColor}}>{props.name}</AppText>
                    <AppText style={{fontSize: 12, fontWeight: '400', color: colors.gray[4]}}>{props.address}</AppText>
                </View>
                <TouchableOpacity onPress={() => setLike(likeState => !likeState)}>
                    <Jewel width={26} height={21} style={{color: like ? colors.red[3] : colors.red_gray[5]}}/>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={{backgroundColor: colors.backgroundColor}}>
            <PlaceContainer name="테라로사 광화문점" address="서울 종로구 중학동 19"/>
            <PlaceContainer name="웬디앤비키 베이커스" address="서울 은평구 진관1 39-40"/>
            <PlaceContainer name="미니마이즈" address="서울시 종로구"/>
        </View>
    )
}


export default SearchPlace;
