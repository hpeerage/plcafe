import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export const PickupScreen = ({ onNavigate }: { onNavigate: (screen: string) => void }) => {
  const mockOrderId = "ORD-123456";

  return (
    <SafeAreaView className="flex-1 bg-brand-primary">
      <View className="flex-1 items-center justify-center px-10">
        <Text className="text-white text-4xl font-black mb-10 text-center">주문이 완료되었습니다!</Text>
        
        <View className="bg-white/20 p-10 rounded-[60px] w-full items-center mb-10 border-4 border-white/30">
          <Text className="text-white text-[120px] font-black leading-none mb-4">102</Text>
          <Text className="text-white text-7xl font-black text-center mb-6">홍길동 님</Text>
          <View className="bg-white p-4 rounded-3xl">
            <QRCode value={mockOrderId} size={150} />
          </View>
        </View>

        <Text className="text-white/80 text-3xl font-bold text-center mb-20">
          이 화면을 바리스타에게{"\n"}보여주세요
        </Text>

        <TouchableOpacity 
          className="bg-brand-bg p-8 rounded-[40px] w-full shadow-2xl"
          onPress={() => onNavigate('main')}
        >
          <Text className="text-brand-primary text-3xl font-black text-center">처음으로 돌아가기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
