import React, {useState, useEffect} from 'react';
import {
    Image,
    StatusBar,
    useWindowDimensions,
    View,
    FlatList,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {
    SafeAreaProvider,
    SafeAreaView,
    useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Animated, {
    cancelAnimation,
    runOnJS,
    scrollTo,
    useAnimatedGestureHandler,
    useAnimatedReaction,
    useAnimatedRef,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    useCode,
    call,
} from 'react-native-reanimated';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import {useTheme} from '@react-navigation/native';
import {updatedList} from '../../contexts/UpdatedListContextProvider';

import ShowPlaces from './ShowPlaces';

function clamp(value, lowerBound, upperBound) {
    'worklet';
    return Math.max(lowerBound, Math.min(value, upperBound));
}

function objectMove(object, from, to) {
    'worklet';
    const newObject = Object.assign({}, object);

    for (const id in object) {
        if (object[id] === from) {
            newObject[id] = to;
        }

        if (object[id] === to) {
            newObject[id] = from;
        }
    }

    return newObject;
}

function listToObject(list) {
    const values = Object.values(list);
    const object = {};
    for (let i = 0; i < values.length; i++) {
        object[values[i].place_pk] = i;
    }

    return object;
}

//해당 height 가져오는 방법 구상
const CONTAINER_HEIGHT = 150;

function ListAnimation({
    day,
    index,
    data,
    positions,
    scrollY,
    dataCount,
    isEditPage,
    isPress,
}) {
    const dimensions = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const [moving, setMoving] = useState(false);

    const top = useSharedValue(positions.value[data.place_pk] * CONTAINER_HEIGHT);

    useAnimatedReaction(
        () => positions.value[data.place_pk],
        (currentPosition, previousPosition) => {
            if (currentPosition !== previousPosition) {
                if (!moving) {
                    top.value = currentPosition * CONTAINER_HEIGHT;
                }
            }
        },
        [moving]
    );

    const gestureHandler = useAnimatedGestureHandler({

        onStart() {
            runOnJS(setMoving)(true);
        },
        onActive(event) {
            const positionY = event.absoluteY + scrollY.value;

            if (positionY <= scrollY.value + CONTAINER_HEIGHT) {
                // Scroll up
                scrollY.value = withTiming(0, {duration: 1500});
            } else if (
                positionY >=
                scrollY.value + dimensions.height - CONTAINER_HEIGHT
            ) {
                // Scroll down
                const contentHeight = dataCount * CONTAINER_HEIGHT;
                const containerHeight =
                    dimensions.height - insets.top - insets.bottom;
                const maxScroll = contentHeight - containerHeight;
                scrollY.value = withTiming(maxScroll, {duration: 1500});
            } else {
                cancelAnimation(scrollY);
            }

            top.value = withTiming(positionY - CONTAINER_HEIGHT, {
                duration: 16,
            });

            const newPosition = clamp(
                Math.floor(positionY / CONTAINER_HEIGHT),
                0,
                dataCount - 1
            );

            if (newPosition !== positions.value[data.place_pk]) {
                positions.value = objectMove(
                    positions.value,
                    positions.value[data.place_pk],
                    newPosition
                );
            }
        },
        onFinish() {
            top.value = positions.value[data.place_pk] * CONTAINER_HEIGHT;
            runOnJS(setMoving)(false);
        },
        onEnd() {
            // runOnJS(setUpdatedData)(positions.value);
            // useCode(() => {
            //   return call([], () => {
            //     // setUpdatedData(positions.value);
            //     runOnJS(setUpdatedData)(positions.value);
            //   })
            // }, [positions.value])
        }
    });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            position: 'absolute',
            left: 0,
            right: 0,
            top: top.value,
            zIndex: moving ? 1 : 0,
            shadowColor: 'black',
            shadowOffset: {
                height: 0,
                width: 0,
            },
            shadowRadius: 10,
        };
    }, [moving]);

    return (
        <Animated.View style={animatedStyle}>
            <PanGestureHandler onGestureEvent={gestureHandler}>
                <Animated.View>
                    <ShowPlaces day={day} item={data} index={index} key={index} isEditPage={isEditPage}
                        isPress={isPress} length={data.length}/>
                </Animated.View>
            </PanGestureHandler>
        </Animated.View>
    );
}

const DragAndDropList = props => {
    const Data = props.data;
    const positions = useSharedValue(listToObject(Data));
    const updated = useSharedValue([]);
    const scrollY = useSharedValue(0);
    const scrollViewRef = useAnimatedRef();
    const {colors} = useTheme();

    useAnimatedReaction(
        () => scrollY.value,
        (scrolling) => scrollTo(scrollViewRef, 0, scrolling, true)
    );

    const handleScroll = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y;
    });

    const array = Object.entries(positions.value);

    return (
        <>
            <StatusBar barStyle="dark-content"/>
            <SafeAreaProvider>
                <SafeAreaView style={{flex: 1}}>
                    <Animated.ScrollView
                        ref={scrollViewRef}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        style={{
                            flex: 1,
                            position: 'relative',
                            backgroundColor: colors.backgroundColor,
                        }}
                        contentContainerStyle={{
                            height: Data.length * CONTAINER_HEIGHT,
                        }}
                    >
                        {Data.map((data, index) => (
                            <ListAnimation
                                key={data.place_pk}
                                day={props.idx}
                                index={index}
                                data={data}
                                positions={positions}
                                scrollY={scrollY}
                                dataCount={Data.length}
                                isEditPage={props.isEditPage}
                                isPress={props.isPress}
                                updated={updated}
                            />
                        ))}
                    </Animated.ScrollView>
                </SafeAreaView>
            </SafeAreaProvider>
        </>
    );
};

const styles = StyleSheet.create({
    //swipe style
    rowBack: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
        marginTop: 13
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
    },
});

export default DragAndDropList;