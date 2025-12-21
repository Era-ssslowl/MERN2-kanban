'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/boards');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="text-6xl">📋</div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            TaskFlow
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Современная платформа для управления проектами и задачами
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition shadow-lg"
            >
              Начать работу
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 bg-white text-primary-600 rounded-lg font-medium hover:bg-gray-50 transition border-2 border-primary-600"
            >
              Войти
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Feature 1 */}
          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Глобальный поиск</h3>
            <p className="text-gray-600">
              Быстрый поиск по доскам и карточкам с мгновенными результатами
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition">
            <div className="text-4xl mb-4">🔔</div>
            <h3 className="text-xl font-semibold mb-2">Уведомления</h3>
            <p className="text-gray-600">
              Получайте уведомления о комментариях, назначениях и обновлениях в реальном времени
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-xl font-semibold mb-2">Профиль пользователя</h3>
            <p className="text-gray-600">
              Управляйте своим профилем, меняйте пароль и настраивайте аватар
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Аналитика</h3>
            <p className="text-gray-600">
              Подробная аналитика для администраторов с метриками активности
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">Журнал действий</h3>
            <p className="text-gray-600">
              Отслеживайте все действия пользователей в системе
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-2">Командный чат</h3>
            <p className="text-gray-600">
              Общайтесь с командой прямо в приложении
            </p>
          </div>
        </div>

        {/* Admin Features */}
        <div className="bg-gradient-to-r from-purple-600 to-primary-600 rounded-2xl p-8 text-white mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Возможности для администраторов</h2>
            <p className="text-lg mb-6 text-white/90">
              Полный контроль над системой с мощными инструментами управления
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div>
                <div className="text-2xl mb-2">📈</div>
                <h4 className="font-semibold mb-1">Аналитика</h4>
                <p className="text-sm text-white/80">Статистика пользователей, досок и активности</p>
              </div>
              <div>
                <div className="text-2xl mb-2">👥</div>
                <h4 className="font-semibold mb-1">Управление пользователями</h4>
                <p className="text-sm text-white/80">Назначайте роли и управляйте доступом</p>
              </div>
              <div>
                <div className="text-2xl mb-2">📋</div>
                <h4 className="font-semibold mb-1">Журнал активности</h4>
                <p className="text-sm text-white/80">Отслеживайте все действия в системе</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Готовы начать?</h2>
          <p className="text-gray-600 mb-6">
            Присоединяйтесь к тысячам команд, которые уже используют TaskFlow
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition shadow-lg text-lg"
          >
            Создать аккаунт бесплатно
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 TaskFlow. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
}
