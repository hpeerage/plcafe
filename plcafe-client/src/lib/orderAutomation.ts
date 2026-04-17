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
    'B4F': -4, 'B3F': -3, 'B2F': -2, 'B1F': -1, '1F': 0, '2F': 1, '3F': 2
  };
  
  const targetFloorIndex = 1; // 2F is the target
  const currentFloorIndex = floorMap[floor] ?? 0;
  const distance = Math.abs(currentFloorIndex - targetFloorIndex); // Distance to 2F (Cafe)
  
  const baseTimePerFloor = 0.5; // 0.5 min per floor
  const trafficMultiplier = 1 + (pendingCount / 5); 
  
  return distance * baseTimePerFloor * trafficMultiplier;
};
