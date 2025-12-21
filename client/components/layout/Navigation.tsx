'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { SearchBar } from '@/components/search/SearchBar';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/boards" className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-primary-600">📋</div>
              <span className="text-xl font-bold text-gray-900">TaskFlow</span>
            </Link>
          </div>

          {/* Search Bar - Center */}
          <div className="flex-1 max-w-2xl mx-8">
            <SearchBar />
          </div>

          {/* Right Side - Navigation Links & User Menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <NotificationCenter />

            {/* Navigation Links */}
            <Link
              href="/boards"
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('/boards')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Boards
            </Link>

            <Link
              href="/chat"
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('/chat')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Chat
            </Link>

            {user?.role === 'admin' && (
              <Link
                href="/admin"
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  isActive('/admin')
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Admin
              </Link>
            )}

            {/* User Menu Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition">
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-primary-700 font-medium">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="hidden md:block">{user?.name}</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                  >
                    Profile
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <div className="border-t border-gray-200 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
