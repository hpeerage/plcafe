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
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 py-6 flex-1">
        <View className="flex-row items-center mb-8">
          <TouchableOpacity onPress={() => onNavigate('main')} className="mr-4">
            <Text className="text-4xl">←</Text>
          </TouchableOpacity>
          <Text className="text-4xl font-bold">장바구니</Text>
        </View>

        <ScrollView className="flex-1">
          {/* Order Items List */}
          <View className="mb-10 bg-gray-50 p-6 rounded-3xl">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-2xl font-bold">아메리카노 (HOT)</Text>
              <Text className="text-2xl">3,500원</Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-2xl font-bold">플-라떼 (ICE)</Text>
              <Text className="text-2xl">4,500원</Text>
            </View>
          </View>

          {/* Packaging Options */}
          <Text className="text-2xl font-bold mb-6">포장 옵션 선택</Text>
          <View className="flex-row flex-wrap justify-between">
            {PACKAGING_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => setSelectedPack(option.id)}
                className={`w-[48%] p-6 rounded-2xl mb-4 border-2 ${
                  selectedPack === option.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white'
                }`}
              >
                <Text className={`text-2xl text-center font-bold ${selectedPack === option.id ? 'text-orange-600' : 'text-gray-700'}`}>
                  {option.name}
                </Text>
                {option.price > 0 && (
                  <Text className="text-center text-lg text-gray-400">+{option.price}원</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Total and Order Button */}
        <View className="pt-6 border-t border-gray-100">
          <View className="flex-row justify-between mb-6">
            <Text className="text-2xl font-semibold text-gray-500">총 결제 금액</Text>
            <Text className="text-4xl font-black">8,000원</Text>
          </View>
          <TouchableOpacity
            className="bg-orange-500 p-8 rounded-3xl"
            onPress={() => onNavigate('payment')}
          >
            <Text className="text-white text-3xl font-bold text-center">결제 선불 충전하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
