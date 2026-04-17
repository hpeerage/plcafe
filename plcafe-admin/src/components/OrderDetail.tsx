'use client';

import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot, updateDoc, Timestamp } from 'firebase/firestore';

interface OrderItem {
  id: string;
  name: string;
  qty: number;
  options: string;
}

interface Order {
  id: string;
  nickname: string;
  status: 'new' | 'making' | 'waiting' | 'ready' | 'completed';
  items: OrderItem[];
  totalPrice: number;
  packaging: string;
  floor: string;
}

export default function OrderDetail({ orderId }: { orderId: string | null }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setOrder(null);
      return;
    }

    setLoading(true);
    const unsub = onSnapshot(doc(db, 'orders', orderId), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setOrder({
          id: doc.id,
          nickname: data.nickname || '익명',
          status: data.status || 'new',
          items: data.items || [],
          totalPrice: data.totalPrice || 0,
          packaging: data.packaging || '매장 컵',
          floor: data.floor || '알 수 없음'
        } as Order);
      }
      setLoading(false);
    });

    return () => unsub();
  }, [orderId]);

  const updateStatus = async (newStatus: string) => {
    if (!orderId) return;
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Status update failed:', error);
      alert('상태 업데이트에 실패했습니다.');
    }
  };

  if (!orderId) {
    return (
      <div className="flex-1 bg-brand-bg/30 h-[calc(100vh-6rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-64 h-64 mx-auto mb-10 opacity-20 rounded-full overflow-hidden border-8 border-brand-primary/10">
            <img src="/mascot.jpg" alt="Logo" className="w-full h-full object-cover grayscale" />
          </div>
          <p className="text-3xl font-black text-brand-primary/20 uppercase tracking-widest">주문을 선택해 주세요</p>
        </div>
      </div>
    );
  }

  if (loading || !order) {
    return (
      <div className="flex-1 bg-brand-bg/30 h-[calc(100vh-6rem)] flex items-center justify-center">
        <p className="text-brand-primary/40 font-bold">주문 상세 내용을 불러오는 중...</p>
      </div>
    );
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return '신규 주문';
      case 'making': return '제조 중';
      case 'ready': return '수령 대기';
      case 'completed': return '완료됨';
      default: return status;
    }
  };

  return (
    <div className="flex-1 bg-brand-bg/30 h-[calc(100vh-6rem)] overflow-y-auto">
      <div className="p-16 max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-16 border-b-4 border-brand-primary/5 pb-12">
          <div className="flex items-center gap-8">
            <div className="bg-white p-6 rounded-4xl shadow-sm border border-brand-primary/5">
              <p className="text-xs font-black text-center mb-2 text-brand-primary/30 tracking-widest uppercase">Order Source</p>
              <div className="w-28 h-28 bg-brand-primary/5 rounded-2xl flex items-center justify-center text-3xl font-black text-brand-primary">
                {order.floor}
              </div>
            </div>
            <div>
              <p className="text-xl font-bold text-brand-primary/30 uppercase tracking-[0.2em] mb-3">Order #{order.id.slice(-4).toUpperCase()}</p>
              <h2 className="text-8xl font-black text-brand-primary tracking-tighter">{order.nickname} <span className="text-3xl font-bold text-brand-primary/40 ml-2">님이 주문함</span></h2>
            </div>
          </div>
          <div className={`px-10 py-4 rounded-4xl text-2xl font-black border-2 shadow-sm ${
            order.status === 'new' ? 'bg-red-600/10 text-red-600 border-red-600/20' :
            order.status === 'making' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
            'bg-brand-primary/10 text-brand-primary border-brand-primary/20'
          }`}>
            {getStatusLabel(order.status)}
          </div>
        </div>

        <div className="space-y-8">
          {order.items.map((item, idx) => (
            <div key={idx} className="bg-white p-10 rounded-5xl border-2 border-brand-primary/5 shadow-sm flex justify-between items-center transition-all hover:shadow-md">
              <div>
                <h3 className="text-4xl font-black text-brand-primary mb-3">{item.name}</h3>
                <p className="text-xl font-bold text-brand-primary/40">옵션: {item.options || '기본'}</p>
              </div>
              <div className="bg-brand-primary/5 px-8 py-5 rounded-3xl">
                <p className="text-4xl font-black text-brand-primary">x {item.qty || 1}</p>
              </div>
            </div>
          ))}

          <div className="bg-brand-primary/5 p-10 rounded-5xl border-2 border-dashed border-brand-primary/10 mt-12">
            <p className="text-lg font-black text-brand-primary/40 uppercase tracking-widest mb-4">포장 옵션</p>
            <p className="text-4xl font-black text-brand-primary">{order.packaging}</p>
          </div>
        </div>

        <div className="flex gap-6 mt-20">
          {order.status === 'new' && (
            <button 
              onClick={() => updateStatus('making')}
              className="flex-1 bg-brand-primary hover:opacity-90 py-8 rounded-4xl text-3xl font-black text-white shadow-xl shadow-brand-primary/20 transition-all active:scale-95"
            >
              제조 시작
            </button>
          )}
          {(order.status === 'making' || order.status === 'ready') && (
            <button 
              onClick={() => updateStatus('new')}
              className="flex-1 bg-zinc-200 hover:bg-zinc-300 py-8 rounded-4xl text-3xl font-black text-brand-primary transition-all active:scale-95"
            >
              상태 되돌리기
            </button>
          )}
          <button className="flex-[0.6] bg-white hover:bg-zinc-50 py-8 rounded-4xl text-3xl font-black text-brand-primary border-4 border-brand-primary/5 transition-all active:scale-95">
            주문 취소
          </button>
        </div>

        {order.status !== 'completed' && (
          <button 
            onClick={() => updateStatus(order.status === 'making' ? 'ready' : 'completed')}
            className="w-full mt-6 bg-brand-primary/5 hover:bg-brand-primary/10 py-10 rounded-5xl text-4xl font-black text-brand-primary border-4 border-brand-primary/10 flex items-center justify-center gap-4 transition-all active:scale-95 mb-20"
          >
            <span className="text-5xl">{order.status === 'making' ? '🔔' : '✅'}</span> 
            {order.status === 'making' ? '제조 완료 및 호출' : '수령 완료 처리'}
          </button>
        )}
      </div>
    </div>
  );
}
