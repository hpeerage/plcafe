import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useStore } from '../store/useStore';

const PACKAGING_OPTIONS = [
  { id: 'none', name: '선택 안함', price: 0 },
  { id: 'carrier2', name: '2구 캐리어', price: 0 },
  { id: 'carrier4', name: '4구 캐리어', price: 0 },
  { id: 'box', name: '박스 포장 (8구)', price: 1000 },
];

export const CartScreen = ({ onNavigate }: { onNavigate: (screen: string) => void }) => {
  const { cart } = useStore();
  const [selectedPack, setSelectedPack] = useState('none');

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const packagingPrice = PACKAGING_OPTIONS.find(o => o.id === selectedPack)?.price || 0;
  const total = subtotal + packagingPrice;

  return (
    <SafeAreaView className="flex-1 bg-brand-bg">
      <View className="px-6 py-6 flex-1">
        <View className="flex-row items-center mb-8 px-2">
          <TouchableOpacity onPress={() => onNavigate('main')} className="mr-6 bg-white p-4 rounded-2xl shadow-sm border border-brand-primary/5">
            <Text className="text-2xl text-brand-primary">←</Text>
          </TouchableOpacity>
          <Text className="text-4xl font-black text-brand-primary tracking-tighter">장바구니</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          {/* Order Items List */}
          <View className="mb-10 space-y-4">
            {cart.map((item, idx) => (
              <View key={idx} className="bg-white p-8 rounded-4xl border border-brand-primary/5 shadow-sm flex-row justify-between items-center">
                <View>
                  <Text className="text-2xl font-black text-brand-primary mb-1">{item.name}</Text>
                  <Text className="text-lg font-bold text-brand-primary/40">{(item.price * item.qty).toLocaleString()}원</Text>
                </View>
                <View className="bg-brand-primary/5 px-4 py-2 rounded-xl">
                  <Text className="text-xl font-black text-brand-primary">x{item.qty}</Text>
                </View>
              </View>
            ))}
            
            {cart.length === 0 && (
              <View className="py-20 items-center">
                <Text className="text-xl font-bold text-brand-primary/20">장바구니가 비어 있습니다.</Text>
              </View>
            )}
          </View>

          {/* Packaging Options */}
          <Text className="text-xl font-black mb-6 text-brand-primary px-2 uppercase tracking-widest">포장 옵션</Text>
          <View className="flex-row flex-wrap justify-between gap-y-4">
            {PACKAGING_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => setSelectedPack(option.id)}
                className={`w-[48%] p-6 rounded-4xl border-2 transition-all ${
                  selectedPack === option.id 
                    ? 'border-brand-primary bg-brand-primary shadow-xl shadow-brand-primary/20' 
                    : 'border-brand-primary/5 bg-white'
                }`}
              >
                <Text className={`text-xl text-center font-black ${selectedPack === option.id ? 'text-white' : 'text-brand-primary'}`}>
                  {option.name}
                </Text>
                {option.price > 0 && (
                  <Text className={`text-center text-sm font-bold ${selectedPack === option.id ? 'text-white/60' : 'text-brand-primary/40'}`}>
                    +{option.price.toLocaleString()}원
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Total and Order Button */}
        <View className="pt-8 border-t-2 border-brand-primary/5">
          <View className="flex-row justify-between mb-8 px-2">
            <Text className="text-xl font-bold text-brand-primary/40">최종 결제 금액</Text>
            <Text className="text-4xl font-black text-brand-primary">{total.toLocaleString()}원</Text>
          </View>
          <TouchableOpacity
            disabled={cart.length === 0}
            className={`p-8 rounded-4xl shadow-2xl transition-all active:scale-95 ${
              cart.length === 0 ? 'bg-zinc-200' : 'bg-brand-primary shadow-brand-primary/30'
            }`}
            onPress={() => onNavigate('payment')}
          >
            <Text className="text-white text-2xl font-black text-center uppercase tracking-widest">주문하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
