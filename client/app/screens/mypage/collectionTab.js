import React, {useEffect, useState} from "react";
import {useTheme} from "@react-navigation/native";
import {Dimensions, FlatList, Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View} from "react-native";
import ScreenContainer from "../../components/ScreenContainer";
import ScreenContainerView from "../../components/ScreenContainerView";
import AppText from "../../components/AppText";
import {Icon} from "react-native-elements";
import {useIsUserData} from "../../contexts/UserDataContextProvider";

const CollectionTab = ({navigation}) => {

    const [userData, setUserData] = useIsUserData()
    const [collectionList, setCollectionList] = useState({});
    const [selectedDirType, setSelectedDirType] = useState(1);
    const [directoryType, setDirectoryType] = useState([
        {
            name: '전체',
            isClicked: true
        },
        {
            name: '내 보관함',
            isClicked: false
        },
        {
            name: '수집한 보관함',
            isClicked: false
        },
        {
            name: '일정보관함',
            isClicked: false
        },
        {
            name: '자유보관함',
            isClicked: false
        }
    ])

    useEffect(() => {
        getCollectionsFromUsers();
    })

    const {colors} = useTheme();
    const styles = StyleSheet.create({
        directoryContainer: {
            width: "49%",
            height: 249,
            borderRadius: 10,
            backgroundColor: '#fff',
            marginBottom: 11,
            shadowColor: colors.red_gray[6],
            shadowOffset: {
                width: 0,
                height: 0,
            },
            shadowOpacity: 1,
            shadowRadius: 6,
            elevation: 5,
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
            height: '100%',
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

        keyword: {
            justifyContent: 'center',
            alignItems: 'center'
        },
    })

    // 보관함 데이터 가져오는 함수
    const getCollectionsFromUsers = () => {
        try {
            fetch('http://34.146.140.88/collection/list', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: userData.user_pk
                })
            }).then((res) => res.json())
                .then(({data}) => {
                    setCollectionList(data);
                })
                .catch((err) => {
                    console.error(err)
                });

        } catch (err) {
            console.error(err);
        }
    }

    const showDirectories = ({item}) => (

        <TouchableOpacity style={styles.directoryContainer} onPress={() => {
            navigation.navigate('ShowFreeDir', {data : item})
        }}>
            <View flex={1} style={{overflow: "hidden", borderRadius: 10}}>
                <View style={{height: '68%'}}>
                    <View style={{zIndex: 10000, flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={[styles.dirType, {
                            borderColor: colors.backgroundColor,
                            backgroundColor: colors.backgroundColor
                        }]}>
                            <AppText
                                style={item.collection_type == 1 ? styles.dirPlanText : styles.dirFreeText}>{item.collection_type === 1 ? '일정' : '자유'}</AppText>
                        </View>
                        {item.collection_private === 1 &&
                        <View style={{marginRight: 9, marginTop: 8}}>
                            <Image style={{width: 20, height: 20}}
                                   source={require('../../assets/images/lock_outline.png')}></Image>
                        </View>
                        }
                    </View>
                    <Image style={styles.defaultImage}
                           source={item.thumbnail_images.length !== 0 ? {uri: item.thumbnail_images[0]} : require('../../assets/images/mountain.jpeg')}/>
                </View>
                <View flex={1} style={{marginLeft: 10, marginTop: 8}}>
                    <AppText style={{
                        fontSize: 14,
                        fontWeight: '400',
                        color: colors.mainColor
                    }}>{item.collection_name}</AppText>
                    <View style={{marginTop: 4}}>
                        {item.keywords.map((keyword, idx) => {
                            return (
                                <AppText key={idx} style={{
                                    color: colors.gray[4],
                                    fontSize: 10,
                                    marginRight: 6.21
                                }}># {keyword}</AppText>)
                        })}
                    </View>
                    <View flexDirection="row" style={{position: 'absolute', bottom: 10}}>
                        <AppText style={{fontSize: 8, width: '60%'}}>by minsun</AppText>
                        <View style={{marginRight: 8, flexDirection: 'row'}}>
                            <Image source={require('../../assets/images/here_icon.png')}
                                   style={{width: 8, height: 8, margin: 2}}></Image>
                            <AppText
                                style={{fontSize: 8, color: colors.hashTagColor, fontWeight: 'bold'}}>1.2k</AppText>
                        </View>
                        <View style={{marginRight: 8, flexDirection: 'row'}}>
                            <Icon type="ionicon" name={"location"} size={8} color={colors.gray[2]}
                                  style={{margin: 2}}></Icon>
                            <AppText style={{
                                fontSize: 8,
                                color: colors.hashTagColor,
                                fontWeight: 'bold'
                            }}>{item.place_cnt}</AppText>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )

    const Keyword = ({type, idx}) => {
        return (
            <View style={styles.keyword}>
                <TouchableOpacity
                    style={type.isClicked ? styles.selectTypeClicked : styles.selectType}
                    onPress={() => {
                        // 클릭하면 색 바꾸기
                        setDirectoryType(dirType => dirType.map(
                            (val, i) =>
                                i === idx ? {name: val.name, isClicked: true} : {
                                    name: val.name,
                                    isClicked: false
                                })
                        )
                    }}
                >
                    <AppText
                        style={type.isClicked ? styles.selectTypeTextClicked : styles.selectTypeText}>{type.name}</AppText>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <ScreenContainer backgroundColor={colors.backgroundColor}>
            <ScreenContainerView flex={1}>
                {/* 키워드 선택 */}
                <View flexDirection="row" style={{alignItems: 'center', justifyContent: 'center', marginVertical: 4}}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        {directoryType.map(
                            (type, idx) => <Keyword type={type} key={idx} idx={idx}/>
                        )}
                    </ScrollView>
                </View>

                <View flexDirection="row" style={{justifyContent: 'space-between', marginVertical: 14}}>
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
                        <View style={{marginHorizontal: 10}}><AppText
                            style={{color: colors.subColor}}>|</AppText></View>
                        <View flexDirection="row">
                            <Icon style={{color: colors.mainColor, marginTop: 3, marginRight: 2}} type="ionicon"
                                  name={"pencil"} size={13}></Icon>
                            <AppText style={{color: colors.mainColor}}>편집</AppText>
                        </View>
                    </View>
                </View>
                <FlatList columnWrapperStyle={{justifyContent: 'space-between'}} numColumns={2}
                          showsVerticalScrollIndicator={false}
                          data={collectionList} renderItem={showDirectories}
                          keyExtractor={(item) => item.collection_pk} nestedScrollEnabled
                />
            </ScreenContainerView>
        </ScreenContainer>
    );
}

export default CollectionTab;