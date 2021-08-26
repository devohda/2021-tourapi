import React, {useState} from "react";
import {View, Text, TextInput, Image, ScrollView, Dimensions, Pressable, StyleSheet} from "react-native";
import ScreenContainer from "../components/ScreenContainer";
import {useTheme} from '@react-navigation/native';
import NavigationTop from "../components/NavigationTop";
import SearchIcon from "../assets/images/search-icon.svg"
import ScreenContainerView from "../components/ScreenContainerView";
import SearchTabNavigator from "../navigation/SearchTabNavigator";
import ScreenDivideLine from "../components/ScreenDivideLine";
import Star from "../assets/images/search/star.svg";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;


const SearchScreen = ({navigation}) => {
    const {colors} = useTheme();
    const [searchText, setSearchText] = useState("");

    const styles = StyleSheet.create({
        search_box: {
            borderBottomWidth: 1,
            borderColor: colors.gray[5],
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 4
        },
        score_line: {
            width: 1,
            height: '80%',
            backgroundColor: colors.gray[4],
            marginHorizontal: 4
        },
        ad_sticker: {
            backgroundColor: colors.gray[5],
            borderRadius: 10,
            paddingHorizontal: 6,
            paddingVertical: 2,
            marginLeft: 8
        }
    })

    const RecommendedPlace = (props) => {
        return (
            <View style={{marginRight: 8}}>
                <Image source={require('../assets/images/mountain.jpeg')}
                       style={{width: 141, height: 101, borderRadius: 10}}/>
                <View style={{height: 62, justifyContent : 'space-between', marginVertical : 8}}>
                    <View flexDirection="row" style={{alignItems: 'center'}}>
                        <Text style={{fontSize: 10, color: colors.mainColor}}>음식점</Text>
                        <View style={styles.score_line}></View>
                        <Star width={14} height={14}/>
                        <Text style={{fontSize: 10, color: colors.mainColor, marginLeft: 2}}>4.84</Text>
                    </View>
                    <Text style={{fontSize: 16, fontWeight: '700', color: colors.mainColor}}>{props.name}</Text>
                    <Text style={{fontSize: 12, fontWeight: '400', color: colors.gray[4]}}>{props.address}</Text>
                </View>
            </View>
        )
    }

    return (
        <ScreenContainer backgroundColor={colors.backgroundColor}>
            <NavigationTop title="검색" navigation={navigation}/>
            <ScrollView showsVerticalScrollIndicator={false}>
                <ScreenContainerView>
                    <View flexDirection="row" style={styles.search_box}>
                        <TextInput flex={1} style={{fontSize: 16}}
                                   autoCapitalize="none"
                                   autoCorrect={false}
                                   onChangeText={(text) => setSearchText(text)}/>
                        <Pressable style={{marginLeft: 5}} onPress={() => alert(searchText)}>
                            <SearchIcon width={26} height={26} style={{color: colors.gray[5]}}/>
                        </Pressable>
                    </View>
                    <SearchTabNavigator/>
                </ScreenContainerView>
                <ScreenDivideLine/>
                <ScreenContainerView>
                    <View style={{marginVertical: 12}}>
                        <View flexDirection="row" style={{alignItems: 'center', marginBottom : 12}}>
                            <Text style={{color: colors.mainColor, fontSize: 20, fontWeight: '700'}}>추천하는 공간</Text>
                            <View style={styles.ad_sticker}>
                                <Text style={{color: colors.defaultColor, fontSize: 12, fontWeight: '700'}}>AD</Text>
                            </View>
                        </View>
                        <ScrollView horizontal={true}>
                            <RecommendedPlace name="서울식물원" address="서울 강서구 마곡동 812"/>
                            <RecommendedPlace name="경의선숲길" address="서울 용산구 용문동"/>
                            <RecommendedPlace name="헬로피자" address="서울 마포구"/>
                            <RecommendedPlace name="서울식물원" address="서울 강서구 마곡동 812"/>
                            <RecommendedPlace name="경의선숲길" address="서울 용산구 용문동"/>
                            <RecommendedPlace name="헬로피자" address="서울 마포구"/>
                            <RecommendedPlace name="서울식물원" address="서울 강서구 마곡동 812"/>
                            <RecommendedPlace name="경의선숲길" address="서울 용산구 용문동"/>
                            <RecommendedPlace name="헬로피자" address="서울 마포구"/>
                        </ScrollView>
                    </View>
                    <View style={{marginVertical: 12}}>
                        <View flexDirection="row" style={{alignItems: 'center', marginBottom : 12}}>
                            <Text style={{color: colors.mainColor, fontSize: 20, fontWeight: '700'}}>추천하는 보관함</Text>
                        </View>
                        <ScrollView horizontal={true}>
                            <RecommendedPlace name="서울식물원" address="서울 강서구 마곡동 812"/>
                            <RecommendedPlace name="경의선숲길" address="서울 용산구 용문동"/>
                            <RecommendedPlace name="헬로피자" address="서울 마포구"/>
                            <RecommendedPlace name="서울식물원" address="서울 강서구 마곡동 812"/>
                            <RecommendedPlace name="경의선숲길" address="서울 용산구 용문동"/>
                            <RecommendedPlace name="헬로피자" address="서울 마포구"/>
                            <RecommendedPlace name="서울식물원" address="서울 강서구 마곡동 812"/>
                            <RecommendedPlace name="경의선숲길" address="서울 용산구 용문동"/>
                            <RecommendedPlace name="헬로피자" address="서울 마포구"/>
                        </ScrollView>
                    </View>
                </ScreenContainerView>
            </ScrollView>
        </ScreenContainer>
    )
};

export default SearchScreen;