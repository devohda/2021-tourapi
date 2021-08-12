import React, {createRef, useEffect, useState, useRef, useCallback} from 'react';
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
    Switch,
    KeyboardAvoidingView,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';
import {Icon} from 'react-native-elements';
import Toast from 'react-native-easy-toast';

export const navigationRef = React.createRef();

const Keyword = ({keyword, idx, pressFunc}) => {
    return (
        <View key={idx}
              style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center'
              }}
        >
            <TouchableOpacity style={styles.selectType} onPress={pressFunc}>
                <Text style={styles.selectTypeText}>{keyword.keyword}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default function MakeFreeDirectory({navigation}) {
    //자유보관함이므로 type은 0
    //TODO 키워드 어떻게 받지
    const toastRef = useRef();
    const showCopyToast = useCallback(() => {
        toastRef.current.show('비어있는 필드가 있습니다.', 2000);
        console.log('완료')
      }, []);
    const [isEnabled, setIsEnabled] = useState(false);
    const [collectionName, setCollectionName] = useState('');
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const DATA = {
        collection_name: collectionName,
        collection_type: 0,
        collection_private: (isEnabled===true) ? 1: 0
    }
    console.log(DATA.collection_private)
    const getCollections = () => {
        try {
            // ! localhost 로 보내면 굳이 ip 안 찾아도 됩니다~!! 확인 후 삭제해주세요 :)
            //TODO 언어 바꾸기 필요
            console.log(DATA.collection_name)
            fetch('http://172.30.1.36:3000/collections/collections_free_post', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(DATA)
            }).then((res) => res.text())
                .then((responsedata) => {
                    console.log(responsedata)
                })
                .catch((err) => {
                    console.error(err)
                });

        } catch (err) {
            console.error(err);
        }
        // navigation.navigate('mypage', {from: 'makeDir'})
    }

    // TODO 추가한 키워드들 화면 안쪽으로 쌓일 수 있도록 css 수정
    const [keywords, setKeywords] = useState([
        {
            id: '1',
            keyword: '힐링',
        },
        {
            id: '2',
            keyword: '관광',
        },
        {
            id: '3',
            keyword: '여유',
        },
        {
            id: '4',
            keyword: '뚜벅'
        }
    ])

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

    const showUsers = ({item}) => (
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 1}}>
            {/* <TouchableOpacity style={styles.selectType}><Image style={styles.selectTypeText} source={item.key}></Image></TouchableOpacity> */}
        </View>
    )


    useEffect(() => {
        // getCollections();
        // Keyboard.dismiss();
    })

    return (
        <>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={{ flex: 1 }}>

            <SafeAreaView style={{backgroundColor: '#FCF6F5'}}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                <ScrollView>

                    <View style={styles.rankingContainer}>
                        <View style={{marginVertical: 14}}>
                            <TextInput
                                style={{paddingHorizontal: 14, fontSize: 20,color: '#40516E', fontWeight: 'bold'}}
                                placeholder={"보관함 이름을 입력해주세요 (2~25자)"}
                                onChangeText={(name) => setCollectionName(name)}>
                            </TextInput>
                        </View>
                    </View>
                    <View style={{marginTop: 37, left: 24}}>
                        <View style={{flexDirection:'row'}}>
                        <Text style={{marginVertical: 8, fontSize: 16, fontWeight: 'bold', color: '#40516E'}}>보관함 해시태그</Text>
                        <Text style={{fontSize: 12, color: '#BDC2CA', alignSelf: 'center', marginLeft: 6}}>* 최대 3개</Text>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            marginTop: 16
                        }}>
                            
                            <View flexDirection="row">
                                <Image source={require('../assets/images/add_keyword.png')} style={{width: 32, height: 32, marginEnd: 8.5}}></Image>
                                {keywords.map((keyword, idx) => (
                                    <Keyword keyword={keyword} key={idx}/>
                                ))}
                                {/*{버튼 추가 가능하도록 만들었음.}*/}
                                {/* <Keyword keyword={{keyword: '+'}} key={0} pressFunc={() => {
                                    setKeywords((addedKeywords) => {
                                        return [...addedKeywords, {keyword: '추가됨'}]
                                    })
                                }}/> */}
                                {/* <View style={{paddingEnd: 18}}><TouchableOpacity style={styles.selectTypeIcon}><Icon type="ionicon" name={"add-outline"} size={16} style={styles.selectTypeIconDetail} ></Icon></TouchableOpacity></View> */}
                            </View>
                        </View>
                    </View>
                    {/* <View style={{marginTop: 37, left: 24}}>
                        <Text style={{marginVertical: 8, fontSize: 20, fontWeight: 'bold'}}>공동 작성자</Text>
                        <View style={{flexDirection: 'row', marginTop: 16}}>
                            <SafeAreaView>
                                <FlatList data={users} renderItem={showUsers} keyExtractor={(item) => item.id}
                                          contentContainerStyle={{paddingBottom: 20}} horizontal={true}
                                          nestedScrollEnabled/>
                            </SafeAreaView>
                        </View>
                    </View> */}
                                                                                {/* marginBottom은 일단 퍼블리싱때문에 */}
                    <View style={{marginTop: 37, left: 24, flexDirection: 'row', marginBottom: '75%'}}>
                        <Text style={{marginVertical: 8, fontSize: 16, fontWeight: 'bold', color: '#40516E', marginEnd: '60%'}}>비공개 설정</Text>
                        <Switch
                                trackColor={{false: "#CDD0D7", true: "#7B9ACC"}}
                                thumbColor={isEnabled ? "#fff" : "#fff"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleSwitch}
                                value={isEnabled}
                            />
                    </View>
                    {/* <View style={{marginTop: 37, left: 24}}>
                        <Text style={{marginVertical: 8, fontSize: 16, fontWeight: 'bold'}}>보관함 사진</Text>
                        <View style={{flexDirection: 'row', marginTop: 16}}>
                        </View>
                    </View> */}

                    <TouchableOpacity
                        testID="completed"
                        style={{backgroundColor: (DATA.collection_name.length >= 2) ? '#7B9ACC' : '#CDD0D7', height: 48, borderRadius: 10, margin: 16, marginBottom: '25%'}}
                        onPress={() => {
                            if(DATA.collection_name.length >= 2) {
                                getCollections();
                                navigation.navigate('mypage');
                            } else {
                                alert('비어있는 필드가 있습니다.')
                            }
                        }}
                    ><Text
                        style={{
                            textAlign: 'center',
                            padding: 14,
                            fontSize: 16,
                            color: '#fff',
                            fontWeight: 'bold'
                        }}
                        >보관함 만들기</Text>
                    </TouchableOpacity>
                </ScrollView>
                </TouchableWithoutFeedback>

            </SafeAreaView>
            </KeyboardAvoidingView>

        </>
    )

}

