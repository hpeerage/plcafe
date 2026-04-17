import { db } from './firebase';
import { doc, runTransaction, serverTimestamp, collection, getDoc } from 'firebase/firestore';

export const checkQuotaAndPlaceOrder = async (orderData: any) => {
  // 1. 전역 설정 가져오기
  const settingsRef = doc(db, 'settings', 'global');
  const settingsSnap = await getDoc(settingsRef);
  
  const settings = settingsSnap.exists() ? settingsSnap.data() : {
    slotMinutes: 10,
    maxQuota: 15,
    peakMaxQuota: 10,
    peakMode: false
  };

  const slotMinutes = settings.slotMinutes || 10;
  const isPeak = settings.peakMode || false;
  const currentMaxQuota = isPeak ? (settings.peakMaxQuota || 10) : (settings.maxQuota || 15);

  // 2. KST 기준 슬롯 아이디 생성
  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(now.getTime() + kstOffset);
  
  const slotIndex = Math.floor(kstDate.getUTCMinutes() / slotMinutes) * slotMinutes;
  const slotId = `${kstDate.getUTCFullYear()}${String(kstDate.getUTCMonth() + 1).padStart(2, '0')}${String(kstDate.getUTCDate()).padStart(2, '0')}${String(kstDate.getUTCHours()).padStart(2, '0')}${String(slotIndex).padStart(2, '0')}`;
  
  const slotRef = doc(db, 'slots', slotId);
  const orderRef = doc(collection(db, 'orders'));
  
  try {
    const result = await runTransaction(db, async (transaction) => {
      const slotDoc = await transaction.get(slotRef);
      let count = 0;
      
      if (slotDoc.exists()) {
        count = slotDoc.data().count;
      }
      
      if (count >= currentMaxQuota) {
        throw new Error('QUOTA_EXCEEDED');
      }
      
      // Update Slot
      transaction.set(slotRef, { 
        count: count + 1,
        lastUpdated: serverTimestamp()
      }, { merge: true });
      
      // Place Order
      transaction.set(orderRef, {
        ...orderData,
        slotId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'new'
      });

      return orderRef.id;
    });
    
    return { success: true, orderId: result };
  } catch (error: any) {
    console.error('Order fail:', error);
    return { success: false, error: error.message };
  }
};
