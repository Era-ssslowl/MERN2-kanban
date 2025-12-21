'use client';

import { useState } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
import { useAuthStore } from '@/store/authStore';

const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      name
      avatar
      bio
      role
      createdAt
    }
  }
`;

const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      name
      avatar
      bio
    }
  }
`;

const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input)
  }
`;

export function UserProfile() {
  const { user, updateUser } = useAuthStore();
  const { data, refetch } = useQuery(ME_QUERY);
  const [updateProfile, { loading: updating }] = useMutation(UPDATE_PROFILE_MUTATION);
  const [changePassword, { loading: changingPassword }] = useMutation(CHANGE_PASSWORD_MUTATION);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    name: data?.me?.name || '',
    bio: data?.me?.bio || '',
    avatar: data?.me?.avatar || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await updateProfile({
        variables: { input: profileData },
      });

      if (result.data) {
        updateUser(result.data.updateProfile);
        setIsEditingProfile(false);
        refetch();
        alert('Profile updated successfully!');
      }
    } catch (error: any) {
      alert('Error updating profile: ' + error.message);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    try {
      await changePassword({
        variables: {
          input: {
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          },
        },
      });

      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setIsChangingPassword(false);
      alert('Password changed successfully!');
    } catch (error: any) {
      alert('Error changing password: ' + error.message);
    }
  };

  const currentUser = data?.me || user;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-primary-500 to-primary-600">
          <h2 className="text-2xl font-bold text-white">User Profile</h2>
        </div>

        {/* Profile Information Section */}
        <div className="p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center">
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-primary-700 text-3xl font-bold">
                    {currentUser?.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">{currentUser?.name}</h3>
                <p className="text-gray-600">{currentUser?.email}</p>
                <span
                  className={`inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full ${
                    currentUser?.role === 'admin'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {currentUser?.role}
                </span>
              </div>
            </div>
            {!isEditingProfile && (
              <button
                onClick={() => {
                  setProfileData({
                    name: currentUser?.name || '',
                    bio: currentUser?.bio || '',
                    avatar: currentUser?.avatar || '',
                  });
                  setIsEditingProfile(true);
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Edit Profile Form */}
          {isEditingProfile ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4 border-t pt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {profileData.bio.length}/500 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Avatar URL
                </label>
                <input
                  type="url"
                  value={profileData.avatar}
                  onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 transition"
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Bio</h4>
              <p className="text-gray-600">{currentUser?.bio || 'No bio provided'}</p>
            </div>
          )}

          {/* Change Password Section */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Security</h4>
              {!isChangingPassword && (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                >
                  Change Password
                </button>
              )}
            </div>

            {isChangingPassword && (
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, currentPassword: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                    minLength={6}
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 transition"
                  >
                    {changingPassword ? 'Changing...' : 'Change Password'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
