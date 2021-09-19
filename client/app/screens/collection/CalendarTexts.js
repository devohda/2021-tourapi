import React, { memo, useState } from 'react';
import { View, Image, Switch, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import AppText from '../../components/AppText';

const CalendarTexts = props => {
    const {colors} = useTheme();

    return(
        <View>
            <AppText style={{color: props.Date.date >= props.startDate && props.Date.date <= props.endDate ? colors.defaultColor : colors.mainColor,
                fontSize: 12, lineHeight: 24, fontWeight: '500', justifyContent: 'center',textAlign: 'center'}}>
            {Platform.OS === 'ios' ?
            props.Date.date.toLocaleDateString().split('.')[2]
            : props.Date.date.toLocaleDateString().split('/')[1]}
            </AppText>
        </View>
    )};

const areEqual = (prevProps, nextProps) => {
    const { isSelected } = nextProps;
    const { isSelected: prevIsSelected } = prevProps;
    
    /*if the props are equal, it won't update*/
    const isSelectedEqual = isSelected === prevIsSelected;
  
    return isSelectedEqual;
};

const styles = StyleSheet.create({
    header_text: {
        fontSize: 12,
        fontWeight: '500',
        lineHeight: 19.2,
        marginTop: 16
    },
    list_style: {
        marginBottom: 32
    },
    list_style_version1: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    list_style_version2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
})

export default memo(CalendarTexts, areEqual);