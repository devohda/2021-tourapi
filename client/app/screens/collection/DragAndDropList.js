import React, { useState } from 'react';
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
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useTheme } from '@react-navigation/native';

import AppText from '../../components/AppText';
import ShowPlaces from './ShowPlaces';

function clamp(value, lowerBound, upperBound) {
  'worklet';
  return Math.max(lowerBound, Math.min(value, upperBound));
}

function shuffle(array) {
  let counter = array.length;

  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
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
    // object[values[i].id] = i;
    object[values[i].tip] = i;
  }

  return object;
}

//해당 height 가져오는 방법 구상
const CONTAINER_HEIGHT = 180;
const SCROLL_HEIGHT_THRESHOLD = CONTAINER_HEIGHT;

function ListAnimation({
  day,
  index,
  tip,
  data,
  positions,
  scrollY,
  songsCount,
  isEditPage,
  isPress
}) {
  const dimensions = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [moving, setMoving] = useState(false);
  const top = useSharedValue(positions.value[tip] * CONTAINER_HEIGHT);

  useAnimatedReaction(
    () => positions.value[tip],
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

      if (positionY <= scrollY.value + SCROLL_HEIGHT_THRESHOLD) {
        // Scroll up
        scrollY.value = withTiming(0, { duration: 1500 });
      } else if (
        positionY >=
        scrollY.value + dimensions.height - SCROLL_HEIGHT_THRESHOLD
      ) {
        // Scroll down
        const contentHeight = songsCount * CONTAINER_HEIGHT;
        const containerHeight =
          dimensions.height - insets.top - insets.bottom;
        const maxScroll = contentHeight - containerHeight;
        scrollY.value = withTiming(maxScroll, { duration: 1500 });
      } else {
        cancelAnimation(scrollY);
      }

      top.value = withTiming(positionY - CONTAINER_HEIGHT, {
        duration: 16,
      });

      const newPosition = clamp(
        Math.floor(positionY / CONTAINER_HEIGHT),
        0,
        songsCount - 1
      );

      if (newPosition !== positions.value[tip]) {
        positions.value = objectMove(
          positions.value,
          positions.value[tip],
          newPosition
        );
      }
    },
    onFinish() {
      top.value = positions.value[tip] * CONTAINER_HEIGHT;
      runOnJS(setMoving)(false);
    },
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
            <ShowPlaces day={day} item={data} index={index} key={index} isEditPage={isEditPage} isPress={isPress} />
          </Animated.View>
        </PanGestureHandler>
    </Animated.View>
  );
}

const DragAndDropList = props => {
  const Data = props.data;
  const positions = useSharedValue(listToObject(Data));
  const scrollY = useSharedValue(0);
  const scrollViewRef = useAnimatedRef();
  const { colors } = useTheme();

  useAnimatedReaction(
    () => scrollY.value,
    (scrolling) => scrollTo(scrollViewRef, 0, scrolling, true)
  );

  const handleScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
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
              {/* <SwipeListView
                  data={Data}
                  renderItem={({item, index}) => 
                  <ListAnimation
                  key={item.id}
                  day={props.idx}
                  index={index}
                  tip={item.tip}
                  data={item}
                  positions={positions}
                  scrollY={scrollY}
                  songsCount={Data.length}
                  isEditPage={props.isEditPage}
                  isPress={props.isPress}
                />}
                  keyExtractor={(item, idx) => {idx.toString()}}
                  key={(item, idx) => {idx.toString()}}
                  renderHiddenItem={(item, rowMap) => {
                      return (
                      <View style={{...styles.rowBack, backgroundColor: colors.red[1]}} key={item.id}>
                          <TouchableOpacity
                              style={{...styles.backRightBtn, backgroundColor: colors.red[1]}}
                              onPress={() => deleteRow(rowMap, item.index)}
                          >
                              <View>
                                  <AppText style={{color: colors.defaultColor}}>삭제</AppText>
                              </View>
                          </TouchableOpacity>
                      </View>
                  )}}
                  rightOpenValue={-75}
                  previewRowKey={'0'}
                  previewOpenDelay={3000}
                  disableRightSwipe={true}
                  disableLeftSwipe={props.isEditPage ? true : false}
                  closeOnRowOpen={true}
                  closeOnRowPress={true}
                  nestedScrollEnabled
              /> */}
            {Data.map((data, index) => (
              <ListAnimation
                key={data.id}
                day={props.idx}
                index={index}
                tip={data.tip}
                data={data}
                positions={positions}
                scrollY={scrollY}
                songsCount={Data.length}
                isEditPage={props.isEditPage}
                isPress={props.isPress}
              />
            ))}
          </Animated.ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    </>
  );
}

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