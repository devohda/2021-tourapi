import React, {createRef, useEffect, useState} from 'react';
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    Image,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    FlatList,
    Switch } from 'react-native';
import { Icon } from 'react-native-elements';

export const navigationRef = React.createRef();

export default function MakeFreeDirectoy(Free) {
    //자유보관함이므로 type은 0
    //TODO 키워드 어떻게 받지
    const [isEnabled, setIsEnabled] = useState(false);
    const [collectionName, setCollectionName] = useState('');
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const DATA = {
        collection_name: collectionName,
        collection_type: 0
    }
    const getCollections = async () => {
        try {
            //ipV4 주소 찾기 : ipconfig/all (window ver.)
            //TODO 언어 바꾸기 필요
            console.log(DATA.collection_name)
            fetch('http://172.30.1.21:3000/collections/collections_free_post', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                // body: JSON.stringify({
                //     collection_name: 'name'
                // })
                body: JSON.stringify(DATA)
            }).then((res)=>res.text())
            .then((responsedata) => {
                console.log(responsedata)
            })
            .catch((err) => {
                console.error(err)
            }) ;
        
        } catch (err) {
            console.error(err);
        }
    }

    //TODO 플러스 버튼 클릭하면 여기에 append 가능하도록
    const keyWords = [
        {
            id: '1',
            key: '힐링',
        },
        {
            id: '2',
            key: '관광',
        },
        {
            id: '3',
            key: '여유',
        },
        {
            id: '4',
            key: '뚜벅'
        }
    ]

    const showKeywords = ({ item }) => (
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 1}}>
            <TouchableOpacity style={styles.selectType}><Text style={styles.selectTypeText}>{item.key}</Text></TouchableOpacity>
        </View>
    )

    //TODO 임의로 사진 넣어준거고 실제로는 유저의 프로필 사진?? 넣어야함
    const users = [
        {
            id: '1',
            image: '../assets/images/image1',
        },
        {
            id: '2',
            key: '../assets/images/image2',
        },
        {
            id: '3',
            key: '../assets/images/image3',
        }
    ]

    const showUsers = ({ item }) => (
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 1}}>
            {/* <TouchableOpacity style={styles.selectType}><Image style={styles.selectTypeText} source={item.key}></Image></TouchableOpacity> */}
        </View>
    )


    useEffect(()=>{
        // getCollections();
    })

    navigationRef.current?.navigate(Free);

        return (
            <>
            <SafeAreaView>
                <ScrollView>
                <View style={styles.rankingContainer}>
                    <View style={{marginVertical: 14}}>
                    <TextInput style={{paddingHorizontal: 4, fontSize: 20, fontWeight: 'bold', textAlign: 'center'}} placeholder={"보관함 이름을 입력해주세요 (2~16자)"} onChangeText={(name)=>setCollectionName(name)}></TextInput>

                    </View>
                </View>
                <View style={{marginTop: 37, left: 24}}>
                    <Text style={{marginVertical: 8, fontSize: 20, fontWeight: 'bold'}}>보관함 키워드</Text>
                    <View style={{flexDirection: 'row',marginTop: 16}}>
                    <SafeAreaView>
                        <FlatList data={keyWords} renderItem={showKeywords} keyExtractor={(item) => item.id} contentContainerStyle={{ paddingBottom: 20 }} horizontal={true} nestedScrollEnabled/>
                        {/* <View style={{paddingEnd: 18}}><TouchableOpacity style={styles.selectTypeIcon}><Icon type="ionicon" name={"add-outline"} size={16} style={styles.selectTypeIconDetail} ></Icon></TouchableOpacity></View> */}
                    </SafeAreaView>
                    </View>
                </View>
                <View style={{marginTop: 37, left: 24}}>
                    <Text style={{marginVertical: 8, fontSize: 20, fontWeight: 'bold'}}>공동 작성자</Text>
                    <View style={{flexDirection: 'row',marginTop: 16}}>
                    <SafeAreaView>
                        <FlatList data={users} renderItem={showUsers} keyExtractor={(item) => item.id} contentContainerStyle={{ paddingBottom: 20 }} horizontal={true} nestedScrollEnabled/>
                        {/* <View style={{paddingEnd: 18}}><TouchableOpacity style={styles.selectTypeIcon}><Icon type="ionicon" name={"add-outline"} size={16} style={styles.selectTypeIconDetail} ></Icon></TouchableOpacity></View> */}
                    </SafeAreaView>
                    </View>
                </View>
                <View style={{marginTop: 37, left: 24}}>
                    <Text style={{marginVertical: 8, fontSize: 20, fontWeight: 'bold'}}>비공개 설정</Text>
                    <View style={{marginTop: 16,alignItems: "center",
                        justifyContent: "center"}}>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                    </View>
                </View>
                <View style={{marginTop: 37, left: 24}}>
                    <Text style={{marginVertical: 8, fontSize: 20, fontWeight: 'bold'}}>보관함 사진</Text>
                    <View style={{flexDirection: 'row', marginTop: 16}}>
                    </View>
                </View>
                {/* 완료 버튼 색깔 바뀌는건 온전히 데이터 다 만들고 할 예정 : 조건에 따라 바뀌어야 하므로 */}
                <TouchableOpacity
                style={{backgroundColor: '#DCDCDC', height: 52, borderRadius: 10, margin: 16}}
                onPress={()=>getCollections()}
                ><Text
                style={{textAlign: 'center', padding: 14, fontSize: 16, color: '#fff', fontWeight: 'bold'}}>완료</Text>
                </TouchableOpacity>
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
        borderRadius: 12,
        marginRight: 10,
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
        // width: 287,
        // height: 320,
        marginTop: 36,
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