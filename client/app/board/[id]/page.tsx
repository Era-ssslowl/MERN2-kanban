'use client';

import { useEffect, useState } from 'react';
import { useQuery, useSubscription, useMutation } from '@apollo/client';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { BOARD_QUERY, ME_QUERY } from '@/lib/graphql/queries';
import {
  CARD_CREATED_SUBSCRIPTION,
  CARD_UPDATED_SUBSCRIPTION,
  CARD_MOVED_SUBSCRIPTION,
} from '@/lib/graphql/subscriptions';
import { MOVE_CARD_MUTATION, MOVE_LIST_MUTATION } from '@/lib/graphql/mutations';
import { Board, List as ListType, Card } from '@/types';
import { SortableList } from '@/components/board/SortableList';
import { CreateListButton } from '@/components/board/CreateListButton';
import { BoardMembersModal } from '@/components/board/BoardMembersModal';
import { BoardStatistics } from '@/components/board/BoardStatistics';
import { BoardSettingsModal } from '@/components/board/BoardSettingsModal';

export default function BoardPage() {
  const params = useParams();
  const router = useRouter();
  const boardId = params.id as string;

  const { data, loading, error, refetch } = useQuery(BOARD_QUERY, {
    variables: { id: boardId },
    skip: !boardId,
  });

  const { data: meData } = useQuery(ME_QUERY);

  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Subscribe to card updates
  useSubscription(CARD_CREATED_SUBSCRIPTION, {
    variables: { boardId },
    skip: !boardId,
    onData: () => refetch(),
  });

  useSubscription(CARD_UPDATED_SUBSCRIPTION, {
    variables: { boardId },
    skip: !boardId,
    onData: () => refetch(),
  });

  useSubscription(CARD_MOVED_SUBSCRIPTION, {
    variables: { boardId },
    skip: !boardId,
    onData: () => refetch(),
  });

  // DnD setup
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor));
  const [moveCard] = useMutation(MOVE_CARD_MUTATION);
  const [moveList] = useMutation(MOVE_LIST_MUTATION);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !data?.board) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Board not found</p>
          <Link href="/boards" className="btn btn-primary">
            Back to Boards
          </Link>
        </div>
      </div>
    );
  }

  const board: Board = data.board;
  const lists: ListType[] = board.lists || [];
  const isOwner = meData?.me && board.owner.id === meData.me.id;
  const isAdmin = meData?.me && board.admins.some((admin) => admin.id === meData.me.id);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    // Find if dragging a card or list
    const draggedCard = lists.flatMap(l => l.cards || []).find(c => c.id === active.id);
    const draggedList = lists.find(l => l.id === active.id);

    if (draggedCard) {
      // Handle card move
      const targetList = lists.find(l =>
        l.cards?.some(c => c.id === over.id) || l.id === over.id
      );

      if (targetList) {
        const targetCards = targetList.cards || [];
        const overIndex = targetCards.findIndex(c => c.id === over.id);
        let newPosition: number;

        if (overIndex === -1) {
          // Dropped on empty list
          newPosition = 0;
        } else if (overIndex === 0) {
          newPosition = targetCards[0].position / 2;
        } else if (overIndex === targetCards.length - 1) {
          newPosition = targetCards[targetCards.length - 1].position + 1;
        } else {
          newPosition = (targetCards[overIndex - 1].position + targetCards[overIndex].position) / 2;
        }

        try {
          await moveCard({
            variables: {
              input: {
                cardId: draggedCard.id,
                targetListId: targetList.id,
                position: newPosition,
              },
            },
          });
          refetch();
        } catch (error) {
          console.error('Error moving card:', error);
        }
      }
    } else if (draggedList) {
      // Handle list move
      const overIndex = lists.findIndex(l => l.id === over.id);
      let newPosition: number;

      if (overIndex === 0) {
        newPosition = lists[0].position / 2;
      } else if (overIndex === lists.length - 1) {
        newPosition = lists[lists.length - 1].position + 1;
      } else {
        newPosition = (lists[overIndex - 1].position + lists[overIndex].position) / 2;
      }

      try {
        await moveList({
          variables: {
            input: {
              listId: draggedList.id,
              position: newPosition,
            },
          },
        });
        refetch();
      } catch (error) {
        console.error('Error moving list:', error);
      }
    }
  };

  return (
    <div
      className="min-h-screen pb-8"
      style={{ backgroundColor: board.backgroundColor }}
    >
      <header className="bg-black/20 backdrop-blur-sm">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/boards" className="text-white hover:text-white/80">
              ← Back
            </Link>
            <h1 className="text-2xl font-bold text-white">{board.title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowStatistics(true)}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-md text-sm font-medium transition-colors"
              title="View Statistics"
            >
              📊 Stats
            </button>
            <button
              onClick={() => setShowMembersModal(true)}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-2"
              title="Manage Members"
            >
              <span>👥 Members</span>
              <span className="bg-white/30 px-2 py-0.5 rounded-full text-xs">
                {board.members.length}
              </span>
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-md text-sm font-medium transition-colors"
              title="Board Settings"
            >
              ⚙️ Settings
            </button>
            <div className="flex items-center gap-2">
              {board.members.slice(0, 3).map((member) => (
                <div
                  key={member.id}
                  className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-medium"
                  title={member.name}
                >
                  {member.name.charAt(0).toUpperCase()}
                </div>
              ))}
              {board.members.length > 3 && (
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs">
                  +{board.members.length - 3}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-4">
            <SortableContext
              items={lists.filter(l => !l.isArchived).map(l => l.id)}
              strategy={horizontalListSortingStrategy}
            >
              {lists
                .filter((list) => !list.isArchived)
                .sort((a, b) => a.position - b.position)
                .map((list) => (
                  <SortableList
                    key={list.id}
                    list={list}
                    boardId={boardId}
                    boardMembers={board.members}
                    boardOwner={board.owner}
                    boardAdmins={board.admins}
                    currentUser={meData?.me}
                    refetch={refetch}
                  />
                ))}
            </SortableContext>
            <CreateListButton boardId={boardId} position={lists.length} refetch={refetch} />
          </div>
          <DragOverlay>
            {activeId ? (
              <div className="drag-overlay opacity-80">
                Dragging...
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>

      {/* Modals */}
      {showMembersModal && meData?.me && (
        <BoardMembersModal
          board={board}
          currentUser={meData.me}
          onClose={() => setShowMembersModal(false)}
          refetch={refetch}
        />
      )}

      {showStatistics && board.statistics && (
        <BoardStatistics
          statistics={board.statistics}
          onClose={() => setShowStatistics(false)}
        />
      )}

      {showSettings && meData?.me && (
        <BoardSettingsModal
          board={board}
          isOwner={!!isOwner}
          onClose={() => setShowSettings(false)}
          refetch={refetch}
        />
      )}
    </div>
  );
}
