import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  chatUsers: User[];
  adminList: string[]; // List of admin user IDs
  tasks: Task[];
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  addChatUser: (user: User) => void;
  addAdmin: (userId: string) => void;
  removeAdmin: (userId: string) => void;
  addTask: (task: Task) => void;
  editTask: (taskId: string, updatedTask: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  getTaskStats: () => { total: number; completed: number; pending: number };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      chatUsers: [],
      adminList: [],
      tasks: [],

      setAuth: (user, token) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
        }
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateUser: (user: Partial<User>) => {
        set((state) => ({ user: { ...state.user, ...user } as User }));
      },

      addChatUser: (user) => {
        set((state) => ({ chatUsers: [...state.chatUsers, user] }));
      },

      addAdmin: (userId) => {
        set((state) => {
          if (!state.adminList.includes(userId)) {
            return { adminList: [...state.adminList, userId] };
          }
          return state;
        });
      },

      removeAdmin: (userId) => {
        set((state) => ({
          adminList: state.adminList.filter((id) => id !== userId),
        }));
      },

      addTask: (task) => {
        const { user, adminList } = get();
        if (user && adminList.includes(user.id)) {
          set((state) => ({ tasks: [...state.tasks, task] }));
        } else {
          console.error('Only admins can add tasks.');
        }
      },

      editTask: (taskId, updatedTask) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, ...updatedTask } : task
          ),
        }));
      },

      deleteTask: (taskId) => {
        const { user, adminList } = get();
        if (user && adminList.includes(user.id)) {
          set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== taskId),
          }));
        } else {
          console.error('Only admins can delete tasks.');
        }
      },

      getTaskStats: () => {
        const { tasks } = get();
        const total = tasks.length;
        const completed = tasks.filter((task) => task.completed).length;
        const pending = total - completed;
        return { total, completed, pending };
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);