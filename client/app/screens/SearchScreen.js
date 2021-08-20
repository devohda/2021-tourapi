import React, {useState} from "react";
import {View, Text, TextInput, Image, ScrollView, Dimensions, Pressable} from "react-native";
import ScreenContainer from "../components/ScreenContainer";
import FIcon from 'react-native-vector-icons/Feather';
import IIcon from 'react-native-vector-icons/Ionicons';
import {useTheme} from '@react-navigation/native';
import NavigationTop from "../components/NavigationTop";
import SearchIcon from "../assets/images/search-icon.svg"

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const SearchScreen = ({navigation}) => {
    const {colors} = useTheme();
    const [searchText, setSearchText] = useState("");

    return (
        <ScreenContainer backgroundColor={colors.background}>
            <NavigationTop title="검색" navigation={navigation}/>
            <ScrollView>
                <View flexDirection="row"
                      style={{
                          borderBottomWidth: 1,
                          borderColor: '#BABFC8',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingVertical : 4,
                          marginTop : screenHeight/25
                      }}>
                    <TextInput flex={1} style={{fontSize : 16}}
                               autoCapitalize="none"
                               autoCorrect={false}
                               onChangeText={(text) => setSearchText(text)}/>
                    <Pressable style={{marginLeft : 5}} onPress={()=>alert(searchText)}>
                        <SearchIcon width={26} height={26}/>
                    </Pressable>
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
            </ScrollView>
        </ScreenContainer>
    )
};

const styles = {
    search_container: {
        height: "7%",
        alignItems: "center",
        marginTop: "10%",
        // borderBottomWidth: "2rem",
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
        borderRadius: 20,
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