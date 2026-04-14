import { db } from './firebase';
import { collection, query, where, onSnapshot, getCountFromServer, addDoc, serverTimestamp } from 'firebase/firestore';

export const triggerOrderNotification = async (nickname: string, currentFloor: string, pendingCount: number) => {
  try {
    await addDoc(collection(db, 'alerts'), {
      type: 'ORDER_START_RECOMMENDED',
      message: `${nickname}님이 ${currentFloor}에서 접근 중입니다. 제조 시작을 권장합니다.`,
      pendingOrders: pendingCount,
      timestamp: serverTimestamp(),
      read: false,
    });
  } catch (error) {
    console.error('Failed to trigger notification:', error);
  }
};

export const calculateEstimatedArrivalTime = (floor: string, pendingCount: number) => {
  const floorMap: Record<string, number> = {
    'B4': -4, 'B3': -3, 'B2': -2, 'B1': -1, '1F': 0, '2F': 1, '3F': 2, '4F': 3
  };
  
  const currentFloorIndex = floorMap[floor] || 0;
  const distance = Math.abs(currentFloorIndex); // Distance to 1F (Cafe)
  
  const baseTimePerFloor = 0.5; // 0.5 min per floor (assuming cafe is on 1F)
  const trafficMultiplier = 1 + (pendingCount / 5); // 0.2 min additional per pending order
  
  return distance * baseTimePerFloor * trafficMultiplier;
};
