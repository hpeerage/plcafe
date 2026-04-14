import { create } from 'zustand';

interface Order {
  id: string;
  nickname: string;
  items: any[];
  status: 'new' | 'making' | 'waiting' | 'completed';
  timestamp: any;
}

interface AppState {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  // 추가 상태 정의 예정
}

export const useStore = create<AppState>((set) => ({
  orders: [],
  setOrders: (orders) => set({ orders }),
}));
