'use client';

import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, where, Timestamp } from 'firebase/firestore';

interface Alert {
  id: string;
  message: string;
  type: string;
  timestamp: Timestamp;
  read: boolean;
}

export default function AlertToast() {
  const [activeAlert, setActiveAlert] = useState<Alert | null>(null);

  useEffect(() => {
    // 최근 1분 이내의 읽지 않은 알림만 감시
    const oneMinuteAgo = new Date(Date.now() - 60000);
    const q = query(
      collection(db, 'alerts'),
      where('timestamp', '>=', Timestamp.fromDate(oneMinuteAgo)),
      where('read', '==', false),
      orderBy('timestamp', 'desc'),
      limit(1)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Alert;
        
        // 새 알림이면 소리 재생 및 토스트 표시
        setActiveAlert(data);
        playNotifySound();

        // 5초 후 토스트 제거 (자동으로 '읽음' 처리는 하지 않고 시각적으로만 제거)
        setTimeout(() => {
          setActiveAlert(null);
        }, 5000);
      }
    });

    return unsub;
  }, []);

  const playNotifySound = () => {
    try {
      const audio = new Audio('/sounds/notify.mp3');
      audio.play();
    } catch (e) {
       // 브라우저 정책상 첫 상호작용 전에는 재생이 차단될 수 있음
      console.warn('Audio play blocked or failed');
    }
  };

  if (!activeAlert) return null;

  return (
    <div className="fixed top-32 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md animate-in fade-in slide-in-from-top-4">
      <div className="mx-6 bg-brand-accent p-6 rounded-4xl shadow-2xl border-4 border-white flex items-center gap-6">
        <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center text-3xl">
          ⚡
        </div>
        <div className="flex-1">
          <p className="text-white/60 text-xs font-black uppercase tracking-[0.2em] mb-1">Context Alert</p>
          <p className="text-white text-xl font-black leading-tight">
            {activeAlert.message}
          </p>
        </div>
      </div>
    </div>
  );
}
