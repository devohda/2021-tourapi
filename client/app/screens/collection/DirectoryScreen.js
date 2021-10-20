import React, {useRef} from 'react';
import { useTheme } from '@react-navigation/native';

import {View, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import RBSheet from 'react-native-raw-bottom-sheet';
import MakeCollectionBtn from './MakeCollectionBtn';
import AppText from '../../components/AppText';

export default function DirectoryScreen() {
    const refRBSheet = useRef();
    const { colors } = useTheme();

    return (
        <View style={{justifyContent: 'flex-end', paddingBottom: 15}}>
            <TouchableOpacity onPress={() => refRBSheet.current.open()} activeOpacity={0.8}>
                <Icon type="ionicon" name={'add-circle'} size={68}/>
                <RBSheet
                    ref={refRBSheet}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    customStyles={{
                        wrapper: {
                            backgroundColor: 'transparent'
                        },
                        draggableIcon: {
                            backgroundColor: colors.defaultDarkColor
                        // display: 'none'
                        }
                    }}
                >
                    <MakeCollectionBtn />
                </RBSheet>
            </TouchableOpacity>
        </View>
    );
}
