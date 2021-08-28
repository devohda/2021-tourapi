import React from "react";
import {Image, Text, View, ScrollView, FlatList} from "react-native";
import {useTheme} from "@react-navigation/native";
import AppText from "../../components/AppText";
import ScreenContainer from "../../components/ScreenContainer";
import { Icon } from "react-native-elements";

const SearchCollection = (props) => {
    const {colors} = useTheme();
    
    const SearchedCollections = () => {
        return (
            <View style={{
                width: '45%',
                height: 249,
                shadowColor: colors.shadowColor,
                shadowOffset: {width: 0, height: 0},
                shadowOpacity: 0.27,
                shadowRadius: 1,
                elevation: 1,
                marginBottom: 12,
                marginRight : '2.5%',
                borderRadius : 10,
                overflow: 'hidden'
            }}>
                <View flexDirection="row" style={{
                    flexWrap: "wrap",
                    height: 162,
                    width: '100%',
                }}>
                    <Image source={require('../../assets/images/flower.jpeg')} style={{width: '50%', height: 81}}/>
                    <Image source={require('../../assets/images/mountain.jpeg')} style={{width: '50%', height: 81}}/>
                    <Image source={require('../../assets/images/autumn.jpeg')} style={{width: '50%', height: 81}}/>
                    <Image source={require('../../assets/images/sea.jpeg')} style={{width: '50%', height: 81}}/>
                </View>
                <View flex={1} style={{backgroundColor : colors.defaultColor, padding : 8}}>
                    <View style={{paddingBottom: 10}}>
                        <AppText style={{color : colors.mainColor, fontSize : 14, fontWeight : '700'}}>
                            종로 25년 토박이가 알려주는 종로 사진스팟
                        </AppText>
                        <AppText style={{flexDirection : 'row', fontSize : 10, color : colors.gray[5]}}>
                            <AppText># 힐링</AppText>
                            <AppText># 뚜벅</AppText>
                            <AppText># 여유</AppText>
                        </AppText>
                    </View>
                    <View style={{flexDirection: 'row', paddingBottom: 6}}>
                        <AppText style={{fontSize: 8, width: '60%', color: colors.subColor}}>by minsun</AppText>
                        <View style={{marginRight: 8, flexDirection: 'row'}}>
                            <Image source={require('../../assets/images/here_icon.png')} style={{width: 8, height: 8, marginVertical: 1.5, marginHorizontal: 2}}></Image>
                            <AppText style={{fontSize: 8, color: colors.subColor, fontWeight: 'bold'}}>1.2k</AppText>
                        </View>
                        <View style={{marginRight: 8, flexDirection: 'row'}}>
                            <Icon type="ionicon" name={"location"} size={8} color={colors.hashTagColor}
                                style={{marginVertical: 1, marginHorizontal: 2}}></Icon>
                            <AppText style={{fontSize: 8, color: colors.subColor, fontWeight: 'bold'}}>9</AppText>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    const PlaceContainer = (props) => {
        return (
            <View flexDirection="row" style={{marginBottom: 8, alignItems: 'center', marginTop: 22, width: '100%'}}>
                {/* <ScrollView horizontal={true} scrollEnabled={false}>
                    <SafeAreaView>
                        <FlatList contentContainerStyle={{justifyContent: 'space-between'}} numColumns={2} data={directoryData} renderItem={showDirectories} keyExtractor={(item) => item.collection_pk.toString()} nestedScrollEnabled/>
                    </SafeAreaView>
                </ScrollView> */}
                <ScrollView scrollEnabled={false}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <SearchedCollections/>
                        <SearchedCollections/>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <SearchedCollections/>
                        <SearchedCollections/>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <SearchedCollections/>
                        <SearchedCollections/>
                    </View>
                </ScrollView>
            </View>
        )
    }

    return (
        <View>
            <PlaceContainer />
        </View>
    )
}

export default SearchCollection;