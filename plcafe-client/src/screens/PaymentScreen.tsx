import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';

export const PaymentScreen = ({ onNavigate }: { onNavigate: (screen: string) => void }) => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 py-6 flex-1">
        <View className="flex-row items-center mb-8">
          <TouchableOpacity onPress={() => onNavigate('cart')} className="mr-4">
            <Text className="text-4xl">←</Text>
          </TouchableOpacity>
          <Text className="text-4xl font-bold">Pl-Money 결제</Text>
        </View>

        <View className="flex-1 items-center justify-center">
          {/* Current Balance */}
          <View className="bg-gray-50 w-full p-8 rounded-3xl mb-12 border border-gray-100">
            <Text className="text-2xl text-gray-500 mb-2">현재 잔액</Text>
            <Text className="text-5xl font-black text-black">12,500원</Text>
          </View>

          {/* Barcode Placeholder */}
          <View className="w-full bg-white p-6 border-2 border-dashed border-gray-300 rounded-2xl items-center mb-12">
            <View className="bg-black w-full h-32 mb-4" />
            <Text className="text-2xl tracking-[10px] font-mono">1234 5678 9012</Text>
            <Text className="text-lg text-gray-400 mt-2">1초 만에 바로 결제</Text>
          </View>

          {/* Recharge Buttons */}
          <Text className="text-2xl font-bold self-start mb-6">포인트 충전</Text>
          <View className="flex-row justify-between w-full mb-6">
            <TouchableOpacity 
              className="bg-orange-100 p-8 rounded-3xl flex-1 mr-2 border border-orange-200"
              onPress={() => alert('30,000원 충전 완료')}
            >
              <Text className="text-3xl font-black text-orange-700 text-center">3만 원</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="bg-orange-500 p-8 rounded-3xl flex-1 ml-2"
              onPress={() => alert('50,000원 충전 완료')}
            >
              <Text className="text-3xl font-black text-white text-center">5만 원</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="bg-black p-8 rounded-3xl w-full"
            onPress={() => onNavigate('pickup')}
          >
            <Text className="text-white text-3xl font-bold text-center">주문 완료하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
