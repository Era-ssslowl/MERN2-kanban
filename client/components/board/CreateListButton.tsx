'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_LIST_MUTATION } from '@/lib/graphql/mutations';

interface CreateListButtonProps {
  boardId: string;
  position: number;
  refetch: () => void;
}

export function CreateListButton({ boardId, position, refetch }: CreateListButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');

  const [createList, { loading }] = useMutation(CREATE_LIST_MUTATION, {
    onCompleted: () => {
      setTitle('');
      setIsAdding(false);
      refetch();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await createList({
      variables: {
        input: {
          title,
          boardId,
          position,
        },
      },
    });
  };

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="flex-shrink-0 w-72 bg-white/20 hover:bg-white/30 rounded-lg p-3 text-white transition-colors"
      >
        + Add a list
      </button>
    );
  }

  return (
    <div className="flex-shrink-0 w-72 bg-gray-100 rounded-lg p-3">
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter list title..."
          className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
          autoFocus
          disabled={loading}
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="btn btn-primary text-sm py-1 px-3"
            disabled={loading || !title.trim()}
          >
            Add List
          </button>
          <button
            type="button"
            onClick={() => {
              setIsAdding(false);
              setTitle('');
            }}
            className="btn btn-secondary text-sm py-1 px-3"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
