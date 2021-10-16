import React, { useState } from 'react';
import {
  useWindowDimensions,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Animated, {
  cancelAnimation,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useTheme} from '@react-navigation/native';
import {Icon} from 'react-native-elements';

import { PanGestureHandler } from 'react-native-gesture-handler';
import { BlurView } from 'expo-blur';

import ShowPlacesForFree from './ShowPlacesForFree';

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
};

function setDatas(isEdited, data, day) {
  'worklet';
  runOnJS(isEdited)(data, day)
  return data;
}

function listToObject(list) {
  const values = Object.values(list);
  const object = {};
  for (let i = 0; i < values.length; i++) {
    object[values[i].cpm_order] = i;
  }
  return object;
}

function EditPlaces({
  id,
  day,
  index,
  data,
  positions,
  scrollY,
  dataCount,
  props,
  dataHeight,
  isEdited
}) {
  const dimensions = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [moving, setMoving] = useState(false);
  const top = useSharedValue(positions.value[id] * dataHeight);

  useAnimatedReaction(
    () => positions.value[id],
    (currentPosition, previousPosition) => {
      if (currentPosition !== previousPosition) {
        if (!moving) {
          top.value = currentPosition * dataHeight;
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

      if (positionY <= scrollY.value + dataHeight) {
        // Scroll up
        scrollY.value = withTiming(0, { duration: 1500 });
      } else if (
        positionY >=
        scrollY.value + dimensions.height - dataHeight
      ) {
        // Scroll down
        const contentHeight = dataCount * dataHeight;
        const containerHeight =
          dimensions.height - insets.top - insets.bottom;
        const maxScroll = contentHeight - containerHeight;
        scrollY.value = withTiming(maxScroll, { duration: 1500 });
      } else {
        cancelAnimation(scrollY);
      }

      top.value = withTiming(positionY - dataHeight, {
        duration: 16,
      });

      const newPosition = clamp(
        Math.floor(positionY / dataHeight),
        0,
        dataCount - 1
      );

      if (newPosition !== positions.value[id]) {
        positions.value = objectMove(
          positions.value,
          positions.value[id],
          newPosition,
        );
      }
    },
    onFinish() {
      top.value = positions.value[id] * dataHeight;
      runOnJS(setMoving)(false);
      setDatas(isEdited, positions.value, day)
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      left: 0,
      right: 0,
      top: top.value,
      zIndex: moving ? 1 : 0,
      shadowRadius: 10,
    };
  }, [moving]);

  return (
    <Animated.View style={animatedStyle}>
      <BlurView intensity={moving ? 100 : 0} tint="light">
        <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[{ maxWidth: '100%'}]}>
              <ShowPlacesForFree day={day} item={data} index={index} key={index} isEditPage={props.isEditPage} navigation={props.navigation} length={props.length} private={props.private} pk={props.pk} originData={props.originData} isDeleted={props.isDeleted} isDeletedOrigin={props.isDeletedOrigin} isLimited={true}
                isCommentDeleted={props.isCommentDeleted} isDeletedComment={props.isDeletedComment} curLength={props.curLength}
                isReplacementGotten={props.isReplacementGotten} isGottenReplacementMapPk={props.isGottenReplacementMapPk}
                isReplacementDeleted={props.isReplacementDeleted} isDeletedReplacement={props.isDeletedReplacement} checkDeletedReplacement={props.checkDeletedReplacement} setDeletedReplacementData={props.setDeletedReplacementData}
                postPlaceComment={props.postPlaceComment} putPlaceComment={props.putPlaceComment}
                postReplacement={props.postReplacement} getReplacement={props.getReplacement} getInitialPlaceData={props.getInitialPlaceData} replacementData={props.replacementData}
              />
          </Animated.View>
        </PanGestureHandler>
      </BlurView>
    </Animated.View>
  );
}

const DragAndDropListForFree = props => {
  const {colors} = useTheme();
  const Data = props.data;
  const { isEdited } = props;
  const positions = useSharedValue(listToObject(Data));
  const scrollY = useSharedValue(0);
  const scrollViewRef = useAnimatedRef();

  const handleScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  return (
    <>
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
              height: props.curLength ? Data.length * 100 : 0
            }}
          >
            {Data.map((data, index) => {
              return (
              <EditPlaces
                day={data.cpm_plan_day}
                index={index}
                data={data}
                key={data.cpm_order}
                id={data.cpm_order}
                positions={positions}
                scrollY={scrollY}
                dataCount={Data.length}
                props={props}
                dataHeight={100}
                isEdited={isEdited}
              />
            )})}
          </Animated.ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    </>
  );
}

export default DragAndDropListForFree;