const styles = StyleSheet.create({
    selectType: {
        borderColor: '#fff',
        borderWidth: 1,
        paddingVertical: 1,
        paddingHorizontal: 8.5,
        borderRadius: 12,
        marginRight: 10,
        shadowColor: '#470000',
        shadowOffset: {width: 0, height: 10},
        shadowOpacity: 0.2,
        elevation: 1,
        backgroundColor: '#fff',
        width: 58, height: 28,
        
    },
    selectTypeText: {
        color: '#40516E',
        fontSize: 14,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontWeight: 'bold'
    },
    selectTypeIcon: {
        backgroundColor: 'rgb(141, 141, 141)',
        borderColor: 'black',
        borderWidth: 1,
        paddingVertical: 1,
        paddingHorizontal: 8.5,
        borderRadius: 12
    },
    selectTypeIconDetail: {
        color: '#40516E',
        paddingVertical: 1,
        borderRadius: 12
    },
    rankingContainer: {
        backgroundColor: '#FCF6F5',
        width: '100%',
        marginTop: 14,
        justifyContent: 'center',
        alignSelf: 'center',
        borderBottomColor: '#F0E7E7',
        borderBottomWidth: 6,
    },
    defaultImage: {
        backgroundColor: '#c4c4c4',
        width: 287,
        height: 243,
    }
});