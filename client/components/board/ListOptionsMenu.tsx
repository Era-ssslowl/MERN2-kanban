'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_LIST_MUTATION, DELETE_LIST_MUTATION } from '@/lib/graphql/mutations';
import { List as ListType } from '@/types';

interface ListOptionsMenuProps {
  list: ListType;
  canEdit: boolean;
  refetch: () => void;
}

export function ListOptionsMenu({ list, canEdit, refetch }: ListOptionsMenuProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(list.title);

  const [updateList, { loading }] = useMutation(UPDATE_LIST_MUTATION, {
    onCompleted: () => {
      setIsEditing(false);
      refetch();
    },
  });

  const [deleteList] = useMutation(DELETE_LIST_MUTATION, {
    onCompleted: () => {
      refetch();
    },
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) {
      alert('Only board owner or admins can edit lists');
      return;
    }

    try {
      await updateList({
        variables: {
          id: list.id,
          input: { title },
        },
      });
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleDelete = async () => {
    if (!canEdit) {
      alert('Only board owner or admins can delete lists');
      return;
    }

    if (confirm('Are you sure you want to delete this list and all its cards?')) {
      try {
        await deleteList({
          variables: { id: list.id },
        });
      } catch (error: any) {
        alert(error.message);
      }
    }
  };

  const handleArchive = async () => {
    if (!canEdit) {
      alert('Only board owner or admins can archive lists');
      return;
    }

    try {
      await updateList({
        variables: {
          id: list.id,
          input: { isArchived: true },
        },
      });
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (isEditing) {
    return (
      <form onSubmit={handleUpdate} className="mb-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
          disabled={loading}
        />
        <div className="flex gap-2 mt-2">
          <button
            type="submit"
            className="text-xs px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={loading}
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => {
              setTitle(list.title);
              setIsEditing(false);
            }}
            className="text-xs px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-1 hover:bg-gray-200 rounded transition-colors"
        title="List options"
      >
        <svg
          className="w-4 h-4 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 top-8 z-20 bg-white rounded-md shadow-lg border border-gray-200 py-1 w-48">
            {canEdit && (
              <>
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Edit Title
                </button>
                <button
                  onClick={() => {
                    handleArchive();
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Archive List
                </button>
                <hr className="my-1" />
                <button
                  onClick={() => {
                    handleDelete();
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete List
                </button>
              </>
            )}
            {!canEdit && (
              <div className="px-4 py-2 text-sm text-gray-500">
                No actions available
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
