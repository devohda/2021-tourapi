import React from "react";
import {View, Text, TextInput} from "react-native";
import ScreenContainer from "../components/ScreenContainer";

const SearchScreen = () => {
    return (
        <ScreenContainer>
            <View style={styles.search_container} className="search-container">
                <View style={{height: "30%", backgroundColor: "yellow"}}>
                    <TextInput/>
                    <Text>hi</Text>
                </View>
            </View>
            <View className="search-keywords"></View>
            <View className="search-results">
                <View className="places">
                    <View className="place-container">
                        <View className="place-img">

                        </View>
                        <Text className="place-name"></Text>
                        <Text className="place-description"></Text>
                    </View>
                </View>
                <View className="directories">

                </View>
            </View>
        </ScreenContainer>
    )
};

const styles = {
    search_container: {
        flex : 1
    }
}

export default SearchScreen;