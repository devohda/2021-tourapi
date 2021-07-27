import React from 'react';
import { Text, View, StyleSheet, TextInput, Image, ImageBackground, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';

export default function MakeDirectory({navigation}) {
    return (
        <>
        <SafeAreaView>
            <ScrollView>
            <View style={styles.rankingContainer}>
                <ImageBackground style={styles.defaultImage} source={{uri: 'https://via.placeholder.com/150/45601a'}} imageStyle={{borderRadius: 10, borderBottomLeftRadius: 0, borderBottomRightRadius: 0}}></ImageBackground>
                <View style={{marginVertical: 14}}>
                    <TextInput style={{marginVertical: 8, fontSize: 24, fontWeight: 'bold', textAlign: 'center'}} placeholder={"보관함 이름"}></TextInput>
                </View>
            </View>
            <View style={{marginTop: 37, left: 24}}>
                <Text style={{marginVertical: 8, fontSize: 20, fontWeight: 'bold'}}>보관함 타입</Text>
                <View style={{flexDirection: 'row', marginTop: 16}}>
                    <View style={{paddingEnd: 18}}><TouchableOpacity style={styles.selectType}><Text style={styles.selectTypeText}>힐링</Text></TouchableOpacity></View>
                    <View style={{paddingEnd: 18}}><TouchableOpacity style={styles.selectType}><Text style={styles.selectTypeText}>관광</Text></TouchableOpacity></View>
                    <View style={{paddingEnd: 18}}><TouchableOpacity style={styles.selectType}><Text style={styles.selectTypeText}>여유</Text></TouchableOpacity></View>
                    <View style={{paddingEnd: 18}}><TouchableOpacity style={styles.selectType}><Text style={styles.selectTypeText}>바쁜</Text></TouchableOpacity></View>
                    <View style={{paddingEnd: 18}}><TouchableOpacity style={styles.selectType}><Text style={styles.selectTypeText}>뚜벅</Text></TouchableOpacity></View>
                    <View style={{paddingEnd: 18}}><TouchableOpacity style={styles.selectTypeIcon}><Icon type="ionicon" name={"add-outline"} size={16} style={styles.selectTypeIconDetail} ></Icon></TouchableOpacity></View>
                </View>
            </View>
            <View style={{marginVertical: 37, left: 24}}>
                <Text style={{marginVertical: 8, fontSize: 20, fontWeight: 'bold'}}>보관함에 대한 소개를 적어주세요</Text>
                <TextInput multiline style={{backgroundColor: 'rgb(243, 243, 243)', padding: 17.5, width: 350, height: 215, left: 0, fontSize: 15, textAlignVertical: 'top'}}></TextInput>
            </View>
            </ScrollView>
        </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    selectType : {
        borderColor: 'black',
        borderWidth: 1,
        paddingVertical: 1,
        paddingHorizontal: 8.5,
        borderRadius: 12
    },
    selectTypeText : {
        color: 'black',
        fontSize: 14
    },
    selectTypeIcon: {
        backgroundColor: 'rgb(141, 141, 141)',
        borderColor: 'black',
        borderWidth: 1,
        paddingVertical: 1,
        paddingHorizontal: 8.5,
        borderRadius: 12
    },
    selectTypeIconDetail : {
        color: 'black',
        paddingVertical: 1,
        borderRadius: 12
    },
    rankingContainer: {
        backgroundColor: 'white',
        width: 287,
        height: 320,
        marginTop: 66,
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 10,
        shadowOffset: {
            width: 6,
            height: 3
        },
        shadowOpacity: 0.25,
        elevation: 6,
    },
    defaultImage: {
        backgroundColor: '#c4c4c4',
        width: 287,
        height: 243,
    },
  });