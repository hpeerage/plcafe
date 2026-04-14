import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';

export default function ControlBar() {
  const [isPeakMode, setIsPeakMode] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'global'), (doc) => {
      if (doc.exists()) {
        setIsPeakMode(doc.data().peakMode || false);
      }
    });
    return unsub;
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
        <div className="flex gap-4">
          <button 
            onClick={togglePeakMode}
            className={`${isPeakMode ? 'bg-red-600' : 'bg-brand-primary'} hover:opacity-90 px-10 py-4 rounded-4xl text-xl font-bold transition-all text-white shadow-lg active:scale-95`}
          >
            {isPeakMode ? '⚡ PEAK MODE ON' : '⚡ PEAK MODE OFF'}
          </button>
          <button className="bg-brand-primary/5 hover:bg-brand-primary/10 px-10 py-4 rounded-4xl text-xl font-bold transition-all text-brand-primary border border-brand-primary/20">
            전체 완료 (Batch)
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-8">
        <div className="text-right">
          <p className="text-brand-primary/40 text-sm uppercase font-black tracking-widest mb-1">Wait Time</p>
          <p className="text-4xl font-black text-brand-primary">12 MIN</p>
        </div>
        <div className="w-16 h-16 bg-brand-primary text-brand-bg rounded-4xl flex items-center justify-center text-3xl shadow-md">
          👤
        </div>
      </div>
    </div>
  );
}
