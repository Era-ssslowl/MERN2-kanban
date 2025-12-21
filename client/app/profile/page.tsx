'use client';

import { UserProfile } from '@/components/user/UserProfile';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <UserProfile />
      </div>
    </ProtectedRoute>
  );
}
