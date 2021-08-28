import React from "react";
import {View, Platform} from "react-native";

// ** ScreenContainer 안에 공통 padding 을 주는 component 입니다.
// ** 화면 전체를 가로지르는 컴포넌트(패딩을 갖지 않는 요소)를 제외하고 감싸게 됩니다.
// ** 가로지르는 컴포넌트가 없는 경우 대부분 ScreenContainer 하위에 ScreenContainerView 를 한 개만 갖게 됩니다.

/*
[example]

<ScreenContainer>
    <ScreenContainerView>
        ... -> 공통 패딩값을 갖는 컴포넌트들(1)
    </ScreenContainerView>
    <Line/> -> 화면 좌우 전체를 가르는 선(패딩값 없음 화면 처음부터 끝까지 가로지르는 컴포넌트)
    <ScreenContainerView>
        ... -> 공통 패딩값을 갖는 컴포넌트들(2)
    </ScreenContainerView>
</ScreenContainer>

*/

const ScreenContainerView = (props) => {
    return (
        <View style={{...props.style, marginHorizontal: 20}} flex={props.flex}>
            {props.children}
        </View>
    )
};

export default ScreenContainerView;