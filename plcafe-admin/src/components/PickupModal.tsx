'use client';

import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc, Timestamp, orderBy, limit } from 'firebase/firestore';

export default function PickupModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 수령 대기 중인 최근 주문 5개를 기본으로 보여줌
  useEffect(() => {
    if (isOpen) {
      fetchRecentReadyOrders();
    }
  }, [isOpen]);

  const fetchRecentReadyOrders = async () => {
    setLoading(true);
    const q = query(
      collection(db, 'orders'),
      where('status', '==', 'ready'),
      orderBy('updatedAt', 'desc'),
      limit(5)
    );
    const snap = await getDocs(q);
    setResults(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchRecentReadyOrders();
      return;
    }
    setLoading(true);
    // 닉네임 또는 ID 뒷자리 검색 (Firestore 쿼리 제약상 닉네임 일치 검색 우선)
    const q = query(
      collection(db, 'orders'),
      where('nickname', '==', searchQuery.trim()),
      where('status', '==', 'ready')
    );
    const snap = await getDocs(q);
    setResults(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  const completePickup = async (orderId: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: 'completed',
        updatedAt: Timestamp.now()
      });
      playSuccessSound();
      setResults(results.filter(r => r.id !== orderId));
      if (results.length <= 1) onClose();
    } catch (e) {
      console.error(e);
      alert('수령 처리 실패');
    }
  };

  const playSuccessSound = () => {
    try {
      const audio = new Audio('/sounds/pickup_success.mp3');
      audio.play();
    } catch (e) {
      console.warn('Audio play failed');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-brand-primary/20 backdrop-blur-xl">
      <div className="bg-white w-full max-w-4xl rounded-5xl shadow-2xl overflow-hidden border border-brand-primary/10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-10 border-b border-brand-primary/5 flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-black text-brand-primary tracking-tighter">수령 확인 (Manual Scan)</h2>
            <p className="text-brand-primary/40 font-bold mt-1 uppercase tracking-widest text-sm">Verify Order for Pickup</p>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-brand-primary/5 rounded-2xl text-4xl">✕</button>
        </div>

        {/* Search Bar */}
        <div className="p-10 bg-brand-bg/30">
          <div className="flex gap-4">
            <input 
              type="text"
              placeholder="닉네임을 입력하세요..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 bg-white p-6 rounded-3xl text-2xl font-black text-brand-primary border-4 border-brand-primary/5 focus:border-brand-primary outline-none transition-all"
            />
            <button 
              onClick={handleSearch}
              className="bg-brand-primary px-10 rounded-3xl text-white text-xl font-black active:scale-95 transition-all"
            >
              검색
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="p-10 min-h-[400px] max-h-[600px] overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-brand-primary/20 font-black">
              <div className="w-24 h-24 mb-6 rounded-full overflow-hidden border-4 border-brand-primary/10 animate-pulse">
                <img src="/mascot.jpg" alt="Loading" className="w-full h-full object-cover grayscale" />
              </div>
              <p className="tracking-widest capitalize">Searching for Orders...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              {results.map((order) => (
                <div key={order.id} className="bg-brand-bg/50 p-8 rounded-4xl border border-brand-primary/5 flex justify-between items-center transition-all hover:border-brand-primary/20">
                  <div className="flex items-center gap-8">
                    <div className="bg-brand-primary p-4 rounded-2xl text-white font-black text-xl">
                      #{order.id.slice(-3).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-3xl font-black text-brand-primary">{order.nickname}</p>
                      <p className="text-brand-primary/40 font-bold text-sm tracking-widest uppercase">
                        {order.items.length} Items · {order.packaging}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => completePickup(order.id)}
                    className="bg-brand-primary/10 hover:bg-brand-primary text-brand-primary hover:text-white px-10 py-5 rounded-3xl text-xl font-black transition-all active:scale-95"
                  >
                    수령 완료 처리
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-32 h-32 mx-auto mb-6 opacity-10 rounded-full overflow-hidden border-4 border-brand-primary/10">
                <img src="/mascot.jpg" alt="No Data" className="w-full h-full object-cover grayscale" />
              </div>
              <p className="text-2xl font-black text-brand-primary/20 uppercase tracking-widest">수령 대기 중인 주문이 없습니다</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
