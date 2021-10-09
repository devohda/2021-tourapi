import React, {FC} from "react";
import { View } from 'react-native';
import { Droppable, Draggable, DroppableProvided } from "react-beautiful-dnd";

interface Props {
  colors: string[];
  listId: string;
  listType?: string;
  internalScroll?: boolean;
  isCombineEnabled?: boolean;
}

export const AuthorList: FC<Props> = ({ listId, listType, colors }) => {
  return (
    <Droppable
      droppableId={listId}
      type={listType}
      direction="horizontal"
      isCombineEnabled={false}
    >
      {dropProvided => (
        <View {...dropProvided.droppableProps}>
          <View>
            <View>
              <View style={{ display: "flex" }} ref={dropProvided.innerRef}>
                {colors.map((color, index) => (
                  <Draggable key={color} draggableId={color} index={index}>
                    {dragProvided => (
                      <View
                        {...dragProvided.dragHandleProps}
                        {...dragProvided.draggableProps}
                        ref={dragProvided.innerRef}
                      >
                        <View style={{ backgroundColor: color }}>{color}</View>
                      </View>
                    )}
                  </Draggable>
                ))}
                {dropProvided.placeholder}
              </View>
            </View>
          </View>
        </View>
      )}
    </Droppable>
  );
};