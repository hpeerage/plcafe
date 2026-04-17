import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Alert, ScrollView } from 'react-native';
import { useStore } from '../store/useStore';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export const PointScreen = ({ onNavigate }: { onNavigate: (screen: string) => void }) => {
  const { points, rechargePoints } = useStore();
  const [settings, setSettings] = useState({
    bonusThreshold1: 30000,
    bonusRate1: 5,
    bonusThreshold2: 50000,
    bonusRate2: 10
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'global'), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setSettings({
          bonusThreshold1: data.bonusThreshold1 || 30000,
          bonusRate1: data.bonusRate1 || 5,
          bonusThreshold2: data.bonusThreshold2 || 50000,
          bonusRate2: data.bonusRate2 || 10
        });
      }
    });
    return unsub;
  }, []);

  const handleRecharge = (amount: number) => {
    let bonus = 0;
    if (amount >= settings.bonusThreshold2) {
      bonus = Math.ceil(amount * (settings.bonusRate2 / 100));
    } else if (amount >= settings.bonusThreshold1) {
      bonus = Math.ceil(amount * (settings.bonusRate1 / 100));
    }

    const total = amount + bonus;

    Alert.alert(
      '충전 확인',
      `${amount.toLocaleString()}원을 충전하시겠습니까?\n보너스: ${bonus.toLocaleString()}원\n총 ${total.toLocaleString()}원이 적립됩니다.`,
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '충전하기', 
          onPress: () => {
            rechargePoints(total);
            Alert.alert('충전 완료', '포인트가 성공적으로 적립되었습니다.');
          }
        }
      ]
    );
  };

  const getBonusText = (amount: number) => {
    if (amount >= settings.bonusThreshold2) return `+${settings.bonusRate2}% 보너스`;
    if (amount >= settings.bonusThreshold1) return `+${settings.bonusRate1}% 보너스`;
    return null;
  };

  return (
    <SafeAreaView className="flex-1 bg-brand-bg">
      <View className="px-6 py-10 flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-12">
          <TouchableOpacity onPress={() => onNavigate('main')} className="p-4 bg-white rounded-2xl shadow-sm border border-brand-primary/5">
            <Text className="text-xl">←</Text>
          </TouchableOpacity>
          <Text className="text-3xl font-black text-brand-primary tracking-tighter uppercase">Point Center</Text>
          <View className="w-12" />
        </View>

        {/* Balance Card */}
        <View className="bg-brand-primary p-12 rounded-5xl shadow-2xl shadow-brand-primary/20 mb-12">
          <Text className="text-white/60 text-xl font-bold mb-2 uppercase tracking-widest">My Balance</Text>
          <View className="flex-row items-end gap-3">
            <Text className="text-7xl font-black text-white">{points.toLocaleString()}</Text>
            <Text className="text-2xl font-black text-white/40 mb-2">PLM</Text>
          </View>
        </View>

        {/* Recharge Options */}
        <Text className="text-xl font-black text-brand-primary mb-6 px-2 uppercase tracking-widest">Recharge Points</Text>
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          <View className="space-y-6">
            {[10000, 30000, 50000, 100000].map((amount) => {
              const bonusText = getBonusText(amount);
              return (
                <TouchableOpacity 
                  key={amount}
                  onPress={() => handleRecharge(amount)}
                  className="bg-white p-10 rounded-4xl border border-brand-primary/5 shadow-sm active:scale-[0.98] transition-all flex-row justify-between items-center"
                >
                  <View>
                    <Text className="text-4xl font-black text-brand-primary mb-1">{amount.toLocaleString()} <Text className="text-lg font-bold text-brand-primary/20">KRW</Text></Text>
                    {bonusText && (
                      <View className="bg-brand-accent/10 self-start px-3 py-1 rounded-lg">
                        <Text className="text-brand-accent font-black text-sm uppercase">{bonusText}</Text>
                      </View>
                    )}
                  </View>
                  <View className="bg-brand-primary/5 w-16 h-16 rounded-3xl flex items-center justify-center">
                    <Text className="text-3xl">➕</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
          
          <View className="mt-12 p-8 bg-zinc-100 rounded-4xl border border-zinc-200">
            <Text className="text-zinc-400 font-bold mb-2 tracking-tight">안내사항</Text>
            <Text className="text-zinc-400 leading-relaxed text-sm">
              • 포인트 충전 시 즉시 가상 적립됩니다.{"\n"}
              • 현재는 테스트 버전으로 실제 결제가 이루어지지 않습니다.{"\n"}
              • {settings.bonusThreshold1.toLocaleString()}원 이상 충전 시 보너스 포인트가 지급됩니다.
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
