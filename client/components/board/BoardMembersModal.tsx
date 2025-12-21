'use client';

import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  ADD_BOARD_MEMBER_MUTATION,
  REMOVE_BOARD_MEMBER_MUTATION,
  ADD_BOARD_ADMIN_MUTATION,
  REMOVE_BOARD_ADMIN_MUTATION,
} from '@/lib/graphql/mutations';
import { USERS_QUERY } from '@/lib/graphql/queries';
import { Board, User } from '@/types';

interface BoardMembersModalProps {
  board: Board;
  currentUser: User;
  onClose: () => void;
  refetch: () => void;
}

export function BoardMembersModal({
  board,
  currentUser,
  onClose,
  refetch,
}: BoardMembersModalProps) {
  const [selectedUserId, setSelectedUserId] = useState('');
  const { data: usersData } = useQuery(USERS_QUERY);

  const [addMember] = useMutation(ADD_BOARD_MEMBER_MUTATION, {
    onCompleted: () => {
      setSelectedUserId('');
      refetch();
    },
  });

  const [removeMember] = useMutation(REMOVE_BOARD_MEMBER_MUTATION, {
    onCompleted: () => refetch(),
  });

  const [addAdmin] = useMutation(ADD_BOARD_ADMIN_MUTATION, {
    onCompleted: () => refetch(),
  });

  const [removeAdmin] = useMutation(REMOVE_BOARD_ADMIN_MUTATION, {
    onCompleted: () => refetch(),
  });

  const isAdmin = board.admins.some((admin) => admin.id === currentUser.id);
  const isOwner = board.owner.id === currentUser.id;

  const handleAddMember = async () => {
    if (!selectedUserId) return;

    try {
      await addMember({
        variables: {
          boardId: board.id,
          userId: selectedUserId,
        },
      });
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (confirm('Are you sure you want to remove this member?')) {
      try {
        await removeMember({
          variables: {
            boardId: board.id,
            userId,
          },
        });
      } catch (error: any) {
        alert(error.message);
      }
    }
  };

  const handleToggleAdmin = async (userId: string, isCurrentlyAdmin: boolean) => {
    try {
      if (isCurrentlyAdmin) {
        await removeAdmin({
          variables: {
            boardId: board.id,
            userId,
          },
        });
      } else {
        await addAdmin({
          variables: {
            boardId: board.id,
            userId,
          },
        });
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const availableUsers =
    usersData?.users.filter(
      (user: User) => !board.members.some((member) => member.id === user.id)
    ) || [];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Board Members</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {/* Add Member Section */}
          {isAdmin && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Add Member</h3>
              <div className="flex gap-2">
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a user...</option>
                  {availableUsers.map((user: User) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddMember}
                  disabled={!selectedUserId}
                  className="btn btn-primary px-4 py-2 disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {/* Members List */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              Members ({board.members.length})
            </h3>
            <div className="space-y-2">
              {board.members.map((member) => {
                const memberIsAdmin = board.admins.some((admin) => admin.id === member.id);
                const memberIsOwner = board.owner.id === member.id;

                return (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {member.name}
                          {memberIsOwner && (
                            <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                              Owner
                            </span>
                          )}
                          {memberIsAdmin && !memberIsOwner && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              Admin
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-600">{member.email}</p>
                      </div>
                    </div>

                    {isAdmin && !memberIsOwner && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleAdmin(member.id, memberIsAdmin)}
                          className="text-sm px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                        >
                          {memberIsAdmin ? 'Remove Admin' : 'Make Admin'}
                        </button>
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-sm px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button onClick={onClose} className="btn btn-secondary px-6 py-2">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
