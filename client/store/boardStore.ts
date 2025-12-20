import { create } from 'zustand';
import { Board, Card } from '@/types';

interface BoardState {
  selectedBoard: Board | null;
  selectedCard: Card | null;
  isCardModalOpen: boolean;
  setSelectedBoard: (board: Board | null) => void;
  setSelectedCard: (card: Card | null) => void;
  openCardModal: (card: Card) => void;
  closeCardModal: () => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  selectedBoard: null,
  selectedCard: null,
  isCardModalOpen: false,

  setSelectedBoard: (board) => set({ selectedBoard: board }),

  setSelectedCard: (card) => set({ selectedCard: card }),

  openCardModal: (card) => set({ selectedCard: card, isCardModalOpen: true }),

  closeCardModal: () => set({ selectedCard: null, isCardModalOpen: false }),
}));
