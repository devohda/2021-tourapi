import React, { useState, useCallback, useRef } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import DraggableFlatList , { RenderItemParams } from 'react-native-draggable-flatlist';
import { ScrollView } from 'react-native-gesture-handler';

const NUM_ITEMS = 20;
 
function getColor(i: number) { 
  const multiplier = 255 / (NUM_ITEMS - 1);
  const colorVal = i * multiplier;
  return `rgb(${colorVal}, ${Math.abs(128 - colorVal)}, ${255 - colorVal})`;
}

const exampleData: Item[] = [...Array(NUM_ITEMS)].map((d, index) => {
  const backgroundColor = getColor(index); 
  return {
    key: `item-${backgroundColor}`,
    label: `${index}`,
    backgroundColor,
  };
});

type Item = {
  key: string;
  label: string;
  backgroundColor: string;
};

const Example = () => {
  const [data, setData] = useState(exampleData);

  const scrollView = useRef<ScrollView>(null);
  const [outerScrollEnabled, setOuterScrollEnabled] = useState(true)

  const renderItem = useCallback( 
    ({ item, index, drag, isActive }: RenderItemParams<Item>) => {
      return (
        <TouchableOpacity
          style={{
            height: 100,
            backgroundColor: isActive ? 'red' : item.backgroundColor,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.5,
          }}
          onPressIn={drag}>
          <Text
            style={{
              fontWeight: 'bold',
              color: 'white',
              fontSize: 32,
            }}>
            {item.label}
          </Text>
        </TouchableOpacity>
      );
    },
    []
  );
  return (
    <ScrollView ref={scrollView} style={{ flex: 1, backgroundColor: 'blue' }}>
      <DraggableFlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => `draggable-item-${item.key}`}
        onDragBegin={() => setOuterScrollEnabled(false)}
        onDragEnd={({ data }) => {
          setData(data)
          setOuterScrollEnabled(true)
        }}
        simultaneousHandlers={scrollView}
        activationDistance={20}
      />
    </ScrollView>
  );
}

export default Example;
