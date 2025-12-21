'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import {
  UPDATE_CARD_MUTATION,
  DELETE_CARD_MUTATION,
} from '@/lib/graphql/mutations';
import { Card, User } from '@/types';

interface CardEditModalProps {
  card: Card;
  boardMembers: User[];
  currentUser: User;
  isAdmin: boolean;
  isOwner: boolean;
  onClose: () => void;
  refetch: () => void;
  onAssign: (userId: string) => void;
  onUnassign: (userId: string) => void;
  onDelete: () => void;
}

export function CardEditModal({
  card,
  boardMembers,
  currentUser,
  isAdmin,
  isOwner,
  onClose,
  refetch,
  onAssign,
  onUnassign,
  onDelete,
}: CardEditModalProps) {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [priority, setPriority] = useState(card.priority.toUpperCase());
  const [dueDate, setDueDate] = useState(
    card.dueDate ? new Date(card.dueDate).toISOString().split('T')[0] : ''
  );
  const [labels, setLabels] = useState(card.labels.join(', '));

  const [updateCard, { loading }] = useMutation(UPDATE_CARD_MUTATION, {
    onCompleted: () => {
      refetch();
      onClose();
    },
  });

  // Check if current user can edit (only owner or admin)
  const canEdit = isOwner || isAdmin;
  const canDelete = isOwner || isAdmin;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) {
      alert('You do not have permission to edit this card');
      return;
    }

    try {
      // Convert date string to ISO DateTime format
      let dueDateISO = null;
      if (dueDate) {
        // Create a Date object and convert to ISO string
        const dateObj = new Date(dueDate + 'T00:00:00.000Z');
        dueDateISO = dateObj.toISOString();
      }

      await updateCard({
        variables: {
          id: card.id,
          input: {
            title,
            description,
            priority,
            dueDate: dueDateISO,
            labels: labels
              .split(',')
              .map((l) => l.trim())
              .filter((l) => l),
          },
        },
      });
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleDelete = () => {
    if (!canDelete) {
      alert('You do not have permission to delete this card');
      return;
    }
    onDelete();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Edit Card</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Permission Notice */}
          {!canEdit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
              ⚠️ You can only view this card. Only the board owner or admins can edit.
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={!canEdit || loading}
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
              rows={4}
              disabled={!canEdit || loading}
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!canEdit || loading}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!canEdit || loading}
            />
          </div>

          {/* Labels */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Labels (comma-separated)
            </label>
            <input
              type="text"
              value={labels}
              onChange={(e) => setLabels(e.target.value)}
              placeholder="bug, feature, urgent"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!canEdit || loading}
            />
          </div>

          {/* Assignees */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assigned To
            </label>
            <div className="space-y-2">
              {card.assignees.length === 0 ? (
                <p className="text-sm text-gray-500">No one assigned yet</p>
              ) : (
                card.assignees.map((assignee) => (
                  <div
                    key={assignee.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
                        {assignee.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm text-gray-900">{assignee.name}</span>
                    </div>
                    {canEdit && (
                      <button
                        type="button"
                        onClick={() => onUnassign(assignee.id)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Unassign
                      </button>
                    )}
                  </div>
                ))
              )}

              {canEdit && (
                <div className="mt-2">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        onAssign(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">+ Assign member...</option>
                    {boardMembers
                      .filter(
                        (member) =>
                          !card.assignees.some((assignee) => assignee.id === member.id)
                      )
                      .map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t border-gray-200">
            <div>
              {canDelete && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  Delete Card
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
              {canEdit && (
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
