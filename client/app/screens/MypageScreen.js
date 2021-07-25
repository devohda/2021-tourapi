import React from "react";
import {View, Text, TextInput, Image, ScrollView, Dimensions} from "react-native";
import ScreenContainer from "../components/ScreenContainer";

const screenWidth = Dimensions.get('window').width;
import MyTabs from "../navigation/MypageNavigator";


const MypageScreen = () => {
    return (
        <ScreenContainer>
            <View style={{
                height: "25%",
                alignItems: "center",
                paddingHorizontal: 10,
                justifyContent: "space-between"
            }} className="profile-container" flexDirection="row">
                <View className="profile-img-container">
                    <Image style={{width: 120, height: 120, borderRadius: 60}}
                           source={require('../assets/images/suzy.jpeg')}
                           resizeMode="cover"
                    />
                </View>
                <View flex={1} style={{
                    marginLeft: 30,
                    height: "100%",
                    justifyContent: "space-around",
                    paddingVertical : 55
                }}>
                    <Text style={{fontSize : 20, fontWeight : "bold"}}>SuzyZzang!</Text>
                    <Text>SuzyZzang~~</Text>
                </View>
            </View>
            <MyTabs/>
        </ScreenContainer>
    )
};

const styles = {}

export default MypageScreen;