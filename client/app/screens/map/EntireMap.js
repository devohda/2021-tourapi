import React, {useState, useRef, useEffect} from 'react';
import { View, ScrollView, Image, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, Share, Alert, FlatList, Platform } from 'react-native';
import {useTheme, useIsFocused} from '@react-navigation/native';
import {Icon, Rating} from 'react-native-elements';
import MapView, {Marker, UrlTile, PROVIDER_GOOGLE} from 'react-native-maps';
import NavigationTop from '../../components/NavigationTop';
import AppText from '../../components/AppText';

import CustomMarker from '../../assets/images/place/map-marker.svg';

import ScreenContainer from '../../components/ScreenContainer';

const EntireMap = ({route, navigation}) => {
    const {colors} = useTheme();
    // const { data } = route.params;
    const [region, setRegion] = useState({
        latitude: 37.56633546113615,
        longitude: 126.9775482762618,
        latitudeDelta: 0.0015,
        longitudeDelta: 0.0015,
    });

    const onMarkerPress = (event) => {
        const { id, coordinate } = event.nativeEvent;
        // console.log(coordinate)
        const newRegion = { ...region };
    
        newRegion.latitude = coordinate.latitude;
        newRegion.longitude = coordinate.longitude;
    
        setRegion(newRegion)
    };

    return (
        <ScreenContainer backgroundColor={colors.backgroundColor}>
            {/* 보관함 이름 데려오기 */}
            <NavigationTop navigation={navigation} title=""/>
            <MapView style={{width: Dimensions.get('window').width, height: Platform.OS === 'android' ? Dimensions.get('window').height - 89 : Dimensions.get('window').height - 104}}
                region={region}
                moveOnMarkerPress
                tracksViewChanges={false}
                provider={PROVIDER_GOOGLE}
                onMarkerPress={onMarkerPress}
            >
                <Marker coordinate={{
                    latitude: 37.56633546113615,
                    longitude: 126.9779482762618
                }} title={'기본'}
                description="기본값입니다">
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <CustomMarker />
                        <View style={{position: 'absolute', justifyContent: 'center', alignItems: 'center', bottom: 8}}>
                            <AppText style={{fontSize: 12, fontWeight: '500', lineHeight: 19.2, color: colors.mainColor}}>1</AppText>
                        </View>
                    </View>
                </Marker>
            </MapView>
            {/* {
                list.map((data, idx) => (
                    <Markers data={data} key={idx + 'user'} idx={idx}/>
                ))
            } */}
        </ScreenContainer>
    );
};

export default EntireMap;