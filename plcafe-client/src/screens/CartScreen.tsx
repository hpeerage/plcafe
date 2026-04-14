import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';

const PACKAGING_OPTIONS = [
  { id: 'none', name: '선택 안함', price: 0 },
  { id: 'carrier2', name: '2구 캐리어', price: 0 },
  { id: 'carrier4', name: '4구 캐리어', price: 0 },
  { id: 'box', name: '박스 포장 (8구)', price: 1000 },
];

export const CartScreen = ({ onNavigate }: { onNavigate: (screen: string) => void }) => {
  const [selectedPack, setSelectedPack] = useState('none');

  return (
    <SafeAreaView className="flex-1 bg-brand-bg">
      <View className="px-6 py-6 flex-1">
        <View className="flex-row items-center mb-8">
          <TouchableOpacity onPress={() => onNavigate('main')} className="mr-4">
            <Text className="text-4xl text-brand-text">←</Text>
          </TouchableOpacity>
          <Text className="text-4xl font-black text-brand-text">장바구니</Text>
        </View>

        <ScrollView className="flex-1">
          {/* Order Items List */}
          <View className="mb-10 bg-white/50 p-6 rounded-3xl border border-brand-text/5">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-2xl font-bold text-brand-text">아메리카노 (HOT)</Text>
              <Text className="text-2xl text-brand-text/60">3,500원</Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-2xl font-bold text-brand-text">플-라떼 (ICE)</Text>
              <Text className="text-2xl text-brand-text/60">4,500원</Text>
            </View>
          </View>

          {/* Packaging Options */}
          <Text className="text-2xl font-black mb-6 text-brand-text">포장 옵션 선택</Text>
          <View className="flex-row flex-wrap justify-between">
            {PACKAGING_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => setSelectedPack(option.id)}
                className={`w-[48%] p-6 rounded-2xl mb-4 border-2 ${
                  selectedPack === option.id ? 'border-brand-primary bg-brand-primary/10' : 'border-brand-text/10 bg-white/30'
                }`}
              >
                <Text className={`text-2xl text-center font-bold ${selectedPack === option.id ? 'text-brand-primary' : 'text-brand-text/60'}`}>
                  {option.name}
                </Text>
                {option.price > 0 && (
                  <Text className="text-center text-lg text-brand-text/30">+{option.price}원</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Total and Order Button */}
        <View className="pt-6 border-t border-brand-text/10">
          <View className="flex-row justify-between mb-6">
            <Text className="text-2xl font-bold text-brand-text/40">총 결제 금액</Text>
            <Text className="text-4xl font-black text-brand-text">8,000원</Text>
          </View>
          <TouchableOpacity
            className="bg-brand-primary p-8 rounded-3xl"
            onPress={() => onNavigate('payment')}
          >
            <Text className="text-white text-3xl font-black text-center">결제 선불 충전하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
