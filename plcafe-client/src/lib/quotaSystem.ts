import { db } from './firebase';
import { doc, runTransaction, serverTimestamp } from 'firebase/firestore';

export const checkQuotaAndPlaceOrder = async (orderData: any) => {
  const now = new Date();
  const slotMinutes = Math.floor(now.getMinutes() / 10) * 10;
  const slotId = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(slotMinutes).padStart(2, '0')}`;
  
  const slotRef = doc(db, 'slots', slotId);
  
  try {
    await runTransaction(db, async (transaction) => {
      const slotDoc = await transaction.get(slotRef);
      let count = 0;
      
      if (slotDoc.exists()) {
        count = slotDoc.data().count;
      }
      
      const MAX_QUOTA = 15;
      if (count >= MAX_QUOTA) {
        throw new Error('QUOTA_EXCEEDED');
      }
      
      // Update Slot
      transaction.set(slotRef, { 
        count: count + 1,
        lastUpdated: serverTimestamp()
      }, { merge: true });
      
      // Place Order
      const orderRef = doc(collection(db, 'orders'));
      transaction.set(orderRef, {
        ...orderData,
        slotId,
        timestamp: serverTimestamp(),
        status: 'new'
      });
    });
    return { success: true };
  } catch (error: any) {
    console.error('Order fail:', error);
    return { success: false, error: error.message };
  }
};
