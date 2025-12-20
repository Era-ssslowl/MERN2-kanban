'use client';

import { useQuery, useMutation } from '@apollo/client';
import { USERS_QUERY } from '@/lib/graphql/queries';
import { UPDATE_USER_ROLE_MUTATION } from '@/lib/graphql/mutations';
import { useAuthStore } from '@/store/authStore';
import { AdminBadge } from '@/components/ui/AdminBadge';
import { User } from '@/types';
import { format } from 'date-fns';

export function UserManagementPanel() {
  const { user: currentUser } = useAuthStore();
  const { data, loading, refetch } = useQuery(USERS_QUERY);
  const [updateUserRole, { loading: updating }] = useMutation(UPDATE_USER_ROLE_MUTATION);

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (userId === currentUser?.id && newRole === 'user') {
      alert('You cannot demote yourself!');
      return;
    }

    try {
      await updateUserRole({
        variables: { userId, role: newRole },
      });
      refetch();
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const users: User[] = data?.users || [];

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
        <p className="text-sm text-gray-600 mt-1">
          Manage user roles and permissions
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-700 font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                        <AdminBadge isAdmin={user.role === 'admin'} />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(user.createdAt), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {user.role === 'admin' ? (
                    <button
                      onClick={() => handleRoleChange(user.id, 'user')}
                      disabled={updating || user.id === currentUser?.id}
                      className={`text-red-600 hover:text-red-900 ${
                        user.id === currentUser?.id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      Demote to User
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRoleChange(user.id, 'admin')}
                      disabled={updating}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      Promote to Admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No users found</p>
        </div>
      )}
    </div>
  );
}
