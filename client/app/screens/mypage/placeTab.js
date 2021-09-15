import {useTheme} from "@react-navigation/native";
import {Dimensions, FlatList, Image, SafeAreaView, ScrollView, StyleSheet, View} from "react-native";
import React, {useState} from "react";
import AppText from "../../components/AppText";
import {Icon} from "react-native-elements";
import ScreenContainer from "../../components/ScreenContainer";
import ScreenContainerView from "../../components/ScreenContainerView";

const PlaceTab = () => {
    const {colors} = useTheme();
    const styles = StyleSheet.create({
        directoryContainer: {
            marginEnd: Dimensions.get('screen').width / 14,
            marginTop: 11,
            width: 162,
            height: 249,
        },
        likesContainer: {
            width: Dimensions.get('screen').width / 2.25,
            marginTop: 16,
        },
        dirType: {
            borderWidth: 1,
            paddingVertical: 1,
            paddingHorizontal: 8,
            borderRadius: 14,
            elevation: 1,
            width: 43,
            height: 22,
            marginLeft: 9,
            marginTop: 8,
            flexDirection: 'row',
            zIndex: 10000,
            justifyContent: 'center',
            alignItems: 'center',
        },
        dirFreeText: {
            color: colors.mainColor,
            fontSize: 12,
            fontWeight: 'bold',
        },
        dirPlanText: {
            color: colors.red[3],
            fontSize: 12,
            fontWeight: 'bold'
        },
        defaultImage: {
            width: '100%',
            height: 162,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            position: 'absolute',
        },
        selectType: {
            borderColor: colors.defaultColor, backgroundColor: colors.defaultColor, shadowColor: colors.red[7],
            borderWidth: 1,
            paddingVertical: 1,
            paddingHorizontal: 8.5,
            borderRadius: 12,
            marginRight: 10,
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.1,
            elevation: 1,
            height: 28,
            justifyContent: 'center',
            alignItems: 'center'
        },
        selectTypeClicked: {
            borderColor: colors.mainColor, backgroundColor: colors.mainColor, shadowColor: colors.red[7],
            borderWidth: 1,
            paddingVertical: 1,
            paddingHorizontal: 8.5,
            borderRadius: 12,
            marginRight: 10,
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.1,
            elevation: 1,
            height: 28,
            justifyContent: 'center',
            alignItems: 'center'
        },
        selectTypeTextClicked: {
            color: colors.defaultColor,
            fontSize: 14,
            textAlign: 'center',
            textAlignVertical: 'center',
            fontWeight: 'bold',
            marginVertical: 2
        },
        selectTypeText: {
            color: colors.subColor,
            fontSize: 14,
            textAlign: 'center',
            textAlignVertical: 'center',
            marginVertical: 2
        },
    })

    const [placeList, setPlaceList] = useState({});

    // useEffect(() => {
    //     getLikesFromUsers();
    // }, [])
    //
    // const getLikesFromUsers = () => {
    //     try {
    //         fetch('http://34.146.140.88/place/like', {
    //             method: 'GET',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json'
    //             },
    //         }).then((res) => res.json())
    //             .then((responsedata) => {
    //                 // console.log(responsedata);
    //                 setLikedData(responsedata)
    //             })
    //             .catch((err) => {
    //                 console.error(err)
    //             });
    //
    //     } catch (err) {
    //         console.error(err);
    //     }
    // }

    const PlaceContainer = ({item}) => (
        <View style={styles.likesContainer}>
            <View style={{alignItems: 'center'}}>
                <View style={{marginEnd: 8}}>
                    <View><Image source={{uri: 'https://via.placeholder.com/150/56acb2'}}
                                 style={{width: 163, height: 113, borderRadius: 10}}></Image></View>
                    <View style={{flexDirection: 'row', marginTop: 8}}>
                        {/* //TODO 리스트화 할필요 있음 */}
                        <AppText style={{
                            color: colors.mainColor,
                            fontSize: 10,
                            marginTop: 2
                        }}>{item.like_type === 0 && '음식점'}</AppText>
                        <AppText style={{color: colors.mainColor, fontSize: 11, marginHorizontal: 6,}}>|</AppText>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <Image source={require('../../assets/images/here_icon.png')}
                                   style={{width: 11.36, height: 9.23, marginTop: 2, marginRight: 3.24}}></Image>
                            <AppText style={{color: colors.mainColor, fontSize: 10}}>{item.like_score}</AppText>
                        </View>
                    </View>
                    <View>
                        <AppText style={{
                            color: colors.mainColor,
                            fontSize: 16,
                            fontWeight: 'bold',
                            lineHeight: 28.8
                        }}>{item.like_title}</AppText>
                    </View>
                    <View>
                        <AppText style={{
                            color: colors.gray[4],
                            fontSize: 12,
                            lineHeight: 19.2
                        }}>{item.like_location}</AppText>
                    </View>
                </View>
            </View>
        </View>

    )

    return (
        <View style={{backgroundColor: colors.backgroundColor, flex: 1}}>
            <ScreenContainerView flex={1}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop : 4
                }}>
                    <View flexDirection="row">
                        <AppText style={{color: colors.mainColor}}>최근 추가순</AppText>
                        <Icon style={{color: colors.mainColor, paddingTop: 1, paddingLeft: 8}} type="ionicon"
                              name={"chevron-down-outline"} size={16}></Icon>
                    </View>

                    <View flexDirection="row">
                        <View flexDirection="row">
                            <Icon style={{color: colors.mainColor, marginTop: 3, marginRight: 2}} type="ionicon"
                                  name={"funnel"} size={13}></Icon>
                            <AppText style={{color: colors.mainColor}}>필터</AppText>
                        </View>
                        <View style={{marginHorizontal: 10}}><AppText style={{color: colors.gray[5]}}>|</AppText></View>
                        <View flexDirection="row">
                            <Icon style={{color: colors.mainColor, marginTop: 3, marginRight: 2}} type="ionicon"
                                  name={"pencil"} size={13}></Icon>
                            <AppText style={{color: colors.mainColor}}>편집</AppText>
                        </View>
                    </View>
                </View>

                <SafeAreaView>
                    <FlatList contentContainerStyle={{justifyContent: 'space-between'}} numColumns={2}
                              data={placeList} renderItem={PlaceContainer}
                              keyExtractor={(item) => item.place_pk.toString()} nestedScrollEnabled/>
                </SafeAreaView>
            </ScreenContainerView>
        </View>
    );
}

export default PlaceTab;