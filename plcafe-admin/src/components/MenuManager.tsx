'use client';

import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, doc, deleteDoc, getDocs, writeBatch } from 'firebase/firestore';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  fastTrack: boolean;
  complex: boolean;
  status: 'available' | 'soldout' | 'hidden';
}

export default function MenuManager() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', price: 3000, fastTrack: false, complex: false });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'menus'), (snapshot) => {
      const menuData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
      setMenus(menuData);
      setLoading(false);
    });
    return unsub;
  }, []);

  const initializeMenus = async () => {
    const initialMenus = [
      { name: '아메리카노', price: 2200, fastTrack: true, complex: false, status: 'available' },
      { name: '플-라떼', price: 3500, fastTrack: true, complex: false, status: 'available' },
      { name: '자몽 에이드', price: 3200, fastTrack: false, complex: true, status: 'available' },
      { name: '딸기 스무디', price: 4500, fastTrack: false, complex: true, status: 'available' },
    ];
    
    const batch = writeBatch(db);
    initialMenus.forEach(item => {
      const newDoc = doc(collection(db, 'menus'));
      batch.set(newDoc, item);
    });
    await batch.commit();
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'available' ? 'soldout' : 'available';
    await updateDoc(doc(db, 'menus', id), { status: nextStatus });
  };

  const hideMenu = async (id: string) => {
    await updateDoc(doc(db, 'menus', id), { status: 'hidden' });
  };

  const handleAddMenu = async () => {
    if (!newItem.name) return;
    await addDoc(collection(db, 'menus'), { ...newItem, status: 'available' });
    setNewItem({ name: '', price: 3000, fastTrack: false, complex: false });
    setShowAddForm(false);
  };

  if (loading) return <div className="p-20 text-center text-2xl font-black text-brand-primary/20">LOADING MENUS...</div>;

  return (
    <div className="flex-1 bg-brand-bg/30 p-12 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-sm font-bold text-brand-primary/30 uppercase tracking-[0.2em] mb-2">Inventory Control</p>
            <h2 className="text-6xl font-black text-brand-primary tracking-tighter">메뉴 관리</h2>
          </div>
          <div className="flex gap-4">
            {menus.length === 0 && (
              <button 
                onClick={initializeMenus}
                className="bg-brand-primary/5 hover:bg-brand-primary/10 border-2 border-brand-primary/10 px-8 py-4 rounded-3xl text-lg font-black"
              >
                데이터 초기화
              </button>
            )}
            <button 
              onClick={() => setShowAddForm(true)}
              className="bg-brand-primary hover:opacity-90 px-10 py-5 rounded-4xl text-xl font-black text-white shadow-xl shadow-brand-primary/20 transition-all active:scale-95"
            >
              + 신규 메뉴 추가
            </button>
          </div>
        </div>

        {/* Add Menu Form (Simple Inline or Modal-like) */}
        {showAddForm && (
          <div className="bg-white p-10 rounded-5xl border-4 border-brand-primary/5 shadow-2xl mb-12 animate-in fade-in slide-in-from-top-4">
            <h3 className="text-3xl font-black text-brand-primary mb-8">새 메뉴 정보 입력</h3>
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-brand-primary/40 uppercase">메뉴 이름</label>
                <input 
                  type="text" 
                  value={newItem.name}
                  onChange={e => setNewItem({...newItem, name: e.target.value})}
                  className="w-full bg-brand-primary/5 p-5 rounded-2xl text-2xl font-black focus:outline-brand-primary"
                  placeholder="예: 바닐라 라떼"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-brand-primary/40 uppercase">가격 (원)</label>
                <input 
                  type="number" 
                  value={newItem.price}
                  onChange={e => setNewItem({...newItem, price: parseInt(e.target.value)})}
                  className="w-full bg-brand-primary/5 p-5 rounded-2xl text-2xl font-black focus:outline-brand-primary"
                />
              </div>
            </div>
            <div className="flex gap-8 mb-8">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={newItem.fastTrack}
                  onChange={e => setNewItem({...newItem, fastTrack: e.target.checked})}
                  className="w-6 h-6 rounded-lg accent-brand-primary"
                />
                <span className="text-lg font-bold text-brand-primary">Fast Track (1분 픽업)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={newItem.complex}
                  onChange={e => setNewItem({...newItem, complex: e.target.checked})}
                  className="w-6 h-6 rounded-lg accent-brand-primary"
                />
                <span className="text-lg font-bold text-brand-primary">복합 메뉴 (피크타임 비활성)</span>
              </label>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={handleAddMenu}
                className="flex-1 bg-brand-primary py-6 rounded-3xl text-2xl font-black text-white"
              >
                등록하기
              </button>
              <button 
                onClick={() => setShowAddForm(false)}
                className="flex-[0.4] bg-zinc-100 py-6 rounded-3xl text-2xl font-black text-zinc-400"
              >
                취소
              </button>
            </div>
          </div>
        )}

        {/* Menu Grid */}
        <div className="grid grid-cols-2 gap-8">
          {menus.filter(m => m.status !== 'hidden').map((menu) => (
            <div 
              key={menu.id} 
              className={`bg-white p-10 rounded-5xl border-2 transition-all group ${
                menu.status === 'soldout' ? 'border-red-100 opacity-60' : 'border-brand-primary/5 hover:shadow-xl hover:-translate-y-1'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-4xl font-black text-brand-primary">{menu.name}</h3>
                    {menu.fastTrack && <span className="text-2xl">⚡</span>}
                  </div>
                  <p className="text-2xl font-bold text-brand-primary/40">{menu.price.toLocaleString()}원</p>
                </div>
                <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${
                  menu.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {menu.status === 'available' ? 'Available' : 'Sold Out'}
                </div>
              </div>

              <div className="flex gap-4 mt-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => toggleStatus(menu.id, menu.status)}
                  className={`flex-1 py-4 rounded-2xl text-lg font-black border-2 transition-all ${
                    menu.status === 'available' ? 'border-red-600 text-red-600 hover:bg-red-50' : 'border-green-600 text-green-600 hover:bg-green-50'
                  }`}
                >
                  {menu.status === 'available' ? '품절 처리' : '판매 개시'}
                </button>
                <button 
                  onClick={() => hideMenu(menu.id)}
                  className="flex-1 py-4 rounded-2xl text-lg font-black border-2 border-zinc-200 text-zinc-400 hover:bg-zinc-50"
                >
                  메뉴 삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
