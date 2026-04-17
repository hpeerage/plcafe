import { create } from 'zustand';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  options: string;
}

interface AppState {
  points: number;
  nickname: string;
  cart: OrderItem[];
  currentFloor: string;
  activeOrderId: string | null;
  rechargePoints: (amount: number) => void;
  deductPoints: (amount: number) => boolean;
  setNickname: (name: string) => void;
  setFloor: (floor: string) => void;
  addToCart: (item: any) => void;
  clearCart: () => void;
  setActiveOrderId: (id: string | null) => void;
}

export const useStore = create<AppState>((set, get) => ({
  points: 50000, // 초기 테스트용 잔액 (5만 원)
  nickname: '',
  cart: [],
  currentFloor: 'B1F', // 기본 위치
  activeOrderId: null, // 진행 중인 주문 ID
  
  rechargePoints: (amount) => set((state) => ({ points: state.points + amount })),
  
  deductPoints: (amount) => {
    const { points } = get();
    if (points >= amount) {
      set({ points: points - amount });
      return true;
    }
    return false;
  },

  setNickname: (name) => set({ nickname: name }),
  
  setFloor: (floor) => set({ currentFloor: floor }),

  addToCart: (item) => set((state) => {
    const existing = state.cart.find(i => i.id === item.id);
    if (existing) {
      return {
        cart: state.cart.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
      };
    }
    return { cart: [...state.cart, { ...item, qty: 1, options: '' }] };
  }),

  clearCart: () => set({ cart: [] }),

  setActiveOrderId: (id) => set({ activeOrderId: id }),

  rechargePoints: (amount) => set((state) => ({ points: state.points + amount })),
}));
