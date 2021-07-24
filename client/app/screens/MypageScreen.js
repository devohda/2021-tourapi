import React from "react";
import {View, Text, TextInput, Image, ScrollView, Dimensions} from "react-native";
import ScreenContainer from "../components/ScreenContainer";

const screenWidth = Dimensions.get('window').width;
import MyTabs from "../navigation/MypageNavigator";


const MypageScreen = () => {
    return (
        <ScreenContainer>
            <View style={{height: "30%"}} className="profile-container"></View>
            <MyTabs/>
        </ScreenContainer>
    )
};

const styles = {

}

export default MypageScreen;