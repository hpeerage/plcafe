import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';

export const PickupScreen = ({ onNavigate }: { onNavigate: (screen: string) => void }) => {
  return (
    <SafeAreaView className="flex-1 bg-orange-500">
      <View className="flex-1 items-center justify-center px-10">
        <Text className="text-white text-4xl font-bold mb-10 text-center">주문이 완료되었습니다!</Text>
        
        <View className="bg-white/20 p-10 rounded-[60px] w-full items-center mb-10 border-4 border-white/30">
          <Text className="text-white text-[120px] font-black leading-none mb-4">102</Text>
          <Text className="text-white text-7xl font-bold text-center">홍길동 님</Text>
        </View>

        <Text className="text-white/80 text-3xl font-bold text-center mb-20">
          이 화면을 바리스타에게{"\n"}보여주세요
        </Text>

        <TouchableOpacity 
          className="bg-white p-8 rounded-[40px] w-full shadow-2xl"
          onPress={() => onNavigate('main')}
        >
          <Text className="text-orange-600 text-3xl font-black text-center">처음으로 돌아가기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
