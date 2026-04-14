import { create } from 'zustand';

interface AppState {
  points: number;
  addPoints: (amount: number) => void;
  // 추가 상태 정의 예정
}

export const useStore = create<AppState>((set) => ({
  points: 0,
  addPoints: (amount) => set((state) => ({ points: state.points + amount })),
}));
