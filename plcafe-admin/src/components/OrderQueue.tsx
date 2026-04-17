'use client';

import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';

interface Order {
  id: string;
  nickname: string;
  status: 'new' | 'making' | 'waiting' | 'ready' | 'completed';
  items: any[];
  totalPrice: number;
  timeLabel: string;
  createdAt: Timestamp;
}

export default function OrderQueue({ onSelect }: { onSelect: (id: string) => void }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orderData = snapshot.docs.map(doc => {
        const data = doc.data();
        const createdAt = data.createdAt as Timestamp;
        
        // 시간 표시 로직 (예: 2분 전)
        let timeLabel = '방금';
        if (createdAt) {
          const diff = Math.floor((Date.now() - createdAt.toDate().getTime()) / 1000 / 60);
          if (diff > 0) timeLabel = `${diff}분 전`;
        }

        return {
          id: doc.id,
          nickname: data.nickname || '익명',
          status: data.status || 'new',
          items: data.items || [],
          totalPrice: data.totalPrice || 0,
          timeLabel,
          createdAt
        } as Order;
      });
      
      setOrders(orderData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <aside className="w-[450px] bg-brand-bg/50 border-r border-brand-primary/10 px-6 py-8 h-[calc(100vh-6rem)] flex items-center justify-center">
        <p className="text-brand-primary/40 font-bold">주문 데이터를 불러오는 중...</p>
      </aside>
    );
  }

  return (
    <aside className="w-[450px] bg-brand-bg/50 border-r border-brand-primary/10 overflow-y-auto px-6 py-8 h-[calc(100vh-6rem)]">
      <div className="flex justify-between items-center mb-10 px-2">
        <h2 className="text-3xl font-black text-brand-primary">대기 목록 <span className="text-brand-primary/20">({orders.length})</span></h2>
      </div>
      
      <div className="flex flex-col gap-6">
        {orders.map((order) => (
          <div 
            key={order.id} 
            onClick={() => onSelect(order.id)}
            className={`p-8 rounded-4xl border-2 transition-all cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1 active:scale-95 ${
              order.status === 'making' 
                ? 'bg-brand-primary border-brand-primary text-white shadow-xl shadow-brand-primary/20' 
                : 'bg-white border-brand-primary/5 hover:border-brand-primary/10'
            }`}
          >
            <div className="flex justify-between items-start mb-6">
              <span className={`px-4 py-2 rounded-2xl text-lg font-black ${
                order.status === 'making' ? 'bg-white text-brand-primary' : 'bg-brand-primary/10 text-brand-primary'
              }`}>
                #{order.id.slice(-4).toUpperCase()}
              </span>
              <span className={`text-sm font-bold uppercase tracking-widest ${
                order.status === 'making' ? 'text-white/60' : 'text-brand-primary/40'
              }`}>
                {order.timeLabel}
              </span>
            </div>
            
            <h3 className={`text-4xl font-black mb-2 ${
              order.status === 'making' ? 'text-white' : 'text-brand-primary'
            }`}>
              {order.nickname}
            </h3>
            <p className={`text-xl font-bold ${
              order.status === 'making' ? 'text-white/80' : 'text-brand-primary/40'
            }`}>
              {order.items.length}개 메뉴
            </p>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-brand-primary/30 font-bold text-xl">대기 중인 주문이 없습니다.</p>
          </div>
        )}
      </div>
    </aside>
  );
}
