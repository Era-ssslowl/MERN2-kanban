'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CREATE_CARD_MUTATION } from '@/lib/graphql/mutations';
import { List as ListType, Card } from '@/types';
import { SortableCard } from '../card/SortableCard';

interface BoardListProps {
  list: ListType;
  boardId: string;
  refetch: () => void;
  dragHandleListeners?: any;
}

export function BoardList({ list, boardId, refetch, dragHandleListeners }: BoardListProps) {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');

  const [createCard, { loading }] = useMutation(CREATE_CARD_MUTATION, {
    onCompleted: () => {
      setNewCardTitle('');
      setIsAddingCard(false);
      refetch();
    },
  });

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardTitle.trim()) return;

    await createCard({
      variables: {
        input: {
          title: newCardTitle,
          listId: list.id,
          position: list.cards?.length || 0,
        },
      },
    });
  };

  const cards = list.cards || [];

  return (
    <div className="flex-shrink-0 w-72 bg-gray-100 rounded-lg p-3">
      <div
        className="flex justify-between items-center mb-3 cursor-grab active:cursor-grabbing"
        {...dragHandleListeners}
      >
        <h3 className="font-semibold text-gray-900">{list.title}</h3>
        <span className="text-xs text-gray-500">{cards.length}</span>
      </div>

      <div className="space-y-2 mb-3">
        <SortableContext
          items={cards.filter(c => !c.isArchived).map(c => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {cards
            .filter((card) => !card.isArchived)
            .sort((a, b) => a.position - b.position)
            .map((card) => (
              <SortableCard key={card.id} card={card} />
            ))}
        </SortableContext>
      </div>

      {isAddingCard ? (
        <form onSubmit={handleAddCard} className="space-y-2">
          <textarea
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            placeholder="Enter card title..."
            className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            rows={3}
            autoFocus
            disabled={loading}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="btn btn-primary text-sm py-1 px-3"
              disabled={loading || !newCardTitle.trim()}
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAddingCard(false);
                setNewCardTitle('');
              }}
              className="btn btn-secondary text-sm py-1 px-3"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsAddingCard(true)}
          className="w-full text-left p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
        >
          + Add a card
        </button>
      )}
    </div>
  );
}
