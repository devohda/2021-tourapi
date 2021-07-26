import React from "react";
import {View, Text, TextInput, Image, ScrollView, Dimensions} from "react-native";
import ScreenContainer from "../components/ScreenContainer";
import FIcon from 'react-native-vector-icons/Feather';
import IIcon from 'react-native-vector-icons/Ionicons'

const screenWidth = Dimensions.get('window').width;

const SearchScreen = () => {
    return (
        <ScreenContainer>
            <View style={styles.search_container} className="search-container">
                <FIcon name="search" size={30} color="#000"/>
                <TextInput style={{flex: 1, fontSize: 20, marginLeft: "3%"}}/>
            </View>
            <View className="search-keywords" style={styles.keyword_box}>
                <View className="keyword" style={styles.keyword}>
                    <Text style={{fontWeight: "bold"}}>장소</Text>
                    <IIcon name="close" size={15} color="#000" style={{paddingLeft: 3}}/>
                </View>
                <View className="keyword" style={styles.keyword}>
                    <Text style={{fontWeight: "bold"}}>장소</Text>
                    <IIcon name="close" size={15} color="#000" style={{paddingLeft: 3}}/>
                </View>
                <View className="keyword" style={styles.keyword}>
                    <Text style={{fontWeight: "bold"}}>장소</Text>
                    <IIcon name="close" size={15} color="#000" style={{paddingLeft: 3}}/>
                </View>
            </View>
            <View className="search-results" style={styles.result_box}>
                <View className="places" style={{marginBottom: 40}}>
                    <View className="place-container">
                        <Text style={{fontSize: 28, fontWeight: "900", marginBottom: 20}}>장소</Text>
                        <ScrollView horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{flexGrow: 1}}
                        >
                            <View className="place" style={styles.place}>
                                <View className="place-img">
                                    <Image style={{width: 130, height: 100, borderRadius: 10}}
                                           source={require('../assets/images/mountain.jpeg')}
                                           resizeMode="cover"
                                    />
                                </View>
                                <Text className="place-name"
                                      style={{
                                          fontSize: 20,
                                          fontWeight: "900",
                                          marginTop: 10,
                                          marginBottom: 5
                                      }}>청계산</Text>
                                <Text className="place-description">뭐가들어가야할가...</Text>
                            </View>
                            <View className="place" style={styles.place}>
                                <View className="place-img">
                                    <Image style={{width: 130, height: 100, borderRadius: 10}}
                                           source={require('../assets/images/mountain.jpeg')}
                                           resizeMode="cover"
                                    />
                                </View>
                                <Text className="place-name"
                                      style={{
                                          fontSize: 20,
                                          fontWeight: "900",
                                          marginTop: 10,
                                          marginBottom: 5
                                      }}>청계산</Text>
                                <Text className="place-description">뭐가들어가야할가...</Text>
                            </View>
                            <View className="place" style={styles.place}>
                                <View className="place-img">
                                    <Image style={{width: 130, height: 100, borderRadius: 10}}
                                           source={require('../assets/images/mountain.jpeg')}
                                           resizeMode="cover"
                                    />
                                </View>
                                <Text className="place-name"
                                      style={{
                                          fontSize: 20,
                                          fontWeight: "900",
                                          marginTop: 10,
                                          marginBottom: 5
                                      }}>청계산</Text>
                                <Text className="place-description">뭐가들어가야할가...</Text>
                            </View>
                        </ScrollView>
                    </View>
                </View>
                <View className="places">
                    <View className="place-container">
                        <Text style={{fontSize: 28, fontWeight: "900", marginBottom: 20}}>디렉토리</Text>
                        <ScrollView horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{flexGrow: 1}}
                        >
                            <View className="place" style={styles.place}>
                                <View className="place-img">
                                    <Image style={{width: 130, height: 100, borderRadius: 10}}
                                           source={require('../assets/images/mountain.jpeg')}
                                           resizeMode="cover"
                                    />
                                </View>
                                <Text className="place-name"
                                      style={{
                                          fontSize: 20,
                                          fontWeight: "900",
                                          marginTop: 10,
                                          marginBottom: 5
                                      }}>청계산</Text>
                                <Text className="place-description">뭐가들어가야할가...</Text>
                            </View>
                            <View className="place" style={styles.place}>
                                <View className="place-img">
                                    <Image style={{width: 130, height: 100, borderRadius: 10}}
                                           source={require('../assets/images/mountain.jpeg')}
                                           resizeMode="cover"
                                    />
                                </View>
                                <Text className="place-name"
                                      style={{
                                          fontSize: 20,
                                          fontWeight: "900",
                                          marginTop: 10,
                                          marginBottom: 5
                                      }}>청계산</Text>
                                <Text className="place-description">뭐가들어가야할가...</Text>
                            </View>
                            <View className="place" style={styles.place}>
                                <View className="place-img">
                                    <Image style={{width: 130, height: 100, borderRadius: 10}}
                                           source={require('../assets/images/mountain.jpeg')}
                                           resizeMode="cover"
                                    />
                                </View>
                                <Text className="place-name"
                                      style={{
                                          fontSize: 20,
                                          fontWeight: "900",
                                          marginTop: 10,
                                          marginBottom: 5
                                      }}>청계산</Text>
                                <Text className="place-description">뭐가들어가야할가...</Text>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </View>
        </ScreenContainer>
    )
};

const styles = {
    search_container: {
        height: "7%",
        alignItems: "center",
        marginTop: "10%",
        borderBottomWidth: "2rem",
        borderColor: "#ccc",
        flexDirection: "row",
    },
    keyword_box: {
        flexDirection: "row",
        marginTop: "25%",
    },
    keyword: {
        backgroundColor: "grey",
        paddingVertical: 5,
        paddingHorizontal: "3%",
        marginRight: "3%",
        borderRadius: "20%",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    result_box: {
        flex: 1,
        marginTop: "35%"
    },
    place: {
        marginRight: 10
    }
}

export default SearchScreen;