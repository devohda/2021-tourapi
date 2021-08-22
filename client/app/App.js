import React from 'react';
import {DefaultTheme, NavigationContainer} from "@react-navigation/native";

import AppNavigator from "./navigation/AppNavigator";
import AppContextProviders from "./contexts/AppContextProviders";

const NavigationTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: 'transparent'
    },
};

const ColorTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        defaultColor : '#FFFFFF',
        mainColor : '#4C648D',
        backgroundColor : '#FCF6F5',
        notClicked : '#C9CFD9',
        emphasizedColor : '#F07A7A',
        subColor : '#BABFC8',
        hashTagColor: '#90969F',
        detailColor: '#F0E7E7',
        detailTextColor: '#818792',
        detailSubTextColor: '#AFB3BB',
        linkColor: '#7E97C2',
        notClickedDirColor: '#9DA2AB',
        shadowColor: '#cbb4b4',
        blue : {
            1 : '#3E557D',
            2 : '#4C648D',
            3 : '#637DA9',
            4 : '#7E97C2',
            5 : '#98B1DA',
            6 : '#B8CDF0'
        },
        red : {
            1 : '#F74A4A',
            2 : '#F15B5B',
            3 : '#F07A7A',
            4 : '#F39191',
            5 : '#FDADAD',
            6 : '#FFC7C7'
        },
        gray : {
            1 : '#818792',
            2 : '#90969F',
            3 : '#9DA2AB',
            4 : '#AFB3BB',
            5 : '#BABFC8',
            6 : '#C9CFD9'
        },
        red_gray : {
            1 : '#BFAFAF',
            2 : '#CABBBB',
            3 : '#D5C6C6',
            4 : '#E0D4D4',
            5 : '#EAE0E0',
            6 : '#F0E7E7'
        },
        yellow : {
            1 : '#FFB84B',
            2 : '#FFC46A',
            3 : '#FFC978',
            4 : '#FFD391',
            5 : '#FFDEAD',
            6 : '#FFEBCD'
        }
    }
};

export default function App() {
    return (
            <AppContextProviders>
                <NavigationContainer theme={ColorTheme}>
                    <AppNavigator/>
                </NavigationContainer>
            </AppContextProviders>
    );
}
