import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';

export default function ControlBar({ 
  activeTab, 
  setActiveTab,
  onOpenPickup
}: { 
  activeTab: 'orders' | 'menus' | 'settings'; 
  setActiveTab: (tab: 'orders' | 'menus' | 'settings') => void; 
  onOpenPickup: () => void;
}) {
  const [isPeakMode, setIsPeakMode] = useState(false);
  const [slotInfo, setSlotInfo] = useState({ count: 0, max: 15 });

  useEffect(() => {
    let unsubSlot: (() => void) | undefined;

    // 1. 전역 설정 구독 (피크 모드 및 최대 쿼터)
    const unsubSettings = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setIsPeakMode(data.peakMode || false);
        const max = data.peakMode ? (data.peakMaxQuota || 10) : (data.maxQuota || 15);
        
        // 2. 현재 슬롯 정보 구독 (설정이 로드된 후)
        const slotMinutes = data.slotMinutes || 10;
        const now = new Date();
        const kstOffset = 9 * 60 * 60 * 1000;
        const kstDate = new Date(now.getTime() + kstOffset);
        const slotIndex = Math.floor(kstDate.getUTCMinutes() / slotMinutes) * slotMinutes;
        const slotId = `${kstDate.getUTCFullYear()}${String(kstDate.getUTCMonth() + 1).padStart(2, '0')}${String(kstDate.getUTCDate()).padStart(2, '0')}${String(kstDate.getUTCHours()).padStart(2, '0')}${String(slotIndex).padStart(2, '0')}`;

        // 이전 슬롯 구독 해제 후 새 슬롯 구독
        if (unsubSlot) unsubSlot();
        
        unsubSlot = onSnapshot(doc(db, 'slots', slotId), (slotDoc) => {
          setSlotInfo({
            count: slotDoc.exists() ? slotDoc.data().count : 0,
            max: max
          });
        });
      }
    });

    return () => {
      unsubSettings();
      if (unsubSlot) unsubSlot();
    };
  }, []);

  const togglePeakMode = async () => {
    try {
      await updateDoc(doc(db, 'settings', 'global'), {
        peakMode: !isPeakMode
      });
    } catch (error) {
      console.error('Failed to toggle peak mode:', error);
    }
  };

  return (
    <div className="h-28 bg-brand-bg text-brand-primary flex items-center justify-between px-12 border-b border-brand-primary/10 sticky top-0 z-50">
      <div className="flex items-center gap-10">
        <h1 className="text-4xl font-black tracking-tighter text-brand-primary">PL-CAFE <span className="text-brand-accent">ADMIN</span></h1>
        
        <div className="flex bg-brand-primary/5 p-1.5 rounded-3xl border border-brand-primary/10">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-8 py-3 rounded-2xl text-lg font-black transition-all ${activeTab === 'orders' ? 'bg-brand-primary text-white shadow-md' : 'text-brand-primary/40 hover:text-brand-primary'}`}
          >
            ORDER
          </button>
          <button 
            onClick={() => setActiveTab('menus')}
            className={`px-8 py-3 rounded-2xl text-lg font-black transition-all ${activeTab === 'menus' ? 'bg-brand-primary text-white shadow-md' : 'text-brand-primary/40 hover:text-brand-primary'}`}
          >
            MENU
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-8 py-3 rounded-2xl text-lg font-black transition-all ${activeTab === 'settings' ? 'bg-brand-primary text-white shadow-md' : 'text-brand-primary/40 hover:text-brand-primary'}`}
          >
            SETTINGS
          </button>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={togglePeakMode}
            className={`${isPeakMode ? 'bg-red-600' : 'bg-brand-primary'} hover:opacity-90 px-8 py-3 rounded-3xl text-sm font-black transition-all text-white shadow-lg active:scale-95`}
          >
            {isPeakMode ? '⚡ PEAK ON' : '⚡ PEAK OFF'}
          </button>
          <button 
            onClick={onOpenPickup}
            className="bg-brand-accent hover:opacity-90 px-8 py-3 rounded-3xl text-sm font-black transition-all text-white shadow-lg shadow-brand-accent/20 active:scale-95"
          >
            ✅ PICKUP
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-8">
        <div className="text-right">
          <p className="text-brand-primary/40 text-sm uppercase font-black tracking-widest mb-1">Current Slot Capacity</p>
          <p className={`text-4xl font-black ${slotInfo.count >= slotInfo.max ? 'text-red-600 animate-pulse' : 'text-brand-primary'}`}>
            {slotInfo.count} / {slotInfo.max}
          </p>
        </div>
        <div className="w-16 h-16 bg-brand-primary rounded-full overflow-hidden flex items-center justify-center shadow-md border-2 border-brand-primary/10">
          <img src="/mascot.jpg" alt="Mascot" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
}
