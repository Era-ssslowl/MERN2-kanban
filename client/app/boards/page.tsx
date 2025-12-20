'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BOARDS_QUERY } from '@/lib/graphql/queries';
import { CREATE_BOARD_MUTATION } from '@/lib/graphql/mutations';
import { useAuthStore } from '@/store/authStore';
import { Board } from '@/types';
import { AdminBadge } from '@/components/ui/AdminBadge';

export default function BoardsPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newBoardDescription, setNewBoardDescription] = useState('');

  const { data, loading, refetch } = useQuery(BOARDS_QUERY);
  const [createBoard, { loading: creating }] = useMutation(CREATE_BOARD_MUTATION, {
    onCompleted: () => {
      setShowCreateModal(false);
      setNewBoardTitle('');
      setNewBoardDescription('');
      refetch();
    },
  });

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardTitle) return;

    await createBoard({
      variables: {
        input: {
          title: newBoardTitle,
          description: newBoardDescription,
        },
      },
    });
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const boards: Board[] = data?.boards || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">TaskFlow</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Welcome, {user?.name}
              <AdminBadge isAdmin={user?.role === 'admin'} />
            </span>
            <button onClick={handleLogout} className="btn btn-secondary text-sm">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">My Boards</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            + Create Board
          </button>
        </div>

        {boards.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No boards yet. Create your first board to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {boards.map((board) => (
              <Link
                key={board.id}
                href={`/board/${board.id}`}
                className="block p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                style={{ backgroundColor: board.backgroundColor }}
              >
                <h3 className="text-lg font-semibold text-white mb-2">{board.title}</h3>
                {board.description && (
                  <p className="text-sm text-white/80 line-clamp-2">{board.description}</p>
                )}
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs text-white/70">{board.members.length} members</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Create New Board</h3>
            <form onSubmit={handleCreateBoard} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Board Title *
                </label>
                <input
                  type="text"
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                  className="input"
                  placeholder="My Project"
                  autoFocus
                  disabled={creating}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={newBoardDescription}
                  onChange={(e) => setNewBoardDescription(e.target.value)}
                  className="input"
                  rows={3}
                  placeholder="Brief description of your board..."
                  disabled={creating}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-secondary"
                  disabled={creating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={creating || !newBoardTitle}
                >
                  {creating ? 'Creating...' : 'Create Board'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
