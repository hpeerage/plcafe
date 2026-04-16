import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';

export const PaymentScreen = ({ onNavigate }: { onNavigate: (screen: string) => void }) => {
  const rechargePoints = (amount: number, bonus: number) => {
    alert(`${amount.toLocaleString()}원 (+보너스 ${bonus.toLocaleString()}원) 충전이 완료되었습니다.`);
  };
  return (
    <SafeAreaView className="flex-1 bg-brand-bg">
      <View className="px-6 py-6 flex-1">
        <View className="flex-row items-center mb-10 px-2">
          <TouchableOpacity onPress={() => onNavigate('cart')} className="mr-6 bg-white p-4 rounded-2xl shadow-sm border border-brand-primary/5">
            <Text className="text-2xl text-brand-primary">←</Text>
          </TouchableOpacity>
          <Text className="text-4xl font-black text-brand-primary tracking-tighter">PL-MONEY <Text className="text-brand-accent">WALLET</Text></Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          {/* Current Balance Card */}
          <View className="bg-brand-primary p-10 rounded-5xl mb-8 shadow-2xl shadow-brand-primary/40">
            <Text className="text-sm font-bold text-white/40 uppercase tracking-[0.2em] mb-2">My Balance</Text>
            <Text className="text-6xl font-black text-white">12,500원</Text>
            <View className="h-[2px] bg-white/10 w-full my-8" />
            <View className="flex-row justify-between items-center">
              <Text className="text-white/60 font-bold text-lg">PL-CAFE 멤버십</Text>
              <Text className="text-brand-accent font-black text-xl">VIP</Text>
            </View>
          </View>

          {/* Barcode Section */}
          <View className="bg-white p-10 rounded-5xl border border-brand-primary/5 shadow-sm mb-10 items-center">
            <View className="bg-brand-primary/5 w-full h-24 mb-6 rounded-2xl flex-row overflow-hidden">
               {/* Mock barcode lines */}
               {[...Array(40)].map((_, i) => (
                 <View key={i} className={`h-full ${i % 3 === 0 ? 'bg-brand-primary' : 'bg-transparent'}`} style={{ width: Math.random() * 4 + 1 }} />
               ))}
            </View>
            <Text className="text-2xl tracking-[8px] font-mono font-black text-brand-primary">1234 5678 9012</Text>
            <Text className="text-sm text-brand-primary/30 mt-4 font-bold uppercase tracking-widest">결제용 1회용 바코드</Text>
          </View>

          {/* Recharge Section */}
          <View className="px-2">
            <Text className="text-xl font-black text-brand-primary mb-6 uppercase tracking-widest">포인트 충전 혜택</Text>
            <View className="flex-row gap-4 mb-8">
              <TouchableOpacity 
                className="flex-1 bg-white p-8 rounded-4xl border border-brand-primary/10 shadow-sm transition-all active:scale-95"
                onPress={() => rechargePoints(30000, 1500)}
              >
                <Text className="text-3xl font-black text-brand-primary mb-1">3만</Text>
                <View className="bg-brand-accent/10 px-3 py-1 rounded-lg self-start">
                  <Text className="text-sm font-black text-brand-accent">+5% 보너스</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity 
                className="flex-1 bg-white p-8 rounded-4xl border border-brand-primary/10 shadow-sm transition-all active:scale-95"
                onPress={() => rechargePoints(50000, 5000)}
              >
                <Text className="text-3xl font-black text-brand-primary mb-1">5만</Text>
                <View className="bg-brand-accent px-3 py-1 rounded-lg self-start">
                  <Text className="text-sm font-black text-white">+10% 보너스</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity
          className="bg-brand-primary p-8 rounded-4xl shadow-2xl shadow-brand-primary/30 mt-4"
          onPress={() => onNavigate('pickup')}
        >
          <Text className="text-white text-2xl font-black text-center uppercase tracking-widest">주문 결제하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
