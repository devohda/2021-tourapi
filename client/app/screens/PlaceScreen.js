import React from "react";
import ScreenContainer from "../components/ScreenContainer";
import {View, Text, ScrollView, Image, StyleSheet, SafeAreaView} from "react-native";
import styled, {css} from 'styled-components/native';
import {useTheme} from '@react-navigation/native';

import Star from "../components/Star";
import StarScore from '../components/StarScore';

// styled component 사용해봤음.
const Line = styled(View)`
  width: 100%;
  height: 8px;
  backgroundColor: #DCDCDC;
  zIndex: -1000;
`

const Score = (props) => {
    return (
        <View flexDirection="row" style={{marginVertical: 8, alignItems: 'center'}}>
            <View width={70}>
                <Text style={{
                    fontWeight: 'bold',
                    fontSize: 12
                }}>{props.name}</Text>
            </View>
            {props.children}
        </View>
    )
}

const Time = (props) => {
    return (
        <View style={{
            borderColor: '#000000',
            borderStyle: 'solid',
            borderWidth: 1,
            borderRadius: 11,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 2,
            paddingHorizontal: 10,
            marginRight: 10,
        }}><Text style={{fontSize: 12}}>{props.name}</Text></View>
    )
}

const PlaceScreen = () => {
    const { colors } = useTheme();

    return (
        <SafeAreaView style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.defaultColor,
            width: "100%"
        }}>
            <ScrollView style={{width: "100%"}}>
                <View>
                    <Image style={{width: "100%", height: 200}}
                           source={require('../assets/images/mountain.jpeg')}
                           resizeMode="center"
                    />
                    <View style={{
                        backgroundColor: 'white',
                        shadowColor: '#c7c7c7',
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: 0.8,
                        shadowRadius: 2,
                        elevation: 1,
                        alignItems: 'center'
                    }}>
                        <View style={{width: '90%', paddingVertical: 20, justifyContent: "center"}}>
                            <Text style={{fontSize: 20, fontWeight: "bold", marginBottom: 4}}>주왕산 주산지</Text>
                            <Text style={{fontSize: 14, color: '#898989', marginTop: 4}}>경상북도 청송</Text>
                        </View>
                    </View>
                </View>
                <Line/>
                <View style={{alignItems: 'center'}}>
                    <View style={{width: '90%'}}>
                        <View flexDirection="row" style={{marginTop: 22}}>
                            <View>
                                <Score name="쾌적성"><StarScore score={3.8} starSize={12}/></Score>
                                <Score name="접근성"><StarScore score={3.8} starSize={12}/></Score>
                                <Score name="주변상권"><StarScore score={3.8} starSize={12}/></Score>
                            </View>
                            <View flex={1} style={{alignItems: 'center', justifyContent: 'center'}}>
                                <View flex={1} flexDirection="row" style={{marginTop: 3, alignItems: 'center'}}>
                                    <View><Text
                                        style={{fontSize: 24, fontWeight: 'bold', marginRight: 5}}>4.8</Text></View>
                                    <View><Text style={{color: '#898989'}}>(16명)</Text></View>
                                </View>
                                <View flex={1}>
                                    <Star score={4.8} starSize={17}/>
                                </View>
                            </View>
                        </View>
                        <View>
                            <Score name="혼잡한 시간">
                                <Time name="오전"/>
                                <Time name="오후"/>
                                <Time name="밤"/>
                            </Score>
                            <Score name="주변 시설"></Score>
                        </View>
                    </View>
                    <View style={{backgroundColor: '#FFF0B4'}}>
                        <Text>+ 보관함에 수집</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>

    )
}


export default PlaceScreen;