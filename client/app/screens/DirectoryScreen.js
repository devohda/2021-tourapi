import React, {useRef} from 'react';

import {View, TouchableOpacity} from "react-native";
import {Icon} from "react-native-elements";
import RBSheet from "react-native-raw-bottom-sheet";
import MakeDirectoryBtn from './MakeDirectoryBtn';
import AppText from "../components/AppText";

export default function DirectoryScreen() {
    const refRBSheet = useRef();

    return (
        <View style={{justifyContent: 'flex-end', paddingBottom: 15}}>
        <TouchableOpacity onPress={() => refRBSheet.current.open()}>
            <Icon type="ionicon" name={"add-circle"} size={68}/>
                <RBSheet
                    ref={refRBSheet}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    customStyles={{
                    wrapper: {
                        backgroundColor: "transparent"
                    },
                    draggableIcon: {
                        backgroundColor: "#000"
                        // display: 'none'
                    }
                    }}
                >
                <MakeDirectoryBtn />
            </RBSheet>
    </TouchableOpacity>
    </View>
    );
}
