import React, { useState, useEffect } from 'react';
import { View } from 'react-native';

import AppText from '../components/AppText';

const Timer = props => {
    const { mm, ss, style } = props;
    const [minutes, setMinutes] = useState(parseInt(mm));
    const [seconds, setSeconds] = useState(parseInt(ss));

    return (
        <View style={{...style, flexDirection: 'row'}}>
            <AppText>
                남은시간
            </AppText>
            <AppText>
                {minutes} : { seconds < 10 ? `0${seconds}` : seconds}
            </AppText>
        </View>
    );
};

export default Timer;