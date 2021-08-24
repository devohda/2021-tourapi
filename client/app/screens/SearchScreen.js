import React, {useState} from "react";
import {View, Text, TextInput, Image, ScrollView, Dimensions, Pressable} from "react-native";
import ScreenContainer from "../components/ScreenContainer";
import {useTheme} from '@react-navigation/native';
import NavigationTop from "../components/NavigationTop";
import SearchIcon from "../assets/images/search-icon.svg"
import ScreenContainerView from "../components/ScreenContainerView";
import SearchTabNavigator from "../navigation/SearchTabNavigator";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const SearchScreen = ({navigation}) => {
    const {colors} = useTheme();
    const [searchText, setSearchText] = useState("");

    const styles = {
        search_box: {
            borderBottomWidth: 1,
            borderColor: colors.gray[5],
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 4
        }
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
                            <SearchIcon width={26} height={26} style={{ color : colors.gray[5]}}/>
                        </Pressable>
                    </View>
                    <SearchTabNavigator />
                </ScreenContainerView>
            </ScrollView>
        </ScreenContainer>
    )
};

export default SearchScreen;