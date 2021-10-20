import React, {useEffect, useState, useCallback} from 'react';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import { StatusBar, Platform, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

import AppNavigator from './navigation/AppNavigator';
import AppContextProviders from './contexts/AppContextProviders';

const ColorTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        defaultColor : '#FFFFFF',
        defaultDarkColor : '#000000',
        mainColor : '#4C648D',
        backgroundColor : '#FFF8F8',
        blue : {
            1 : '#3E557D',
            2 : '#637DA9',
            3 : '#7E97C2',
            4 : '#98B1DA',
            5 : '#B8CDF0',
            6 : '#B8CDF0'
        },
        red : {
            1 : '#F74A4A',
            2 : '#F15B5B',
            3 : '#F07A7A',
            4 : '#F39191',
            5 : '#FDADAD',
            6 : '#FFC7C7',
            7 : '#CBB4B4',
            8 : '#470000'
        },
        gray : {
            1 : '#818792',
            2 : '#90969F',
            3 : '#9DA2AB',
            4 : '#AFB3BB',
            5 : '#BABFC8',
            6 : '#C9CFD9',
            7 : '#BDC2CA',
            8 : '#929292',
            9 : '#C4C4C4'
        },
        red_gray : {
            1 : '#BFAFAF',
            2 : '#CABBBB',
            3 : '#D5C6C6',
            4 : '#E0D4D4',
            5 : '#EAE0E0',
            6 : '#F0E7E7',
            7 : '#CBB4B4'
        },
        yellow : {
            1 : '#FFB84B',
            2 : '#FFC46A',
            3 : '#FFC978',
            4 : '#FFD391',
            5 : '#FFDEAD',
            6 : '#FFEBCD',
            7 : '#FCF6F5',
            8 : '#FEE500'
        }
    }
};


export default function App() {
    const [appIsReady, setAppIsReady] = useState(false);

    useEffect(() => {
        async function prepare() {
            try {
                // Keep the splash screen visible while we fetch resources
                await SplashScreen.preventAutoHideAsync();
                // Pre-load fonts, make any API calls you need to do here
                await Font.loadAsync({
                    'Pretendard-Thin': require('./assets/fonts/Pretendard-Thin.otf'),
                    'Pretendard-ExtraLight': require('./assets/fonts/Pretendard-ExtraLight.otf'),
                    'Pretendard-Light': require('./assets/fonts/Pretendard-Light.otf'),
                    'Pretendard-Regular': require('./assets/fonts/Pretendard-Regular.otf'),
                    'Pretendard-Medium': require('./assets/fonts/Pretendard-Medium.otf'),
                    'Pretendard-SemiBold': require('./assets/fonts/Pretendard-SemiBold.otf'),
                    'Pretendard-Bold' : require('./assets/fonts/Pretendard-Bold.otf'),
                    'Pretendard-ExtraBold' : require('./assets/fonts/Pretendard-ExtraBold.otf'),
                    'Pretendard-Black' : require('./assets/fonts/Pretendard-Black.otf'),
                });
                // Artificially delay for two seconds to simulate a slow loading
                // experience. Please remove this if you copy and paste the code!
                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (e) {
                console.warn(e);
            } finally {
                // Tell the application to render
                setAppIsReady(true);
            }
        }

        prepare();
    }, []);



    const onLayoutRootView = useCallback(async () => {
        if (appIsReady) {
            await SplashScreen.hideAsync();
        }
    }, [appIsReady]);

    if (!appIsReady) {
        return null;
    }

    return (
        <View
            style={{ flex: 1}}
            onLayout={onLayoutRootView}>
            <AppContextProviders>
                <NavigationContainer theme={ColorTheme}>
                    {Platform.OS === 'ios' && <StatusBar barStyle={'dark-content'} />}
                    <AppNavigator/>
                </NavigationContainer>
            </AppContextProviders>
        </View>
    );
}
