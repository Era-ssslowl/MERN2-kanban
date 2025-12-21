'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BoardList } from './BoardList';
import { List as ListType, User } from '@/types';

interface SortableListProps {
  list: ListType;
  boardId: string;
  boardMembers: User[];
  boardOwner: User;
  boardAdmins: User[];
  currentUser: User;
  refetch: () => void;
}

export function SortableList({
  list,
  boardId,
  boardMembers,
  boardOwner,
  boardAdmins,
  currentUser,
  refetch,
}: SortableListProps) {
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
      className="sortable-list"
    >
      <BoardList
        list={list}
        boardId={boardId}
        boardMembers={boardMembers}
        boardOwner={boardOwner}
        boardAdmins={boardAdmins}
        currentUser={currentUser}
        refetch={refetch}
        dragHandleListeners={listeners}
      />
    </div>
  );
}
