'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_BOARD_MUTATION, DELETE_BOARD_MUTATION } from '@/lib/graphql/mutations';
import { Board } from '@/types';
import { useRouter } from 'next/navigation';

interface BoardSettingsModalProps {
  board: Board;
  isOwner: boolean;
  onClose: () => void;
  refetch: () => void;
}

export function BoardSettingsModal({
  board,
  isOwner,
  onClose,
  refetch,
}: BoardSettingsModalProps) {
  const router = useRouter();
  const [title, setTitle] = useState(board.title);
  const [description, setDescription] = useState(board.description || '');
  const [backgroundColor, setBackgroundColor] = useState(board.backgroundColor);
  const [isPrivate, setIsPrivate] = useState(board.isPrivate);

  const [updateBoard, { loading }] = useMutation(UPDATE_BOARD_MUTATION, {
    onCompleted: () => {
      refetch();
      onClose();
    },
  });

  const [deleteBoard] = useMutation(DELETE_BOARD_MUTATION, {
    onCompleted: () => {
      router.push('/boards');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) {
      alert('Only board owner can edit the board');
      return;
    }

    try {
      await updateBoard({
        variables: {
          id: board.id,
          input: {
            title,
            description,
            backgroundColor,
            isPrivate,
          },
        },
      });
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleDelete = async () => {
    if (!isOwner) {
      alert('Only board owner can delete the board');
      return;
    }

    if (confirm('Are you sure you want to delete this board? This action cannot be undone.')) {
      try {
        await deleteBoard({
          variables: { id: board.id },
        });
      } catch (error: any) {
        alert(error.message);
      }
    }
  };

  const colorPresets = [
    '#0079BF', '#D29034', '#519839', '#B04632', '#89609E',
    '#CD5A91', '#4BBF6B', '#00AECC', '#838C91',
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Board Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!isOwner && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm">
              ⚠️ Only the board owner can edit board settings.
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Board Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={!isOwner || loading}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              disabled={!isOwner || loading}
            />
          </div>

          {/* Background Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Color
            </label>
            <div className="flex gap-2 flex-wrap">
              {colorPresets.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setBackgroundColor(color)}
                  className={`w-12 h-12 rounded-md border-2 ${
                    backgroundColor === color ? 'border-gray-900' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                  disabled={!isOwner || loading}
                />
              ))}
            </div>
            <input
              type="text"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="#0079BF"
              disabled={!isOwner || loading}
            />
          </div>

          {/* Privacy */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPrivate"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="w-4 h-4"
              disabled={!isOwner || loading}
            />
            <label htmlFor="isPrivate" className="text-sm text-gray-700">
              Make this board private
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t border-gray-200">
            <div>
              {isOwner && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  Delete Board
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              {isOwner && (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
