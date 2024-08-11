import React, { CSSProperties, ReactNode } from "react";
import type { UniqueIdentifier } from "@dnd-kit/core";
import { AnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { TreeItem, TreeItemProps as TreeItemProps } from "./TreeItem";
import { iOS } from "../../utilities";

interface Props extends TreeItemProps {
  id: UniqueIdentifier;
}

const animateLayoutChanges: AnimateLayoutChanges = ({
  isSorting,
  wasDragging,
  children,
}) => (isSorting || wasDragging ? false : true);

export function SortableTreeItem({ id, depth, children, ...props }: Props) {
  const {
    attributes,
    isDragging,
    isSorting,
    listeners,
    setDraggableNodeRef,
    setDroppableNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
    animateLayoutChanges,
  });
  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <>
      {children({
        ref: setDraggableNodeRef,
        wrapperRef: setDroppableNodeRef,
        style,
        depth,
        ghost: isDragging,
        disableSelection: iOS,
        disableInteraction: isSorting,
        handleProps: {
          ...attributes,
          ...listeners,
        },
        ...props,
      })}

    </>
  );
}
