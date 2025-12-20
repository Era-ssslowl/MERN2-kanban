'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BoardList } from './BoardList';
import { List as ListType } from '@/types';

interface SortableListProps {
  list: ListType;
  boardId: string;
  refetch: () => void;
}

export function SortableList({ list, boardId, refetch }: SortableListProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: list.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="sortable-list"
    >
      <BoardList list={list} boardId={boardId} refetch={refetch} />
    </div>
  );
}
