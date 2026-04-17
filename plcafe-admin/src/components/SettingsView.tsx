'use client';

import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot, updateDoc, setDoc } from 'firebase/firestore';

export default function SettingsView() {
  const [settings, setSettings] = useState({
    slotMinutes: 10,
    maxQuota: 15,
    peakMaxQuota: 10,
    bonusThreshold1: 30000,
    bonusRate1: 5,
    bonusThreshold2: 50000,
    bonusRate2: 10,
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'global'), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setSettings({
          slotMinutes: data.slotMinutes || 10,
          maxQuota: data.maxQuota || 15,
          peakMaxQuota: data.peakMaxQuota || 10,
          bonusThreshold1: data.bonusThreshold1 || 30000,
          bonusRate1: data.bonusRate1 || 5,
          bonusThreshold2: data.bonusThreshold2 || 50000,
          bonusRate2: data.bonusRate2 || 10,
        });
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'global'), settings, { merge: true });
      alert('설정이 저장되었습니다.');
    } catch (error) {
      console.error('Save failed:', error);
      alert('저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center text-brand-primary/20">LOADING SETTINGS...</div>;

  return (
    <div className="flex-1 bg-brand-bg/30 p-12 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <p className="text-sm font-bold text-brand-primary/30 uppercase tracking-[0.2em] mb-2">System Config</p>
          <h2 className="text-6xl font-black text-brand-primary tracking-tighter">시스템 설정</h2>
        </div>

        <div className="bg-white p-12 rounded-5xl border border-brand-primary/5 shadow-sm space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Slot Minutes */}
            <div className="space-y-4">
              <label className="text-lg font-black text-brand-primary uppercase tracking-widest">슬롯 단위 (분)</label>
              <p className="text-sm text-brand-primary/40 leading-relaxed">주문량을 제한할 시간 블록의 크기입니다. 보통 10분 또는 15분을 권장합니다.</p>
              <div className="flex items-center gap-4">
                <input 
                  type="number"
                  value={settings.slotMinutes}
                  onChange={(e) => setSettings({...settings, slotMinutes: parseInt(e.target.value)})}
                  className="w-full bg-brand-primary/5 p-6 rounded-3xl text-3xl font-black text-brand-primary focus:outline-brand-primary"
                />
                <span className="text-2xl font-black text-brand-primary/20">MIN</span>
              </div>
            </div>

            {/* Max Quota */}
            <div className="space-y-4">
              <label className="text-lg font-black text-brand-primary uppercase tracking-widest">기본 주문 제한 (잔)</label>
              <p className="text-sm text-brand-primary/40 leading-relaxed">평상시 슬롯당 허용할 최대 음료 제조 잔수입니다.</p>
              <div className="flex items-center gap-4">
                <input 
                  type="number"
                  value={settings.maxQuota}
                  onChange={(e) => setSettings({...settings, maxQuota: parseInt(e.target.value)})}
                  className="w-full bg-brand-primary/5 p-6 rounded-3xl text-3xl font-black text-brand-primary focus:outline-brand-primary"
                />
                <span className="text-2xl font-black text-brand-primary/20">CUPS</span>
              </div>
            </div>

            {/* Peak Max Quota */}
            <div className="space-y-4">
              <label className="text-lg font-black text-brand-primary uppercase tracking-widest text-red-600">피크 모드 주문 제한 (잔)</label>
              <p className="text-sm text-brand-primary/40 leading-relaxed">피크 모드 활성 시 슬롯당 허용할 음료 잔수입니다. 평소보다 낮게 설정하여 과부하를 방지하세요.</p>
              <div className="flex items-center gap-4">
                <input 
                  type="number"
                  value={settings.peakMaxQuota}
                  onChange={(e) => setSettings({...settings, peakMaxQuota: parseInt(e.target.value)})}
                  className="w-full bg-brand-primary/5 p-6 rounded-3xl text-3xl font-black text-red-600 focus:outline-red-600"
                />
                <span className="text-2xl font-black text-red-600/20">CUPS</span>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-brand-primary/5">
            <p className="text-sm font-bold text-brand-primary/30 uppercase tracking-[0.2em] mb-6">Point Bonus Policy</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Level 1 Bonus */}
              <div className="bg-brand-bg/50 p-8 rounded-4xl border border-brand-primary/5 space-y-6">
                <h4 className="text-xl font-black text-brand-primary uppercase tracking-tight">1차 보너스 구간</h4>
                <div className="space-y-4">
                  <label className="text-xs font-bold text-brand-primary/40 uppercase">충전 임계치 (원)</label>
                  <input 
                    type="number"
                    value={settings.bonusThreshold1}
                    onChange={(e) => setSettings({...settings, bonusThreshold1: parseInt(e.target.value)})}
                    className="w-full bg-white p-4 rounded-2xl text-xl font-black text-brand-primary border-2 border-brand-primary/5"
                  />
                  <label className="text-xs font-bold text-brand-primary/40 uppercase">추가 적립 비율 (%)</label>
                  <input 
                    type="number"
                    value={settings.bonusRate1}
                    onChange={(e) => setSettings({...settings, bonusRate1: parseInt(e.target.value)})}
                    className="w-full bg-white p-4 rounded-2xl text-xl font-black text-brand-primary border-2 border-brand-primary/5"
                  />
                </div>
              </div>

              {/* Level 2 Bonus */}
              <div className="bg-brand-accent/5 p-8 rounded-4xl border border-brand-accent/10 space-y-6">
                <h4 className="text-xl font-black text-brand-accent uppercase tracking-tight">2차 보너스 구간 (VIP)</h4>
                <div className="space-y-4">
                  <label className="text-xs font-bold text-brand-accent/40 uppercase">충전 임계치 (원)</label>
                  <input 
                    type="number"
                    value={settings.bonusThreshold2}
                    onChange={(e) => setSettings({...settings, bonusThreshold2: parseInt(e.target.value)})}
                    className="w-full bg-white p-4 rounded-2xl text-xl font-black text-brand-accent border-2 border-brand-accent/10"
                  />
                  <label className="text-xs font-bold text-brand-accent/40 uppercase">추가 적립 비율 (%)</label>
                  <input 
                    type="number"
                    value={settings.bonusRate2}
                    onChange={(e) => setSettings({...settings, bonusRate2: parseInt(e.target.value)})}
                    className="w-full bg-white p-4 rounded-2xl text-xl font-black text-brand-accent border-2 border-brand-accent/10"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-brand-primary/5">
            <button 
              onClick={saveSettings}
              disabled={isSaving}
              className={`w-full py-8 rounded-4xl text-2xl font-black text-white shadow-xl transition-all active:scale-[0.98] ${
                isSaving ? 'bg-zinc-300' : 'bg-brand-primary shadow-brand-primary/30 hover:opacity-90'
              }`}
            >
              {isProcessing ? '저장 중...' : '설정 저장하기'}
            </button>
          </div>
        </div>

        <div className="mt-12 p-8 bg-brand-accent/10 rounded-4xl border border-brand-accent/20">
          <p className="text-brand-accent font-bold text-lg mb-2">💡 팁</p>
          <p className="text-brand-accent/60 leading-relaxed">
            슬롯 단위가 너무 짧으면 바리스타가 주문을 인지하기 어렵고, 너무 길면 사용자 대기가 길어질 수 있습니다. 10분/15잔 설정이 가장 일반적입니다.
          </p>
        </div>
      </div>
    </div>
  );
}
