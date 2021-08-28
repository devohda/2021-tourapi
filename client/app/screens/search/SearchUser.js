import React from "react";
import {View, ScrollView, Image, StyleSheet} from "react-native";
import AppText from "../../components/AppText";
import { useTheme } from "@react-navigation/native";

const SearchUser = (props) => {
    const { colors } = useTheme();

    const styles = StyleSheet.create({
        authorImage: {
            width: 88,
            height: 88,
            backgroundColor: '#c4c4c4',
            borderRadius: 50,
            position: 'absolute'
        },
        keywordHashTagView: {
            marginHorizontal: 4
        },
        keywordHashTag: {
            color: colors.detailSubTextColor,
            fontSize: 12,
            justifyContent: 'center',
            alignItems: 'center',
            lineHeight: 19.2
        },
    });

    const SearchedUsers = () => {
        return(
            <View style={{alignItems: 'center', paddingBottom: 20}}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Image style={styles.authorImage}
                    source={{uri: 'https://via.placeholder.com/150/92c952'}}></Image>
                    <View style={{backgroundColor: colors.defaultColor, borderRadius: 50, borderWidth: 5, borderColor: colors.backgroundColor,
                                width: 32, height: 32, marginBottom: 64, marginLeft: 61, padding: 2,
                                justifyContent: 'center', alignItems: 'center'
                    }}><AppText style={{color: colors.blue[1], textAlign: 'center', fontSize: 12}}>31</AppText></View>
                </View>
                <AppText style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: colors.mainColor,
                    marginTop: 8
                }}>K-민선</AppText>

                <View style={{flexDirection: 'row'}}>
                    <View
                        style={{
                            ...styles.keywordHashTagView,
                        }}><AppText
                        style={styles.keywordHashTag}>#조용한</AppText></View>
                    <View
                        style={{
                            ...styles.keywordHashTagView,
                        }}><AppText
                        style={styles.keywordHashTag}>#따뜻한</AppText></View>
                </View>
            </View>
        )

    }

    return (
        <View flexDirection="row" style={{marginBottom: 8, alignItems: 'center', marginTop: 22}}>
            <ScrollView scrollEnabled={false}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '10%'}}>
                    <SearchedUsers/>
                    <SearchedUsers/>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '10%'}}>
                    <SearchedUsers/>
                    <SearchedUsers/>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '10%'}}>
                    <SearchedUsers/>
                </View>
            </ScrollView>
        </View>
    )
}


export default SearchUser;